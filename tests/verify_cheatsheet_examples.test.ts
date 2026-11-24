import { describe, it, expect, afterAll } from 'vitest';
import * as duckdb from '@duckdb/duckdb-wasm/dist/duckdb-node-blocking.cjs';
import * as path from 'path';
import * as fs from 'fs';
import { DUCKDB_CHEAT_SHEET_ITEMS } from '../src/data/duckdbCheatSheetData';
import { loadDatabaseTables } from '../src/engine/duckdb';

describe('Run ALL DuckDB Cheat Sheet Examples against Real DuckDB', () => {
  afterAll(() => {
    const tempFiles = [
      'products.parquet',
      'customers.csv',
      'category_summary.parquet',
      'analytics.db',
      'p2.parquet',
    ];

    for (const f of tempFiles) {
      if (fs.existsSync(f)) {
        try {
          fs.unlinkSync(f);
        } catch {
          // ignore cleanup error
        }
      }
    }
  });
  it('should execute every cheatsheet item exampleSql cleanly', async () => {
    const DUCKDB_BUNDLES = {
      mvp: {
        mainModule: path.resolve('node_modules/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm'),
        mainWorker: path.resolve('node_modules/@duckdb/duckdb-wasm/dist/duckdb-node-mvp.worker.cjs'),
      },
      eh: {
        mainModule: path.resolve('node_modules/@duckdb/duckdb-wasm/dist/duckdb-eh.wasm'),
        mainWorker: path.resolve('node_modules/@duckdb/duckdb-wasm/dist/duckdb-node-eh.worker.cjs'),
      },
    };

    const logger = new duckdb.VoidLogger();
    const db = await duckdb.createDuckDB(DUCKDB_BUNDLES, logger, duckdb.NODE_RUNTIME);
    await db.instantiate();
    const conn = await db.connect();

    // Load default store dataset (which is what executeQuery loads by default)
    await loadDatabaseTables(conn as any, 'store');

    console.log(`Starting execution of all ${DUCKDB_CHEAT_SHEET_ITEMS.length} cheatsheet items...`);

    const errors: Array<{ index: number; id: string; name: string; error: string; sql: string }> = [];

    for (let i = 0; i < DUCKDB_CHEAT_SHEET_ITEMS.length; i++) {
      const item = DUCKDB_CHEAT_SHEET_ITEMS[i];
      const sql = item.exampleSql.trim();

      try {
        const res = await conn.query(sql);
        res.toArray();
        // Rows or schema returned
      } catch (err: any) {
        errors.push({
          index: i + 1,
          id: item.id,
          name: item.name,
          error: err.message || String(err),
          sql,
        });
      }
    }

    console.log(`Cheatsheet execution complete.`);
    console.log(`Total items tested: ${DUCKDB_CHEAT_SHEET_ITEMS.length}`);
    console.log(`Errors: ${errors.length}`);

    if (errors.length > 0) {
      for (const e of errors) {
        console.log(`\n❌ ERROR at #${e.index} [${e.id}] (${e.name}):\n   Error: ${e.error.split('\n')[0]}\n   SQL:\n${e.sql}`);
      }
    }

    expect(errors).toHaveLength(0);

    await conn.close();
  }, 120000);
});
