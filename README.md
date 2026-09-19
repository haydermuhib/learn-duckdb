# learn-duckdb

Interactive SQL learning in your terminal, powered by DuckDB.

learn-duckdb is a local-first SQL tutor built directly into your terminal. There is no browser UI, no remote database server, and no setup overhead.

![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)
![License MIT](https://img.shields.io/badge/license-MIT-green.svg)
![DuckDB](https://img.shields.io/badge/powered%20by-DuckDB-FEC62E.svg)
![Platforms](https://img.shields.io/badge/platforms-Linux%20%7C%20macOS%20%7C%20Windows-blueviolet.svg)

---

## Installation

### Linux and macOS
```bash
curl -fsSL https://raw.githubusercontent.com/haydermuhib/learn-duckdb/main/install.sh | bash
```

### Windows (PowerShell)
```powershell
irm https://raw.githubusercontent.com/haydermuhib/learn-duckdb/main/install.ps1 | iex
```

Once installed, open the application from any terminal:
```bash
learn-duckdb
```

<details>
<summary><b>Running directly with uv (without global install)</b></summary>

```bash
# Run on demand with uvx
uvx --from git+https://github.com/haydermuhib/learn-duckdb.git learn-duckdb

# Or clone and run in a local repository
git clone https://github.com/haydermuhib/learn-duckdb.git
cd learn-duckdb
uv run app.py
```

</details>

---

## Architecture and workflow

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   YAML Lessons  │──────▶│ In-Memory DuckDB│◀──────│  Your SQL Code  │
└─────────────────┘       └────────┬────────┘       └─────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Output Matching │
                          │ (Pass / Retry)  │
                          └─────────────────┘
```

1. **In-memory execution**: Each lecture loads its tables directly into memory (`:memory:`). You can run queries or modify tables without altering source data.
2. **Result-based grading**: The engine evaluates query output rather than exact SQL syntax. Any valid query returning the required rows and columns passes.
3. **Persistent playground**: When switching to Sandbox mode, tables save to local `.duckdb` files that persist across sessions.

---

## Curriculum

| Section | Topic | Exercises | Level |
|:---|:---|:---|:---|
| 01 | SELECT basics | 8 | Beginner |
| 02 | Filtering and conditions | 8 | Beginner |
| 03 | Sorting, limits, and NULL values | 8 | Beginner |
| 04 | Real-world data queries | 8 | Intermediate |
| 05 | JOINs and aggregations | 8 | Intermediate |
| 06 | Window functions | 8 | Advanced |

<details>
<summary><b>View detailed topic breakdown</b></summary>

* **01 SELECT basics**: Column projection, arithmetic expressions, table aliases.
* **02 Filtering**: `WHERE`, `LIKE`, `ILIKE`, `IN`, `BETWEEN`, Boolean operators.
* **03 Sorting & limits**: `ORDER BY`, `NULLS FIRST/LAST`, `LIMIT`, `OFFSET`.
* **04 Real-world queries**: Multi-table data exploration and practical business queries.
* **05 JOINs & aggregates**: `INNER JOIN`, `LEFT JOIN`, `GROUP BY`, `HAVING`, aggregate functions.
* **06 Window functions**: `OVER ()`, `PARTITION BY`, `ROW_NUMBER`, `RANK`, `LAG`, `LEAD`.

</details>

---

## Features

* **SQL IntelliSense**: Autocomplete suggestions for SQL keywords, functions, clauses, and live table and column names.
* **Statement under cursor execution**: Press <kbd>Ctrl+G</kbd> to run only the query at your cursor position, or <kbd>Ctrl+J</kbd> to run all editor text.
* **Automatic task progression**: Solving a task validates your output and moves to the next lesson automatically.
* **Resizable and collapsible sidebar**: Drag the divider with your mouse, adjust with <kbd>Alt+Left</kbd> / <kbd>Alt+Right</kbd>, or toggle with <kbd>Ctrl+B</kbd>.
* **Terminal scale adaptation**: Responsive layout adjusts cleanly across varying terminal font sizes and window dimensions.
* **Schema explorer and ERD**: Inspect tables, columns, primary and foreign keys, or generate ASCII Entity-Relationship diagrams.
* **In-app update notifications**: Checks GitHub releases on startup and prompts for in-place updates.
* **Isolated progress storage**: User progress saves to `~/.local/share/learn-duckdb/progress.duckdb` and remains safe across git updates.

---

## Quick reference: keyboard shortcuts

| Key | Action |
|:---|:---|
| <kbd>Ctrl+J</kbd> | Run all queries in editor |
| <kbd>Ctrl+G</kbd> | Run query under cursor (or selected text) |
| <kbd>Tab</kbd> | Accept autocomplete suggestion |
| <kbd>Ctrl+B</kbd> | Toggle sidebar visibility |
| <kbd>Alt+Left</kbd> / <kbd>Alt+Right</kbd> | Shrink or expand sidebar width |
| <kbd>Ctrl+N</kbd> / <kbd>Ctrl+P</kbd> | Next or previous task |
| <kbd>Ctrl+H</kbd> | Toggle task hint |
| <kbd>Ctrl+I</kbd> | Import CSV / Parquet file into Sandbox |
| <kbd>Ctrl+R</kbd> | Reset database (with confirmation prompt) |
| <kbd>Ctrl+L</kbd> | Clear editor text |
| <kbd>Ctrl+T</kbd> | Generate ASCII ERD diagram |
| <kbd>Ctrl+Q</kbd> | Quit application |

---

## Development and contributing

```bash
# Clone the repository
git clone https://github.com/haydermuhib/learn-duckdb.git
cd learn-duckdb

# Install dependencies and start development environment
uv sync
uv run app.py
```

<details>
<summary><b>Adding a new lecture</b></summary>

1. Create a new directory under `data/lectures/` (e.g. `07_advanced_analytics/`).
2. Add `seed.sql` with table definitions and seed records.
3. Add `solutions.sql` containing reference answers for each task.
4. Add `lecture.yaml` specifying task instructions, hints, and expected row counts.

</details>

---

## License

MIT License. Open source and free for personal and educational use.
