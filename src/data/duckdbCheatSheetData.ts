import {
  CategoryMetadata,
  CheatSheetCategory,
  CheatSheetItem,
  FormatSpecifier,
  DuckDBDataType,
  DuckDBCliCommand,
  DuckDBExtension,
} from '../types/cheatsheet';

export const DUCKDB_CHEAT_SHEET_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'superpowers',
    title: 'DuckDB Superpowers & Clauses',
    shortTitle: 'Superpowers',
    iconName: 'Zap',
    description: 'Modern SQL ergonomics that eliminate boilerplate, subqueries, and repetitive typing.',
  },
  {
    id: 'strings',
    title: 'Strings, Text & printf Formatting',
    shortTitle: 'Strings & printf',
    iconName: 'Type',
    description: 'String manipulation, regex extraction, and C-style printf format specifiers.',
  },
  {
    id: 'dates',
    title: 'Dates, Timestamps & strftime',
    shortTitle: 'Dates & strftime',
    iconName: 'Calendar',
    description: 'Date arithmetic, truncations, intervals, and complete strftime/strptime format codes.',
  },
  {
    id: 'window',
    title: 'Window Functions & Frames',
    shortTitle: 'Window Functions',
    iconName: 'LayoutGrid',
    description: 'Ranking, offsets, cumulative running aggregates, and precise physical/logical frames.',
  },
  {
    id: 'nested',
    title: 'Nested Types (Lists, Structs, Maps, JSON)',
    shortTitle: 'Complex Types',
    iconName: 'Layers',
    description: 'First-class array lambdas (x -> ...), struct packing, key-value maps, and JSON extraction.',
  },
  {
    id: 'aggregates',
    title: 'Aggregates & Statistical Analysis',
    shortTitle: 'Aggregates',
    iconName: 'BarChart2',
    description: 'Medians, quantiles, standard deviations, correlations, and positional arg_min/arg_max.',
  },
  {
    id: 'ingestion',
    title: 'Data Ingestion, Parquet & Export',
    shortTitle: 'I/O & Parquet',
    iconName: 'Database',
    description: 'Direct querying of Parquet, CSV, JSON, zero-copy Arrow memory, and COPY export.',
  },
];

export const STRFTIME_SPECIFIERS: FormatSpecifier[] = [
  { code: '%Y', meaning: 'Year with century as a decimal number (4 digits)', example: '2026', category: 'date' },
  { code: '%y', meaning: 'Year without century (00-99)', example: '26', category: 'date' },
  { code: '%m', meaning: 'Month as a zero-padded decimal number (01-12)', example: '05', category: 'date' },
  { code: '%B', meaning: 'Full month name in current locale', example: 'November', category: 'date' },
  { code: '%b', meaning: 'Abbreviated month name', example: 'Nov', category: 'date' },
  { code: '%h', meaning: 'Equivalent to %b (Abbreviated month name)', example: 'Nov', category: 'date' },
  { code: '%d', meaning: 'Day of the month as a zero-padded decimal (01-31)', example: '21', category: 'date' },
  { code: '%e', meaning: 'Day of the month as a space-padded decimal ( 1-31)', example: ' 4', category: 'date' },
  { code: '%H', meaning: 'Hour (24-hour clock) as a zero-padded decimal (00-23)', example: '14', category: 'time' },
  { code: '%I', meaning: 'Hour (12-hour clock) as a zero-padded decimal (01-12)', example: '02', category: 'time' },
  { code: '%p', meaning: 'Locale AM or PM designation', example: 'PM', category: 'time' },
  { code: '%M', meaning: 'Minute as a zero-padded decimal number (00-59)', example: '45', category: 'time' },
  { code: '%S', meaning: 'Second as a zero-padded decimal number (00-59)', example: '09', category: 'time' },
  { code: '%f', meaning: 'Microsecond as a decimal number (000000-999999)', example: '123456', category: 'time' },
  { code: '%w', meaning: 'Weekday as a decimal number (0-6, Sunday is 0)', example: '6', category: 'date' },
  { code: '%u', meaning: 'ISO 8601 weekday as a decimal (1-7, Monday is 1)', example: '6', category: 'date' },
  { code: '%A', meaning: 'Full weekday name', example: 'Saturday', category: 'date' },
  { code: '%a', meaning: 'Abbreviated weekday name', example: 'Sat', category: 'date' },
  { code: '%j', meaning: 'Day of the year as a zero-padded decimal (001-366)', example: '325', category: 'date' },
  { code: '%W', meaning: 'Week number of the year (Monday as first day) 00-53', example: '47', category: 'date' },
  { code: '%U', meaning: 'Week number of the year (Sunday as first day) 00-53', example: '47', category: 'date' },
  { code: '%V', meaning: 'ISO 8601 week number (01-53)', example: '47', category: 'date' },
  { code: '%z', meaning: 'UTC offset in the form +HHMM or -HHMM', example: '+0000', category: 'time' },
  { code: '%Z', meaning: 'Time zone name', example: 'UTC', category: 'time' },
  { code: '%%', meaning: 'A literal % character', example: '%', category: 'date' },
];

export const PRINTF_SPECIFIERS: FormatSpecifier[] = [
  { code: '%s', meaning: 'String format: inserts text as-is', example: "printf('User: %s', 'Alice') -> 'User: Alice'", category: 'printf' },
  { code: '%d', meaning: 'Signed decimal integer', example: "printf('Count: %d', 42) -> 'Count: 42'", category: 'printf' },
  { code: '%i', meaning: 'Signed decimal integer (synonym for %d)', example: "printf('%i items', 10) -> '10 items'", category: 'printf' },
  { code: '%04d', meaning: 'Zero-padded integer to fixed width (e.g. 4 digits)', example: "printf('%04d', 7) -> '0007'", category: 'printf' },
  { code: '%f', meaning: 'Floating-point number (default 6 decimal places)', example: "printf('%f', 3.14) -> '3.140000'", category: 'printf' },
  { code: '%.2f', meaning: 'Floating-point number rounded to 2 decimal places', example: "printf('$%.2f', 99.5) -> '$99.50'", category: 'printf' },
  { code: '%.0f', meaning: 'Floating-point number rounded to integer with no decimals', example: "printf('%.0f%%', 85.7) -> '86%'", category: 'printf' },
  { code: '%x', meaning: 'Unsigned hexadecimal integer in lowercase', example: "printf('%x', 255) -> 'ff'", category: 'printf' },
  { code: '%X', meaning: 'Unsigned hexadecimal integer in uppercase', example: "printf('%X', 255) -> 'FF'", category: 'printf' },
  { code: '%o', meaning: 'Unsigned octal integer', example: "printf('%o', 8) -> '10'", category: 'printf' },
  { code: '%e', meaning: 'Scientific notation with lowercase e', example: "printf('%e', 12300.0) -> '1.230000e+04'", category: 'printf' },
  { code: '%E', meaning: 'Scientific notation with uppercase E', example: "printf('%E', 12300.0) -> '1.230000E+04'", category: 'printf' },
  { code: '%-10s', meaning: 'Left-aligned string padded with spaces up to width 10', example: "printf('%-10s|', 'DuckDB') -> 'DuckDB    |'", category: 'printf' },
  { code: '%10s', meaning: 'Right-aligned string padded with spaces up to width 10', example: "printf('%10s|', 'DuckDB') -> '    DuckDB|'", category: 'printf' },
  { code: '%%', meaning: 'Literal % character escape', example: "printf('%d%% complete', 100) -> '100% complete'", category: 'printf' },
];

export const REGEX_SPECIFIERS: FormatSpecifier[] = [
  { code: '\\d', meaning: 'Any digit character (0-9)', example: "regexp_extract('Order-948', '\\d+') -> '948'", category: 'regex' },
  { code: '\\D', meaning: 'Any non-digit character', example: "regexp_replace('A12B', '\\D', '', 'g') -> '12'", category: 'regex' },
  { code: '\\w', meaning: 'Word character (alphanumeric or underscore)', example: "regexp_matches('DuckDB_2026', '^\\w+$') -> true", category: 'regex' },
  { code: '\\W', meaning: 'Non-word character (symbols, spaces)', example: "regexp_replace('A#B@C', '\\W', '_', 'g') -> 'A_B_C'", category: 'regex' },
  { code: '\\s', meaning: 'Any whitespace character (space, tab, newline)', example: "regexp_replace('Hi   there', '\\s+', ' ', 'g') -> 'Hi there'", category: 'regex' },
  { code: '\\S', meaning: 'Any non-whitespace character', example: "regexp_extract('Hello World', '^\\S+') -> 'Hello'", category: 'regex' },
  { code: '^', meaning: 'Asserts start of the string boundary', example: "regexp_matches('admin@site.com', '^admin') -> true", category: 'regex' },
  { code: '$', meaning: 'Asserts end of the string boundary', example: "regexp_matches('file.parquet', '\\.parquet$') -> true", category: 'regex' },
  { code: '[a-z]', meaning: 'Character set matching any lowercase letter', example: "regexp_extract('DuckDB', '[a-z]+') -> 'uck'", category: 'regex' },
  { code: '[^0-9]', meaning: 'Negated character set (anything NOT in set)', example: "regexp_replace('$99.50', '[^0-9.]', '', 'g') -> '99.50'", category: 'regex' },
  { code: '(...)', meaning: 'Capture group for targeted extraction', example: "regexp_extract('id:456', 'id:(\\d+)', 1) -> '456'", category: 'regex' },
  { code: '\\1, \\2', meaning: 'Backreferences to capture groups in regexp_replace', example: "regexp_replace('First Last', '(\\w+) (\\w+)', '\\2, \\1') -> 'Last, First'", category: 'regex' },
  { code: '(?i)', meaning: 'Case-insensitive matching mode flag', example: "regexp_matches('duckdb', '(?i)DUCKDB') -> true", category: 'regex' },
  { code: '*', meaning: 'Match zero or more times (greedy)', example: "regexp_extract('abccc', 'abc*') -> 'abccc'", category: 'regex' },
  { code: '+', meaning: 'Match one or more times', example: "regexp_extract('item_123', '\\d+') -> '123'", category: 'regex' },
  { code: '?', meaning: 'Match zero or one time (optional)', example: "regexp_extract('https://', 'https?') -> 'https'", category: 'regex' },
];

export const DUCKDB_DATA_TYPES: DuckDBDataType[] = [
  // Integers
  { name: 'TINYINT', aliases: ['INT1'], category: 'integer', description: 'Signed 1-byte integer (-128 to 127)', exampleValue: '127', storageSize: '1 byte' },
  { name: 'SMALLINT', aliases: ['INT2', 'SHORT'], category: 'integer', description: 'Signed 2-byte integer (-32,768 to 32,767)', exampleValue: '32000', storageSize: '2 bytes' },
  { name: 'INTEGER', aliases: ['INT', 'INT4'], category: 'integer', description: 'Standard signed 4-byte integer (-2.1B to 2.1B)', exampleValue: '100000', storageSize: '4 bytes' },
  { name: 'BIGINT', aliases: ['INT8', 'LONG'], category: 'integer', description: 'Signed 8-byte integer for large IDs and counters', exampleValue: '9223372036854775807', storageSize: '8 bytes' },
  { name: 'HUGEINT', aliases: ['INT16', 'INT128'], category: 'integer', description: 'DuckDB 128-bit huge integer with zero overflow risk', exampleValue: '170141183460469231731687303715884105727', storageSize: '16 bytes' },
  
  // Numerics
  { name: 'FLOAT', aliases: ['REAL', 'FLOAT4'], category: 'numeric', description: 'Single-precision 4-byte floating point (6-9 digits precision)', exampleValue: '3.14159', storageSize: '4 bytes' },
  { name: 'DOUBLE', aliases: ['FLOAT8'], category: 'numeric', description: 'Double-precision 8-byte floating point (15-17 digits precision)', exampleValue: '2.718281828459', storageSize: '8 bytes' },
  { name: 'DECIMAL(p, s)', aliases: ['NUMERIC'], category: 'numeric', description: 'Exact fixed-point decimal up to 38 digits precision (e.g. currency)', exampleValue: '1299.99', storageSize: 'Variable' },

  // Text & Binary
  { name: 'VARCHAR', aliases: ['TEXT', 'STRING'], category: 'string', description: 'Variable-length UTF-8 encoded text with inline string optimization', exampleValue: "'DuckDB in-browser'", storageSize: 'Dynamic' },
  { name: 'BLOB', aliases: ['BYTEA', 'BINARY'], category: 'string', description: 'Raw binary byte array (e.g. images, serialized data)', exampleValue: "'\\xAA\\xBB'::BLOB", storageSize: 'Dynamic' },
  { name: 'UUID', aliases: ['GUID'], category: 'string', description: 'Universally unique 128-bit identifier', exampleValue: "'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID", storageSize: '16 bytes' },

  // Temporal
  { name: 'DATE', aliases: [], category: 'temporal', description: 'Calendar date without time (YYYY-MM-DD)', exampleValue: "'2026-11-21'::DATE", storageSize: '4 bytes' },
  { name: 'TIME', aliases: [], category: 'temporal', description: 'Time of day without date (HH:MM:SS.microseconds)', exampleValue: "'14:30:00'::TIME", storageSize: '8 bytes' },
  { name: 'TIMESTAMP', aliases: ['DATETIME'], category: 'temporal', description: 'Date and time without timezone', exampleValue: "'2026-11-21 14:30:00'::TIMESTAMP", storageSize: '8 bytes' },
  { name: 'TIMESTAMPTZ', aliases: ['TIMESTAMP WITH TIME ZONE'], category: 'temporal', description: 'Date and time with instant UTC offset', exampleValue: "'2026-11-21 14:30:00+00'::TIMESTAMPTZ", storageSize: '8 bytes' },
  { name: 'INTERVAL', aliases: [], category: 'temporal', description: 'Relative time span (e.g. INTERVAL 3 DAY 2 HOUR)', exampleValue: "INTERVAL '7' DAY", storageSize: '16 bytes' },

  // Complex / Nested
  { name: 'T[] (LIST)', aliases: ['ARRAY'], category: 'nested', description: 'Ordered variable-length list of uniform elements', exampleValue: "[1, 2, 3, 4]", storageSize: 'Dynamic' },
  { name: 'STRUCT(...)', aliases: ['ROW'], category: 'nested', description: 'Key-value record with fixed named fields and types', exampleValue: "{'id': 1, 'name': 'Laptop'}", storageSize: 'Dynamic' },
  { name: 'MAP(K, V)', aliases: [], category: 'nested', description: 'Key-value hash map supporting fast dynamic keys', exampleValue: "map(['a', 'b'], [1, 2])", storageSize: 'Dynamic' },
  { name: 'JSON', aliases: [], category: 'nested', description: 'Native JSON text representation supporting -> and ->> operators', exampleValue: "'{\"status\": \"ok\"}'::JSON", storageSize: 'Dynamic' },

  // Special
  { name: 'BOOLEAN', aliases: ['BOOL'], category: 'special', description: 'Logical true, false, or NULL', exampleValue: 'true', storageSize: '1 byte' },
  { name: 'ENUM(...)', aliases: [], category: 'special', description: 'Dictionary-encoded discrete string labels stored as 1-byte integers', exampleValue: "'high' (from CREATE TYPE priority AS ENUM)", storageSize: '1 byte' },
];

export const DUCKDB_CLI_COMMANDS: DuckDBCliCommand[] = [
  { command: '.mode duckbox', category: 'dot-command', description: 'Render query output in DuckDB signature Unicode box style', example: '.mode duckbox' },
  { command: '.mode markdown', category: 'dot-command', description: 'Render query results directly as GitHub-flavored Markdown tables', example: '.mode markdown' },
  { command: '.mode csv', category: 'dot-command', description: 'Format output as standard comma-separated values', example: '.mode csv' },
  { command: '.mode json', category: 'dot-command', description: 'Format output rows as serialized JSON objects', example: '.mode json' },
  { command: '.timer on', category: 'dot-command', description: 'Print real, user, and CPU execution time after every query', example: '.timer on' },
  { command: '.excel', category: 'dot-command', description: 'Instantly export query results and open directly in Microsoft Excel or Calc', example: '.excel' },
  { command: '.output filename', category: 'dot-command', description: 'Redirect all query outputs to a file on disk (.output stdout to reset)', example: '.output out.csv' },
  { command: '.schema [table]', category: 'dot-command', description: 'Display DDL CREATE TABLE statements for tables or views', example: '.schema orders' },
  { command: '.tables', category: 'dot-command', description: 'List all tables and views across active databases', example: '.tables' },
  { command: '.read script.sql', category: 'dot-command', description: 'Execute external SQL statements from a file', example: '.read setup.sql' },
  { command: '.nullvalue string', category: 'dot-command', description: 'Set custom display text for SQL NULL values in terminal outputs', example: ".nullvalue 'NULL'" },
  { command: 'SET threads = 4;', category: 'setting', description: 'Configure maximum worker threads for parallel query execution', example: 'SET threads = 4;' },
  { command: "SET memory_limit = '4GB';", category: 'setting', description: 'Set memory consumption cap before out-of-core streaming spills to disk', example: "SET memory_limit = '4GB';" },
  { command: 'SET preserve_insertion_order = false;', category: 'setting', description: 'Disable insertion ordering to boost hash aggregate and join performance', example: 'SET preserve_insertion_order = false;' },
  { command: 'PRAGMA version;', category: 'pragma', description: 'Display the running DuckDB engine version, git hash, and build platform', example: 'PRAGMA version;' },
  { command: "PRAGMA table_info('table_name');", category: 'pragma', description: 'Inspect column names, data types, nullability, and primary key status', example: "PRAGMA table_info('orders');" },
  { command: 'PRAGMA database_list;', category: 'pragma', description: 'List all currently attached database catalogs and storage paths', example: 'PRAGMA database_list;' },
];

export const DUCKDB_EXTENSIONS: DuckDBExtension[] = [
  { name: 'httpfs', category: 'cloud', installCommand: 'INSTALL httpfs; LOAD httpfs;', description: 'Direct querying of HTTPS, S3, Azure Blob, GCS, and Cloudflare R2 object stores', exampleSql: "SELECT * FROM 's3://my-bucket/lake.parquet';" },
  { name: 'spatial', category: 'spatial', installCommand: 'INSTALL spatial; LOAD spatial;', description: 'Full geospatial analytics engine supporting GeoJSON, Shapefiles, ST_Point, and ST_Distance', exampleSql: "SELECT ST_Distance(ST_Point(0, 0), ST_Point(3, 4));" },
  { name: 'sqlite', category: 'database', installCommand: 'INSTALL sqlite; LOAD sqlite;', description: 'Zero-copy direct attach and query of SQLite database files', exampleSql: "ATTACH 'production.db' AS sqlite_db (TYPE SQLITE);" },
  { name: 'postgres', category: 'database', installCommand: 'INSTALL postgres; LOAD postgres;', description: 'Seamless attach and live remote query pushdown to PostgreSQL databases', exampleSql: "ATTACH 'dbname=core user=postgres' AS pg (TYPE POSTGRES);" },
  { name: 'mysql', category: 'database', installCommand: 'INSTALL mysql; LOAD mysql;', description: 'Attach and direct query pushdown to MySQL databases', exampleSql: "ATTACH 'host=127.0.0.1 user=root' AS mysql_db (TYPE MYSQL);" },
  { name: 'excel', category: 'cloud', installCommand: 'INSTALL excel; LOAD excel;', description: 'Direct reading and writing of Excel spreadsheet (.xlsx) workbooks', exampleSql: "SELECT * FROM read_xlsx('quarterly_report.xlsx');" },
  { name: 'iceberg', category: 'lakehouse', installCommand: 'INSTALL iceberg; LOAD iceberg;', description: 'Query Apache Iceberg REST catalogs, metadata snapshots, and tables', exampleSql: "SELECT * FROM iceberg_scan('s3://lake/table_dir');" },
  { name: 'delta', category: 'lakehouse', installCommand: 'INSTALL delta; LOAD delta;', description: 'Native read access to Delta Lake ACID transaction log tables', exampleSql: "SELECT * FROM delta_scan('s3://lake/delta_table');" },
  { name: 'vss', category: 'ai', installCommand: 'INSTALL vss; LOAD vss;', description: 'Vector Similarity Search with HNSW indexing for AI embeddings and semantic search', exampleSql: "CREATE INDEX idx ON items USING HNSW (embedding);" },
  { name: 'json', category: 'cloud', installCommand: 'INSTALL json; LOAD json;', description: 'High-performance native JSON parsing, validation, and JSON Pointer extractions', exampleSql: "SELECT json_extract('{\"a\": [10, 20]}', '$.a[0]');" },
];

export const DUCKDB_CHEAT_SHEET_ITEMS: CheatSheetItem[] = [
  // ==========================================
  // 1. SUPERPOWERS & CLAUSES
  // ==========================================
  {
    id: 'superpower-bar-chart',
    name: 'bar() - ASCII Terminal Visualizations',
    category: 'superpowers',
    signature: 'bar(x, min, max [, width]) -> VARCHAR',
    summary: 'Renders an in-terminal ASCII/Unicode horizontal bar chart directly inside SQL results. Perfect for CLI dashboards and quick visual distribution checks.',
    parityBadge: 'DuckDB Exclusive',
    parameters: [
      { name: 'x', type: 'numeric', description: 'The numeric value to visualize.' },
      { name: 'min', type: 'numeric', description: 'Lower bound value of the visualization axis (0% width).' },
      { name: 'max', type: 'numeric', description: 'Upper bound value of the axis (100% width).' },
      { name: 'width', type: 'integer', description: 'Character width of the bar (defaults to 80).', optional: true },
    ],
    exampleSql: "SELECT name, score, bar(score, 0, 100, 15) AS visual_bar\nFROM (VALUES ('Alice', 95), ('Bob', 72), ('Charlie', 84), ('Diana', 61)) t(name, score);",
    notes: 'Uses Unicode fractional block characters (▏, ▎, ▍, ▌, ▋, ▊, ▉, █) for sub-character precision.',
    tags: ['duckdb superpower', 'bar', 'visualization', 'terminal', 'ascii', 'charts', 'cli'],
  },
  {
    id: 'superpower-list-comprehension',
    name: 'Pythonic List Comprehension',
    category: 'nested',
    signature: '[expression FOR var IN list [IF condition]]',
    summary: 'Write Python-style list comprehension syntax natively in SQL to transform and filter collection lists in a single readable line.',
    parityBadge: 'DuckDB Exclusive',
    parameters: [
      { name: 'expression', type: 'expression', description: 'Transformation expression computed for each element.' },
      { name: 'var', type: 'identifier', description: 'Variable bound to each list element in iteration.' },
      { name: 'list', type: 'LIST', description: 'Source list or array to iterate through.' },
      { name: 'condition', type: 'boolean', description: 'Optional filter predicate; only elements matching condition are kept.', optional: true },
    ],
    exampleSql: "SELECT [x * 2 FOR x IN [1, 2, 3, 4, 5, 6] IF x % 2 = 0] AS doubled_evens;",
    notes: 'Compiles down to list_transform and list_filter under the hood, but is much more ergonomic for Python/Arrow developers.',
    tags: ['duckdb superpower', 'list comprehension', 'python', 'arrow', 'lists', 'nested'],
  },
  {
    id: 'superpower-columns-regex',
    name: "COLUMNS('regex') Regex Column Selection",
    category: 'superpowers',
    signature: "SELECT func(COLUMNS('regex_pattern')) FROM table",
    summary: 'Dynamically match and project all columns whose names match a regular expression pattern. Eliminates typing dozens of column names.',
    parityBadge: 'DuckDB Exclusive',
    parameters: [
      { name: 'regex_pattern', type: 'VARCHAR', description: 'Regular expression matching column names.' },
    ],
    exampleSql: "SELECT COLUMNS('^rev_')\nFROM (VALUES (100, 250, 'Store A')) t(rev_q1, rev_q2, store_name);",
    notes: "Combine with aggregations like min(COLUMNS('^metric_')) or max(COLUMNS('.*')) to aggregate whole column families simultaneously.",
    tags: ['duckdb superpower', 'columns', 'regex', 'pattern matching', 'dynamic projection'],
  },
  {
    id: 'superpower-lateral-join',
    name: 'LATERAL Subquery Joins',
    category: 'superpowers',
    signature: 'FROM table1, LATERAL (SELECT ... FROM table2 WHERE ...)',
    summary: 'Allows subqueries in FROM/JOIN to reference columns provided by previous preceding tables in the FROM clause, functioning like a SQL foreach loop.',
    parityBadge: 'Postgres & DuckDB Standard',
    parameters: [
      { name: 'LATERAL', type: 'keyword', description: 'Enables subquery to access outer table column references.' },
    ],
    exampleSql: "SELECT u.name, item.tag\nFROM (VALUES (1, 'Alice'), (2, 'Bob')) u(id, name),\nLATERAL (SELECT u.name || ' # ' || n AS tag FROM range(1, 3) r(n)) item;",
    notes: 'Extremely efficient in DuckDB because the planner vectorizes lateral projections without row-by-row iteration overhead.',
    tags: ['duckdb superpower', 'lateral', 'join', 'subquery', 'correlated'],
  },
  {
    id: 'superpower-merge-into',
    name: 'MERGE INTO (v1.0+ UPSERT)',
    category: 'ingestion',
    signature: 'MERGE INTO target USING source ON condition WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ...',
    summary: 'Performs atomic UPSERT (update, insert, delete) operations between a target table and an incoming source dataset in a single SQL statement.',
    parityBadge: 'DuckDB v1.0+ Standard',
    parameters: [
      { name: 'WHEN MATCHED', type: 'clause', description: 'Specifies action (UPDATE or DELETE) when keys match.' },
      { name: 'WHEN NOT MATCHED', type: 'clause', description: 'Specifies INSERT action when source keys are absent from target.' },
    ],
    exampleSql: "CREATE OR REPLACE TABLE target_users (id INT, status VARCHAR);\nINSERT INTO target_users VALUES (1, 'active'), (2, 'inactive');\nCREATE OR REPLACE TABLE incoming_sync (id INT, status VARCHAR);\nINSERT INTO incoming_sync VALUES (2, 'active'), (3, 'pending');\nMERGE INTO target_users t USING incoming_sync s ON t.id = s.id\nWHEN MATCHED THEN UPDATE SET status = s.status\nWHEN NOT MATCHED THEN INSERT (id, status) VALUES (s.id, s.status);\nSELECT * FROM target_users ORDER BY id;",
    notes: 'Full ACID-compliant merge introduced in DuckDB 1.0, eliminating the need for multi-step staging tables.',
    tags: ['ingestion', 'merge into', 'upsert', 'duckdb v1.0', 'mutations'],
  },
  {
    id: 'clause-group-by-all',
    name: 'GROUP BY ALL',
    category: 'superpowers',
    signature: 'SELECT col1, col2, AGG(...) FROM table GROUP BY ALL',
    summary: 'Automatically detects all non-aggregated columns in SELECT and groups by them. Zero repetitive column typing.',
    parityBadge: 'DuckDB & Snowflake Standard',
    parameters: [
      { name: 'ALL', type: 'keyword', description: 'Infers the full list of grouping columns from non-aggregate SELECT expressions.' },
    ],
    exampleSql: `SELECT 
  category, 
  status, 
  COUNT(*) AS total_items, 
  ROUND(AVG(price), 2) AS avg_price
FROM products
GROUP BY ALL
ORDER BY total_items DESC;`,
    exampleOutput: 'Columns: [category, status, total_items, avg_price]',
    notes: 'Supported in modern cloud warehouses (DuckDB, Snowflake). Eliminates tedious GROUP BY col1, col2, col3 clauses.',
    tags: ['group by', 'all', 'aggregate', 'ergonomics', 'snowflake'],
  },
  {
    id: 'clause-order-by-all',
    name: 'ORDER BY ALL',
    category: 'superpowers',
    signature: 'SELECT col1, col2 FROM table ORDER BY ALL [ASC | DESC]',
    summary: 'Orders rows by all selected columns from left to right without needing to specify 1, 2, 3 or column names.',
    parityBadge: 'DuckDB Standard',
    exampleSql: `SELECT category, name, price
FROM products
ORDER BY ALL ASC;`,
    tags: ['order by', 'all', 'sorting', 'ergonomics'],
  },
  {
    id: 'clause-qualify',
    name: 'QUALIFY',
    category: 'superpowers',
    signature: 'SELECT ... FROM table QUALIFY <window_condition>',
    summary: 'Filters results directly by window function expressions without requiring nested subqueries or CTE wrappers.',
    parityBadge: 'Snowflake & BigQuery 1:1',
    parameters: [
      { name: 'window_condition', type: 'boolean expression', description: 'A boolean condition evaluating window functions like ROW_NUMBER() or RANK().' },
    ],
    exampleSql: `SELECT 
  category, 
  name, 
  price, 
  DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) AS rank
FROM products
QUALIFY rank <= 2;`,
    notes: 'Native 1:1 match with Snowflake, Databricks, and BigQuery. Replaces multi-line subquery boilerplate.',
    tags: ['qualify', 'window', 'filter', 'top-n', 'snowflake', 'bigquery'],
  },
  {
    id: 'clause-select-exclude',
    name: 'SELECT * EXCLUDE (...)',
    category: 'superpowers',
    signature: 'SELECT * EXCLUDE (col1, col2) FROM table',
    summary: 'Returns all columns from a table except the ones explicitly listed. Ideal for wide tables with 50+ columns.',
    parityBadge: 'Snowflake & BigQuery 1:1',
    parameters: [
      { name: 'columns', type: 'column list', description: 'Comma-separated column names to remove from the asterisk projection.' },
    ],
    exampleSql: `SELECT * EXCLUDE (created_at, updated_at, internal_id)
FROM customers
LIMIT 5;`,
    tags: ['exclude', 'select', 'star', 'projection', 'wide tables'],
  },
  {
    id: 'clause-select-replace',
    name: 'SELECT * REPLACE (...)',
    category: 'superpowers',
    signature: 'SELECT * REPLACE (expr AS col) FROM table',
    summary: 'Returns all columns from a table while transforming or replacing specific columns in-place.',
    parityBadge: 'Snowflake & BigQuery 1:1',
    parameters: [
      { name: 'replacement', type: 'expr AS col', description: 'Replaces the column value with the evaluated expression while preserving position.' },
    ],
    exampleSql: `SELECT * REPLACE (
  ROUND(price * 1.10, 2) AS price,
  UPPER(name) AS name
)
FROM products
LIMIT 5;`,
    tags: ['replace', 'select', 'star', 'transform', 'bigquery'],
  },
  {
    id: 'clause-from-first',
    name: 'FROM-First Query Syntax',
    category: 'superpowers',
    signature: 'FROM table SELECT col1, col2 WHERE ...',
    summary: 'Allows starting queries with the FROM clause. Natural autocomplete because the table schema is known upfront.',
    parityBadge: 'DuckDB Exclusive',
    exampleSql: `FROM products
SELECT category, name, price
WHERE price > 100
ORDER BY price DESC;`,
    tags: ['from-first', 'leading from', 'syntax', 'autocomplete'],
  },
  {
    id: 'clause-columns-lambda',
    name: 'COLUMNS() Dynamic Projection',
    category: 'superpowers',
    signature: 'SELECT COLUMNS(\'pattern\') | MIN(COLUMNS(*)) FROM table',
    summary: 'Applies functions or selections across multiple columns dynamically matching a regex or list of names.',
    parityBadge: 'DuckDB Exclusive',
    parameters: [
      { name: 'pattern', type: 'regex | star expression', description: 'Regex pattern matching column names or expression like COLUMNS(* EXCLUDE id).' },
    ],
    exampleSql: `SELECT 
  ROUND(AVG(COLUMNS(* EXCLUDE (id, name, category))), 2)
FROM products;`,
    tags: ['columns', 'dynamic', 'meta-query', 'regex'],
  },
  {
    id: 'clause-pivot',
    name: 'PIVOT',
    category: 'superpowers',
    signature: 'PIVOT table ON pivot_col USING agg_func(value_col)',
    summary: 'Transforms row values into columns without tedious manual CASE WHEN aggregations.',
    parityBadge: 'DuckDB Standard',
    parameters: [
      { name: 'ON', type: 'column', description: 'The column whose unique values become the new output column headers.' },
      { name: 'USING', type: 'aggregate', description: 'The aggregate function computing values for each cell (e.g. SUM(sales)).' },
    ],
    exampleSql: `PIVOT (
  SELECT category, city, price 
  FROM products p 
  JOIN customers c ON p.id = c.id
)
ON category 
USING SUM(price);`,
    tags: ['pivot', 'crosstab', 'reshape', 'matrix'],
  },
  {
    id: 'clause-unpivot',
    name: 'UNPIVOT',
    category: 'superpowers',
    signature: 'UNPIVOT table ON col1, col2 INTO NAME name_col VALUE val_col',
    summary: 'Rotates wide columns into key-value rows (reverse of PIVOT).',
    parityBadge: 'DuckDB Standard',
    exampleSql: `UNPIVOT monthly_revenue
ON jan, feb, mar, apr
INTO
  NAME month
  VALUE revenue;`,
    tags: ['unpivot', 'melt', 'normalize', 'reshape'],
  },
  {
    id: 'clause-asof-join',
    name: 'ASOF JOIN',
    category: 'superpowers',
    signature: 'SELECT ... FROM t1 ASOF JOIN t2 ON t1.id = t2.id AND t1.time >= t2.time',
    summary: 'Performs point-in-time temporal joins matching each record with the closest preceding timestamp.',
    parityBadge: 'Snowflake & Timescale Parity',
    parameters: [
      { name: 'equality', type: 't1.id = t2.id', description: 'Exact match column(s) (e.g. ticker symbol, user ID).' },
      { name: 'inequality', type: 't1.timestamp >= t2.timestamp', description: 'Temporal ordering column matching the nearest prior state.' },
    ],
    exampleSql: `SELECT trade.symbol, trade.trade_time, quote.ask
FROM trades trade
ASOF JOIN quotes quote
  ON trade.symbol = quote.symbol
 AND trade.trade_time >= quote.quote_time;`,
    tags: ['asof join', 'temporal', 'finance', 'nearest timestamp'],
  },
  {
    id: 'clause-sample',
    name: 'USING SAMPLE',
    category: 'superpowers',
    signature: 'SELECT * FROM table USING SAMPLE 10% | 500 ROWS (BERNOULLI | RESERVOIR)',
    summary: 'Fast, statistically sound sampling across datasets without reading the full file or table.',
    parityBadge: 'DuckDB Standard',
    parameters: [
      { name: 'size', type: 'percentage | integer rows', description: 'e.g. 10% or 1000 ROWS.' },
      { name: 'method', type: 'BERNOULLI | RESERVOIR', optional: true, description: 'Sampling algorithm (default Reservoir for fixed rows, Bernoulli for percent).' },
    ],
    exampleSql: `SELECT * FROM products
USING SAMPLE 20% (bernoulli);`,
    tags: ['sample', 'bernoulli', 'reservoir', 'exploration'],
  },

  // ==========================================
  // 2. STRINGS & PRINTF
  // ==========================================
  {
    id: 'func-printf',
    name: 'printf()',
    category: 'strings',
    signature: 'printf(format_string, arg1, arg2, ...)',
    summary: 'Interpolates and formats arguments into a string using classic C-style format specifiers.',
    parityBadge: 'C-Standard / SQLite / DuckDB',
    parameters: [
      { name: 'format_string', type: 'VARCHAR', description: 'Format template containing format specifiers like %s, %d, %.2f, %04d.' },
      { name: 'args...', type: 'ANY', description: 'Values corresponding to each specifier in the format template.' },
    ],
    formatSpecifiers: ['%s', '%d', '%i', '%04d', '%f', '%.2f', '%.0f', '%x', '%X', '%o', '%e', '%-10s', '%10s', '%%'],
    exampleSql: `SELECT 
  name, 
  printf('SKU-%04d: %s ($%.2f)', id, name, price) AS label
FROM products
LIMIT 5;`,
    exampleOutput: 'SKU-0001: Laptop Pro ($1299.99)',
    notes: 'Supports precision controls (%.2f), zero-padding (%04d), and literal escapes (%%).',
    tags: ['printf', 'format', 'specifiers', '%s', '%d', '%.2f'],
  },
  {
    id: 'func-format',
    name: 'format()',
    category: 'strings',
    signature: 'format(format_string, arg1, ...)',
    summary: 'Synonym for printf(), formats expressions using format specifiers.',
    parityBadge: 'DuckDB Standard',
    exampleSql: `SELECT format('Customer #%d from %s', id, city) AS summary
FROM customers
LIMIT 3;`,
    tags: ['format', 'printf', 'template'],
  },
  {
    id: 'func-concat-ws',
    name: 'concat_ws()',
    category: 'strings',
    signature: 'concat_ws(separator, str1, str2, ...)',
    summary: 'Concatenates multiple strings together using a specified delimiter, safely ignoring NULL values.',
    parityBadge: 'Postgres & Snowflake 1:1',
    parameters: [
      { name: 'separator', type: 'VARCHAR', description: 'The delimiter placed between each non-NULL string.' },
      { name: 'strings...', type: 'VARCHAR...', description: 'Strings to concatenate together.' },
    ],
    exampleSql: `SELECT concat_ws(', ', name, category, printf('$%.2f', price)) AS card
FROM products
LIMIT 4;`,
    tags: ['concat_ws', 'concat', 'join strings', 'delimiter'],
  },
  {
    id: 'func-regexp-extract',
    name: 'regexp_extract()',
    category: 'strings',
    signature: 'regexp_extract(string, pattern [, group_idx])',
    summary: 'Extracts substrings matching a regular expression pattern or capture group.',
    parityBadge: 'BigQuery & Presto 1:1',
    parameters: [
      { name: 'string', type: 'VARCHAR', description: 'Source text to inspect.' },
      { name: 'pattern', type: 'VARCHAR', description: 'Perl/PCRE-compatible regular expression with capture groups (e.g. \'@([a-zA-Z0-9.-]+)\').' },
      { name: 'group_idx', type: 'INTEGER', optional: true, description: 'Index of the capture group to return (default 0 for entire match, 1 for first capture group).' },
    ],
    exampleSql: `SELECT 
  email, 
  regexp_extract(email, '@([a-zA-Z0-9.-]+)', 1) AS domain
FROM customers
LIMIT 5;`,
    tags: ['regex', 'regexp_extract', 'pattern', 'capture group'],
  },
  {
    id: 'func-regexp-replace',
    name: 'regexp_replace()',
    category: 'strings',
    signature: 'regexp_replace(string, pattern, replacement [, flags])',
    summary: 'Replaces occurrences of a regex pattern with a replacement string.',
    parityBadge: 'Postgres & BigQuery 1:1',
    parameters: [
      { name: 'string', type: 'VARCHAR', description: 'Source text.' },
      { name: 'pattern', type: 'VARCHAR', description: 'Regex pattern.' },
      { name: 'replacement', type: 'VARCHAR', description: 'Replacement string (can include \\1, \\2 backreferences).' },
      { name: 'flags', type: 'VARCHAR', optional: true, description: 'Modifiers: \'g\' for global (all occurrences), \'i\' for case-insensitive.' },
    ],
    exampleSql: `SELECT regexp_replace('Order #12345 confirmed', '\\d+', '*****', 'g') AS masked;`,
    tags: ['regex', 'regexp_replace', 'masking', 'sanitize'],
  },
  {
    id: 'func-string-split',
    name: 'string_split() / str_split()',
    category: 'strings',
    signature: 'string_split(string, delimiter)',
    summary: 'Splits a string by a delimiter and returns a native DuckDB LIST (array).',
    parityBadge: 'DuckDB Standard',
    parameters: [
      { name: 'string', type: 'VARCHAR', description: 'String to split.' },
      { name: 'delimiter', type: 'VARCHAR', description: 'Sub-string delimiter.' },
    ],
    exampleSql: `SELECT string_split('apple,banana,orange,grape', ',') AS fruits;`,
    tags: ['string_split', 'str_split', 'tokenize', 'list'],
  },
  {
    id: 'func-trim-casing',
    name: 'trim(), upper(), lower(), initcap()',
    category: 'strings',
    signature: 'upper(s) | lower(s) | initcap(s) | trim(s [, chars])',
    summary: 'Essential string casing and whitespace trimming functions.',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT 
  initcap(lower(name)) AS formatted_name, 
  trim(category) AS clean_cat
FROM products
LIMIT 5;`,
    tags: ['trim', 'upper', 'lower', 'initcap', 'cleanup'],
  },

  // ==========================================
  // 3. DATES, TIMESTAMPS & STRFTIME
  // ==========================================
  {
    id: 'func-strftime',
    name: 'strftime()',
    category: 'dates',
    signature: 'strftime(date_or_timestamp, format_string)',
    summary: 'Formats dates and timestamps into custom string representations using standard format specifiers (%Y, %m, %d, %H, %M, %S).',
    parityBadge: 'Python & SQLite & C-Standard',
    parameters: [
      { name: 'date_or_timestamp', type: 'DATE | TIMESTAMP', description: 'The temporal value to format.' },
      { name: 'format_string', type: 'VARCHAR', description: 'Specifier template such as \'%Y-%m-%d\' or \'%B %d, %Y (%A)\'.' },
    ],
    formatSpecifiers: ['%Y', '%y', '%m', '%B', '%b', '%d', '%e', '%H', '%I', '%p', '%M', '%S', '%f', '%w', '%u', '%A', '%a', '%j', '%W', '%U', '%V', '%z', '%Z', '%%'],
    exampleSql: `SELECT 
  signup_date, 
  strftime(signup_date, '%Y-%m-%d') AS iso_date,
  strftime(signup_date, '%B %d, %Y (%A)') AS verbal_date
FROM customers
LIMIT 5;`,
    exampleOutput: 'verbal_date: January 15, 2024 (Monday)',
    tags: ['strftime', 'date format', '%Y', '%m', '%d', '%H', '%M', '%S', 'calendar'],
  },
  {
    id: 'func-strptime',
    name: 'strptime()',
    category: 'dates',
    signature: 'strptime(date_string, format_string)',
    summary: 'Parses a date/time string into a TIMESTAMP according to explicit format specifiers.',
    parityBadge: 'Python & C-Standard',
    parameters: [
      { name: 'date_string', type: 'VARCHAR', description: 'Raw textual date representation.' },
      { name: 'format_string', type: 'VARCHAR', description: 'Matching format specifier template (e.g. \'%d/%m/%Y %H:%M\').' },
    ],
    formatSpecifiers: ['%Y', '%m', '%d', '%H', '%M', '%S'],
    exampleSql: `SELECT strptime('21/11/2026 14:30:00', '%d/%m/%Y %H:%M:%S') AS parsed_ts;`,
    tags: ['strptime', 'parse date', 'string to date', 'timestamps'],
  },
  {
    id: 'func-date-trunc',
    name: 'date_trunc()',
    category: 'dates',
    signature: 'date_trunc(\'part\', timestamp)',
    summary: 'Truncates a timestamp to the specified precision boundary (e.g. month, year, day, quarter, hour).',
    parityBadge: 'Postgres & Snowflake 1:1',
    parameters: [
      { name: 'part', type: 'VARCHAR', description: '\'year\', \'quarter\', \'month\', \'week\', \'day\', \'hour\', \'minute\', \'second\'.' },
      { name: 'timestamp', type: 'TIMESTAMP', description: 'Date or timestamp to truncate.' },
    ],
    exampleSql: `SELECT 
  date_trunc('month', signup_date) AS cohort_month, 
  COUNT(*) AS total_signups
FROM customers
GROUP BY ALL
ORDER BY cohort_month ASC;`,
    tags: ['date_trunc', 'cohort', 'aggregation', 'month', 'quarter'],
  },
  {
    id: 'func-date-diff',
    name: 'date_diff()',
    category: 'dates',
    signature: 'date_diff(\'part\', start_date, end_date)',
    summary: 'Calculates the integer count of specified boundary periods between two dates/timestamps.',
    parityBadge: 'BigQuery & Snowflake 1:1',
    parameters: [
      { name: 'part', type: 'VARCHAR', description: '\'day\', \'month\', \'year\', \'week\', \'hour\', \'minute\'.' },
      { name: 'start_date', type: 'DATE | TIMESTAMP', description: 'Start boundary.' },
      { name: 'end_date', type: 'DATE | TIMESTAMP', description: 'End boundary.' },
    ],
    exampleSql: `SELECT 
  name, 
  signup_date, 
  date_diff('day', signup_date, current_date) AS days_as_customer
FROM customers
LIMIT 5;`,
    tags: ['date_diff', 'duration', 'retention', 'tenure'],
  },
  {
    id: 'func-date-add-sub',
    name: 'date_add() / date_sub() & INTERVAL',
    category: 'dates',
    signature: 'date + INTERVAL \'n\' PART | date_add(date, INTERVAL n PART)',
    summary: 'Adds or subtracts temporal interval durations to dates and timestamps.',
    parityBadge: 'ANSI SQL Standard',
    parameters: [
      { name: 'date', type: 'DATE | TIMESTAMP', description: 'Initial timestamp.' },
      { name: 'interval', type: 'INTERVAL', description: 'INTERVAL \'7\' DAY, INTERVAL \'1\' MONTH, INTERVAL \'3\' HOUR.' },
    ],
    exampleSql: `SELECT 
  current_date AS today,
  current_date + INTERVAL '14' DAY AS two_weeks_later,
  current_date - INTERVAL '1' MONTH AS last_month;`,
    tags: ['interval', 'date_add', 'date_sub', 'arithmetic'],
  },

  // ==========================================
  // 4. WINDOW FUNCTIONS & FRAMES
  // ==========================================
  {
    id: 'func-dense-rank-row-number',
    name: 'ROW_NUMBER() / RANK() / DENSE_RANK()',
    category: 'window',
    signature: 'ROW_NUMBER() | RANK() | DENSE_RANK() OVER (PARTITION BY ... ORDER BY ...)',
    summary: 'Ranking functions to compute positional ordering within partitions. DENSE_RANK assigns consecutive ranks without gaps on ties.',
    parityBadge: 'ANSI SQL Standard',
    parameters: [
      { name: 'PARTITION BY', type: 'column(s)', optional: true, description: 'Groups rows into partition windows.' },
      { name: 'ORDER BY', type: 'column(s) [ASC|DESC]', description: 'Specifies the ranking order within each partition.' },
    ],
    exampleSql: `SELECT 
  category, 
  name, 
  price,
  DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) AS rank
FROM products;`,
    tags: ['dense_rank', 'row_number', 'rank', 'window', 'leaderboard'],
  },
  {
    id: 'func-lag-lead',
    name: 'LAG() & LEAD()',
    category: 'window',
    signature: 'LAG(column [, offset, default]) OVER (PARTITION BY ... ORDER BY ...)',
    summary: 'Accesses data from preceding (LAG) or following (LEAD) rows without joining a table back to itself.',
    parityBadge: 'ANSI SQL Standard',
    parameters: [
      { name: 'column', type: 'ANY', description: 'The column expression to retrieve from offset row.' },
      { name: 'offset', type: 'INTEGER', optional: true, description: 'Row offset distance (default 1).' },
      { name: 'default', type: 'ANY', optional: true, description: 'Fallback value if offset row is out of partition bounds (default NULL).' },
    ],
    exampleSql: `SELECT 
  id, 
  price,
  LAG(price, 1) OVER (ORDER BY id) AS prev_price,
  ROUND(price - LAG(price, 1) OVER (ORDER BY id), 2) AS price_diff
FROM products
LIMIT 6;`,
    tags: ['lag', 'lead', 'offset', 'growth', 'mom'],
  },
  {
    id: 'func-window-frame',
    name: 'Window Frame Clauses (ROWS / RANGE)',
    category: 'window',
    signature: 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
    summary: 'Defines the sliding or cumulative window frame subset for running sums, moving averages, and rolling metrics.',
    parityBadge: 'ANSI SQL Standard',
    parameters: [
      { name: 'frame_start', type: 'specifier', description: 'UNBOUNDED PRECEDING, n PRECEDING, CURRENT ROW.' },
      { name: 'frame_end', type: 'specifier', description: 'CURRENT ROW, n FOLLOWING, UNBOUNDED FOLLOWING.' },
    ],
    exampleSql: `SELECT 
  id, 
  price,
  SUM(price) OVER (ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
  ROUND(AVG(price) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3
FROM products
LIMIT 6;`,
    tags: ['frame', 'running total', 'moving average', 'rows between'],
  },

  // ==========================================
  // 5. NESTED & COMPLEX TYPES
  // ==========================================
  {
    id: 'func-list-lambdas',
    name: 'List Lambdas (list_transform & list_filter)',
    category: 'nested',
    signature: 'list_transform(list, x -> expr) | list_filter(list, x -> condition)',
    summary: 'Applies Python/JavaScript-style lambda arrow functions (x -> ...) across elements of a list in vectorized C++.',
    parityBadge: 'DuckDB & Presto Native',
    parameters: [
      { name: 'list', type: 'LIST(T)', description: 'Input list or array.' },
      { name: 'lambda', type: 'x -> expression', description: 'Anonymous function taking item x and returning transformed value or boolean.' },
    ],
    exampleSql: `SELECT 
  list_transform([10, 20, 30], x -> x * 1.15) AS prices_with_tax,
  list_filter(['apple', 'banana', 'avocado'], x -> x LIKE 'a%') AS a_fruits;`,
    tags: ['list', 'lambda', 'arrow function', 'list_filter', 'list_transform'],
  },
  {
    id: 'func-unnest',
    name: 'UNNEST()',
    category: 'nested',
    signature: 'UNNEST(list_column)',
    summary: 'Flattens arrays/lists into individual rows, transforming nested structures into tabular format.',
    parityBadge: 'BigQuery & Postgres 1:1',
    exampleSql: `SELECT 
  id, 
  name, 
  UNNEST(string_split('red,blue,green', ',')) AS color
FROM products
LIMIT 6;`,
    tags: ['unnest', 'flatten', 'expand', 'array to rows'],
  },
  {
    id: 'func-structs',
    name: 'Structs & Struct Packing',
    category: 'nested',
    signature: '{\'key1\': val1, \'key2\': val2} | struct_pack(k := v) | s.key | s[\'key\']',
    summary: 'Strongly-typed object records. Accessed via direct dot notation (s.key) or bracket syntax.',
    parityBadge: 'Snowflake & BigQuery Parity',
    exampleSql: `SELECT 
  {'id': id, 'name': name, 'usd': price} AS product_obj,
  product_obj.name AS extracted_name,
  product_obj['usd'] AS extracted_price
FROM products
LIMIT 3;`,
    tags: ['struct', 'object', 'dot notation', 'record'],
  },
  {
    id: 'func-json-extract',
    name: 'JSON Extraction (-> and ->>)',
    category: 'nested',
    signature: 'json_col -> \'$.path\' (JSON) | json_col ->> \'$.path\' (VARCHAR)',
    summary: 'Extracts values from JSON text. -> returns raw JSON; ->> unquotes and returns text (VARCHAR).',
    parityBadge: 'Postgres & SQLite 1:1',
    parameters: [
      { name: '->', type: 'operator', description: 'Returns matching sub-document as JSON type.' },
      { name: '->>', type: 'operator', description: 'Returns matching scalar value as plain unquoted VARCHAR.' },
    ],
    exampleSql: `SELECT 
  '{"user": {"name": "Haider", "tier": "pro"}, "active": true}'::JSON AS doc,
  doc -> '$.user' AS user_json,
  doc ->> '$.user.name' AS user_name;`,
    tags: ['json', '->', '->>', 'json_extract', 'semi-structured'],
  },

  // ==========================================
  // 6. AGGREGATES & STATISTICS
  // ==========================================
  {
    id: 'func-median-quantiles',
    name: 'MEDIAN() & QUANTILE_CONT()',
    category: 'aggregates',
    signature: 'MEDIAN(col) | QUANTILE_CONT(col, 0.95)',
    summary: 'Exact continuous and discrete percentiles and medians calculated in single-pass vectorization.',
    parityBadge: 'DuckDB & Snowflake 1:1',
    parameters: [
      { name: 'col', type: 'NUMERIC', description: 'Numeric column to analyze.' },
      { name: 'percentile', type: 'DOUBLE (0.0 - 1.0)', description: 'e.g. 0.50 (median), 0.90, 0.95, 0.99.' },
    ],
    exampleSql: `SELECT 
  category, 
  ROUND(AVG(price), 2) AS mean_price,
  ROUND(MEDIAN(price), 2) AS median_price,
  ROUND(QUANTILE_CONT(price, 0.90), 2) AS p90_price
FROM products
GROUP BY ALL;`,
    tags: ['median', 'quantile', 'p90', 'percentile', 'statistics'],
  },
  {
    id: 'func-arg-min-max',
    name: 'ARG_MIN() & ARG_MAX()',
    category: 'aggregates',
    signature: 'ARG_MIN(target_col, comparator_col) | ARG_MAX(target_col, comparator_col)',
    summary: 'Returns the value of target_col associated with the minimum or maximum of comparator_col without subqueries.',
    parityBadge: 'DuckDB & BigQuery 1:1',
    parameters: [
      { name: 'target_col', type: 'ANY', description: 'Value you want to return (e.g. product name).' },
      { name: 'comparator_col', type: 'ORDERABLE', description: 'Metric being maximized/minimized (e.g. price).' },
    ],
    exampleSql: `SELECT 
  category, 
  ARG_MAX(name, price) AS most_expensive_item, 
  MAX(price) AS max_price,
  ARG_MIN(name, price) AS cheapest_item
FROM products
GROUP BY ALL;`,
    tags: ['arg_max', 'arg_min', 'top item', 'argmax', 'optimization'],
  },
  {
    id: 'func-stddev-corr',
    name: 'STDDEV(), VARIANCE(), CORR()',
    category: 'aggregates',
    signature: 'STDDEV(col) | CORR(col1, col2) | COVAR_SAMP(col1, col2)',
    summary: 'Full suite of sample and population statistical variance, standard deviation, and Pearson correlation.',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT 
  ROUND(STDDEV(price), 2) AS price_stddev,
  ROUND(VARIANCE(price), 2) AS price_variance
FROM products;`,
    tags: ['stddev', 'variance', 'corr', 'correlation', 'data science'],
  },

  // ==========================================
  // 7. INGESTION, PARQUET & I/O
  // ==========================================
  {
    id: 'func-read-parquet',
    name: 'read_parquet() & Direct Parquet Querying',
    category: 'ingestion',
    signature: 'SELECT * FROM read_parquet(\'path/*.parquet\') | SELECT * FROM \'path/*.parquet\'',
    summary: 'Reads Parquet files directly with pushdown predicates and column projection pruning. Glob patterns (*.parquet) supported.',
    parityBadge: 'DuckDB Superpower',
    parameters: [
      { name: 'path', type: 'VARCHAR | LIST', description: 'Local path, glob pattern, or remote S3 / HTTPS URL.' },
    ],
    exampleSql: `SELECT category, COUNT(*) AS rows, ROUND(AVG(price), 2) AS avg_price
FROM 'https://shell.duckdb.org/data/tpch/0_01/parquet/lineitem.parquet'
GROUP BY ALL
LIMIT 5;`,
    tags: ['parquet', 'read_parquet', 'glob', 'zero-copy', 'arrow'],
  },
  {
    id: 'func-read-csv-auto',
    name: 'read_csv_auto()',
    category: 'ingestion',
    signature: 'read_csv_auto(\'file.csv\', header=true, normalize_names=true)',
    summary: 'Automatically sniffs delimiters, header rows, quotes, and infers strict column data types.',
    parityBadge: 'DuckDB Superpower',
    exampleSql: `SELECT * 
FROM read_csv_auto('customers.csv')
LIMIT 5;`,
    tags: ['csv', 'read_csv_auto', 'sniffing', 'ingest'],
  },
  {
    id: 'func-copy-export',
    name: 'COPY ... TO (FORMAT PARQUET)',
    category: 'ingestion',
    signature: 'COPY (SELECT ...) TO \'output.parquet\' (FORMAT PARQUET, COMPRESSION ZSTD)',
    summary: 'Exports any query result or table directly to high-compression columnar Parquet or CSV with single-digit MB output.',
    parityBadge: 'DuckDB Standard',
    parameters: [
      { name: 'FORMAT', type: 'PARQUET | CSV | JSON', description: 'Target file format.' },
      { name: 'COMPRESSION', type: 'ZSTD | SNAPPY | GZIP', optional: true, description: 'Compression codec (default ZSTD for Parquet).' },
    ],
    exampleSql: `COPY (
  SELECT category, COUNT(*) AS items, ROUND(AVG(price), 2) AS avg_price
  FROM products
  GROUP BY ALL
) TO 'category_summary.parquet' (FORMAT PARQUET, COMPRESSION ZSTD);`,
    tags: ['copy', 'export', 'parquet', 'zstd', 'backup'],
  },
  {
    id: 'func-attach-db',
    name: 'ATTACH & Multi-Database Joins',
    category: 'ingestion',
    signature: 'ATTACH \'other.db\' AS other_db; DETACH other_db;',
    summary: 'Attaches external SQLite, PostgreSQL, MySQL, or DuckDB database files to query and join them across boundaries in a single query.',
    parityBadge: 'DuckDB Superpower',
    exampleSql: `ATTACH 'analytics.db' AS analytics;
SELECT * 
FROM main.products p
JOIN analytics.sales s ON p.id = s.product_id;`,
    tags: ['attach', 'detach', 'multi-db', 'sqlite', 'postgres'],
  },

  // ==========================================
  // ADDITIONAL ESSENTIALS & UTILITIES
  // ==========================================
  {
    id: 'func-coalesce-nullif',
    name: 'COALESCE() & NULLIF()',
    category: 'superpowers',
    signature: 'COALESCE(val1, val2, ...) | NULLIF(val1, val2)',
    summary: 'Returns first non-NULL value (COALESCE) or returns NULL if two arguments are equal (NULLIF to prevent division by zero).',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT 
  name, 
  COALESCE(category, 'Uncategorized') AS safe_category,
  ROUND(price / NULLIF(stock, 0), 2) AS price_per_unit_stock
FROM products
LIMIT 5;`,
    tags: ['coalesce', 'nullif', 'null handling', 'safe division'],
  },
  {
    id: 'func-case-when',
    name: 'CASE WHEN Expressions',
    category: 'superpowers',
    signature: 'CASE WHEN cond1 THEN res1 [WHEN ... THEN ...] [ELSE default] END',
    summary: 'Conditional branching expression evaluated sequentially from top to bottom.',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT 
  name, 
  price,
  CASE 
    WHEN price >= 500 THEN 'Premium'
    WHEN price >= 100 THEN 'Mid-range'
    ELSE 'Budget'
  END AS price_tier
FROM products
LIMIT 6;`,
    tags: ['case', 'when', 'if-else', 'conditional', 'classification'],
  },
  {
    id: 'func-greatest-least',
    name: 'GREATEST() & LEAST()',
    category: 'aggregates',
    signature: 'GREATEST(val1, val2, ...) | LEAST(val1, val2, ...)',
    summary: 'Returns the maximum or minimum value among arbitrary lists of scalar expressions.',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT 
  name, 
  price,
  GREATEST(price * 0.9, 10.0) AS min_floor_discount,
  LEAST(price * 1.2, 1500.0) AS capped_price
FROM products
LIMIT 4;`,
    tags: ['greatest', 'least', 'min', 'max', 'clamp'],
  },
  {
    id: 'func-round-math',
    name: 'ROUND(), TRUNC(), CEIL(), FLOOR(), ABS()',
    category: 'aggregates',
    signature: 'ROUND(x [, n]) | TRUNC(x [, n]) | CEIL(x) | FLOOR(x) | ABS(x)',
    summary: 'Essential mathematical rounding, truncation, and absolute value operations.',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT 
  price, 
  ROUND(price, 1) AS rounded_1,
  FLOOR(price) AS floored,
  CEIL(price) AS ceiling
FROM products
LIMIT 4;`,
    tags: ['round', 'floor', 'ceil', 'trunc', 'abs', 'math'],
  },
  {
    id: 'func-power-sqrt-log',
    name: 'POWER(), SQRT(), LN(), LOG10(), EXP()',
    category: 'aggregates',
    signature: 'POWER(base, exp) | SQRT(x) | LN(x) | LOG10(x) | EXP(x)',
    summary: 'Exponential, logarithmic, and power functions for statistical modeling and normalizations.',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT 
  price, 
  ROUND(SQRT(price), 2) AS sqrt_price,
  ROUND(LN(price), 3) AS log_price
FROM products
LIMIT 4;`,
    tags: ['power', 'sqrt', 'log', 'exp', 'math'],
  },
  {
    id: 'func-lpad-rpad',
    name: 'LPAD() & RPAD()',
    category: 'strings',
    signature: 'LPAD(string, length, pad_string) | RPAD(string, length, pad_string)',
    summary: 'Pads a string to the left or right with characters until reaching the target length.',
    parityBadge: 'Postgres & Snowflake 1:1',
    exampleSql: `SELECT 
  name, 
  LPAD(id::VARCHAR, 5, '0') AS zero_padded_id,
  RPAD(name, 20, '.') AS dotted_name
FROM products
LIMIT 4;`,
    tags: ['lpad', 'rpad', 'padding', 'alignment'],
  },
  {
    id: 'func-split-part',
    name: 'SPLIT_PART()',
    category: 'strings',
    signature: 'SPLIT_PART(string, delimiter, index)',
    summary: 'Splits string on delimiter and returns the 1-based N-th item directly without array unpacking.',
    parityBadge: 'Postgres & Snowflake 1:1',
    exampleSql: `SELECT 
  email, 
  SPLIT_PART(email, '@', 1) AS username,
  SPLIT_PART(email, '@', 2) AS domain
FROM customers
LIMIT 5;`,
    tags: ['split_part', 'string', 'delimiter', 'fast extract'],
  },
  {
    id: 'func-reverse-repeat',
    name: 'REVERSE() & REPEAT()',
    category: 'strings',
    signature: 'REVERSE(string) | REPEAT(string, count)',
    summary: 'Reverses string characters or duplicates text N times.',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT 
  name, 
  REVERSE(name) AS mirror_name,
  REPEAT('⭐', 3) AS stars
FROM products
LIMIT 3;`,
    tags: ['reverse', 'repeat', 'string'],
  },
  {
    id: 'func-make-date',
    name: 'MAKE_DATE() & MAKE_TIMESTAMP()',
    category: 'dates',
    signature: 'MAKE_DATE(year, month, day) | MAKE_TIMESTAMP(y, m, d, h, m, s)',
    summary: 'Constructs date or timestamp objects safely from integer year, month, and day components.',
    parityBadge: 'Postgres & DuckDB Standard',
    exampleSql: `SELECT 
  MAKE_DATE(2026, 11, 21) AS conference_day,
  MAKE_TIMESTAMP(2026, 11, 21, 14, 30, 00) AS start_time;`,
    tags: ['make_date', 'make_timestamp', 'constructor', 'calendar'],
  },
  {
    id: 'func-age',
    name: 'AGE()',
    category: 'dates',
    signature: 'AGE(timestamp [, timestamp])',
    summary: 'Computes exact calendar difference interval (years, months, days) between two timestamps.',
    parityBadge: 'Postgres 1:1',
    exampleSql: `SELECT 
  name, 
  signup_date, 
  AGE(current_date, signup_date) AS customer_age
FROM customers
LIMIT 4;`,
    tags: ['age', 'tenure', 'calendar interval'],
  },
  {
    id: 'func-ntile',
    name: 'NTILE()',
    category: 'window',
    signature: 'NTILE(buckets) OVER (ORDER BY ...)',
    summary: 'Divides an ordered partition into N equally sized buckets (e.g. quartiles, quintiles, deciles).',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT 
  name, 
  price, 
  NTILE(4) OVER (ORDER BY price) AS price_quartile
FROM products;`,
    tags: ['ntile', 'quartile', 'decile', 'buckets', 'window'],
  },
  {
    id: 'func-first-last-value',
    name: 'FIRST_VALUE(), LAST_VALUE(), NTH_VALUE()',
    category: 'window',
    signature: 'FIRST_VALUE(col) | LAST_VALUE(col) | NTH_VALUE(col, n) OVER (...)',
    summary: 'Retrieves the first, last, or N-th value within an ordered window partition frame.',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT 
  category, 
  name, 
  price,
  FIRST_VALUE(name) OVER (
    PARTITION BY category 
    ORDER BY price DESC 
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS top_product_in_category
FROM products;`,
    tags: ['first_value', 'last_value', 'nth_value', 'window'],
  },
  {
    id: 'func-list-ops',
    name: 'LIST Concatenation, Sort & Reverse',
    category: 'nested',
    signature: 'list_concat(l1, l2) | list_sort(l) | list_reverse(l) | l1 || l2',
    summary: 'High-speed vectorized list operations for merging, ordering, and inverting arrays.',
    parityBadge: 'DuckDB Superpower',
    exampleSql: `SELECT 
  list_sort([5, 2, 8, 1, 9]) AS sorted_list,
  list_reverse([1, 2, 3]) AS reversed_list,
  [1, 2] || [3, 4] AS merged_list;`,
    tags: ['list', 'list_sort', 'list_reverse', 'list_concat', 'array'],
  },
  {
    id: 'func-map-ops',
    name: 'MAP Type & MAP_EXTRACT()',
    category: 'nested',
    signature: 'map(keys_list, values_list) | map_extract(map, key) | map[\'key\']',
    summary: 'Key-value associative map structures with O(1) indexed lookups.',
    parityBadge: 'Presto & DuckDB Parity',
    exampleSql: `SELECT 
  map(['USD', 'EUR', 'GBP'], [1.0, 0.92, 0.79]) AS fx_rates,
  map_extract(fx_rates, 'EUR') AS eur_rate,
  fx_rates['GBP'] AS gbp_rate;`,
    tags: ['map', 'dictionary', 'key-value', 'map_extract'],
  },
  {
    id: 'func-approx-count-distinct',
    name: 'APPROX_COUNT_DISTINCT()',
    category: 'aggregates',
    signature: 'APPROX_COUNT_DISTINCT(col)',
    summary: 'HyperLogLog++ approximation of distinct values using fixed tiny memory for multi-million row datasets.',
    parityBadge: 'Snowflake & BigQuery 1:1',
    exampleSql: `SELECT 
  category, 
  APPROX_COUNT_DISTINCT(id) AS approx_unique_items,
  COUNT(DISTINCT id) AS exact_unique_items
FROM products
GROUP BY ALL;`,
    tags: ['hyperloglog', 'approx_count_distinct', 'cardinality', 'big data'],
  },
  {
    id: 'func-explain-analyze',
    name: 'EXPLAIN & EXPLAIN ANALYZE',
    category: 'superpowers',
    signature: 'EXPLAIN [ANALYZE] query',
    summary: 'Displays physical query execution plan, vectorized pipeline operators, and millisecond timings.',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `EXPLAIN ANALYZE 
SELECT category, AVG(price) 
FROM products 
GROUP BY ALL;`,
    tags: ['explain', 'explain analyze', 'performance', 'query plan', 'profiling'],
  },
  {
    id: 'clause-union-by-name',
    name: 'UNION BY NAME',
    category: 'superpowers',
    signature: 'table1 UNION [ALL] BY NAME table2',
    summary: 'Merges tables by column name rather than positional order. Automatically fills missing columns with NULL.',
    parityBadge: 'DuckDB Exclusive Superpower',
    parameters: [
      { name: 'BY NAME', type: 'keyword', description: 'Matches columns across tables by name regardless of order, padding missing columns with NULL.' },
    ],
    exampleSql: `SELECT 1 AS id, 'Apple' AS name
UNION BY NAME
SELECT 'Banana' AS name, 2 AS id, 0.99 AS price;`,
    exampleOutput: 'Columns: [id, name, price]',
    notes: 'Eliminates brittle manual column aligning in data pipelines when stitching schemas together.',
    tags: ['union by name', 'union', 'schema merge', 'pipelines', 'duckdb superpower'],
  },
  {
    id: 'func-summarize',
    name: 'SUMMARIZE Data Profiling',
    category: 'superpowers',
    signature: 'SUMMARIZE table_name | SUMMARIZE (SELECT ...)',
    summary: 'One-command data profiler! Computes column types, min, max, unique count, avg, stddev, null percentage, and percentiles for every column.',
    parityBadge: 'DuckDB Exclusive Superpower',
    parameters: [
      { name: 'table_or_query', type: 'table | query', description: 'Target table or subquery expression to profile.' },
    ],
    exampleSql: `SUMMARIZE products;`,
    exampleOutput: 'Returns [column_name, column_type, min, max, approx_unique, avg, std, null_percentage, p25, p50, p75]',
    notes: 'Essential for Exploratory Data Analysis (EDA). Runs in single-digit milliseconds even on millions of rows.',
    tags: ['summarize', 'eda', 'data profiling', 'statistics', 'duckdb superpower'],
  },
  {
    id: 'func-range-generate-series',
    name: 'range() & generate_series()',
    category: 'dates',
    signature: 'range(start, stop [, step]) | generate_series(start_date, end_date, INTERVAL \'1\' DAY)',
    summary: 'Generates sequences of numbers or complete date spines for retention cohorts, missing date filling, and synthetic datasets.',
    parityBadge: 'Postgres & DuckDB Standard',
    parameters: [
      { name: 'start', type: 'INTEGER | DATE | TIMESTAMP', description: 'Initial sequence boundary value.' },
      { name: 'stop', type: 'INTEGER | DATE | TIMESTAMP', description: 'End boundary value.' },
      { name: 'step', type: 'INTEGER | INTERVAL', optional: true, description: 'Step duration (e.g. INTERVAL 1 DAY or integer).' },
    ],
    exampleSql: `SELECT range::DATE AS calendar_date
FROM range(DATE '2026-11-01', DATE '2026-11-10', INTERVAL '1' DAY);`,
    notes: 'In DuckDB, range() is exclusive of stop, while generate_series() is inclusive.',
    tags: ['range', 'generate_series', 'date spine', 'cohorts', 'sequences'],
  },
  {
    id: 'func-ilike-any',
    name: 'Multi-Pattern Matching (ILIKE ANY / LIKE ALL)',
    category: 'strings',
    signature: 'col ILIKE ANY([\'pattern1\', \'pattern2\']) | col LIKE ALL([\'%a%\', \'%b%\'])',
    summary: 'Matches a string against multiple patterns contained in an array without typing endless repetitive OR / AND conditions.',
    parityBadge: 'DuckDB & Snowflake 1:1',
    parameters: [
      { name: 'patterns', type: 'LIST(VARCHAR)', description: 'Array of LIKE / ILIKE wildcard patterns (e.g. [\'%pro%\', \'%max%\']).' },
    ],
    exampleSql: `SELECT id, name, category, price
FROM products
WHERE name ILIKE ANY(['%pro%', '%wireless%', '%mouse%']);`,
    tags: ['ilike any', 'like all', 'pattern matching', 'wildcard', 'strings'],
  },
  {
    id: 'func-try-cast',
    name: 'Safe Type Casting (TRY_CAST & ::)',
    category: 'superpowers',
    signature: 'TRY_CAST(expression AS type) | expression::type',
    summary: 'Converts data types. TRY_CAST safely returns NULL if conversion fails instead of throwing a query-killing error.',
    parityBadge: 'Snowflake & BigQuery 1:1',
    parameters: [
      { name: 'expression', type: 'ANY', description: 'Input value to convert.' },
      { name: 'type', type: 'DATA TYPE', description: 'Target data type (e.g. INTEGER, DATE, DOUBLE, HUGEINT).' },
    ],
    exampleSql: `SELECT 
  '42'::INTEGER AS direct_cast,
  TRY_CAST('invalid_number' AS INTEGER) AS safe_null_on_error,
  TRY_CAST('2026-11-21' AS DATE) AS parsed_date;`,
    notes: 'Crucial when parsing dirty CSVs where some rows contain text like "N/A" or "None".',
    tags: ['try_cast', 'cast', '::', 'data types', 'safe parsing', 'data cleaning'],
  },
  {
    id: 'func-hashing',
    name: 'md5(), sha256() & hash()',
    category: 'strings',
    signature: 'md5(str) | sha256(str) | hash(any_val)',
    summary: 'Cryptographic and fast non-cryptographic 64-bit hashing functions for surrogate keys, deduplication, and anomaly tracking.',
    parityBadge: 'ANSI SQL Standard',
    parameters: [
      { name: 'input', type: 'VARCHAR | ANY', description: 'Data to compute hash signature for.' },
    ],
    exampleSql: `SELECT 
  email, 
  md5(email) AS anonymized_hash,
  hash(id) AS 64bit_fast_hash
FROM customers
LIMIT 5;`,
    tags: ['hash', 'md5', 'sha256', 'surrogate key', 'deduplication', 'cryptography'],
  },
  {
    id: 'func-pragma-meta',
    name: 'DESCRIBE & PRAGMA Schema Inspection',
    category: 'superpowers',
    signature: 'DESCRIBE table | PRAGMA table_info(\'table\') | PRAGMA version',
    summary: 'Inspects database metadata, table schemas, column data types, nullability, and engine version info.',
    parityBadge: 'DuckDB & SQLite Parity',
    exampleSql: `DESCRIBE products;`,
    exampleOutput: 'Returns [column_name, column_type, null, key, default, extra]',
    tags: ['describe', 'pragma', 'schema', 'metadata', 'table_info'],
  },
  {
    id: 'func-set-operations',
    name: 'INTERSECT & EXCEPT Set Operations',
    category: 'superpowers',
    signature: 'query1 INTERSECT [ALL] query2 | query1 EXCEPT [ALL] query2',
    summary: 'Mathematical set operations: INTERSECT returns rows present in both queries; EXCEPT returns rows in query1 not in query2.',
    parityBadge: 'ANSI SQL Standard',
    exampleSql: `SELECT city FROM customers
INTERSECT
SELECT 'New York' AS city;`,
    tags: ['intersect', 'except', 'minus', 'set operations'],
  },
];

/**
 * Instant client-side fuzzy search across item name, signature, summary, tags, and format specifiers
 */
export function searchCheatSheet(query: string, category?: CheatSheetCategory): CheatSheetItem[] {
  const normalized = query.trim().toLowerCase();

  return DUCKDB_CHEAT_SHEET_ITEMS.filter(item => {
    // Category filter
    if (category && item.category !== category) {
      return false;
    }

    if (!normalized) {
      return true;
    }

    // Exact or substring match in name, signature, summary, or notes
    if (
      item.name.toLowerCase().includes(normalized) ||
      item.signature.toLowerCase().includes(normalized) ||
      item.summary.toLowerCase().includes(normalized) ||
      (item.notes && item.notes.toLowerCase().includes(normalized))
    ) {
      return true;
    }

    // Search tags
    if (item.tags.some(tag => tag.toLowerCase().includes(normalized))) {
      return true;
    }

    // Search format specifiers (e.g. searching "%m" or "%.2f")
    if (
      item.formatSpecifiers &&
      item.formatSpecifiers.some(code => code.toLowerCase().includes(normalized))
    ) {
      return true;
    }

    // Search parameters
    if (
      item.parameters &&
      item.parameters.some(
        p => p.name.toLowerCase().includes(normalized) || p.description.toLowerCase().includes(normalized)
      )
    ) {
      return true;
    }

    return false;
  });
}
