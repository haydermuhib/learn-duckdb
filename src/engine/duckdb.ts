import * as duckdb from '@duckdb/duckdb-wasm';
import duckdbWasmMvp from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import duckdbWorkerMvp from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import * as arrow from 'apache-arrow';
import { DATABASES } from '../data/databases';

export interface QueryResult {
  columns: string[];
  columnTypes?: string[];
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
      const worker = new Worker(duckdbWorkerMvp);
      const logger = new duckdb.VoidLogger();
      const db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(duckdbWasmMvp);

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
  // Drop transient views/tables created by DDL exercises
  await conn.query(`DROP VIEW IF EXISTS category_sales CASCADE;`);
  await conn.query(`DROP TABLE IF EXISTS reviews CASCADE;`);
  await conn.query(`DROP TABLE IF EXISTS suppliers CASCADE;`);
  await conn.query(`DROP TABLE IF EXISTS summary CASCADE;`);
  await conn.query(`DROP TABLE IF EXISTS dates CASCADE;`);
  await conn.query(`DROP TABLE IF EXISTS numbers CASCADE;`);

  // Drop all existing tables & sequences across all datasets to prevent collision or stale state
  for (const dbKey of Object.keys(DATABASES)) {
    const dbDef = DATABASES[dbKey];

    if (dbDef) {
      for (const table of dbDef.tables) {
        await conn.query(`DROP TABLE IF EXISTS ${table.name} CASCADE;`);
        await conn.query(`DROP SEQUENCE IF EXISTS seq_${table.name}_id;`);
      }
    }
  }

  const dbDef = DATABASES[dbName] || DATABASES.store;

  for (const table of dbDef.tables) {
    // Drop existing table and sequence if any
    const seqName = `seq_${table.name}_id`;
    await conn.query(`DROP TABLE IF EXISTS ${table.name} CASCADE;`);
    await conn.query(`DROP SEQUENCE IF EXISTS ${seqName};`);
    await conn.query(`CREATE SEQUENCE ${seqName} START 100;`);

    // Create table statement
    const colDefs = table.columns
      .map(([name, type]) => {
        // Normalize SQLite types to DuckDB
        let dType = type.toUpperCase();

        if (dType.includes('INTEGER PRIMARY KEY')) {
          dType = `INTEGER PRIMARY KEY DEFAULT nextval('${seqName}')`;
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

  // Pre-seed in-memory VFS files for Parquet and CSV direct querying in Cheatsheet and Playground
  if (dbName === 'store') {
    try {
      await conn.query(`COPY products TO 'products.parquet' (FORMAT PARQUET);`);
      await conn.query(`COPY customers TO 'customers.csv' (FORMAT CSV, HEADER);`);
    } catch (e) {
      // Ignore if files cannot be exported
    }
  }
}

export function formatArrowType(type: any): string {
  if (!type) return 'UNKNOWN';
  const str = String(type);
  if (str.startsWith('Int8') || str.startsWith('Int16') || str.startsWith('Int32')) return 'INT';
  if (str.startsWith('Int64') || str.startsWith('Uint64') || str.startsWith('HugeInt') || str.startsWith('Int128')) return 'BIGINT';
  if (str.startsWith('Float32')) return 'FLOAT';
  if (str.startsWith('Float64')) return 'DOUBLE';
  if (str.startsWith('Utf8') || str.startsWith('LargeUtf8')) return 'VARCHAR';
  if (str.startsWith('Bool')) return 'BOOLEAN';
  if (str.startsWith('Date')) return 'DATE';
  if (str.startsWith('Timestamp')) return 'TIMESTAMP';
  if (str.startsWith('Time')) return 'TIME';
  if (str.startsWith('Decimal')) return 'DECIMAL';
  if (str.startsWith('Struct')) return 'STRUCT';
  if (str.startsWith('List') || str.startsWith('FixedSizeList')) return 'LIST';
  if (str.startsWith('Map')) return 'MAP';
  if (str.startsWith('Binary') || str.startsWith('LargeBinary')) return 'BLOB';
  return str;
}

export function formatBigIntValue(val: bigint): number | string {
  if (val <= BigInt(Number.MAX_SAFE_INTEGER) && val >= BigInt(Number.MIN_SAFE_INTEGER)) {
    return Number(val);
  }
  return val.toString();
}

export function arrowValueToNative(val: any): any {
  if (val === null || val === undefined) {
    return null;
  }
  if (typeof val === 'bigint') {
    return formatBigIntValue(val);
  }
  if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') {
    return val;
  }
  if (val instanceof Date) {
    return val.toISOString().replace('T', ' ').substring(0, 19);
  }
  if (val instanceof Uint8Array) {
    return '\\x' + Array.from(val).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  if (typeof val.toJSON === 'function') {
    try {
      const json = val.toJSON();
      return arrowValueToNative(json);
    } catch {
      // Fall through to other checks
    }
  }
  if (Array.isArray(val)) {
    return val.map(arrowValueToNative);
  }
  if (typeof val.toArray === 'function') {
    try {
      return Array.from(val.toArray()).map(arrowValueToNative);
    } catch {
      // Fall through
    }
  }
  if (typeof val[Symbol.iterator] === 'function' && typeof val !== 'string') {
    try {
      const items: any[] = [];
      for (const item of val) {
        items.push(arrowValueToNative(item));
      }
      return items;
    } catch {
      // Fall through
    }
  }
  if (typeof val === 'object') {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      res[k] = arrowValueToNative(v);
    }
    return res;
  }
  return String(val);
}

export function extractArrowTable(arrowTable: any): { columns: string[]; rows: any[][]; columnTypes: string[] } {
  const numCols = arrowTable.numCols;
  const numRows = arrowTable.numRows;
  const columns = arrowTable.schema.fields.map((f: any) => f.name);
  const columnTypes = arrowTable.schema.fields.map((f: any) => formatArrowType(f.type));

  const children: any[] = [];
  const colTypes: { isDate: boolean; isTimestamp: boolean; isDecimal: boolean; scale: number }[] = [];

  for (let c = 0; c < numCols; c++) {
    children.push(arrowTable.getChildAt(c));
    const fieldType = arrowTable.schema.fields[c]?.type;
    const isDecimal = Boolean(fieldType && arrow.DataType.isDecimal(fieldType));
    colTypes.push({
      isDate: Boolean(fieldType && arrow.DataType.isDate(fieldType)),
      isTimestamp: Boolean(fieldType && arrow.DataType.isTimestamp(fieldType)),
      isDecimal,
      scale: isDecimal ? (fieldType as any).scale || 0 : 0,
    });
  }

  const rows: any[][] = [];

  for (let r = 0; r < numRows; r++) {
    const rowArr: any[] = [];

    for (let c = 0; c < numCols; c++) {
      let val = children[c]?.get(r);

      if (val === null || val === undefined) {
        rowArr.push(null);
        continue;
      }

      if (colTypes[c]?.isDecimal) {
        const scale = colTypes[c].scale;
        const unscaledStr = String(val);

        if (scale > 0) {
          const isNegative = unscaledStr.startsWith('-');
          const digits = isNegative ? unscaledStr.slice(1) : unscaledStr;
          const padded = digits.padStart(scale + 1, '0');
          const integerPart = padded.slice(0, padded.length - scale);
          const fractionalPart = padded.slice(padded.length - scale);
          val = Number((isNegative ? '-' : '') + integerPart + '.' + fractionalPart);
        } else {
          try {
            const b = BigInt(unscaledStr);
            if (b <= BigInt(Number.MAX_SAFE_INTEGER) && b >= BigInt(Number.MIN_SAFE_INTEGER)) {
              val = Number(unscaledStr);
            } else {
              val = unscaledStr;
            }
          } catch {
            val = Number(unscaledStr);
          }
        }
      } else if (typeof val === 'bigint') {
        val = formatBigIntValue(val);
      } else if (colTypes[c]?.isDate) {
        val = new Date(val).toISOString().substring(0, 10);
      } else if (colTypes[c]?.isTimestamp) {
        val = new Date(Number(val)).toISOString().replace('T', ' ').substring(0, 19);
      } else if (val instanceof Date) {
        val = val.toISOString().replace('T', ' ').substring(0, 19);
      } else if (typeof val === 'object' && val !== null) {
        const nativeVal = arrowValueToNative(val);
        val = typeof nativeVal === 'object' && nativeVal !== null
          ? JSON.stringify(nativeVal, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
          : nativeVal;
      }

      rowArr.push(val);
    }

    rows.push(rowArr);
  }

  return { columns, rows, columnTypes };
}

export async function executeQuery(sql: string): Promise<QueryResult> {
  const { conn } = await initDuckDB();
  const startTime = performance.now();

  const arrowTable = await conn.query(sql);
  const endTime = performance.now();
  const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

  const { columns, rows, columnTypes } = extractArrowTable(arrowTable);

  return {
    columns,
    columnTypes,
    rows,
    executionTimeMs,
    rowCount: rows.length,
  };
}

