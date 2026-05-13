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
| 02 | Filtering & Sorting | 8 | ⭐ Beginner |
| 03 | JOINs | 8 | ⭐⭐ Intermediate |

## Features

- **📝 Guided Lessons** — Step-by-step SQL tasks with instant validation
- **🏗️ Playground Mode** — Free-access sandbox with persistent `.duckdb` files
- **💡 Smart Hints** — DuckDB-specific tips (EXCLUDE, QUALIFY, read_csv_auto)
- **📊 Live Results** — See query output immediately in a beautiful table
- **📋 Schema Viewer** — Always know what tables and columns are available
- **💾 Progress Tracking** — Your progress persists across sessions
- **🎨 Premium TUI** — Tokyo Night dark theme, syntax highlighting, keyboard shortcuts

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+J` | Run query |
| `Ctrl+H` | Toggle hint |
| `Ctrl+N` | Next task |
| `Ctrl+P` | Previous task |
| `Ctrl+R` | Reset database |
| `Q` | Quit |

## How It Works

```
You write SQL → DuckDB executes it in-memory → We compare your output
to the expected answer → You get instant feedback with diffs
```

Lecture data is seeded from plain SQL files into an **in-memory** DuckDB instance. Your original data is never modified. The playground writes to a persistent `.duckdb` file so your experiments survive restarts.

## Contributing a Lecture

Adding a new lecture is simple:

1. Create a folder under `data/lectures/` (e.g., `04_aggregations/`)
2. Write three files:
   - `lecture.yaml` — Title, description, tasks with instructions
   - `seed.sql` — CREATE TABLE + INSERT statements
   - `solutions.sql` — One solution query per task
3. That's it! The app auto-discovers new lectures.

See `data/lectures/01_select_basics/` for a complete example.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Package Manager | [uv](https://github.com/astral-sh/uv) |
| Database Engine | [DuckDB](https://duckdb.org/) |
| UI Framework | [Textual](https://textual.textualize.io/) |
| Syntax Highlighting | tree-sitter |

## License

MIT — do whatever you want with it.
