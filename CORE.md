# CORE — learn-duckdb Project Reference

> This file is the source of truth for every user-facing behavior, internal
> mechanism, and design contract in learn-duckdb.
> **Read this first before modifying anything. AI assistants: start here.**

---

## 1. What the User Sees

### 1.1 Layout (Terminal UI — Textual)

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: "learn-duckdb 🦆 — Interactive SQL Learning"           │
├────────────┬────────────────────────────────────────────────────┤
│  SIDEBAR   │  TASK PANEL                                       │
│            │  Shows: title, instruction, progress (e.g. [3/8]) │
│ Lectures   │  Hint: hidden by default, toggled with Ctrl+H     │
│ ✅ / 🔵 / ⬜│────────────────────────────────────────────────────│
│            │  ┌── editor-tabs ─────────────────────────────┐   │
│ Playground │  │  ✏️ SQL Editor  │  📊 ERD                  │   │
│ 🟢 active  │  │                                            │   │
│ 💾 others  │  │  TextArea (SQL) or ERD diagram             │   │
│ ➕ New DB   │  └────────────────────────────────────────────┘   │
│╌╌╌╌╌╌╌╌╌╌╌│  Shortcut bar (always visible below editor-tabs)  │
│ Schema     │────────────────────────────────────────────────────│
│ Explorer   │  ┌── results-tabs ────────────────────────────┐   │
│ 📄 tables  │  │  📋 Results  │  📄 Table Preview           │   │
│  🔑 PK     │  │                                            │   │
│  📎 FK     │  │  DataTable / preview text                  │   │
│  ⭐ UNIQUE  │  │  Feedback bar: ✅ PASS / ❌ FAIL / ⚠️ ERROR│   │
│            │  └────────────────────────────────────────────┘   │
├────────────┴────────────────────────────────────────────────────┤
│ Footer: keybinding labels                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Two Modes

| Mode | How to enter | What it does |
|------|-------------|--------------|
| **Lecture mode** | Click any lecture in the sidebar | Loads seed SQL into an in-memory DB, shows tasks one-by-one, validates answers |
| **Playground mode** | Click "🏗️ Playground" or any DB under it | Opens a persistent `.duckdb` file in `data/sandbox/`, no validation, full access |

---

## 2. Keybindings

| Key | Action | Context |
|-----|--------|---------| 
| `Ctrl+J` | Run the full SQL in the editor | Both modes |
| `Ctrl+G` | Run only the selected text (falls back to full text if nothing selected) | Both modes |
| `Ctrl+H` | Toggle hint visibility | Lecture mode only (no-op in playground) |
| `Ctrl+N` | Next task | Lecture mode only |
| `Ctrl+B` | Previous task | Lecture mode only |
| `Ctrl+R` | **Reset** — context-aware (see §2.1) | Both modes |
| `Ctrl+L` | Clear the SQL editor only (does NOT touch DB or progress) | Both modes |
| `Ctrl+T` | Generate ERD → opens ERD tab (does NOT touch SQL editor) | Both modes |
| `Escape` | Dismiss the "New Database" input box if visible | Global |
| `Q` | Quit the app | Global |

**Shortcut bar** (shown below the editor-tabs, always visible):
```
^J Run │ ^G Selection │ ^H Hint │ ^R Reset │ ^B/N Prev/Next │ ^L Clear │ ^T ERD
```

### 2.1 Ctrl+R Reset Behavior

| Context | What it resets |
|---------|---------------|
| **Lecture mode** | Drops all in-memory tables, re-runs seed SQL, clears ALL progress for that lecture (back to task 1), clears editor and results |
| **Playground mode** | Drops all tables in the current sandbox `.duckdb` file. Does NOT delete the file itself. Clears results. |

---

## 3. Tabs System

The content area contains **two independent TabbedContent widgets**:

### 3.1 Editor Tabs (`#editor-tabs`)

| Tab ID | Label | Content |
|--------|-------|---------|
| `tab-editor` | ✏️ SQL Editor | `SQLEditor` widget (TextArea + shortcut bar) |
| `tab-erd` | 📊 ERD | `Static` widget (`#erd-display`) showing ASCII ERD |

- **`Ctrl+T`** populates `#erd-display` and switches `#editor-tabs` to `tab-erd`.
- SQL editor is **never modified** by ERD generation.
- User can switch back to SQL Editor tab manually at any time.

### 3.2 Results Tabs (`#results-tabs`)

| Tab ID | Label | Content |
|--------|-------|---------|
| `tab-results` | 📋 Results | `ResultsPanel` widget (DataTable + feedback bar) |
| `tab-preview` | 📄 Table Preview | `Static` widget (`#preview-display`) showing aligned ASCII table |

- **Clicking a 📄 table** in schema explorer populates `#preview-display` and switches `#results-tabs` to `tab-preview`.
- Running a query (`Ctrl+J` / `Ctrl+G`) populates `ResultsPanel` in `tab-results` — does NOT switch tabs automatically.
- Both tabs are independent — preview data persists while you run other queries.

### 3.3 Tab Switching

Tabs are switched programmatically via:
```python
self.query_one("#editor-tabs", TabbedContent).active = "tab-erd"
self.query_one("#results-tabs", TabbedContent).active = "tab-preview"
```

---

## 4. Validation System

### 4.1 How It Works

```
Student writes SQL  →  Engine runs student query  →  student_result
                    →  Engine runs solution query  →  solution_result
                    →  Validator compares both     →  ✅ PASS or ❌ FAIL
```

The student **never sees** `solutions.sql`. It's the hidden answer key.

### 4.2 What Gets Compared

1. **Columns**: Must match expected columns (case-insensitive).
   - If `task.expected_columns` is set in YAML → validates against that.
   - Otherwise → validates against whatever the solution returns.

2. **Row count**: If `task.expected_row_count` is set → exact match required.

3. **Row data**: Actual cell values are compared.
   - If `task.order_matters: false` → both result sets are sorted before comparing.
     This means `ORDER BY` doesn't matter for these tasks.
   - If `task.order_matters: true` → row order must match exactly.
     The student MUST use the correct `ORDER BY`.

4. **Float handling**: Floats are rounded to 4 decimal places before comparison
   to avoid precision differences (e.g. `3.1400001` vs `3.14`).

### 4.3 Why Different Logic Still Passes

The validator compares **output data, not SQL code**. These all produce the same result:

```sql
SELECT * FROM people WHERE age >= 20 AND age <= 28;
SELECT * FROM people WHERE age BETWEEN 20 AND 28;
SELECT * FROM people WHERE NOT (age < 20 OR age > 28);
```

All three → same rows → ✅ PASS.

### 4.4 Feedback Displayed to User

| Status | Display | CSS class | Color |
|--------|---------|-----------|-------|
| **PASS** | `✅ Correct! Great job! 🎉` | `feedback-pass` | Green (#9ece6a) |
| **FAIL** (columns wrong) | `❌ Column mismatch — check your SELECT list.` + details | `feedback-fail` | Red (#f7768e) |
| **FAIL** (row count wrong) | `❌ Expected N rows, got M.` + "Check your WHERE clause" | `feedback-fail` | Red |
| **FAIL** (data wrong) | `❌ Row data doesn't match.` + count of missing/extra rows | `feedback-fail` | Red |
| **FAIL** (order wrong) | `❌ Rows are correct but in wrong order. Check your ORDER BY clause.` | `feedback-fail` | Red |
| **ERROR** (SQL syntax error) | `⚠️ [DuckDB error message]` | `feedback-error` | Yellow (#e0af68) |
| **Idle** | `Run a query to see results here` | `feedback-idle` | Gray (#565f89) |

### 4.5 Sandbox Mode Feedback

In playground mode there is NO validation. The feedback bar shows:
- `✓ N rows returned │ X.Xms` for SELECT queries
- `✓ Statement executed │ X.Xms` for DDL/DML (CREATE, INSERT, etc.)
- `⚠️ [error]` for syntax errors

---

## 5. Progress Tracking

### 5.1 Storage

Progress is stored at:
```
~/.local/share/learn-duckdb/progress.duckdb
```

This is **outside the repo** so `git pull` never overwrites user progress.
Nothing here is added to `.gitignore` — it's not in the repo at all.

### 5.2 Schema

```sql
CREATE TABLE completed_tasks (
    lecture_id VARCHAR NOT NULL,
    task_id   INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT current_timestamp,
    PRIMARY KEY (lecture_id, task_id)
);
```

### 5.3 Sidebar Icons

| Icon | Meaning |
|------|---------|
| ⬜ | No tasks completed |
| 🔵 | Some tasks completed |
| ✅ | All tasks completed |

### 5.4 Auto-Advance

When a task passes, the student gets a notification:
- `🎉 Correct! Press Ctrl+N for next task.` (if more tasks remain)
- `🏆 Lecture Complete!` (if all tasks done)

The app does NOT auto-advance. The student presses `Ctrl+N` manually.

---

## 6. Schema Explorer (Sidebar)

Displays a DBCode-style tree for the current database's tables:

```
📄 table_name — description
 ├─ Columns
 │   ├─ 🔑 id  INTEGER  PK · NOT NULL
 │   ├─ 📎 dept_id  INTEGER  FK→departments(id)
 │   ├─ ⭐ email  VARCHAR  UNIQUE
 │   └─ ── name  VARCHAR  NOT NULL
 └─ Constraints
     ├─ 🔑 PRIMARY KEY (id)
     ├─ ⭐ UNIQUE (email)
     └─ 📎 FK dept_id → departments(id)
```

- Introspects `duckdb_constraints()` system table for PK/FK/UNIQUE.
- Introspects `INFORMATION_SCHEMA.COLUMNS` for nullability and defaults.
- Works for both lecture (in-memory) and sandbox (persistent) databases.

### 6.1 Click to Preview (Table Preview Tab)

Clicking a **📄 table name node** in the schema explorer:
1. Runs `SELECT * FROM "table_name" LIMIT 50` internally
2. Renders an aligned ASCII table in `#preview-display`
3. Switches `#results-tabs` to `tab-preview` automatically

The Results tab is NOT touched — student query results remain there.

### 6.2 ERD View (Ctrl+T → ERD Tab)

Pressing `Ctrl+T`:
1. Calls `generate_erd(schemas)` from `src/engine/database.py`
2. Renders ASCII box diagram into `#erd-display`
3. Switches `#editor-tabs` to `tab-erd` automatically
4. Shows a `notify()` toast: "N tables, M FK relationships"

The SQL editor is NOT touched — in-progress SQL is preserved.

ERD format:
```
  ┌─────────────────────────────────────┐
  │ orders                              │
  ├─────────────────────────────────────┤
  │ 🔑 id           INTEGER  PK NN      │
  │ 📎 customer_id  INTEGER  FK         │
  │    order_date   DATE     NN         │
  └─────────────────────────────────────┘

  ╌╌╌ Relationships ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌

  orders.customer_id  ──▶  customers(id)
```

---

## 7. Playground / Sandbox

### 7.1 Database Files

Stored at: `data/sandbox/*.duckdb`

A default `sandbox.duckdb` is created automatically on first use.

### 7.2 Multi-Database Support

- Sidebar shows all `.duckdb` files under `data/sandbox/`
- 🟢 = active database, 💾 = inactive
- Click to switch, click ➕ to create new
- Each database is fully independent and persistent

### 7.3 New Database Input

When the user clicks "➕ New Database...":
- An `Input` box appears at the top of the content area (`#new-db-input`)
- User types a name and presses Enter → creates `data/sandbox/{name}.duckdb`
- Pressing **Escape** or **clicking away** (blur) dismisses the input safely
- Empty names are rejected with a notification
- Duplicate clicks don't create multiple input boxes (deduped by checking for existing widget)

---

## 8. Lecture Content Structure

### 8.1 Directory Layout

```
data/lectures/
├── 01_select_basics/
│   ├── lecture.yaml      # Metadata + task definitions
│   ├── seed.sql          # CREATE TABLE + INSERT statements
│   └── solutions.sql     # Hidden answer key
├── 02_filtering_conditions/
│   ├── ...
├── 03_sorting_limits/
├── 04_real_world_challenges/
├── 05_joins_aggregations/
└── 06_window_functions/
```

Lectures are **auto-discovered** by scanning `data/lectures/` for folders
containing `lecture.yaml`. They are sorted by folder name.

### 8.2 lecture.yaml Format

```yaml
title: "Human-readable title"
description: "One-line description for the sidebar"
difficulty: beginner  # beginner | intermediate | advanced

tables:
  - name: table_name
    description: "What this table contains"

tasks:
  - id: 1                          # Unique within lecture
    title: "Short task title"
    instruction: |                  # Multi-line markdown-ish text
      Theory explanation goes here.
      Examples go here.
      YOUR TASK: what the student must do.
    hint: "Nudge without giving the answer"
    expected_columns: ["col1"]      # Optional: validate column names
    expected_row_count: 5           # Optional: validate exact row count
    order_matters: true             # false = sort before compare (default)
```

### 8.3 solutions.sql Format

```sql
-- TASK 1: Title (title is optional, only the number matters)
SELECT * FROM table_name;

-- TASK 2: Another Task
SELECT col FROM table_name WHERE col > 5;
```

The parser splits on `-- TASK N` comments. Each section becomes the solution
for task with `id: N`. The `: Title` part after the number is ignored.

### 8.4 seed.sql

Standard SQL. Runs once when a lecture is loaded. Creates tables and inserts
sample data into an **in-memory** DuckDB connection. This connection is
destroyed when switching lectures or resetting.

---

## 9. File Map

```
learn-duckdb/
├── app.py                      # Entry point: runs LearnDuckDBApp
├── pyproject.toml               # Dependencies (duckdb, textual, pyyaml, rich)
├── README.md                    # Public-facing docs (users/contributors)
├── CORE.md                      # ← This file (AI/dev internal reference)
│
├── src/
│   ├── content/
│   │   ├── models.py            # All data classes (Task, Lecture, QueryResult, TableInfo, etc.)
│   │   └── loader.py            # Discovers lectures, parses YAML + solutions.sql
│   │
│   ├── engine/
│   │   ├── database.py          # LectureDatabase + SandboxDatabase + generate_erd()
│   │   ├── validator.py         # Compares user output vs solution output
│   │   └── progress.py          # Tracks completed tasks in ~/.local/share/
│   │
│   └── ui/
│       ├── app.py               # Main App — keybindings, tab switching, mode logic
│       ├── sidebar.py           # Lecture tree + schema explorer + message classes
│       ├── editor.py            # SQL TextArea widget (selected_text, runnable_sql)
│       ├── task_panel.py        # Task instructions + hint display
│       ├── results.py           # DataTable + feedback bar (ResultsPanel)
│       └── styles.tcss          # Tokyo Night dark theme (slim scrollbars, tab styles)
│
├── data/
│   ├── lectures/                # Lecture content (auto-discovered)
│   │   ├── 01_select_basics/
│   │   ├── 02_filtering_conditions/
│   │   ├── 03_sorting_limits/
│   │   ├── 04_real_world_challenges/
│   │   ├── 05_joins_aggregations/
│   │   └── 06_window_functions/
│   └── sandbox/                 # Persistent playground .duckdb files (gitignored)
│       └── sandbox.duckdb       # Created automatically on first launch
│
└── learning.txt                 # Original lesson source (archive, not loaded by app)
```

---

## 10. Key Design Contracts

1. **Students never see solutions**. `solutions.sql` is only used by the
   validator engine. Students get `hint` (Ctrl+H) as their only help.

2. **Validation is output-based, not syntax-based**. Any SQL that produces
   the correct result set passes. 10 different approaches → all valid.

3. **Progress is git-safe**. Stored in `~/.local/share/learn-duckdb/`,
   never committed. Sandbox `.duckdb` files in `data/sandbox/` are
   gitignored.

4. **Lectures are self-contained**. Each lecture folder has everything it
   needs. Adding a new lecture = creating a new folder with 3 files.

5. **Lecture databases are in-memory**. Created fresh from seed.sql every
   time a lecture is loaded. Students cannot corrupt them permanently.

6. **Sandbox databases are persistent**. They survive app restarts. `Ctrl+R`
   in sandbox drops all tables but keeps the `.duckdb` file.

7. **Schema explorer auto-refreshes** after every query in sandbox mode
   (in case tables were created/dropped). In lecture mode it refreshes
   on lecture load only.

8. **Task instructions must teach before testing**. Every concept used in a
   task's solution must be explained in that task's `instruction` field or
   in a previous task. No surprise requirements.

9. **ERD never modifies the SQL editor**. `Ctrl+T` writes to `#erd-display`
   in the ERD tab only. The student's in-progress SQL is always preserved.

10. **Table preview never modifies the Results tab**. Clicking a table writes
    to `#preview-display` in the Table Preview tab only. Query results in the
    Results tab are always preserved.

---

## 11. Adding a New Lecture (Checklist)

1. Create `data/lectures/NN_slug/` (numbering determines sidebar order)
2. Write `lecture.yaml` with tables + tasks (follow §8.2 format)
3. Write `seed.sql` with `CREATE TABLE` + `INSERT` statements
4. Write `solutions.sql` with `-- TASK N` comments (follow §8.3 format)
5. Validate: `uv run python -c "from src.content.loader import LectureLoader; l=LectureLoader(); [print(m.title, m.task_count) for m in l.list_lectures()]"`
6. The app auto-discovers the new lecture — no code changes needed

---

## 12. Theme & Styling

- **Base**: Tokyo Night dark palette
- **Accent**: DuckDB brand yellow (#FEC62E)
- **Syntax**: Monokai theme for the SQL editor
- **CSS file**: `src/ui/styles.tcss`
- **Scrollbars**: 1×1 cell slim, thumb `#414868`, hover `#565f89`

| Element | Color |
|---------|-------|
| Background | #1a1b26 |
| Sidebar / header bg | #16161e |
| Panel bg (task, bars) | #1e2030 |
| Dividers / inactive | #292e42 |
| Headers/labels | #7aa2f7 (blue) |
| Task title | #bb9af7 (purple) |
| Hints | #e0af68 (amber) |
| Pass feedback | #9ece6a (green) |
| Fail feedback | #f7768e (red) |
| Accent (DuckDB) | #FEC62E (yellow) |
| Sandbox indicator | #73daca (teal) |
| Editor tab active | #FEC62E (yellow) |
| Results tab active | #7aa2f7 (blue) |
