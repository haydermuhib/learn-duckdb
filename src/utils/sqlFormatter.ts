/**
 * Formats SQL queries:
 * 1. Places major query clauses (SELECT, FROM, WHERE, GROUP BY, ORDER BY, JOIN, etc.) on their own lines.
 * 2. Keeps window function specifications (OVER (PARTITION BY ... ORDER BY ...)) clean and inline.
 * 3. Standardizes uppercase keywords while strictly preserving strings, double-quoted identifiers, and comments.
 * 4. Cleans redundant whitespaces without altering query semantics.
 */

// Single-pass scanner to safely capture comments and quoted literals without collisions
const LITERAL_OR_COMMENT_REGEX = /\/\*[\s\S]*?\*\/|--[^\r\n]*|'(?:''|[^'])*'|"(?:""|[^"])*"/g;

// Window specification regex supporting nested parentheses (e.g. OVER (PARTITION BY COALESCE(dept, 'N/A') ORDER BY id))
const WINDOW_SPEC_REGEX = /\bover\s*\((?:[^()]+|\([^()]*\))*\)/gi;

// Major clauses that should begin on a new line
const MAJOR_CLAUSES = [
  'SELECT DISTINCT',
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'LEFT OUTER JOIN',
  'RIGHT OUTER JOIN',
  'FULL OUTER JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'FULL JOIN',
  'CROSS JOIN',
  'SEMI JOIN',
  'ANTI JOIN',
  'ASOF JOIN',
  'POSITIONAL JOIN',
  'NATURAL JOIN',
  'JOIN',
  'ON',
  'UNION ALL',
  'UNION',
  'INTERSECT',
  'EXCEPT',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
  'WITH RECURSIVE',
  'WITH',
  'WINDOW',
];

// Minor keywords to uppercase
const OTHER_KEYWORDS = [
  'DISTINCT',
  'AND',
  'OR',
  'NOT',
  'IN',
  'IS',
  'NULL',
  'AS',
  'ASC',
  'DESC',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'OVER',
  'PARTITION BY',
  'BETWEEN',
  'LIKE',
  'ILIKE',
  'EXISTS',
  'ALL',
  'ANY',
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
  'STRING_AGG',
  'LIST',
  'UNNEST',
  'FILTER',
  'EXCLUDE',
  'REPLACE',
  'COLUMNS',
  'CREATE TABLE',
  'DROP TABLE',
  'ALTER TABLE',
  'PRIMARY KEY',
  'FOREIGN KEY',
  'TRUE',
  'FALSE',
];

// Precompile regexes once at module level (sorted by length descending for greedy multi-word match)
const SORTED_CLAUSES = [...MAJOR_CLAUSES].sort((a, b) => b.length - a.length);
const CLAUSE_REGEX = new RegExp(
  `\\b(${SORTED_CLAUSES.map(c => c.replace(/ /g, '\\s+')).join('|')})\\b`,
  'gi'
);

const SORTED_KEYWORDS = [...OTHER_KEYWORDS].sort((a, b) => b.length - a.length);
const KEYWORD_REGEX = new RegExp(
  `\\b(${SORTED_KEYWORDS.map(k => k.replace(/ /g, '\\s+')).join('|')})\\b`,
  'gi'
);

export function formatSql(sql: string): string {
  if (!sql || !sql.trim()) return sql;

  const placeholders: string[] = [];
  const saveLiteral = (str: string) => {
    placeholders.push(str);
    return `__SQL_LITERAL_${placeholders.length - 1}__`;
  };

  // 1. Protect comments, string literals, and double-quoted identifiers in a single pass
  let tokenized = sql.replace(LITERAL_OR_COMMENT_REGEX, saveLiteral);

  // 2. Protect window specifications OVER (...) so ORDER BY inside them does not get broken onto a new line
  tokenized = tokenized.replace(WINDOW_SPEC_REGEX, match => {
    const innerFormatted = match
      .replace(/\bover\b/gi, 'OVER')
      .replace(/\bpartition\s+by\b/gi, 'PARTITION BY')
      .replace(/\border\s+by\b/gi, 'ORDER BY')
      .replace(/\basc\b/gi, 'ASC')
      .replace(/\bdesc\b/gi, 'DESC')
      .replace(/\bnulls\s+first\b/gi, 'NULLS FIRST')
      .replace(/\bnulls\s+last\b/gi, 'NULLS LAST')
      .replace(/\s+/g, ' ');
    return saveLiteral(innerFormatted);
  });

  // Normalize spaces
  tokenized = tokenized.replace(/\s+/g, ' ').trim();

  // Apply major clauses newline formatting
  tokenized = tokenized.replace(
    CLAUSE_REGEX,
    match => `\n${match.toUpperCase().replace(/\s+/g, ' ')} `
  );

  // Apply keyword uppercasing
  tokenized = tokenized.replace(
    KEYWORD_REGEX,
    match => match.toUpperCase().replace(/\s+/g, ' ')
  );

  // Clean up each line: normalize internal spaces and trim edges
  const lines = tokenized
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  let formatted = lines.join('\n');

  // Restore protected literals in reverse using replacer function to avoid '$' special pattern injection
  for (let i = placeholders.length - 1; i >= 0; i--) {
    formatted = formatted.replace(`__SQL_LITERAL_${i}__`, () => placeholders[i]);
  }

  return formatted;
}
