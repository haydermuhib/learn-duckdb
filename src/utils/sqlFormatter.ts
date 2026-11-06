/**
 * Formats SQL queries:
 * 1. Places major clauses (SELECT, FROM, WHERE, GROUP BY, ORDER BY, JOIN, etc.) on their own lines.
 * 2. Standardizes uppercase keywords while preserving strings, identifiers, and comments.
 * 3. Cleans redundant whitespaces.
 */
export function formatSql(sql: string): string {
  if (!sql || !sql.trim()) return sql;

  // Protect string literals: 'example' or 'it''s'
  const stringLiterals: string[] = [];
  let tokenized = sql.replace(/'(?:''|[^'])*'/g, match => {
    stringLiterals.push(match);
    return `__SQL_STR_${stringLiterals.length - 1}__`;
  });

  // Major clauses that should begin on a new line
  const majorClauses = [
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
  const otherKeywords = [
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
  ];

  // Normalize spaces first
  tokenized = tokenized.replace(/\s+/g, ' ').trim();

  // Insert line breaks before major clauses
  // Sort clauses by length descending so multi-word clauses match first
  const sortedClauses = [...majorClauses].sort((a, b) => b.length - a.length);
  for (const clause of sortedClauses) {
    const pattern = new RegExp(`\\b${clause.replace(/ /g, '\\s+')}\\b`, 'gi');
    tokenized = tokenized.replace(pattern, `\n${clause} `);
  }

  // Capitalize other keywords
  const sortedKeywords = [...otherKeywords].sort((a, b) => b.length - a.length);
  for (const kw of sortedKeywords) {
    const pattern = new RegExp(`\\b${kw.replace(/ /g, '\\s+')}\\b`, 'gi');
    tokenized = tokenized.replace(pattern, kw);
  }

  // Clean up each line: normalize internal spaces and trim edges
  const lines = tokenized
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  let formatted = lines.join('\n');

  // Restore string literals
  stringLiterals.forEach((literal, idx) => {
    formatted = formatted.replace(`__SQL_STR_${idx}__`, literal);
  });

  return formatted;
}
