import { describe, it, expect } from 'vitest';
import { QueryResult } from '../src/engine/duckdb';
import { compareResults } from '../src/engine/validator';

describe('Validator Logic & Result Matching', () => {

  it('should match identical query results', () => {
    const resA: QueryResult = {
      columns: ['name', 'price'],
      rows: [['Laptop', 1200], ['Mouse', 25]],
      executionTimeMs: 1.2,
      rowCount: 2,
    };
    const resB: QueryResult = {
      columns: ['name', 'price'],
      rows: [['Laptop', 1200], ['Mouse', 25]],
      executionTimeMs: 2.1,
      rowCount: 2,
    };

    expect(compareResults(resA, resB, false)).toBe(true);
    expect(compareResults(resA, resB, true)).toBe(true);
  });

  it('should allow unordered rows when strictOrder is false', () => {
    const resA: QueryResult = {
      columns: ['name', 'price'],
      rows: [['Mouse', 25], ['Laptop', 1200]],
      executionTimeMs: 1.0,
      rowCount: 2,
    };
    const resB: QueryResult = {
      columns: ['name', 'price'],
      rows: [['Laptop', 1200], ['Mouse', 25]],
      executionTimeMs: 1.0,
      rowCount: 2,
    };

    expect(compareResults(resA, resB, false)).toBe(true);
    expect(compareResults(resA, resB, true)).toBe(false);
  });

  it('should handle floating point differences with tolerance', () => {
    const resA: QueryResult = {
      columns: ['avg_price'],
      rows: [[199.9900001]],
      executionTimeMs: 1.0,
      rowCount: 1,
    };
    const resB: QueryResult = {
      columns: ['avg_price'],
      rows: [[199.99]],
      executionTimeMs: 1.0,
      rowCount: 1,
    };

    expect(compareResults(resA, resB, false)).toBe(true);
  });

  it('should fail when row counts or columns mismatch', () => {
    const resA: QueryResult = {
      columns: ['name'],
      rows: [['Laptop']],
      executionTimeMs: 1.0,
      rowCount: 1,
    };
    const resB: QueryResult = {
      columns: ['name', 'price'],
      rows: [['Laptop', 1200]],
      executionTimeMs: 1.0,
      rowCount: 1,
    };

    expect(compareResults(resA, resB, false)).toBe(false);
  });

  it('should handle BigInt values in rows without throwing', () => {
    const resA: QueryResult = {
      columns: ['count'],
      rows: [[BigInt(100)]],
      executionTimeMs: 1.0,
      rowCount: 1,
    };
    const resB: QueryResult = {
      columns: ['count'],
      rows: [[100]],
      executionTimeMs: 1.0,
      rowCount: 1,
    };

    expect(compareResults(resA, resB, false)).toBe(true);
  });

  it('should identify mutation statements accurately', () => {
    const isMutation = (sql: string) => /^(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(sql.trim());

    expect(isMutation('SELECT * FROM products')).toBe(false);
    expect(isMutation('WITH cte AS (...) SELECT * FROM cte')).toBe(false);
    expect(isMutation('INSERT INTO products VALUES (1, "Desk")')).toBe(true);
    expect(isMutation('UPDATE customers SET city = "London"')).toBe(true);
    expect(isMutation('DELETE FROM order_items WHERE quantity = 0')).toBe(true);
    expect(isMutation('CREATE TABLE summary AS SELECT * FROM products')).toBe(true);
  });
});
