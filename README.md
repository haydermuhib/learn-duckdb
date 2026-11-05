# 🦆 learn-duckdb

**Interactive Modern SQL Learning in Your Browser, Powered by DuckDB-Wasm.**

`learn-duckdb` is a 100% client-side, interactive analytical SQL learning platform. It runs real DuckDB inside your browser using WebAssembly and Web Workers—no remote servers, no setup, and no sign-up required.

![DuckDB](https://img.shields.io/badge/powered%20by-DuckDB%20Wasm-FEC62E.svg)
![React 18](https://img.shields.io/badge/react-18-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)
![License MIT](https://img.shields.io/badge/license-MIT-green.svg)

> **Looking for the original Terminal TUI version?**
> The terminal Python version is preserved on the [`cli`](https://github.com/haydermuhib/learn-duckdb/tree/cli) branch.

---

## Features

- **148+ Interactive Exercises**: Structured across 18 progressive modules from foundational `SELECT` to advanced windowing, recursive CTEs, and interview challenges.
- **DuckDB Superpowers**: Learn modern SQL features unavailable in traditional engines (`GROUP BY ALL`, `SELECT * EXCLUDE`, `SELECT * REPLACE`, and `QUALIFY`).
- **100% In-Browser Privacy**: Powered by `@duckdb/duckdb-wasm`. All data, seed tables, and queries execute locally in your browser.
- **Instant Validation**: Real-time feedback comparing your query against canonical solutions with instant pass/fail validation.
- **Built-in Schema Explorer**: Inspect table schemas, data types, and preview seed rows with a single click.
- **LocalStorage Persistence**: Solved exercises, progress, and query drafts are saved automatically.

---

## Curriculum (18 Modules)

1. **Basic SELECT**: First queries, selecting columns, calculations, DISTINCT, `EXCLUDE`, and `REPLACE`.
2. **Filtering with WHERE**: Comparison operators, boolean logic, `BETWEEN`, `IN`, and pattern matching.
3. **Sorting and Limiting**: `ORDER BY`, `LIMIT`, `OFFSET`, and `ORDER BY ALL`.
4. **Aggregate Functions**: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.
5. **Grouping with GROUP BY**: Grouping metrics, `HAVING`, and `GROUP BY ALL`.
6. **Joining Tables (JOIN)**: `INNER JOIN`, `LEFT JOIN`, and multi-table relationships.
7. **Subqueries & CTEs**: Scalar subqueries, correlated queries, and `WITH` CTEs.
8. **Text, Dates and CASE**: String manipulation, date intervals, and conditional `CASE WHEN`.
9. **Changing Data (DML)**: `INSERT`, `UPDATE`, and `DELETE`.
10. **Advanced Aggregation**: Conditional aggregations, percentiles, and ratios.
11. **JOIN Pitfalls, EXISTS and UNION**: Set operations and anti-joins.
12. **More Text and Dates**: Advanced date calculations and string parsing.
13. **Window Functions**: `OVER`, `PARTITION BY`, `ROW_NUMBER`, `RANK`, and DuckDB `QUALIFY`.
14. **Recursive Queries**: `WITH RECURSIVE` tree traversals and sequences.
15. **Changing Data: Level 2**: `CREATE TABLE`, `ON CONFLICT` upsert, and `CREATE VIEW`.
16. **Case Study: School**: Realistic academic analytics.
17. **Practical Challenges**: End-to-end analytical reporting.
18. **Interview Challenges**: Cohorts, retention rates, top earners, and frequency gaps.

---

## Local Development

Runtime is isolated and pinned using [Volta](https://volta.sh):

```bash
# Clone the repository
git clone https://github.com/haydermuhib/learn-duckdb.git
cd learn-duckdb

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## License

[MIT](LICENSE)
