import { describe, it, expect } from 'vitest';
import { QueryResult } from '../src/engine/duckdb';

// We test the comparison & validation rules directly
describe('Validator Logic & Result Matching', () => {
  function compareResults(actual: QueryResult, expected: QueryResult, strictOrder: boolean): boolean {
    if (actual.columns.length !== expected.columns.length) return false;
    if (actual.rowCount !== expected.rowCount) return false;

    let actualRows = actual.rows;
    let expectedRows = expected.rows;

    if (!strictOrder) {
      actualRows = [...actualRows].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
      expectedRows = [...expectedRows].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    }

    for (let i = 0; i < actualRows.length; i++) {
      const aRow = actualRows[i];
      const eRow = expectedRows[i];
      for (let j = 0; j < aRow.length; j++) {
        const a = aRow[j];
        const b = eRow[j];
        if (a === b) continue;
        if (a === null || a === undefined) {
          if (b !== null && b !== undefined) return false;
          continue;
        }
        if (b === null || b === undefined) return false;

        if (typeof a === 'number' && typeof b === 'number') {
          if (Math.abs(a - b) >= 0.001) return false;
          continue;
        }

        if (typeof a === 'string' && typeof b === 'string') {
          if (a.trim() !== b.trim()) return false;
          continue;
        }

        if (String(a) !== String(b)) return false;
      }
    }

    return true;
  }

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
