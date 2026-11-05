# Specification: learn-duckdb Interactive Web Application

## 1. Overview & Objective
Convert `learn-duckdb` from a downloadable Python Textual terminal tool into a client-side web application. The application delivers an interactive, self-paced curriculum for modern analytical SQL powered by `@duckdb/duckdb-wasm`. All queries, database operations, and test validations execute 100% inside the user's web browser with zero server infrastructure or database hosting costs.

---

## 2. Curriculum & Content Design

### 2.1 Scope & Localization
- **Language**: English only, Latin alphabet.
- **Names**: Short English and Punjabi names with no "Al-" prefixes (e.g., Bilal, Emma, Tariq, Simran, Ali, Maya, Navjot, Sunny, Bobby, Noor).
- **Core Database Entities**:
  - `store` (E-Commerce): `customers`, `products`, `orders`, `order_items`, `subscribers`
  - `company` (Corporate Org): `departments`, `employees`
  - `school` (Academic): `students`, `subjects`, `grades`

### 2.2 Modules (18 Core Modules + DuckDB Superpowers = 148+ Exercises)
1. **Basic SELECT** (5 exercises + DuckDB `EXCLUDE` & `REPLACE` = 7 exercises)
2. **Filtering with WHERE** (12 exercises)
3. **Sorting and Limiting** (6 exercises + DuckDB `ORDER BY ALL` = 7 exercises)
4. **Aggregate Functions** (6 exercises)
5. **Grouping with GROUP BY** (8 exercises + DuckDB `GROUP BY ALL` = 9 exercises)
6. **Joining Tables (JOIN)** (13 exercises)
7. **Subqueries and CTEs** (10 exercises + DuckDB `PIVOT` = 11 exercises)
8. **Text, Dates and CASE** (9 exercises)
9. **Changing Data (DML)** (6 exercises)
10. **Advanced Aggregation** (5 exercises)
11. **JOIN Pitfalls, EXISTS and UNION** (4 exercises)
12. **More Text and Dates** (6 exercises)
13. **Window Functions** (13 exercises + DuckDB `QUALIFY` = 14 exercises)
14. **Recursive Queries** (3 exercises)
15. **Changing Data: Level 2** (9 exercises)
16. **Case Study: School** (10 exercises)
17. **Practical Challenges** (4 exercises)
18. **Interview Challenges** (14 exercises)

---

## 3. Visual System & Design Tokens (`landing-page-design` & `figma-designer`)

### 3.1 Color System (DuckDB Signature Theme)
- `--bg-canvas`: `#FBF9F1` (Warm tactile paper)
- `--bg-surface`: `#FFFFFF` (Pure white card surfaces)
- `--ink-primary`: `#111827` (Deep slate / near black)
- `--ink-secondary`: `#4B5563` (Charcoal muted text)
- `--brand-duck-yellow`: `#FEC62E` (DuckDB signature yellow)
- `--brand-duck-hover`: `#E5B025`
- `--brand-duck-subtle`: `#FFF9E6`
- `--code-bg`: `#0F172A` (Obsidian editor surface)
- `--code-ink`: `#F8FAFC`
- `--status-pass-bg`: `#DCFCE7`
- `--status-pass-ink`: `#15803D`
- `--status-fail-bg`: `#FEE2E2`
- `--status-fail-ink`: `#B91C1C`
- `--border-dark`: `2px solid #111827`
- `--shadow-brutal`: `4px 4px 0px #111827`

### 3.2 Typography Hierarchy
- Display / Headings: `Space Grotesk`, sans-serif (Font weights: 700, 800)
- Body / Interface: `Space Grotesk` or `Inter`, sans-serif (Font weights: 400, 500, 600)
- Code / Queries / Data: `JetBrains Mono`, monospace (Font weights: 400, 500, 700)

### 3.3 Layout & Component Hierarchy
1. **Landing Page View**:
   - Navigation Header: Brand title, GitHub link, "Launch Studio" CTA.
   - Hero Section: Outcome-driven headline, sub-headline, primary CTA, instant interactive query sandbox.
   - Curriculum Syllabus: 18 interactive modules with badges, exercise counts, and direct jump links.
   - Proof Points: 100% in-browser Wasm execution, zero signup, zero tracking, sub-millisecond query speed.
   - FAQ: 6 essential questions.
   - Footer: Open-source MIT license, GitHub repository link.
2. **Practice Studio View**:
   - Top Bar: Lesson title, Module progress tracker (`[4/8]`), Switch to Landing, Reset DB button.
   - Left Drawer / Panel: Collapsible Curriculum syllabus & Live Schema tree explorer (Table columns, PKs, seed row count).
   - Main Center Panel:
     - Task card: Objective, concept explanation, example snippet.
     - CodeMirror SQL Editor: Syntax highlighting, auto-complete, keyboard shortcuts (`Cmd+Enter` or `Ctrl+Enter` to run).
     - Action Bar: "Run Query", "Check Answer", "Hint", "Show Solution".
   - Bottom Panel: Tabbed Query Results (Data grid with column types, row count, execution timer) and Test Feedback banner.

---

## 4. Technical Architecture

### 4.1 Client-Side Execution Engine
- `@duckdb/duckdb-wasm`: Bundled with Web Worker scripts (`duckdb-browser-eh.worker.js`, `duckdb-eh.wasm`).
- Vite configuration provides COOP (`same-origin`) and COEP (`credentialless` or `require-corp`) headers for SharedArrayBuffer multithreading.
- Table Seeding: Executed asynchronously upon switching databases.

### 4.2 State & Storage
- `localStorage` keys:
  - `learn_duckdb_completed_exercises`: Set of completed exercise IDs.
  - `learn_duckdb_current_exercise`: Last active exercise ID.
  - `learn_duckdb_drafts`: Map of `exerciseId -> userDraftSql`.
