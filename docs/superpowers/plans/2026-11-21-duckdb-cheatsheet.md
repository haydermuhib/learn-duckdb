# DuckDB Cheat Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Playground button in the homepage navbar with a comprehensive, interactive DuckDB Cheat Sheet page detailing all analytical clauses, functions, complex types, and parameter specifiers (e.g. `strftime` `%m`/`%M`/`%Y`, `printf` `%s`/`%d`/`%.2f`, regex, lambdas).

**Architecture:** Build a dedicated, highly searchable `#cheatsheet` view in `App.tsx` backed by a rich static catalog (`src/data/duckdbCheatSheetData.ts`), interactive category filtering, one-click snippet copying, parameter reference tables, and direct "Try in Playground" execution links.

**Tech Stack:** React, TypeScript, Tailwind CSS (Neo-Brutal tokens), Lucide React icons, Vitest.

---

## Global Constraints
- Strictly preserve existing Neo-Brutal design system (`border-3 border-ink`, `#111827`, `#FEC62E` duck yellow, `#FBF9F1` canvas, `shadow-brutal`).
- Mobile-responsive with touch-friendly tap targets and sticky header/category bar.
- Fully offline and zero-telemetry; fast client-side fuzzy search.
- Clean TypeScript types without `any`.
- All tests must pass, and Android Capacitor web assets must be synced.

---

### Task 1: Data Model & Cheat Sheet Catalog

**Files:**
- Create: `src/types/cheatsheet.ts`
- Create: `src/data/duckdbCheatSheetData.ts`
- Test: `tests/cheatsheet.test.ts`

**Interfaces:**
- Produces: `CheatSheetItem`, `CheatSheetCategory`, `FormatSpecifier`, `DUCKDB_CHEAT_SHEET_CATEGORIES`, `DUCKDB_CHEAT_SHEET_ITEMS`, `STRFTIME_SPECIFIERS`, `PRINTF_SPECIFIERS`

- [ ] **Step 1: Write test suite for cheat sheet data catalog**
- [ ] **Step 2: Create TypeScript interfaces in `src/types/cheatsheet.ts`**
- [ ] **Step 3: Author comprehensive catalog in `src/data/duckdbCheatSheetData.ts` with all 7 categories and format specifiers**
- [ ] **Step 4: Run tests to verify all 70+ cheat sheet items and specifiers pass validation**

---

### Task 2: Cheat Sheet Page Component

**Files:**
- Create: `src/components/cheatsheet/CheatSheetPage.tsx`
- Test: `tests/cheatsheet.test.ts`

**Interfaces:**
- Produces: `CheatSheetPage` component accepting `onBackToHome: () => void`, `onOpenPlayground: (initialQuery?: string) => void`, `onStartLearning: () => void`

- [ ] **Step 1: Implement Neo-Brutal Header, search omnibar, and category tabs**
- [ ] **Step 2: Implement toggleable Format Specifier reference cards (`strftime` % codes, `printf` % codes)**
- [ ] **Step 3: Implement item cards with signature, parameter breakdown, SQL snippet, Copy button, and Run in Playground button**
- [ ] **Step 4: Test component rendering and search behavior**

---

### Task 3: Navbar Integration & Routing in LandingPage and App

**Files:**
- Modify: `src/components/landing/LandingPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/playground/PlaygroundLayout.tsx` (to accept optional initialQuery)

- [ ] **Step 1: In `LandingPage.tsx`, replace Playground button in navbar with DuckDB Cheat Sheet button**
- [ ] **Step 2: In `App.tsx`, add `#cheatsheet` hash route handling, `view === 'cheatsheet'` rendering, and query forwarding to playground**
- [ ] **Step 3: Update `PlaygroundLayout.tsx` to prefill editor query when provided**
- [ ] **Step 4: Run unit tests and production build**

---

### Task 4: Verification, Android Sync & Visual Validation

**Files:**
- Modify: `tests/appSanity.test.ts` (if needed)

- [ ] **Step 1: Run full test suite (`npm test`)**
- [ ] **Step 2: Run production build (`npm run build`)**
- [ ] **Step 3: Sync Android Capacitor assets (`npx cap sync android`)**
- [ ] **Step 4: Capture headless browser screenshots of desktop and mobile Cheat Sheet view**
- [ ] **Step 5: Git commit and push**
