import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as duckdb from '@duckdb/duckdb-wasm/dist/duckdb-node-blocking.cjs';
import * as path from 'path';
import {
  getDeletedPlaygroundTables,
  saveDeletedPlaygroundTables,
  clearDeletedPlaygroundTables,
  DEFAULT_TABLE_NAMES,
} from '../src/engine/playgroundDuckdb';

describe('Playground Isolation & Table Persistence', () => {
  const store = new Map<string, string>();

  const mockStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, String(v)),
    removeItem: (k: string) => store.delete(k),
    clear: () => store.clear(),
  };

  beforeEach(() => {
    (globalThis as any).localStorage = mockStorage;
    mockStorage.clear();
  });

  afterEach(() => {
    mockStorage.clear();
  });

  describe('Storage Helpers for Deleted Tables', () => {
    it('should return empty Set when no deleted tables are stored', () => {
      const set = getDeletedPlaygroundTables();
      expect(set.size).toBe(0);
    });

    it('should persist and retrieve deleted table names', () => {
      const set = new Set(['products', 'orders']);
      saveDeletedPlaygroundTables(set);

      const retrieved = getDeletedPlaygroundTables();
      expect(retrieved.has('products')).toBe(true);
      expect(retrieved.has('orders')).toBe(true);
      expect(retrieved.has('customers')).toBe(false);
    });

    it('should clear deleted table names on reset', () => {
      const set = new Set(['ecommerce_sales']);
      saveDeletedPlaygroundTables(set);
      expect(getDeletedPlaygroundTables().has('ecommerce_sales')).toBe(true);

      clearDeletedPlaygroundTables();
      expect(getDeletedPlaygroundTables().size).toBe(0);
    });
  });

  describe('DuckDB In-Memory Database Isolation (Playground vs Main)', () => {
    it('should isolate tables created in playground from main catalog', async () => {
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

      // Main Connection (Studio / Cheatsheet)
      const mainConn = await db.connect();
      await mainConn.query(`
        CREATE TABLE products (id INT, name VARCHAR);
        INSERT INTO products VALUES (1, 'Main Catalog Laptop');
      `);

      // Playground Connection
      const pgConn = await db.connect();
      await pgConn.query(`
        ATTACH IF NOT EXISTS ':memory:' AS playground;
        USE playground;
      `);
      await pgConn.query(`
        CREATE TABLE products (id INT, name VARCHAR);
        INSERT INTO products VALUES (2, 'Playground Phone');
      `);

      // 1. Verify separate values
      const mainRes = await mainConn.query('SELECT name FROM products;');
      const pgRes = await pgConn.query('SELECT name FROM products;');
      expect(mainRes.toArray()[0].name).toBe('Main Catalog Laptop');
      expect(pgRes.toArray()[0].name).toBe('Playground Phone');

      // 2. Drop table in Playground
      await pgConn.query('DROP TABLE products;');

      // 3. Playground products is gone
      const pgTables = await pgConn.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_catalog = 'playground' AND table_type = 'BASE TABLE';
      `);

      expect(pgTables.toArray().some((r: any) => r.table_name === 'products')).toBe(false);

      // 4. Main products STILL exists and was NOT dropped!
      const mainResAfter = await mainConn.query('SELECT name FROM products;');
      expect(mainResAfter.toArray()[0].name).toBe('Main Catalog Laptop');

      await mainConn.close();
      await pgConn.close();
    });

    it('should ensure DEFAULT_TABLE_NAMES contains core store tables and ecommerce_sales', () => {
      expect(DEFAULT_TABLE_NAMES.has('ecommerce_sales')).toBe(true);
      expect(DEFAULT_TABLE_NAMES.has('customers')).toBe(true);
      expect(DEFAULT_TABLE_NAMES.has('products')).toBe(true);
      expect(DEFAULT_TABLE_NAMES.has('orders')).toBe(true);
      expect(DEFAULT_TABLE_NAMES.has('order_items')).toBe(true);
      expect(DEFAULT_TABLE_NAMES.has('subscribers')).toBe(true);
    });
  });
});
