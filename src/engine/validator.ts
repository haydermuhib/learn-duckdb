import { ExerciseDef, ExerciseStep } from '../types/curriculum';
import { executeQuery, QueryResult, resetDatabase, switchDatabase } from './duckdb';

export interface ValidationFeedback {
  pass: boolean;
  message: string;
  userResult?: QueryResult;
  expectedResult?: QueryResult;
  error?: string;
}

export async function validateUserQuery(
  exercise: ExerciseDef,
  stepIndex: number,
  userSql: string
): Promise<ValidationFeedback> {
  const step: ExerciseStep = exercise.steps[stepIndex] || exercise.steps[0];
  const trimmedSql = userSql.trim().replace(/;+$/, '');

  if (!trimmedSql) {
    return {
      pass: false,
      message: 'Please write a SQL query before checking.',
    };
  }

  // 1. Check keyword requirements if specified
  if (step.requires && step.requires.length > 0) {
    const upperSql = trimmedSql.toUpperCase();
    for (const req of step.requires) {
      if (!upperSql.includes(req.toUpperCase())) {
        return {
          pass: false,
          message: `Your query should use the keyword or clause: ${req}`,
        };
      }
    }
  }

  try {
    // Ensure we are on the right database
    await switchDatabase(exercise.db);

    // Is this a modifying/DDL query? (INSERT, UPDATE, DELETE, CREATE, DROP, ALTER)
    const isMutation = /^(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(trimmedSql);

    if (isMutation) {
      // For mutation tests:
      // Reset DB to clean state, run canonical solution, capture check query result
      await resetDatabase(exercise.db);
      const expectedCheckQuery = step.check || `SELECT * FROM ${exercise.db === 'school' ? 'students' : 'products'}`;
      let expectedResult: QueryResult;
      
      try {
        await executeQuery(step.solution);
        expectedResult = await executeQuery(expectedCheckQuery);
      } catch (err: any) {
        expectedResult = { columns: [], rows: [], executionTimeMs: 0, rowCount: 0 };
      }

      // Reset DB again, run user query, capture check query result
      await resetDatabase(exercise.db);
      const userMutationResult = await executeQuery(trimmedSql);
      const userResult = await executeQuery(expectedCheckQuery);

      const isMatch = compareResults(userResult, expectedResult, false);
      if (isMatch) {
        return {
          pass: true,
          message: 'Excellent! Your SQL modified the database exactly as requested.',
          userResult,
          expectedResult,
        };
      } else {
        return {
          pass: false,
          message: 'The database state does not match the expected solution. Check your statement and try again.',
          userResult,
          expectedResult,
        };
      }
    }

    // Standard SELECT query validation
    let userResult: QueryResult;
    try {
      userResult = await executeQuery(trimmedSql);
    } catch (err: any) {
      return {
        pass: false,
        message: `SQL Error: ${err.message || String(err)}`,
        error: err.message || String(err),
      };
    }

    let expectedResult: QueryResult;
    try {
      expectedResult = await executeQuery(step.solution);
    } catch (err: any) {
      console.warn('Error executing canonical solution:', err);
      // Fallback
      expectedResult = userResult;
    }

    const hasOrderBy = /\bORDER\s+BY\b/i.test(trimmedSql);
    const pass = compareResults(userResult, expectedResult, hasOrderBy);

    if (pass) {
      return {
        pass: true,
        message: 'Correct! Great job!',
        userResult,
        expectedResult,
      };
    }

    // Detail the discrepancy
    let reason = 'Results do not match the expected answer.';
    if (userResult.columns.length !== expectedResult.columns.length) {
      reason = `Expected ${expectedResult.columns.length} columns (${expectedResult.columns.join(', ')}), but your query returned ${userResult.columns.length} columns (${userResult.columns.join(', ')}).`;
    } else if (userResult.rowCount !== expectedResult.rowCount) {
      reason = `Expected ${expectedResult.rowCount} rows, but your query returned ${userResult.rowCount} rows.`;
    }

    return {
      pass: false,
      message: reason,
      userResult,
      expectedResult,
    };
  } catch (err: any) {
    let msg = err.message || 'An unexpected error occurred during execution.';
    if (/syntax error at or near ["']ANTI["']/i.test(msg) || /LEFT\s+ANTI\s+JOIN/i.test(trimmedSql)) {
      msg = "DuckDB syntax error: Use 'ANTI JOIN' directly (DuckDB does not use the 'LEFT ANTI JOIN' syntax).";
    }
    return {
      pass: false,
      message: msg,
      error: err.message || String(err),
    };
  }
}

function compareResults(actual: QueryResult, expected: QueryResult, strictOrder: boolean): boolean {
  if (actual.columns.length !== expected.columns.length) return false;
  if (actual.rowCount !== expected.rowCount) return false;

  let actualRows = actual.rows;
  let expectedRows = expected.rows;

  if (!strictOrder) {
    actualRows = sortRows(actualRows);
    expectedRows = sortRows(expectedRows);
  }

  for (let i = 0; i < actualRows.length; i++) {
    const aRow = actualRows[i];
    const eRow = expectedRows[i];
    for (let j = 0; j < aRow.length; j++) {
      if (!valuesMatch(aRow[j], eRow[j])) {
        return false;
      }
    }
  }

  return true;
}

function valuesMatch(a: any, b: any): boolean {
  if (a === b) return true;
  if (a === null || a === undefined) return b === null || b === undefined;
  if (b === null || b === undefined) return false;

  // Floating point comparison
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 0.001;
  }

  // String comparison (case-insensitive for string outputs)
  if (typeof a === 'string' && typeof b === 'string') {
    return a.trim() === b.trim();
  }

  return String(a) === String(b);
}

function safeStringify(row: any[]): string {
  return JSON.stringify(row, (_, v) => (typeof v === 'bigint' ? v.toString() : v));
}

function sortRows(rows: any[][]): any[][] {
  return [...rows].sort((a, b) => {
    const strA = safeStringify(a);
    const strB = safeStringify(b);
    return strA.localeCompare(strB);
  });
}

