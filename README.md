<p align="center">
  <img src="public/logo.svg" alt="Learn DuckDB logo" width="120" height="120" />
</p>

<h1 align="center">Learn Duckdb</h1>

<p align="center">
  An interactive, browser-based SQL tutorial and practice studio powered by DuckDB-Wasm.
</p>

<p align="center">
  <a href="https://github.com/haydermuhib/learn-duckdb/releases/latest"><img src="https://img.shields.io/badge/version-1.5.2-FFF000.svg?style=flat-square&labelColor=18181B&color=FFF000" alt="Version 1.5.2" /></a>
  <a href="https://duckdb.org"><img src="https://img.shields.io/badge/engine-DuckDB--Wasm-FFF000.svg?style=flat-square&labelColor=18181B&color=FFF000" alt="DuckDB-Wasm" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6.svg?style=flat-square&labelColor=18181B" alt="TypeScript 5" /></a>
  <a href="https://vitest.dev"><img src="https://img.shields.io/badge/tests-51%20passed-16A34A.svg?style=flat-square&labelColor=18181B" alt="51 Tests Passed" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPLv3+-blue.svg?style=flat-square&labelColor=18181B" alt="License: GPLv3+" /></a>
</p>

<p align="center">
  <a href="#overview">Overview</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#duckdb-analytical-syntax">Analytical syntax</a> &bull;
  <a href="#curriculum">Curriculum</a> &bull;
  <a href="#keyboard-shortcuts">Shortcuts</a> &bull;
  <a href="#local-development">Development</a> &bull;
  <a href="#license-and-trademark">License</a>
</p>

---

## Overview

Learn Duckdb runs 149 analytical SQL exercises directly inside your browser. Because the engine runs as WebAssembly inside a dedicated Web Worker, queries execute locally without network roundtrips, backend servers, or account registration. Your queries and local database state never leave your machine.

> Looking for the terminal version? The Python Textual TUI edition is maintained on the [`cli`](https://github.com/haydermuhib/learn-duckdb/tree/cli) branch.

---

## Features

- **149 exercises across 18 modules:** Covers basic projections, joins, aggregation, subqueries, window functions, and recursive CTEs.
- **Modern analytical SQL:** Practice modern clauses native to DuckDB, including `GROUP BY ALL`, `SELECT * EXCLUDE`, `SELECT * REPLACE`, and `QUALIFY`.
- **Sub-millisecond local validation:** Compares query output against reference tables using typed comparisons, floating-point tolerance, and sorted row matching.
- **Interactive schema inspector:** Browse database tables, column data types, and primary key constraints with one-click data previews.
- **Offline persistence:** Saves exercise completion status, editor drafts, and active databases to local storage.
- **Keyboard-driven editor:** Built with CodeMirror 6, featuring vim-friendly navigation, quick-run shortcuts, and syntax highlighting.

---

## Architecture

The application runs entirely on client hardware. The main UI thread communicates with DuckDB-Wasm over an asynchronous Web Worker bridge, receiving query results as Apache Arrow record batches.

```text
+-----------------------------------------------------------------------+
|                             Browser tab                               |
|                                                                       |
|   +--------------------------+         +--------------------------+   |
|   |    Landing page view     |         |   Practice studio view   |   |
|   |  - Sandbox runner        |         |  - CodeMirror 6 editor   |   |
|   |  - Syllabus browser      |<------->|  - Schema tree explorer  |   |
|   |  - Architecture docs     |         |  - Arrow results grid    |   |
|   +------------+-------------+         +------------+-------------+   |
|                |                                    |                 |
|                +-----------------+------------------+                 |
|                                  |                                    |
|                                  v                                    |
|                +------------------------------------+                 |
|                |      Dedicated Web Worker          |                 |
|                |  +------------------------------+  |                 |
|                |  |      @duckdb/duckdb-wasm     |  |                 |
|                |  |  (Vectorized columnar OLAP)  |  |                 |
|                |  +--------------+---------------+  |                 |
|                |                 |                  |                 |
|                |                 v                  |                 |
|                |      In-memory seed catalogs       |                 |
|                |     (store, company, school)       |                 |
|                +-----------------+------------------+                 |
|                                  |                                    |
|                                  v                                    |
|                +------------------------------------+                 |
|                |     Apache Arrow RecordBatches     |                 |
|                |    (Zero-copy browser results)     |                 |
|                +------------------------------------+                 |
+-----------------------------------------------------------------------+
```

---

## Engine comparison

| Property | SQLite (in-browser) | PostgreSQL (hosted container) | Learn Duckdb (DuckDB-Wasm) |
|---|---|---|---|
| Execution site | Browser (sql.js) | Remote cloud server | Browser (Web Worker) |
| Typical query latency | 5 to 15 ms | 150 to 800 ms (network roundtrip) | Under 2 ms |
| Processing model | Row-oriented | Row and columnar via extensions | Vectorized columnar OLAP |
| `GROUP BY ALL` | No | No | Supported |
| `SELECT * EXCLUDE / REPLACE` | No | No | Supported |
| `QUALIFY` clause | No | No (requires CTE or subquery) | Supported |
| Operating cost | Client compute | Server hosting per user | Client compute (zero server cost) |

---

## DuckDB analytical syntax

DuckDB includes several syntax additions that simplify common analytical queries.

### 1. Group by all

The `GROUP BY ALL` clause automatically infers every non-aggregate column in your select list, eliminating repetitive column declarations:

```sql
SELECT
  category,
  city,
  COUNT(*) AS total_orders,
  ROUND(AVG(price), 2) AS average_price
FROM products
JOIN customers ON products.supplier_id = customers.customer_id
GROUP BY ALL;
```

### 2. Exclude specific columns

`SELECT * EXCLUDE` selects all columns while omitting specific fields:

```sql
SELECT * EXCLUDE (email, password_hash)
FROM customers;
```

### 3. Replace columns inline

`SELECT * REPLACE` updates specific columns inline without having to write out the full list of remaining fields:

```sql
SELECT * REPLACE (price * 1.20 AS price)
FROM products;
```

### 4. Filter window calculations with QUALIFY

The `QUALIFY` clause filters window function results directly, removing the need for wrapper subqueries:

```sql
SELECT name, category, price
FROM products
QUALIFY ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) = 1;
```

---

## Curriculum

The curriculum spans 18 progressive modules containing 149 practical exercises.

<details open>
<summary><b>View complete syllabus breakdown</b></summary>
<br />

| Module | Title | Core topics | Exercises |
|:---:|---|---|:---:|
| 01 | Basic SELECT | Projections, mathematical expressions, DISTINCT, EXCLUDE, REPLACE | 7 |
| 02 | Filtering with WHERE | Comparison operators, AND/OR logic, BETWEEN, IN, LIKE, NULL checks | 12 |
| 03 | Sorting and Limiting | ORDER BY, ASC/DESC, multi-column sorts, LIMIT, OFFSET, ORDER BY ALL | 7 |
| 04 | Aggregate Functions | COUNT, SUM, AVG, MIN, MAX, filtered aggregates | 6 |
| 05 | Grouping with GROUP BY | Group metrics, multi-column grouping, HAVING vs WHERE, GROUP BY ALL | 9 |
| 06 | Joining Tables (JOIN) | INNER JOIN, multi-table joins, LEFT JOIN, finding missing records, ANTI JOIN | 14 |
| 07 | Subqueries and CTEs | WHERE subqueries, IN subqueries, scalar expressions, WITH common table expressions | 10 |
| 08 | Text, Dates, and CASE | String manipulation, COALESCE, conditional CASE statements, date math | 9 |
| 09 | Changing Data (DML) | Single and batch INSERT, targeted UPDATE, safe DELETE operations | 6 |
| 10 | Advanced Aggregation | Conditional sums, ratio calculations, COUNT DISTINCT, distribution metrics | 5 |
| 11 | Set Operations | Cross joins, UNION, UNION ALL, NOT EXISTS anti-joins | 4 |
| 12 | Date and Time Parsing | Date intervals, strftime formatting, timestamp parsing, string trimming | 6 |
| 13 | Window Functions | OVER, PARTITION BY, ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, QUALIFY | 14 |
| 14 | Recursive Queries | WITH RECURSIVE hierarchies, tree traversals, sequence generators | 3 |
| 15 | Schema Definition (DDL) | CREATE TABLE, ON CONFLICT upsert, CREATE VIEW, secondary indexes | 9 |
| 16 | Case Study: School | Student GPAs, passing rates, course performance comparisons | 10 |
| 17 | Practical Reporting | Business metrics, sales reporting, and analytical aggregations | 4 |
| 18 | Interview Problems | Retention cohorts, top department earners, month-over-month growth rates | 14 |
| **Total** | | | **149** |

</details>

---

## Keyboard shortcuts

| Key combination | Action | Scope |
|---|---|---|
| `Ctrl + Enter` or `Cmd + Enter` | Run query and verify answer | SQL editor |
| `Alt + N` or `Alt + Right` | Advance to next exercise | Global |
| `Alt + P` or `Alt + Left` | Return to previous exercise | Global |

---

## Local development

The project uses Node.js and npm with [Volta](https://volta.sh) for pinned toolchain versions.

```bash
# 1. Clone the repository
git clone https://github.com/haydermuhib/learn-duckdb.git
cd learn-duckdb

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run the test suite
npm test

# 5. Build for production
npm run build
```

---

## License and trademark

- **Code License:** The source code is licensed under the [GNU General Public License v3.0 or later (GPLv3+)](LICENSE). Any derivative works or modifications must remain open source under the terms of GPLv3.
- **Trademark and Brand Protection:** Under Section 7(e) of the GNU General Public License v3.0, the name "Learn DuckDB", the application logo, and custom brand assets are the exclusive intellectual property and trademarks of Haider Ali Tariq. They may not be used in derivative works, forks, or commercial distributions without prior written permission.
- **Third-Party Trademarks:** DuckDB is a registered trademark of the DuckDB Foundation. Learn Duckdb is an independent open-source educational project and is not affiliated with, sponsored by, or endorsed by the DuckDB Foundation.
