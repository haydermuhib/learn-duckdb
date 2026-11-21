import { describe, it, expect } from 'vitest';
import {
  DUCKDB_CHEAT_SHEET_CATEGORIES,
  DUCKDB_CHEAT_SHEET_ITEMS,
  STRFTIME_SPECIFIERS,
  PRINTF_SPECIFIERS,
  REGEX_SPECIFIERS,
  DUCKDB_DATA_TYPES,
  searchCheatSheet,
} from '../src/data/duckdbCheatSheetData';

describe('DuckDB Cheat Sheet Catalog Integrity', () => {
  it('should define all 7 core categories with unique IDs', () => {
    expect(DUCKDB_CHEAT_SHEET_CATEGORIES.length).toBe(7);
    const ids = DUCKDB_CHEAT_SHEET_CATEGORIES.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should contain a substantial catalog of items (>= 50 items)', () => {
    expect(DUCKDB_CHEAT_SHEET_ITEMS.length).toBeGreaterThanOrEqual(50);
  });

  it('should verify every item has valid category, signature, summary, and runnable SQL', () => {
    const validCategoryIds = new Set(DUCKDB_CHEAT_SHEET_CATEGORIES.map(c => c.id));

    DUCKDB_CHEAT_SHEET_ITEMS.forEach(item => {
      expect(validCategoryIds.has(item.category), `Item ${item.id} has invalid category ${item.category}`).toBe(true);
      expect(item.id.trim()).not.toBe('');
      expect(item.name.trim()).not.toBe('');
      expect(item.signature.trim()).not.toBe('');
      expect(item.summary.trim()).not.toBe('');
      expect(item.exampleSql.trim()).not.toBe('');
      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags.length).toBeGreaterThan(0);
    });
  });

  it('should verify format specifiers for strftime contain key parameters (%Y, %m, %d, %H, %M, %S)', () => {
    expect(STRFTIME_SPECIFIERS.length).toBeGreaterThanOrEqual(15);
    const codes = STRFTIME_SPECIFIERS.map(s => s.code);
    expect(codes).toContain('%Y');
    expect(codes).toContain('%m');
    expect(codes).toContain('%d');
    expect(codes).toContain('%H');
    expect(codes).toContain('%M');
    expect(codes).toContain('%S');
    expect(codes).toContain('%f');

    STRFTIME_SPECIFIERS.forEach(spec => {
      expect(spec.code.startsWith('%')).toBe(true);
      expect(spec.meaning.trim()).not.toBe('');
      expect(spec.example.trim()).not.toBe('');
    });
  });

  it('should verify format specifiers for printf contain key parameters (%s, %d, %f, %x, %%)', () => {
    expect(PRINTF_SPECIFIERS.length).toBeGreaterThanOrEqual(8);
    const codes = PRINTF_SPECIFIERS.map(s => s.code);
    expect(codes).toContain('%s');
    expect(codes).toContain('%d');
    expect(codes).toContain('%f');
    expect(codes).toContain('%.2f');
    expect(codes).toContain('%x');
    expect(codes).toContain('%%');

    PRINTF_SPECIFIERS.forEach(spec => {
      expect(spec.code.startsWith('%')).toBe(true);
      expect(spec.meaning.trim()).not.toBe('');
      expect(spec.example.trim()).not.toBe('');
    });
  });

  it('should verify regex format specifiers contain key regex patterns (\\d, \\w, \\s, \\1, ^, $)', () => {
    expect(REGEX_SPECIFIERS.length).toBeGreaterThanOrEqual(10);
    const codes = REGEX_SPECIFIERS.map(s => s.code);
    expect(codes).toContain('\\d');
    expect(codes).toContain('\\w');
    expect(codes).toContain('\\s');
    expect(codes).toContain('^');
    expect(codes).toContain('$');

    REGEX_SPECIFIERS.forEach(spec => {
      expect(spec.meaning.trim()).not.toBe('');
      expect(spec.example.trim()).not.toBe('');
    });
  });

  it('should verify DuckDB data types catalog covers all core type families', () => {
    expect(DUCKDB_DATA_TYPES.length).toBeGreaterThanOrEqual(18);
    const names = DUCKDB_DATA_TYPES.map(t => t.name);
    expect(names).toContain('INTEGER');
    expect(names).toContain('BIGINT');
    expect(names).toContain('HUGEINT');
    expect(names).toContain('VARCHAR');
    expect(names).toContain('UUID');
    expect(names).toContain('DATE');
    expect(names).toContain('TIMESTAMP');
    expect(names).toContain('INTERVAL');
    expect(names).toContain('T[] (LIST)');
    expect(names).toContain('STRUCT(...)');
    expect(names).toContain('MAP(K, V)');
    expect(names).toContain('JSON');

    DUCKDB_DATA_TYPES.forEach(dt => {
      expect(dt.description.trim()).not.toBe('');
      expect(dt.exampleValue.trim()).not.toBe('');
    });
  });

  it('should verify key analytical superpowers are present in items', () => {
    const itemNames = DUCKDB_CHEAT_SHEET_ITEMS.map(i => i.name.toUpperCase());
    expect(itemNames.some(n => n.includes('UNION BY NAME'))).toBe(true);
    expect(itemNames.some(n => n.includes('SUMMARIZE'))).toBe(true);
    expect(itemNames.some(n => n.includes('RANGE') || n.includes('GENERATE_SERIES'))).toBe(true);
    expect(itemNames.some(n => n.includes('TRY_CAST'))).toBe(true);
    expect(itemNames.some(n => n.includes('ILIKE ANY'))).toBe(true);
    expect(itemNames.some(n => n.includes('MD5') || n.includes('HASH'))).toBe(true);
  });

  it('should support instant search across names, parameters, format codes, and summaries', () => {
    // Search for strftime parameter %m
    const monthResults = searchCheatSheet('%m');
    expect(monthResults.length).toBeGreaterThan(0);
    const hasStrftime = monthResults.some(r => r.name.toLowerCase().includes('strftime'));
    expect(hasStrftime).toBe(true);

    // Search for printf
    const printfResults = searchCheatSheet('printf');
    expect(printfResults.length).toBeGreaterThan(0);
    expect(printfResults[0].name.toLowerCase()).toContain('printf');

    // Search for QUALIFY
    const qualifyResults = searchCheatSheet('qualify');
    expect(qualifyResults.length).toBeGreaterThan(0);
    expect(qualifyResults[0].name.toUpperCase()).toContain('QUALIFY');

    // Search for list_filter / lambda
    const lambdaResults = searchCheatSheet('lambda');
    expect(lambdaResults.length).toBeGreaterThan(0);
  });
});
