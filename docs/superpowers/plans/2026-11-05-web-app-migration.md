# Web App Migration: learn-duckdb Interactive SQL Learning Platform

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `learn-duckdb` from a downloadable Python terminal app into a blazing-fast, client-side web application powered by Vite, React, TypeScript, and `@duckdb/duckdb-wasm`, featuring 148+ interactive analytical SQL exercises (143 foundational + 5 DuckDB superpowers), bilingual table/schema anglicization with short English & Punjabi names, and a DuckDB-themed brutalist UI adhering to `landing-page-design` and `figma-designer`.

**Architecture:** A static, client-side Single Page Application (SPA) where `@duckdb/duckdb-wasm` runs in a dedicated Web Worker on the user's browser. Databases (`store`, `company`, `school`) are seeded in memory into DuckDB on load. User queries are executed directly in DuckDB-Wasm and validated against expected result sets. The interface offers a high-conversion Landing view and an interactive 3-panel Practice Studio.

**Tech Stack:** 
- Runtime / Tools: Node 22, npm, Volta (pinned)
- Frontend: Vite 6, React 18 / 19, TypeScript 5, Tailwind CSS
- Database Engine: `@duckdb/duckdb-wasm`, Apache Arrow
- Code Editor: `@uiw/react-codemirror` with SQL syntax highlighting
- Icons & UI: Lucide React, Canvas Confetti
- Design Tokens: DuckDB warm cream (`#FBF9F1`), deep slate ink (`#111827`), Duck yellow (`#FEC62E`), brutalist 2px/3px borders, JetBrains Mono & Space Grotesk typography.

**Spec:** `docs/superpowers/specs/2026-11-05-web-app-spec.md`

## Global Constraints
- **Language**: English-only content, strictly Latin alphabet.
- **Naming Convention**: Clean, short English & Punjabi names (e.g., Bilal, Emma, Tariq, Simran, Ali, Maya, Navjot, Sunny, Bobby, Noor) without any "Al-" prefixes.
- **Isolation**: Node.js & npm runtime locked via Volta configuration in `package.json`.
- **Zero Backend**: 100% client-side execution via DuckDB-Wasm in Web Workers with LocalStorage persistence.
- **Design System**: Strict adherence to `/landing-page-design` (conversion hierarchy, single primary action, objection handling, proof signals) and `/figma-designer` (tokenized variables, explicit component states).

---

### Task 1: Environment & Project Scaffolding with Volta

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`

**Interfaces:**
- Produces: Working Vite build system with Volta pinning and Cross-Origin Isolation headers for DuckDB-Wasm worker support.

- [ ] **Step 1: Create `package.json` with Volta pinning and dependencies**
  Configure dependencies (`react`, `react-dom`, `@duckdb/duckdb-wasm`, `apache-arrow`, `@uiw/react-codemirror`, `@codemirror/lang-sql`, `lucide-react`, `canvas-confetti`) and `"volta": { "node": "22.22.2", "npm": "10.9.7" }`.
- [ ] **Step 2: Create Vite configuration with worker headers**
  Add COOP (`same-origin`) and COEP (`require-corp`) headers to `vite.config.ts` for DuckDB-Wasm SharedArrayBuffer support.
- [ ] **Step 3: Setup Tailwind & TypeScript configuration**
  Configure DuckDB theme tokens (colors, font families, brutalist shadows) in `tailwind.config.js`.
- [ ] **Step 4: Verify build scaffolding**
  Run `npm install` and `npm run build` to confirm zero errors.

---

### Task 2: Curriculum Extraction, Anglicization & DuckDB Superpowers

**Files:**
- Create: `src/types/curriculum.ts`
- Create: `src/data/databases.ts`
- Create: `src/data/exercises.ts`
- Create: `src/data/modules.ts`
- Test: `tests/curriculum.test.ts`

**Interfaces:**
- Produces: `curriculum` export containing:
  - 3 Databases (`store`, `company`, `school`) with English table names and short English/Punjabi Latin seed records.
  - 18 Core Modules with 143 migrated exercises translated to English.
  - 5 Brand-new DuckDB superpower exercises:
    1. `select-exclude` (`SELECT * EXCLUDE (email)`)
    2. `select-replace` (`SELECT * REPLACE (price * 1.1 AS price)`)
    3. `group-by-all` (`GROUP BY ALL`)
    4. `qualify-clause` (`QUALIFY ROW_NUMBER() OVER (...) <= 2`)
    5. `pivot-sales` (`PIVOT ... ON ... USING ...`)

- [ ] **Step 1: Define TypeScript schemas for curriculum data**
  Create types for `DatabaseDef`, `TableDef`, `ColumnDef`, `ModuleDef`, `ExerciseDef`, `ExerciseStep`.
- [ ] **Step 2: Extract & translate all 143 exercises to English**
  Map Spanish tables (`clientes`, `productos`, etc.) to English (`customers`, `products`, etc.) and replace Spanish names with short English & Punjabi names.
- [ ] **Step 3: Append DuckDB superpower exercises**
  Add the 5 DuckDB-specific feature exercises into `select`, `group`, and `window` modules.
- [ ] **Step 4: Verify data integrity test**
  Write a script/test verifying every exercise has valid solutions and refers to existing tables.

---

### Task 3: In-Browser DuckDB-Wasm Engine & Query Runner

**Files:**
- Create: `src/engine/duckdb.ts`
- Create: `src/engine/validator.ts`
- Test: `src/engine/engine.test.ts`

**Interfaces:**
- Produces:
  - `initDuckDB(): Promise<AsyncDuckDB>`
  - `loadDatabase(dbName: string): Promise<void>`
  - `runQuery(sql: string): Promise<{ columns: string[], rows: any[][], executionTimeMs: number }>`
  - `validateExercise(exerciseId: string, userSql: string): Promise<{ pass: boolean, feedback: string, userResult: any, expectedResult: any }>`

- [ ] **Step 1: Build DuckDB-Wasm initializer**
  Configure CDN bundles or local wasm workers with fallback to MVP/EH worker bundles.
- [ ] **Step 2: Build schema loader and seeder**
  Create DDL statements (`CREATE TABLE ...`) and bulk insert seed data into DuckDB in-memory tables.
- [ ] **Step 3: Build query executor**
  Convert Apache Arrow Table results into clean JavaScript arrays for UI consumption with timing benchmarks.
- [ ] **Step 4: Build result comparator & validator**
  Execute user query and canonical solution query, compare normalized column names and sorted row outputs to give instant PASS/FAIL feedback.

---

### Task 4: Practice Studio UI (3-Panel Workspace)

**Files:**
- Create: `src/components/studio/StudioLayout.tsx`
- Create: `src/components/studio/CurriculumSidebar.tsx`
- Create: `src/components/studio/SchemaExplorer.tsx`
- Create: `src/components/studio/SqlEditor.tsx`
- Create: `src/components/studio/ResultsTable.tsx`
- Create: `src/components/studio/TaskPanel.tsx`
- Create: `src/components/studio/HintModal.tsx`

**Interfaces:**
- Produces: Complete responsive SQL learning IDE with CodeMirror 6, live schema explorer, query shortcuts (`Ctrl+Enter` / `Cmd+Enter`), progressive hints, and table previews.

- [ ] **Step 1: Build TaskPanel & Instructions**
  Display module title, task instructions, example queries, and progressive hint reveal ("Hint 1", "Hint 2", "Show Solution").
- [ ] **Step 2: Build SqlEditor with CodeMirror**
  Integrate `@uiw/react-codemirror` with SQL keyword highlighting, line numbers, automatic bracket closing, and `Cmd+Enter` execution shortcut.
- [ ] **Step 3: Build SchemaExplorer drawer**
  Show active database tables, columns, data types, and primary keys with a one-click "Preview Table" shortcut.
- [ ] **Step 4: Build ResultsTable & Feedback banner**
  Render clean tabular results with pagination, row counts, query execution time, and crisp ✅ PASS / ❌ FAIL alerts.
- [ ] **Step 5: Integrate LocalStorage progress persistence**
  Save solved exercise IDs, drafts, and active database selection to `localStorage`.

---

### Task 5: High-Converting Landing Page (`landing-page-design`)

**Files:**
- Create: `src/components/landing/LandingPage.tsx`
- Create: `src/components/landing/HeroSection.tsx`
- Create: `src/components/landing/LiveSandboxTeaser.tsx`
- Create: `src/components/landing/CurriculumRoadmap.tsx`
- Create: `src/components/landing/ProofAndFeatures.tsx`
- Create: `src/components/landing/FaqSection.tsx`
- Create: `src/components/landing/Header.tsx`
- Create: `src/components/landing/Footer.tsx`

**Interfaces:**
- Produces: Conversion-optimized landing page following `/landing-page-design`:
  - Strong outcome-driven headline ("Master Modern Analytical SQL in Your Browser, Powered by DuckDB")
  - Single primary action ("Start Learning Free" → jump straight into Exercise 1)
  - Interactive "Try a Query" teaser running real DuckDB-Wasm on the landing page
  - 18-module visual syllabus map with live completion counters
  - Proof signals: 100% in-browser, zero login, zero server lag, 148+ exercises
  - FAQ addressing common learner questions (SQLite vs DuckDB, offline capabilities, export options).

- [ ] **Step 1: Build Hero with instant sandbox demo**
  Create brutalist hero with DuckDB yellow badges, CTA button, and interactive live query widget.
- [ ] **Step 2: Build 18-module interactive roadmap**
  Render cards for all 18 modules showing topic names, exercise counts, and "Start Module" actions.
- [ ] **Step 3: Build Features & FAQ sections**
  Detail DuckDB analytical powers (`QUALIFY`, `GROUP BY ALL`, columnar speed) and answer FAQs.
- [ ] **Step 4: Connect Landing Page navigation to Practice Studio**
  Clicking any module or "Start Learning" smoothly opens the Studio with that exercise loaded.

---

### Task 6: Testing, Polish & Build Verification

**Files:**
- Create: `src/App.tsx`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Modify: `README.md`
- Modify: `vercel.json`

**Interfaces:**
- Produces: Production-ready build deployed cleanly to Vercel/GitHub Pages with responsive mobile/desktop testing.

- [ ] **Step 1: Responsive design & mobile check**
  Verify collapsible drawers and responsive layout on mobile screens (< 768px).
- [ ] **Step 2: Full query verification pass**
  Run automated check executing canonical solutions for all 148 exercises in DuckDB-Wasm.
- [ ] **Step 3: Production bundle build**
  Execute `npm run build` to verify clean static output in `dist/`.
- [ ] **Step 4: Update README and documentation**
  Update `README.md` reflecting the new web app, features, local setup, and architecture.
- [ ] **Step 5: Git commit and tag**
  Commit the web app to `main`.
