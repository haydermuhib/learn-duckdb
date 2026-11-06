import * as duckdb from '@duckdb/duckdb-wasm';
import { DATABASES } from '../data/databases';

export interface QueryResult {
  columns: string[];
  rows: any[][];
  executionTimeMs: number;
  rowCount: number;
}

let dbInstance: duckdb.AsyncDuckDB | null = null;
let connInstance: duckdb.AsyncDuckDBConnection | null = null;
let currentDbName: string | null = null;
let initPromise: Promise<{ db: duckdb.AsyncDuckDB; conn: duckdb.AsyncDuckDBConnection }> | null = null;

export async function initDuckDB(): Promise<{ db: duckdb.AsyncDuckDB; conn: duckdb.AsyncDuckDBConnection }> {
  if (dbInstance && connInstance) {
    return { db: dbInstance, conn: connInstance };
  }
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
      
      const worker_url = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker!}");`], { type: 'text/javascript' })
      );
      const worker = new Worker(worker_url);
      const logger = new duckdb.VoidLogger();
      const db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      URL.revokeObjectURL(worker_url);

      const conn = await db.connect();
      dbInstance = db;
      connInstance = conn;

      // Initialize default store database
      await loadDatabaseTables(conn, 'store');
      currentDbName = 'store';

      return { db, conn };
    } catch (err) {
      console.error('Failed to initialize DuckDB-Wasm:', err);
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

export async function switchDatabase(dbName: string): Promise<void> {
  const { conn } = await initDuckDB();
  if (currentDbName === dbName) return;
  if (currentDbName && DATABASES[currentDbName]) {
    for (const table of DATABASES[currentDbName].tables) {
      await conn.query(`DROP TABLE IF EXISTS ${table.name};`);
    }
  }
  await loadDatabaseTables(conn, dbName);
  currentDbName = dbName;
}

export async function resetDatabase(dbName: string): Promise<void> {
  const { conn } = await initDuckDB();
  await loadDatabaseTables(conn, dbName);
  currentDbName = dbName;
}

export async function loadDatabaseTables(conn: duckdb.AsyncDuckDBConnection, dbName: string) {
  const dbDef = DATABASES[dbName] || DATABASES.store;

  for (const table of dbDef.tables) {
    // Drop existing table if any
    await conn.query(`DROP TABLE IF EXISTS ${table.name};`);

    // Create table statement
    const colDefs = table.columns
      .map(([name, type]) => {
        // Normalize SQLite types to DuckDB
        let dType = type.toUpperCase();
        if (dType.includes('INTEGER PRIMARY KEY')) {
          dType = 'INTEGER PRIMARY KEY';
        }
        return `${name} ${dType}`;
      })
      .join(', ');

    await conn.query(`CREATE TABLE ${table.name} (${colDefs});`);

    // Insert rows
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

      // Insert in batches of 50
      for (let i = 0; i < rowLiterals.length; i += 50) {
        const batch = rowLiterals.slice(i, i + 50);
        await conn.query(`INSERT INTO ${table.name} VALUES ${batch.join(', ')};`);
      }
    }
  }
}

export async function executeQuery(sql: string): Promise<QueryResult> {
  const { conn } = await initDuckDB();
  const startTime = performance.now();

  const arrowTable = await conn.query(sql);
  const endTime = performance.now();
  const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

  const columns = arrowTable.schema.fields.map(f => f.name);
  const rows: any[][] = [];

  for (const row of arrowTable) {
    const rowArr = columns.map(col => {
      const val = row[col];
      if (typeof val === 'bigint') return Number(val);
      return val;
    });
    rows.push(rowArr);
  }

  return {
    columns,
    rows,
    executionTimeMs,
    rowCount: rows.length,
  };
}

export function getCurrentDatabase(): string {
  return currentDbName || 'store';
}

