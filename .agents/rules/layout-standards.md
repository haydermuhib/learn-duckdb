<!--
trigger: always_on
-->

# Studio & Workspace Layout Invariants

These layout rules are non-negotiable standards for `learn-duckdb`. Agents and contributors must preserve these settings and invariants:

## 1. Decoupled Column Heights (Never use `align-items: stretch`)
- The main workspace layout row in `StudioLayout.tsx` and `PlaygroundLayout.tsx` MUST use `items-start`:
  `<div className="flex flex-col lg:flex-row gap-4 items-start">`
- NEVER remove `items-start`. Default flexbox stretching couples the column heights and causes the code editor to balloon vertically when the schema expands.

## 2. Fixed, Dedicated Code Editor Sizing
- `SqlEditor.tsx` must maintain a dedicated, comfortable height:
  `className="... h-[460px] lg:h-[500px] shrink-0"` with `min-h-[300px]` on the CodeMirror canvas.
- NEVER add `flex-1` to the outer `SqlEditor` container. The code editor must never expand or shrink based on adjacent column contents.

## 3. Uncapped Database Schema Explorer Depth
- `SchemaExplorer.tsx` and `PlaygroundSchemaExplorer.tsx` table lists must NOT have artificial `max-h` or inner scroll pinching.
- The schema explorer must expand naturally to its full depth (`p-2 space-y-1.5` / `p-2 space-y-2`), allowing users to expand as many tables and columns as they want without restriction.

## 4. Uncapped Results Explorer & Scrollable Views
- Table previews in `StudioLayout.tsx` and `PlaygroundLayout.tsx` must NOT truncate results with `LIMIT 5` or `LIMIT 10`. They must execute `SELECT * FROM ${tableName};` to load all available rows.
- `ResultsTable.tsx` content viewport must remain spacious (`max-h-[600px]` with `min-h-[140px]`, `overflow-x-auto overflow-y-auto`, and `min-w-full`).
- Table previews must auto-scroll the Results Table into view using `scrollIntoView({ behavior: 'smooth', block: 'nearest' })`.
- Cross-browser scrollbars must be preserved via `* { scrollbar-width: thin; scrollbar-color: #D1D5DB #F3EFE6; }` in `src/index.css`.

## 5. Scrollable Syllabus Footer Placement
- In `CurriculumSidebar.tsx`, the footer containing the progress summary, Backup, Import, and Reset buttons must ALWAYS remain embedded at the natural bottom of the scrollable exercise list (`mt-4` inside the scroll container).
- It must NEVER be fixed or floating over the exercise list. It belongs at the natural end of the scroll.

## 6. Absolutely Centered Navigation Mode Titles
- The center title across all main headers (`CheatSheetPage.tsx`, `PlaygroundLayout.tsx`, `StudioLayout.tsx`) must be absolutely positioned:
  `<div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2 pointer-events-none">`
- This ensures zero horizontal or vertical shifting when the user navigates between Studio, Playground, and Cheat Sheet modes.
- Header action buttons must have uniform heights (`h-8` / `h-9` on mobile and desktop) for visual rhythm.

## 7. Accurate Brand Icon Pairing in Parity Badges
- When rendering badges that combine multiple ecosystem technologies (e.g., `DuckDB & Snowflake Standard`, `BigQuery & Snowflake 1:1`), NEVER prepend an icon to the entire string.
- Always use `renderParityBadge()` from `BrandIcons.tsx` to ensure each logo is paired directly beside its corresponding technology name.
- Use official brand vector icons (`DuckDBIcon`, `SnowflakeIcon`, `PythonIcon`, `PostgresIcon`, `BigQueryIcon`, `SQLiteIcon`, `PrestoIcon`).

## 8. Uniform Drawer & Catalog Tab Button Heights on Mobile
- Reference tab selectors (such as the 6 catalog tabs in `CheatSheetPage.tsx`) must use fixed uniform heights on mobile (`h-9` or `h-10` with `flex items-center justify-between sm:justify-center`).
- Labels must not wrap onto jagged extra lines; use concise responsive labels (`strftime`, `printf`, `Regex`, `Types`, `CLI`, `Extensions`) with count indicators and chevrons on the right.

## 9. Non-Intrusive Specifier Card Horizontal Scrolling
- Reference cards in catalog drawers (`strftime`, `printf`, `regex`, `types`, `cli`, `extensions`) must allow horizontal scrolling for lengthy text descriptions using `.scrollbar-none` and `overflow-x-auto whitespace-nowrap` to prevent card height distortions or truncation dots (`...`).
