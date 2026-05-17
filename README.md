# 🦆 learn-duckdb

**Interactive SQL learning in your terminal — powered by DuckDB.**

A FOSS, local-first SQL learning platform. No browser, no server, no database setup. Clone, run, learn.

![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)
![License MIT](https://img.shields.io/badge/license-MIT-green.svg)
![DuckDB](https://img.shields.io/badge/powered%20by-DuckDB-FEC62E.svg)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USER/learn-duckdb.git
cd learn-duckdb

# Run it (uv installs everything automatically)
uv run app.py
```

That's it. No `pip install`, no virtual environments to manage, no database to configure.

## What You'll Learn

| Lecture | Topic | Tasks | Difficulty |
|---------|-------|-------|------------|
| 01 | SELECT Basics | 8 | ⭐ Beginner |
| 02 | Filtering & Conditions | 8 | ⭐ Beginner |
| 03 | Sorting, Limits & NULLs | 8 | ⭐ Beginner |
| 04 | Real-World Challenges | 8 | ⭐⭐ Intermediate |
| 05 | JOINs & Aggregations | 8 | ⭐⭐ Intermediate |
| 06 | Window Functions | 8 | ⭐⭐⭐ Advanced |

48 tasks total, all DuckDB-native SQL.

## Features

- **📝 Guided Lessons** — Step-by-step SQL tasks with instant validation
- **🏗️ Playground Mode** — Free-access sandbox with persistent `.duckdb` files
- **💡 Smart Hints** — DuckDB-specific tips (EXCLUDE, QUALIFY, ILIKE, BOOLEAN)
- **📊 Live Results** — See query output immediately in a data table
- **📋 Schema Viewer** — Always know what tables and columns are available (with PK/FK/UNIQUE badges)
- **📄 Table Preview** — Click any table in the schema explorer to preview its rows instantly
- **📊 ERD Viewer** — Visualize the full entity-relationship diagram for any database
- **💾 Progress Tracking** — Your progress persists across sessions (stored outside the repo)
- **🎨 Premium TUI** — Tokyo Night dark theme, SQL syntax highlighting, slim scrollbars

## Layout

```
┌──────────────────────────────────────────────────────┐
│  Header: learn-duckdb 🦆                             │
├────────────┬─────────────────────────────────────────┤
│  Sidebar   │  Task Panel (title, instruction, hint)  │
│            ├──────────────────┬──────────────────────┤
│  Lectures  │  ✏️ SQL Editor   │  📊 ERD              │
│  Playground├──────────────────┴──────────────────────┤
│  Schema    │  📋 Results      │  📄 Table Preview    │
│  Explorer  │                                         │
├────────────┴─────────────────────────────────────────┤
│  Footer: keybinding hints                            │
└──────────────────────────────────────────────────────┘
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+J` | Run full query |
| `Ctrl+G` | Run selected text only |
| `Ctrl+H` | Toggle hint |
| `Ctrl+N` | Next task |
| `Ctrl+B` | Previous task |
| `Ctrl+R` | Reset (lecture: re-seeds DB + clears progress / playground: drops all tables) |
| `Ctrl+L` | Clear SQL editor only |
| `Ctrl+T` | Generate ERD diagram (opens ERD tab) |
| `Q` | Quit |

**Tips:**
- Click any **📄 table** in the schema explorer → instantly previews its data in the Table Preview tab
- `Ctrl+T` generates the ERD in its own tab — your SQL editor is never touched
- Results and previews are in separate tabs — switch freely without losing anything

## How It Works

```
You write SQL → DuckDB executes it → We compare your output
to the expected answer → Instant feedback (PASS / FAIL / ERROR)
```

Validation is **output-based, not syntax-based**: any SQL that produces the correct result set passes. Ten different approaches to the same answer — all valid.

Lecture data is seeded into an **in-memory** DuckDB instance. Your original data is never modified. The playground writes to persistent `.duckdb` files so your experiments survive restarts.

## Progress

Progress is stored at `~/.local/share/learn-duckdb/progress.duckdb` — outside the repo, never committed. `git pull` never overwrites your progress.

## Contributing a Lecture

Adding a new lecture is simple:

1. Create a folder under `data/lectures/` (e.g., `07_json_handling/`)
2. Write three files:
   - `lecture.yaml` — Title, description, tasks with instructions and hints
   - `seed.sql` — `CREATE TABLE` + `INSERT` statements
   - `solutions.sql` — One solution query per task (`-- TASK N: Title`)
3. That's it. The app auto-discovers new lectures on startup.

See `data/lectures/01_select_basics/` for a complete example.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Package Manager | [uv](https://github.com/astral-sh/uv) |
| Database Engine | [DuckDB](https://duckdb.org/) |
| UI Framework | [Textual](https://textual.textualize.io/) |
| Syntax Highlighting | tree-sitter (via Textual) |

## License

MIT — do whatever you want with it.
