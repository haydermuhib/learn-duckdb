<div align="center">

# 🦆 learn-duckdb

### Master Modern Analytical SQL in Your Browser, Powered by DuckDB-Wasm

148+ interactive query exercises running 100% locally with zero server lag, zero installation, and zero sign-up required.

[![Release v1.0.0](https://img.shields.io/badge/release-v1.0.0-FEC62E.svg?style=flat-square&logo=duckdb&logoColor=black)](https://github.com/haydermuhib/learn-duckdb/releases/tag/v1.0.0)
[![DuckDB Wasm](https://img.shields.io/badge/engine-DuckDB--Wasm-FEC62E.svg?style=flat-square&logo=webassembly&logoColor=black)](https://duckdb.org)
[![React 18](https://img.shields.io/badge/frontend-React%2018-blue.svg?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript 5](https://img.shields.io/badge/language-TypeScript%205-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tests Passing](https://img.shields.io/badge/tests-15%2F15%20passed-16A34A.svg?style=flat-square&logo=vitest&logoColor=white)](https://github.com/haydermuhib/learn-duckdb)
[![License MIT](https://img.shields.io/badge/license-MIT-black.svg?style=flat-square)](LICENSE)

[**Features**](#-features) • [**Architecture**](#-architecture) • [**DuckDB Superpowers**](#-duckdb-superpowers) • [**Curriculum**](#-curriculum-18-modules) • [**Keyboard Shortcuts**](#-keyboard-shortcuts) • [**Development**](#-local-development)

</div>

---

> [!TIP]
> **Zero Infrastructure Overhead:** Unlike traditional SQL practice platforms that proxy queries through remote servers or cloud containers, `learn-duckdb` executes your queries directly in your browser's Web Worker using **DuckDB-Wasm**. Your data and queries never leave your device.

> [!NOTE]
> **Looking for the original Terminal TUI version?**
> The terminal-based Python CLI version is preserved on the [`cli`](https://github.com/haydermuhib/learn-duckdb/tree/cli) branch.

---

## ⚡ Features

- **148+ Interactive Exercises:** Structured across 18 progressive modules from your first `SELECT` to windowing, recursive CTEs, and interview challenges.
- **DuckDB Superpowers:** Master modern analytical features unavailable in older engines (`GROUP BY ALL`, `SELECT * EXCLUDE`, `SELECT * REPLACE`, and `QUALIFY`).
- **Instant Local Validation:** Queries are verified in sub-milliseconds against expected solution tables with floating-point tolerance and smart row sorting.
- **Interactive Schema Explorer:** Real-time table browser with primary key indicators, column types, and instant one-click `SELECT * LIMIT 5` previews.
- **Persistent Progress:** Exercise completions, drafts, and active databases are automatically saved to `localStorage`.
- **Keyboard-Driven Studio:** Built with CodeMirror 6 with instant shortcuts (`Ctrl+Enter` to test, `Alt+→` for next exercise, `Ctrl+B` for sidebar).

---

## 🏗️ Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              BROWSER TAB                               │
│                                                                        │
│   ┌───────────────────────────┐      ┌─────────────────────────────┐   │
│   │    Landing Page View      │      │    Practice Studio View     │   │
│   │  - Hero Live Sandbox      │      │  - CodeMirror 6 SQL Editor  │   │
│   │  - 18-Module Syllabus Map │◀────▶│  - Interactive Schema Tree  │   │
│   │  - Proof Points & FAQ     │      │  - Dynamic Results Grid     │   │
│   └─────────────┬─────────────┘      └──────────────┬──────────────┘   │
│                 │                                   │                  │
│                 └─────────────────┬─────────────────┘                  │
│                                   │                                    │
│                                   ▼                                    │
│                 ┌───────────────────────────────────┐                  │
│                 │      Web Worker Execution Pool    │                  │
│                 │  ┌─────────────────────────────┐  │                  │
│                 │  │     @duckdb/duckdb-wasm     │  │                  │
│                 │  │ (Vectorized Columnar OLAP)  │  │                  │
│                 │  └──────────────┬──────────────┘  │                  │
│                 │                 │                 │                  │
│                 │                 ▼                 │                  │
│                 │     In-Memory Seed Databases      │                  │
│                 │    (store, company, school)       │                  │
│                 └─────────────────┬─────────────────┘                  │
│                                   │                                    │
│                                   ▼                                    │
│                 ┌───────────────────────────────────┐                  │
│                 │     Apache Arrow RecordBatches    │                  │
│                 │   (Sub-millisecond Local Result)  │                  │
│                 └───────────────────────────────────┘                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Why DuckDB? (Comparison)

| Feature | SQLite (Traditional Tutorials) | PostgreSQL (Cloud Containers) | **learn-duckdb (DuckDB-Wasm)** |
|---|:---:|:---:|:---:|
| **Execution Location** | In-Browser (sql.js) | Remote Cloud Server | **100% In-Browser (Wasm)** |
| **Execution Latency** | Fast (~5ms) | Slow (150–800ms roundtrip) | **Instant (< 2ms)** |
| **Analytical Capabilities** | Row-oriented, limited OLAP | Powerful, heavy setup | **Columnar, modern analytical OLAP** |
| **`GROUP BY ALL`** | ❌ No | ❌ No | **✅ Yes** |
| **`SELECT * EXCLUDE / REPLACE`** | ❌ No | ❌ No | **✅ Yes** |
| **`QUALIFY` for Window Functions** | ❌ No | ❌ No (requires CTEs) | **✅ Yes** |
| **Server Costs & Rate Limits** | None | High / Cloud Gated | **Zero / Unlimited** |

---

## 🦆 DuckDB Superpowers

DuckDB introduces modern SQL quality-of-life improvements that eliminate repetitive boilerplate:

### 1. `GROUP BY ALL`
Automatically infers all non-aggregated columns without manually listing them:
```sql
SELECT category, city, COUNT(*), ROUND(AVG(price), 2) AS avg_price
FROM products
JOIN customers ON ...
GROUP BY ALL;
```

### 2. `SELECT * EXCLUDE`
Keep every column in the table except for sensitive or unneeded fields:
```sql
SELECT * EXCLUDE (email, password_hash)
FROM customers;
```

### 3. `SELECT * REPLACE`
Modify specific columns on the fly without re-specifying every other column:
```sql
SELECT * REPLACE (price * 1.20 AS price)
FROM products;
```

### 4. The `QUALIFY` Clause
Filter window functions directly without wrapping your query in an extra CTE or subquery:
```sql
SELECT name, category, price
FROM products
QUALIFY ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) = 1;
```

---

## 📚 Curriculum (18 Modules)

<details open>
<summary><b>📋 Click to expand/collapse full syllabus breakdown (148 exercises)</b></summary>

| Module | Title | Focus Areas | Exercises |
|:---:|---|---|:---:|
| **01** | **Basic SELECT** | First query, column projections, math, DISTINCT, `EXCLUDE`, `REPLACE` | 7 |
| **02** | **Filtering with WHERE** | Comparisons, AND/OR logic, BETWEEN, IN lists, LIKE patterns, NULL handling | 12 |
| **03** | **Sorting and Limiting** | ORDER BY, ASC/DESC, multi-column sorts, LIMIT, OFFSET, `ORDER BY ALL` | 7 |
| **04** | **Aggregate Functions** | COUNT, SUM, AVG, MIN, MAX, filtered counts | 6 |
| **05** | **Grouping with GROUP BY** | Group metrics, multi-grouping, HAVING vs WHERE, `GROUP BY ALL` | 9 |
| **06** | **Joining Tables (JOIN)** | INNER JOIN, multi-table joins, LEFT JOIN, finding missing records | 13 |
| **07** | **Subqueries and CTEs** | WHERE subqueries, IN subqueries, scalar expressions, `WITH` CTEs | 10 |
| **08** | **Text, Dates and CASE** | UPPER/LOWER, SUBSTR, COALESCE, CASE WHEN, date math | 9 |
| **09** | **Changing Data (DML)** | Single/batch INSERT, targeted UPDATE, safe DELETE | 6 |
| **10** | **Advanced Aggregation** | Conditional sums, ratios, COUNT DISTINCT, distribution metrics | 5 |
| **11** | **JOIN Pitfalls & Sets** | Cross products, UNION, UNION ALL, NOT EXISTS anti-joins | 4 |
| **12** | **More Text and Dates** | Date differences, strftime parsing, formatting, trimming | 6 |
| **13** | **Window Functions** | OVER, PARTITION BY, ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, `QUALIFY` | 14 |
| **14** | **Recursive Queries** | `WITH RECURSIVE` hierarchies, tree traversals, number sequences | 3 |
| **15** | **Changing Data: Level 2** | CREATE TABLE, ON CONFLICT upsert, CREATE VIEW, indexes | 9 |
| **16** | **Case Study: School** | Student GPAs, passing rates, top performers across academic subjects | 10 |
| **17** | **Practical Challenges** | Real-world business reporting and analytical dashboards | 4 |
| **18** | **Interview Challenges** | Retention cohorts, top earners per department, growth rates | 14 |
| **TOTAL** | | | **148** |

</details>

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Scope |
|---|---|---|
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> or <kbd>⌘</kbd> + <kbd>Enter</kbd> | **Check Answer** / Verify query | SQL Editor |
| <kbd>Alt</kbd> + <kbd>N</kbd> or <kbd>Alt</kbd> + <kbd>→</kbd> | **Next Exercise** | Global |
| <kbd>Alt</kbd> + <kbd>P</kbd> or <kbd>Alt</kbd> + <kbd>←</kbd> | **Previous Exercise** | Global |

---

## 🛠️ Local Development

Runtime is strictly isolated and pinned with [Volta](https://volta.sh):

```bash
# 1. Clone the repository
git clone https://github.com/haydermuhib/learn-duckdb.git
cd learn-duckdb

# 2. Install dependencies
npm install

# 3. Run development server with hot-reload
npm run dev

# 4. Run test suite (15 unit tests)
npm test

# 5. Build for production
npm run build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
DuckDB is a registered trademark of the DuckDB Foundation.
