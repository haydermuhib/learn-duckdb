# Curriculum & Exercise Invariants (learn-duckdb)

When creating, updating, or reviewing exercises (`ExerciseDef`) or seed datasets (`src/data/databases.ts`), all agents and contributors MUST adhere to the following strict standards:

---

## 1. Automated Execution & Verification Gate
- Every exercise's canonical solution MUST execute without errors on the real DuckDB-Wasm engine.
- Always run the full verification test:
  ```bash
  npm test
  ```
- The verification suite (`tests/verify_all_exercises.test.ts` and `tests/database.test.ts`) must report **0 errors** and **0 unintended empty results**.
- Run `npm run build` (`tsc && vite build`) to ensure type checking and asset bundling pass.

---

## 2. Result Data Quality & Meaningful Testing
- **No Empty Tables (0 Rows):** Unless specifically teaching an anti-pattern or empty set, queries must return real, populated rows.
- **No Dead / Unexercised Branches:** If an exercise teaches `CASE WHEN`, every conditional branch must be represented in the result table (e.g., do not set a threshold like `price >= 3000` when the maximum price in the catalog is `1299.99`).
- **No All-Zero / Redundant Columns:** If teaching conditional aggregation (e.g., `SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END)`), matching rows MUST exist in the database (e.g., `'delivered'`, not `'completed'`).
- **Outer Join Proof:** When demonstrating `LEFT JOIN`, `FULL OUTER JOIN`, `ANTI JOIN`, or `COALESCE(..., 0)`:
  - There MUST be at least one unmatched row in the right table (e.g. an unsold product with 0 sales in `order_items`, an unassigned employee with `department_id IS NULL`, an empty department like `HR`, or a student with no grades).
- **Date Realism:** The `orders` dataset spans **May and June 2024**. All date filters, ranges, and recursive calendars must target this timeframe (e.g. `2024-05-01` to `2024-05-31`), never future or phantom years like 2025 where zero orders exist.

---

## 3. Non-Interference & Regression Guardrails
- The databases (`store`, `company`, `school`) are shared across all 149+ exercises.
- **Never modify seed data without testing the entire curriculum.**
- If you alter a row (e.g. product price, stock, or order item quantity), verify that rankings, tops (`LIMIT 1`), monthly revenues, and grouping counts in existing exercises remain deterministic and valid.

---

## 4. Name Conventions (Strict)
- Seed entities (customers, employees, students) must use natural, short, single-word first names in Latin script.
- **Accepted Cultural Mix:** English, Punjabi, and Muslim names:
  - Examples: `Ali`, `Bilal`, `Maya`, `Navjot`, `Sunny`, `Harun`, `Simran`, `Jack`, `Emma`, `Bobby`, `Chloe`, `Usman`, `Amina`, `Layla`, `Rania`, `Hiba`, `Anas`, `Noor`.
- **Forbidden:** No Spanish or Latin American legacy names (`Pérez`, `Hernández`, `Guadalajara`, etc.). No prefixes like `Al-` or `El-`.

---

## 5. DuckDB Superpower Badging & Engine Explanations
In the exercise metadata and explanation area (`concept` and `title`):
- **DuckDB-Specific Features:**
  - Set `"isDuckDbFeature": true`.
  - Include `"DuckDB Superpower:"` in the exercise `title`.
  - In `concept`, explain why it is a DuckDB superpower and compare it with PostgreSQL/standard SQL:
    - `GROUP BY ALL` & `ORDER BY ALL`
    - `SELECT * EXCLUDE (...)` & `SELECT * REPLACE (...)`
    - First-class native `ANTI JOIN` and `SEMI JOIN`
    - Windowing filter `QUALIFY`
    - Dynamic column selection `COLUMNS(...)`
- **Standard SQL / PostgreSQL Features:**
  - Set `"isDuckDbFeature": false` (or omit).
  - Clarify in the concept that the syntax is standard SQL compatible with PostgreSQL and MySQL.

---

## 6. Schema & Type Rigor
- **Strict Column Types in `databases.ts`:**
  - Dates must always be typed `DATE` (`signup_date`, `order_date`, `hire_date`, `birth_date`). This avoids DuckDB `strftime(STRING_LITERAL, VARCHAR)` binder ambiguities.
  - Primary keys must use `INTEGER PRIMARY KEY`. The database loader attaches `DEFAULT nextval('seq_<table>_id')` to support `INSERT` statements with or without an explicit `id`.
- **Exact Column Names:**
  - Use `role` (not `job_title`).
  - Use `status = 'delivered'` (not `'completed'`).
  - Use `score` (not `grade`).
  - Use `class_group` (not `section`).
- In `GROUP BY` queries, DuckDB strictly requires all non-aggregated SELECT columns to be listed in `GROUP BY` (e.g., `GROUP BY c.id, c.name, c.signup_date`).

---

## 7. Clean English Language & Idiomatic Aliases
- Never use Spanish or legacy placeholder aliases (`jefe`, `porcentaje`, `promedio_ponderado`).
- All column aliases in tasks, solutions, and hints must be clean, idiomatic English (`manager`, `pass_pct`, `weighted_avg`, `units_sold`, `inventory_value`).
- When a task prompts the student with `"(as <column_name>)"`, the canonical solution and hint must use the exact same column alias.

---

## 8. Anti-Bypass Guardrails & Keyword Requirements (`requires`)
- **Anti-Cheat Validation:**
  - The validator automatically strips SQL comments (`-- line comment` and `/* block comment */`) as well as string literals (`'...'`) before inspecting `step.requires`.
  - Hiding required keywords or operators in comments (e.g. `--::` or `/* CAST */`) or inside string literals will not satisfy validation.
- **Multi-Keyword Enforcement:**
  - When an exercise teaches multiple syntaxes in a single challenge (e.g. `requires: ["CAST", "::"]` or `requires: ["DATE_TRUNC", "EXTRACT"]`), the validator enforces that **all** elements are present in active executable SQL.
  - The validator reports clear, unambiguous error messages using `"and"` (e.g. `"Your query must include each of the following required elements: CAST and ::"` or `"Your query must include the required syntax: ::"` when one is missing), never ambiguous "or" phrasing.
  - Authors designing multi-clause exercises must ensure the canonical solution and hints explicitly demonstrate both requirements and that tasks clearly explain the purpose of each column.

---

## 9. Engine Portability & Group Alignment Standard
- **Pedagogical Alignment:**
  - Every exercise must teach SQL capabilities that belong to the same portability group. Do not intermix divergent portability requirements into a single exercise unless the explicit goal of the exercise is comparing dialects (e.g. Exercise 72 `cast`, which compares standard ANSI `CAST` with the DuckDB/PostgreSQL `::` shorthand).
- **Classification Categories:**
  - **All Engines (Universal SQL):** Standard ANSI SQL syntax (`SELECT`, `WHERE`, `ORDER BY`, `GROUP BY`, `COUNT`, `SUM`, `INNER JOIN`, `LEFT JOIN`, `CASE`, `UPPER`, `LOWER`, CTEs, window functions). Supported natively across DuckDB, PostgreSQL, MySQL, and SQLite. Tagged with the green `[✓ All Engines]` badge.
  - **DuckDB Superpower / Exclusive:** Dialect features exclusive to DuckDB (`SELECT * EXCLUDE`, `SELECT * REPLACE`, `QUALIFY`, `GROUP BY ALL`, `ORDER BY ALL`, `COLUMNS(*)`, list comprehension, JSON arrow operators). Set `"isDuckDbFeature": true`. Tagged with the amber `[✨ DuckDB Only]` badge.
  - **Postgres & DuckDB:** Syntax native to PostgreSQL and DuckDB (e.g. `::` typecast shorthand, `ILIKE`, `FILTER (WHERE ...)`, `DISTINCT ON`). Tagged with the sky-blue `[Postgres & DuckDB]` badge.
  - **Multi-Engine / Dialect Nuances:** Features supported across specific subsets of engines (e.g. `FULL OUTER JOIN`, `||` string concatenation). Explicitly define `"compatibility"` with details for `postgres`, `mysql`, and `sqlite`.
- **At-a-Glance 4-Engine Matrix:**
  - Every exercise renders the 4-engine compatibility strip (`DuckDB`, `Postgres`, `MySQL`, `SQLite`) with clear status chips (`✓ Native`, `✗ No`, `⚠ Alt`) so learners immediately understand cross-engine portability without needing to click.

---

## 10. Exercise Versioning & Update Governance
- **Version Increment on Revision:**
  - Whenever an exercise's task prompt, canonical solution, dataset bindings, or `requires` validation rules are updated, ALWAYS increment its `"version"` number (e.g. `"version": 2`).
  - This automatically surfaces the warm amber `[🔄 Updated]` pill badge in both the Curriculum Syllabus sidebar and the Studio Task Card for learners who completed an older version.
- **No Raw Version Numbers in UI:**
  - Never expose raw version numbers (like `v1`, `v2`, or `v1.2`) to the end-user. Rely strictly on the clean amber `[🔄 Updated]` pill.
  - Solving and passing the revised exercise automatically updates the user's completed version in `localStorage` and restores the green mastered checkmark.
- **Backward-Compatible Export/Import:**
  - Progress export/import stores `completedVersions: Record<string, number>` while maintaining 100% backward compatibility with legacy progress JSON backups.

---

## 11. Studio Layout & Visual Hierarchy Invariants
- **Header Supremacy (`z-40`):**
  - The Studio Top Navigation Bar (`<header>`) is the root navigation frame and MUST maintain `z-40` (or higher) and `sticky top-0`.
- **Drawer Mounting (`top-14` / `z-35`):**
  - The Curriculum Syllabus Drawer (`CurriculumSidebar`) must mount cleanly beneath the header (`top-[calc(3.5rem+env(safe-area-inset-top,0px))]`, `h-[calc(100vh-3.5rem-env(safe-area-inset-top,0px))]`, `z-35`).
  - The drawer's right border (`border-r-3 border-ink`) must NEVER pierce, overlap, or extend above the top navigation bar.
- **Neo-Brutal Styling Tokens:**
  - Standard borders use `border-2 border-ink` or `border-3 border-ink` with `#111827` ink.
  - Shadows use brutal elevation tokens (`shadow-brutal-xs`, `shadow-brutal-sm`, `shadow-brutal`).
