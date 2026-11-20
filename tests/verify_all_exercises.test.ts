import { describe, it, expect } from 'vitest';
import * as duckdb from '@duckdb/duckdb-wasm/dist/duckdb-node-blocking.cjs';
import * as path from 'path';
import { EXERCISES, DATABASES } from '../src/data/curriculum';
import { loadDatabaseTables } from '../src/engine/duckdb';

describe('Run ALL Canonical Solutions against Real DuckDB', () => {
  it('should initialize DuckDB and execute every exercise canonical solution', async () => {
    const DUCKDB_BUNDLES = {
      mvp: {
        mainModule: path.resolve('node_modules/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm'),
        mainWorker: path.resolve('node_modules/@duckdb/duckdb-wasm/dist/duckdb-node-mvp.worker.cjs')
      },
      eh: {
        mainModule: path.resolve('node_modules/@duckdb/duckdb-wasm/dist/duckdb-eh.wasm'),
        mainWorker: path.resolve('node_modules/@duckdb/duckdb-wasm/dist/duckdb-node-eh.worker.cjs')
      }
    };

    const logger = new duckdb.VoidLogger();
    const db = await duckdb.createDuckDB(DUCKDB_BUNDLES, logger, duckdb.NODE_RUNTIME);
    await db.instantiate();
    const conn = await db.connect();

    // Helper to seed a database cleanly using engine's loadDatabaseTables
    async function loadDatabase(dbKey: string) {
      await loadDatabaseTables(conn as any, dbKey);
    }

    console.log(`Starting execution of all ${EXERCISES.length} exercises...`);

    const errors: Array<{ index: number; id: number | string; error: string; sql: string }> = [];
    const emptyResults: Array<{ index: number; id: number | string; task: string; sql: string }> = [];

    for (let i = 0; i < EXERCISES.length; i++) {
      const ex = EXERCISES[i];
      const step = ex.steps[0];
      const sql = step.solution;

      await loadDatabase(ex.db);

      try {
        const isMutation = /^(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(sql.trim());
        if (isMutation) {
          await conn.query(sql);
          const checkSql = step.check || `SELECT * FROM ${ex.db === 'school' ? 'students' : 'products'}`;
          const checkRes = await conn.query(checkSql);
          const rows = checkRes.toArray();
          if (rows.length === 0) {
            emptyResults.push({ index: i + 1, id: ex.id, task: step.task, sql: checkSql });
          }
        } else {
          const res = await conn.query(sql);
          const rows = res.toArray();
          if (rows.length === 0) {
            emptyResults.push({ index: i + 1, id: ex.id, task: step.task, sql });
          }
        }
      } catch (err: any) {
        errors.push({ index: i + 1, id: ex.id, error: err.message || String(err), sql });
      }
    }

    console.log(`Execution complete.`);
    console.log(`Total exercises tested: ${EXERCISES.length}`);
    console.log(`Errors: ${errors.length}`);
    console.log(`Empty Results: ${emptyResults.length}`);

    if (errors.length > 0) {
      for (const e of errors) {
        console.log(`ERROR at #${e.index} [${e.id}]: ${e.error.split('\n')[0]}`);
      }
    }
    if (emptyResults.length > 0) {
      for (const er of emptyResults) {
        console.log(`EMPTY RESULT at #${er.index} [${er.id}]: ${er.task}`);
      }
    }

    expect(errors).toHaveLength(0);
    expect(emptyResults).toHaveLength(0);

    await conn.close();
  }, 180000); // 3 minutes timeout
});
