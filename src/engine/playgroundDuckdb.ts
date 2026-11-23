import * as duckdb from '@duckdb/duckdb-wasm';
import { initDuckDB, QueryResult, loadDatabaseTables, extractArrowTable } from './duckdb';
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

export const STORAGE_KEY_PLAYGROUND_DELETED = 'learn_duckdb_playground_deleted_tables';

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      return (globalThis as any).localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

export function getDeletedPlaygroundTables(): Set<string> {
  const storage = getStorage();
  if (!storage) return new Set<string>();
  try {
    const raw = storage.getItem(STORAGE_KEY_PLAYGROUND_DELETED);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    return new Set<string>(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set<string>();
  }
}

export function saveDeletedPlaygroundTables(deleted: Set<string>): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY_PLAYGROUND_DELETED, JSON.stringify([...deleted]));
  } catch {
    // Ignore storage quota or serialization errors
  }
}

export function clearDeletedPlaygroundTables(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY_PLAYGROUND_DELETED);
  } catch {
    // Ignore
  }
}

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
  const deletedTables = getDeletedPlaygroundTables();

  // 1. Seed e-commerce sales dataset if not deleted by user
  if (!deletedTables.has(DEFAULT_DATASET_TABLE_NAME)) {
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
  }

  // 2. Seed default store tables (customers, products, orders, order_items, subscribers)
  // Only seed the ones that the user has not explicitly deleted!
  for (const table of DATABASES.store.tables) {
    if (deletedTables.has(table.name)) {
      continue;
    }

    const seqName = `seq_${table.name}_id`;
    await conn.query(`DROP TABLE IF EXISTS ${table.name} CASCADE;`);
    await conn.query(`DROP SEQUENCE IF EXISTS ${seqName};`);
    await conn.query(`CREATE SEQUENCE ${seqName} START 100;`);

    const colDefs = table.columns
      .map(([name, type]) => {
        let dType = type.toUpperCase();
        if (dType.includes('INTEGER PRIMARY KEY')) {
          dType = `INTEGER PRIMARY KEY DEFAULT nextval('${seqName}')`;
        }
        return `${name} ${dType}`;
      })
      .join(', ');

    await conn.query(`CREATE TABLE ${table.name} (${colDefs});`);

    if (table.rows && table.rows.length > 0) {
      const rowLiterals = table.rows.map(row => {
        const values = row.map(val => {
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'number') return val.toString();
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          return `'${String(val)}'`;
        });
        return `(${values.join(', ')})`;
      });

      for (let i = 0; i < rowLiterals.length; i += 50) {
        const batch = rowLiterals.slice(i, i + 50);
        await conn.query(`INSERT INTO ${table.name} VALUES ${batch.join(', ')};`);
      }
    }

    registeredFiles.set(table.name, {
      tableName: table.name,
      fileName: `${table.name}.sql`,
      size: 0,
      isDefault: true,
    });
  }

  // Pre-seed in-memory VFS files for Parquet and CSV direct querying in Playground
  try {
    if (!deletedTables.has('products')) {
      await conn.query(`COPY products TO 'products.parquet' (FORMAT PARQUET);`);
    }
    if (!deletedTables.has('customers')) {
      await conn.query(`COPY customers TO 'customers.csv' (FORMAT CSV, HEADER);`);
    }
  } catch {
    // Ignore if files cannot be exported
  }
}

export async function initPlayground(): Promise<duckdb.AsyncDuckDBConnection> {
  if (playgroundConn && playgroundDb) {
    return playgroundConn;
  }

  const { db } = await initDuckDB();
  playgroundDb = db;
  playgroundConn = await db.connect();

  // Attach an isolated in-memory database for Playground so actions in Playground
  // never collide with or drop tables from Curriculum / Cheatsheet (main database)
  await playgroundConn.query(`
    ATTACH IF NOT EXISTS ':memory:' AS playground;
    USE playground;
  `);

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

  // If this table was previously in the deleted set, un-delete it now that it is uploaded
  const deleted = getDeletedPlaygroundTables();
  if (deleted.has(baseName)) {
    deleted.delete(baseName);
    saveDeletedPlaygroundTables(deleted);
  }

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
    WHERE table_catalog = 'playground' 
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

  // Check if user ran a DROP TABLE query directly in SQL editor
  const dropMatch = sql.match(/^\s*DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)/i);
  if (dropMatch && dropMatch[1]) {
    const droppedName = dropMatch[1].toLowerCase();
    const deleted = getDeletedPlaygroundTables();
    deleted.add(droppedName);
    saveDeletedPlaygroundTables(deleted);
    registeredFiles.delete(droppedName);
  }

  // Check if user ran a CREATE TABLE query directly in SQL editor (un-deletes it)
  const createMatch = sql.match(/^\s*CREATE\s+(?:OR\s+REPLACE\s+)?TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/i);
  if (createMatch && createMatch[1]) {
    const createdName = createMatch[1].toLowerCase();
    const deleted = getDeletedPlaygroundTables();
    if (deleted.has(createdName)) {
      deleted.delete(createdName);
      saveDeletedPlaygroundTables(deleted);
    }
  }

  const { columns, rows } = extractArrowTable(arrowResult);

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

  // Persist deletion so refresh / hard refresh does NOT resurrect the table
  const deleted = getDeletedPlaygroundTables();
  deleted.add(tableName);
  saveDeletedPlaygroundTables(deleted);
}

export async function resetPlayground(): Promise<void> {
  const conn = await initPlayground();

  // Clear persisted deleted tables so default state is completely restored
  clearDeletedPlaygroundTables();

  // Drop all current tables in playground database
  const tables = await getPlaygroundTables();
  for (const t of tables) {
    await conn.query(`DROP TABLE IF EXISTS ${t.name};`);
  }
  registeredFiles.clear();

  // Re-seed all default tables (ecommerce_sales and store dataset)
  await seedDefaultPlaygroundTables(conn, playgroundDb!);
}

