import { describe, it, expect } from 'vitest';
import * as duckdb from '@duckdb/duckdb-wasm/dist/duckdb-node-blocking.cjs';
import * as path from 'path';
import * as fs from 'fs';
import { extractArrowTable } from '../src/engine/duckdb';

describe('JSON BigInt and Complex Types Loading', () => {
  it('should successfully extract Arrow table containing orders with nested BigInts', async () => {
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

    const fixturePath = path.resolve(__dirname, 'fixtures/simulated_orders.json');
    const jsonBuf = fs.readFileSync(fixturePath);
    await db.registerFileBuffer('simulated_orders.json', new Uint8Array(jsonBuf));

    await conn.query("CREATE OR REPLACE TABLE orders AS SELECT * FROM read_json_auto('simulated_orders.json');");

    const res = await conn.query('SELECT * FROM orders LIMIT 1;');
    const { columns, rows, columnTypes } = extractArrowTable(res);

    expect(columns).toEqual(['order']);
    expect(rows.length).toBe(1);
    expect(columnTypes).toBeDefined();

    // Verify cell is valid JSON and contains bigints converted properly
    const firstCell = rows[0][0];
    expect(firstCell).toBeTypeOf('string');
    const parsed = JSON.parse(firstCell);
    expect(parsed.line_items).toBeDefined();
    expect(parsed.line_items[0].variant_id).toBe(69254412009666);
    expect(parsed.customer.email).toBe('jordan.williams1083@example.com');
  });

  it('should handle direct BigInt columns exceeding Number.MAX_SAFE_INTEGER', async () => {
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

    const res = await conn.query('SELECT 9007199254740995::HUGEINT as huge_val, 42::BIGINT as normal_big;');
    const { columns, rows } = extractArrowTable(res);

    expect(columns).toEqual(['huge_val', 'normal_big']);
    expect(rows[0][1]).toBe(42);
    // huge_val exceeds safe integer, so should be preserved accurately as string
    expect(String(rows[0][0])).toBe('9007199254740995');
  });
});
