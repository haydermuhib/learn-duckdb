import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  SqlCodeBlock,
  tokenizeSql,
  KEYWORDS,
  DATA_TYPES,
} from '../src/components/common/SqlCodeBlock';

describe('SqlCodeBlock & SQL Tokenizer Suite', () => {
  describe('Keyword & Type Catalog Completeness', () => {
    it('should include key DuckDB and modern SQL clauses', () => {
      const expectedKeywords = [
        'SELECT', 'FROM', 'WHERE', 'QUALIFY', 'EXCLUDE', 'REPLACE',
        'COLUMNS', 'UNPIVOT', 'PIVOT', 'ASOF', 'POSITIONAL', 'GROUP', 'BY'
      ];

      for (const kw of expectedKeywords) {
        expect(KEYWORDS.has(kw)).toBe(true);
      }
    });

    it('should include DuckDB analytical and complex types', () => {
      const expectedTypes = ['INTEGER', 'VARCHAR', 'STRUCT', 'LIST', 'MAP', 'TIMESTAMP', 'PARQUET'];

      for (const dt of expectedTypes) {
        expect(DATA_TYPES.has(dt)).toBe(true);
      }
    });
  });

  describe('tokenizeSql() Tokenizer Engine', () => {
    it('should tokenize simple SELECT query accurately', () => {
      const tokens = tokenizeSql('SELECT id, name FROM users;');
      const types = tokens.map(t => t.type);

      expect(tokens[0]).toEqual({ type: 'keyword', text: 'SELECT' });
      expect(types).toContain('keyword');
      expect(types).toContain('ident');
      expect(types).toContain('punct');
    });

    it('should identify function calls when followed by parentheses', () => {
      const tokens = tokenizeSql("SELECT printf('Item: %s', name), round(price, 2) FROM products;");
      const funcs = tokens.filter(t => t.type === 'func').map(t => t.text);

      expect(funcs).toContain('printf');
      expect(funcs).toContain('round');
    });

    it('should distinguish function names from standalone column identifiers', () => {
      // In 'SELECT round FROM my_table', 'round' is NOT followed by '(', so it is an ident
      const tokens = tokenizeSql('SELECT round FROM my_table;');
      const identTokens = tokens.filter(t => t.type === 'ident').map(t => t.text);
      const funcTokens = tokens.filter(t => t.type === 'func').map(t => t.text);

      expect(identTokens).toContain('round');
      expect(funcTokens).not.toContain('round');
    });

    it('should tokenize string literals including escaped quotes and specifiers', () => {
      const tokens = tokenizeSql("SELECT 'SKU-%04d: %s ($%.2f)', 'it''s cool' FROM items;");
      const strings = tokens.filter(t => t.type === 'string').map(t => t.text);

      expect(strings).toContain("'SKU-%04d: %s ($%.2f)'");
      expect(strings).toContain("'it''s cool'");
    });

    it('should tokenize integer and floating point numbers', () => {
      const tokens = tokenizeSql('SELECT 42, 3.14159, 1000 FROM math;');
      const numbers = tokens.filter(t => t.type === 'number').map(t => t.text);

      expect(numbers).toEqual(['42', '3.14159', '1000']);
    });

    it('should tokenize single-line and multi-line comments', () => {
      const sql = `-- Calculate total\nSELECT price * 1.2 /* VAT included */ FROM sales;`;
      const tokens = tokenizeSql(sql);
      const comments = tokens.filter(t => t.type === 'comment').map(t => t.text);

      expect(comments).toContain('-- Calculate total');
      expect(comments).toContain('/* VAT included */');
    });

    it('should recognize DuckDB data types in CAST and expressions', () => {
      const tokens = tokenizeSql('SELECT CAST(val AS VARCHAR), amount::INTEGER FROM data;');
      const dataTypes = tokens.filter(t => t.type === 'type').map(t => t.text);

      expect(dataTypes).toContain('VARCHAR');
      expect(dataTypes).toContain('INTEGER');
    });

    it('should preserve whitespace and formatting completely', () => {
      const formattedSql = `SELECT\n  name,\n  price\nFROM products\nLIMIT 5;`;
      const tokens = tokenizeSql(formattedSql);
      const reconstructed = tokens.map(t => t.text).join('');

      expect(reconstructed).toBe(formattedSql);
    });

    it('should correctly handle multi-character operators (::, ->>, >=)', () => {
      const tokens = tokenizeSql("SELECT raw::JSON->>'name' FROM logs WHERE score >= 10;");
      const puncts = tokens.filter(t => t.type === 'punct').map(t => t.text);

      expect(puncts).toContain('::');
      expect(puncts).toContain('->>');
      expect(puncts).toContain('>=');
    });
  });

  describe('<SqlCodeBlock /> React Rendering Component', () => {
    it('should render pure <pre><code> HTML structure with no heavy editor overhead', () => {
      const markup = renderToStaticMarkup(
        React.createElement(SqlCodeBlock, {
          code: 'SELECT 1;',
        })
      );

      expect(markup).toContain('<pre class="');
      expect(markup).toContain('<code>');
      expect(markup).toContain('</code></pre>');
      expect(markup).not.toContain('cm-editor');
      expect(markup).not.toContain('CodeMirror');
    });

    it('should apply One Dark / Neo-Brutalist color classes to tokens', () => {
      const sql = `SELECT\n  printf('SKU-%04d', id) AS label\nFROM products\nLIMIT 5;`;

      const markup = renderToStaticMarkup(
        React.createElement(SqlCodeBlock, { code: sql })
      );

      // Keywords in magenta #C678DD
      expect(markup).toContain('text-[#C678DD]');
      expect(markup).toContain('SELECT');
      expect(markup).toContain('AS');
      expect(markup).toContain('FROM');
      expect(markup).toContain('LIMIT');

      // Function in cyan #61AFEF
      expect(markup).toContain('text-[#61AFEF]');
      expect(markup).toContain('printf');

      // String in emerald #98C379
      expect(markup).toContain('text-[#98C379]');
      expect(markup).toContain('&#x27;SKU-%04d&#x27;');

      // Number in amber #D19A66
      expect(markup).toContain('text-[#D19A66]');
      expect(markup).toContain('5');

      // Identifiers in slate-100
      expect(markup).toContain('text-slate-100');
    });

    it('should render comments with slate-500 italic styling', () => {
      const markup = renderToStaticMarkup(
        React.createElement(SqlCodeBlock, {
          code: '-- DuckDB Superpower\nSELECT 42;',
        })
      );

      expect(markup).toContain('text-[#64748B] italic');
      expect(markup).toContain('-- DuckDB Superpower');
    });

    it('should support custom className overrides while keeping token styling', () => {
      const markup = renderToStaticMarkup(
        React.createElement(SqlCodeBlock, {
          code: 'SELECT 1;',
          className: 'custom-sql-block',
        })
      );

      expect(markup).toContain('<pre class="custom-sql-block">');
      expect(markup).toContain('text-[#C678DD]');
    });
  });
});
