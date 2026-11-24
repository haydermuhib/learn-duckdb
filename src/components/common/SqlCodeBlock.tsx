import React, { useMemo } from 'react';

interface SqlCodeBlockProps {
  code: string;
  className?: string;
}

export const KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'GROUP', 'BY', 'ORDER', 'LIMIT', 'OFFSET',
  'HAVING', 'QUALIFY', 'EXCLUDE', 'REPLACE', 'COLUMNS', 'AS', 'WITH',
  'JOIN', 'ON', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'CROSS',
  'SEMI', 'ANTI', 'ASOF', 'POSITIONAL', 'NATURAL', 'UNION', 'ALL',
  'INTERSECT', 'EXCEPT', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'ATTACH', 'DETACH',
  'USE', 'PRAGMA', 'COPY', 'TO', 'UNPIVOT', 'PIVOT', 'IN', 'IS',
  'NULL', 'NOT', 'AND', 'OR', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'DESC', 'ASC', 'OVER', 'PARTITION', 'WINDOW', 'BETWEEN', 'LIKE',
  'ILIKE', 'SIMILAR', 'USING', 'SAMPLE', 'BERNOULLI', 'RESERVOIR',
  'FILTER', 'INTERVAL', 'DAY', 'MONTH', 'YEAR', 'DISTINCT', 'TRY_CAST',
  'CAST', 'SHOW', 'DESCRIBE', 'SUMMARIZE'
]);

export const DATA_TYPES = new Set([
  'INTEGER', 'INT', 'BIGINT', 'HUGEINT', 'SMALLINT', 'TINYINT', 'UBIGINT',
  'VARCHAR', 'TEXT', 'STRING', 'BOOLEAN', 'BOOL', 'DATE', 'TIMESTAMP',
  'TIMESTAMPTZ', 'INTERVAL', 'DOUBLE', 'FLOAT', 'DECIMAL', 'NUMERIC',
  'UUID', 'JSON', 'STRUCT', 'LIST', 'MAP', 'BLOB', 'PARQUET', 'CSV', 'ZSTD'
]);

export interface Token {
  type: 'keyword' | 'type' | 'func' | 'string' | 'number' | 'comment' | 'punct' | 'ident' | 'space' | 'other';
  text: string;
}

export function tokenizeSql(sql: string): Token[] {
  const tokenRegex = /(\/\*[\s\S]*?\*\/|--[^\r\n]*)|('(?:''|[^'])*')|(\b\d+(?:\.\d+)?\b)|(::|->>|->|>=|<=|!=|<>|[(),;=<>+*/%])|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;
  const tokens: Token[] = [];
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(sql)) !== null) {
    const [raw, comment, str, num, punct, word, space] = match;

    if (comment) {
      tokens.push({ type: 'comment', text: comment });
    } else if (str) {
      tokens.push({ type: 'string', text: str });
    } else if (num) {
      tokens.push({ type: 'number', text: num });
    } else if (punct) {
      tokens.push({ type: 'punct', text: punct });
    } else if (space) {
      tokens.push({ type: 'space', text: space });
    } else if (word) {
      const upper = word.toUpperCase();

      if (KEYWORDS.has(upper)) {
        tokens.push({ type: 'keyword', text: word });
      } else if (DATA_TYPES.has(upper)) {
        tokens.push({ type: 'type', text: word });
      } else {
        // Look ahead to check if immediately followed by an open paren (function call)
        const nextChar = sql.slice(match.index + word.length).trimStart()[0];

        if (nextChar === '(') {
          tokens.push({ type: 'func', text: word });
        } else {
          tokens.push({ type: 'ident', text: word });
        }
      }
    } else {
      tokens.push({ type: 'other', text: raw });
    }
  }

  return tokens;
}

export const SqlCodeBlock: React.FC<SqlCodeBlockProps> = ({
  code,
  className = 'p-3 bg-[#0B1120] border-2 border-ink font-mono text-xs overflow-x-auto overflow-y-hidden overscroll-x-contain overscroll-y-auto whitespace-pre-wrap break-words leading-relaxed select-text',
}) => {
  const tokens = useMemo(() => tokenizeSql(code), [code]);

  return (
    <pre className={className}>
      <code>
        {tokens.map((token, idx) => {
          switch (token.type) {
            case 'keyword':
              return (
                <span key={idx} className="text-[#C678DD] font-semibold">
                  {token.text}
                </span>
              );
            case 'type':
              return (
                <span key={idx} className="text-[#E5C07B] font-medium">
                  {token.text}
                </span>
              );
            case 'func':
              return (
                <span key={idx} className="text-[#61AFEF] font-medium">
                  {token.text}
                </span>
              );
            case 'string':
              return (
                <span key={idx} className="text-[#98C379]">
                  {token.text}
                </span>
              );
            case 'number':
              return (
                <span key={idx} className="text-[#D19A66] font-medium">
                  {token.text}
                </span>
              );
            case 'comment':
              return (
                <span key={idx} className="text-[#64748B] italic">
                  {token.text}
                </span>
              );
            case 'punct':
              return (
                <span key={idx} className="text-slate-400">
                  {token.text}
                </span>
              );
            case 'ident':
              return (
                <span key={idx} className="text-slate-100">
                  {token.text}
                </span>
              );
            default:
              return <React.Fragment key={idx}>{token.text}</React.Fragment>;
          }
        })}
      </code>
    </pre>
  );
};
