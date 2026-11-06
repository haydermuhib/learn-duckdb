/**
 * Formats SQL queries:
 * 1. Places major query clauses (SELECT, FROM, WHERE, GROUP BY, ORDER BY, JOIN, etc.) on their own lines.
 * 2. Keeps window function specifications (OVER (PARTITION BY ... ORDER BY ...)) clean and inline.
 * 3. Standardizes uppercase keywords while strictly preserving strings, double-quoted identifiers, and comments.
 * 4. Cleans redundant whitespaces without altering query semantics.
 */
export function formatSql(sql: string): string {
  if (!sql || !sql.trim()) return sql;

  const placeholders: string[] = [];
  const saveLiteral = (str: string) => {
    placeholders.push(str);
    return `__SQL_LITERAL_${placeholders.length - 1}__`;
  };

  // 1. Protect block comments: /* ... */
  let tokenized = sql.replace(/\/\*[\s\S]*?\*\//g, saveLiteral);

  // 2. Protect single-line comments: -- ...
  tokenized = tokenized.replace(/--[^\r\n]*/g, saveLiteral);

  // 3. Protect string literals: 'example' or 'it''s'
  tokenized = tokenized.replace(/'(?:''|[^'])*'/g, saveLiteral);

  // 4. Protect double-quoted identifiers: "my_column" or "from"
  tokenized = tokenized.replace(/"(?:""|[^"])*"/g, saveLiteral);

  // 5. Protect window specifications OVER (...) so ORDER BY inside them does not get broken onto a new line
  tokenized = tokenized.replace(/\bover\s*\([^)]*\)/gi, match => {
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
    'TRUE',
    'FALSE',
  ];

  // Normalize spaces
  tokenized = tokenized.replace(/\s+/g, ' ').trim();

  // Single-pass regex for major clauses (sorted by length descending so multi-word clauses match first)
  const sortedClauses = [...majorClauses].sort((a, b) => b.length - a.length);
  const clauseRegex = new RegExp(
    `\\b(${sortedClauses.map(c => c.replace(/ /g, '\\s+')).join('|')})\\b`,
    'gi'
  );
  tokenized = tokenized.replace(
    clauseRegex,
    match => `\n${match.toUpperCase().replace(/\s+/g, ' ')} `
  );

  // Single-pass regex for other keywords
  const sortedKeywords = [...otherKeywords].sort((a, b) => b.length - a.length);
  const keywordRegex = new RegExp(
    `\\b(${sortedKeywords.map(k => k.replace(/ /g, '\\s+')).join('|')})\\b`,
    'gi'
  );
  tokenized = tokenized.replace(
    keywordRegex,
    match => match.toUpperCase().replace(/\s+/g, ' ')
  );

  // Clean up each line: normalize internal spaces and trim edges
  const lines = tokenized
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  let formatted = lines.join('\n');

  // Restore protected literals in reverse
  for (let i = placeholders.length - 1; i >= 0; i--) {
    formatted = formatted.replace(`__SQL_LITERAL_${i}__`, placeholders[i]);
  }

  return formatted;
}
