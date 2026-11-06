import * as duckdb from '@duckdb/duckdb-wasm';
import { initDuckDB, QueryResult, loadDatabaseTables } from './duckdb';
import { DATABASES } from '../data/databases';
import {
  DEFAULT_DATASET_CSV,
  DEFAULT_DATASET_FILENAME,
  DEFAULT_DATASET_TABLE_NAME,
} from '../data/defaultPlaygroundDataset';

export interface PlaygroundColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  isPk: boolean;
}

export interface PlaygroundTableSchema {
  name: string;
  columns: PlaygroundColumnInfo[];
  rowCount: number;
  fileName?: string;
  fileSize?: number;
  isDefault?: boolean;
}

export const DEFAULT_TABLE_NAMES = new Set<string>([
  DEFAULT_DATASET_TABLE_NAME,
  ...DATABASES.store.tables.map(t => t.name),
]);

let playgroundConn: duckdb.AsyncDuckDBConnection | null = null;
let playgroundDb: duckdb.AsyncDuckDB | null = null;
const registeredFiles = new Map<
  string,
  { tableName: string; fileName: string; size: number; isDefault: boolean }
>();

async function seedDefaultPlaygroundTables(
  conn: duckdb.AsyncDuckDBConnection,
  db: duckdb.AsyncDuckDB
): Promise<void> {
  // 1. Seed e-commerce sales dataset
  const encoder = new TextEncoder();
  const defaultBuffer = encoder.encode(DEFAULT_DATASET_CSV);
  await db.registerFileBuffer(DEFAULT_DATASET_FILENAME, defaultBuffer);

  await conn.query(
    `CREATE OR REPLACE TABLE ${DEFAULT_DATASET_TABLE_NAME} AS SELECT * FROM read_csv_auto('${DEFAULT_DATASET_FILENAME}', header=true);`
  );

  registeredFiles.set(DEFAULT_DATASET_TABLE_NAME, {
    tableName: DEFAULT_DATASET_TABLE_NAME,
    fileName: DEFAULT_DATASET_FILENAME,
    size: defaultBuffer.byteLength,
    isDefault: true,
  });

  // 2. Seed default store tables (customers, products, orders, order_items, subscribers)
  await loadDatabaseTables(conn, 'store');
  for (const t of DATABASES.store.tables) {
    registeredFiles.set(t.name, {
      tableName: t.name,
      fileName: `${t.name}.sql`,
      size: 0,
      isDefault: true,
    });
  }
}

export async function initPlayground(): Promise<duckdb.AsyncDuckDBConnection> {
  if (playgroundConn && playgroundDb) {
    return playgroundConn;
  }

  const { db } = await initDuckDB();
  playgroundDb = db;
  playgroundConn = await db.connect();

  await seedDefaultPlaygroundTables(playgroundConn, playgroundDb);

  return playgroundConn;
}

export async function registerPlaygroundFile(
  file: File
): Promise<{ tableName: string; rowCount: number }> {
  const conn = await initPlayground();
  const db = playgroundDb!;

  // Generate safe table name
  let baseName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_');

  if (!baseName || /^[0-9]/.test(baseName)) {
    baseName = `t_${baseName}`;
  }

  // Read file as ArrayBuffer and register in DuckDB VFS
  const arrayBuffer = await file.arrayBuffer();
  const uint8Buffer = new Uint8Array(arrayBuffer);
  await db.registerFileBuffer(file.name, uint8Buffer);

  // Determine query loader based on extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  let loadSql = '';

  if (ext === 'parquet') {
    loadSql = `CREATE OR REPLACE TABLE ${baseName} AS SELECT * FROM read_parquet('${file.name}');`;
  } else if (ext === 'json') {
    loadSql = `CREATE OR REPLACE TABLE ${baseName} AS SELECT * FROM read_json_auto('${file.name}');`;
  } else {
    // Default to CSV
    loadSql = `CREATE OR REPLACE TABLE ${baseName} AS SELECT * FROM read_csv_auto('${file.name}', header=true);`;
  }

  await conn.query(loadSql);

  // Query row count
  const countRes = await conn.query(`SELECT COUNT(*) as cnt FROM ${baseName};`);
  const rowCount = Number(countRes.toArray()[0]?.cnt || 0);

  registeredFiles.set(baseName, {
    tableName: baseName,
    fileName: file.name,
    size: file.size,
    isDefault: false,
  });

  return { tableName: baseName, rowCount };
}

export async function getPlaygroundTables(): Promise<PlaygroundTableSchema[]> {
  const conn = await initPlayground();

  const tablesResult = await conn.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'main' 
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  const tableNames = tablesResult
    .toArray()
    .map((r: any) => String(r.table_name));
  const schemas: PlaygroundTableSchema[] = [];

  for (const name of tableNames) {
    // 1. Column info via PRAGMA
    const pragmaRes = await conn.query(`PRAGMA table_info('${name}');`);
    const cols = pragmaRes.toArray().map((col: any) => ({
      name: String(col.name),
      type: String(col.type),
      nullable: !col.notnull,
      isPk: Boolean(col.pk),
    }));

    // 2. Row count
    let rowCount = 0;
    try {
      const countRes = await conn.query(`SELECT COUNT(*) as cnt FROM ${name};`);
      rowCount = Number(countRes.toArray()[0]?.cnt || 0);
    } catch {
      rowCount = 0;
    }

    const fileMeta = registeredFiles.get(name);

    schemas.push({
      name,
      columns: cols,
      rowCount,
      fileName: fileMeta?.fileName,
      fileSize: fileMeta?.size,
      isDefault: fileMeta?.isDefault ?? DEFAULT_TABLE_NAMES.has(name),
    });
  }

  return schemas;
}

export async function executePlaygroundQuery(
  sql: string
): Promise<QueryResult> {
  const conn = await initPlayground();
  const startTime = performance.now();

  const arrowResult = await conn.query(sql);
  const endTime = performance.now();
  const executionTimeMs = Math.round(endTime - startTime);

  const columns = arrowResult.schema.fields.map(f => f.name);
  const rows: any[][] = [];

  for (const row of arrowResult) {
    const rowValues: any[] = [];
    for (const col of columns) {
      let val = row[col];
      if (typeof val === 'bigint') {
        val = Number(val);
      } else if (val instanceof Date) {
        val = val.toISOString().replace('T', ' ').substring(0, 19);
      } else if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      }
      rowValues.push(val);
    }
    rows.push(rowValues);
  }

  return {
    columns,
    rows,
    executionTimeMs,
    rowCount: rows.length,
  };
}

export async function removePlaygroundTable(
  tableName: string,
  fileName?: string
): Promise<void> {
  const conn = await initPlayground();
  await conn.query(`DROP TABLE IF EXISTS ${tableName};`);

  if (fileName && playgroundDb) {
    try {
      await (playgroundDb as any).dropFile(fileName);
    } catch {}
  }

  registeredFiles.delete(tableName);
}

export async function resetPlayground(): Promise<void> {
  const conn = await initPlayground();

  // Drop all current tables
  const tables = await getPlaygroundTables();
  for (const t of tables) {
    await conn.query(`DROP TABLE IF EXISTS ${t.name};`);
  }
  registeredFiles.clear();

  // Re-seed all default tables (ecommerce_sales and store dataset)
  await seedDefaultPlaygroundTables(conn, playgroundDb!);
}

