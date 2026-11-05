# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-11-05

### 🚀 Major Architectural Milestone: Web App Migration
`learn-duckdb` has evolved from a downloadable terminal CLI into a high-performance, 100% client-side web application powered by **DuckDB-Wasm**.

#### Highlights
- **In-Browser DuckDB Engine**: Full analytical SQL engine running directly in your web browser via Web Workers and WebAssembly. Zero backend, zero server latency, and 100% private.
- **148+ Interactive Exercises**: 18 progressive modules covering everything from basic `SELECT` to multi-table `JOIN`s, recursive `WITH` CTEs, window functions, and real-world interview challenges.
- **DuckDB Superpowers**: Added dedicated exercises for modern DuckDB analytical SQL features:
  - `GROUP BY ALL`
  - `SELECT * EXCLUDE (column)`
  - `SELECT * REPLACE (expression AS column)`
  - `ORDER BY ALL`
  - `QUALIFY ROW_NUMBER() OVER (...) <= N`
- **Anglicized & Localized Schemas**: Standard English table schemas with short English and Punjabi names in Latin script with zero "Al-" prefixes (*Bilal, Emma, Tariq, Simran, Ali, Maya, Navjot, Sunny, Bobby, Noor*).
- **Dual-View User Interface**:
  - **Landing Page**: Built using conversion best practices with an interactive live query sandbox in the Hero, visual 18-module syllabus map, and FAQs.
  - **Practice Studio**: 3-panel workspace with CodeMirror 6 SQL editor, live schema tree explorer, instant table preview, tabbed output grid, and progressive hints.
- **Keyboard Shortcuts**:
  - `Ctrl+Enter` / `Cmd+Enter`: Run & check answer
  - `Alt+N` / `Alt+Right`: Instant next exercise navigation
  - `Alt+P`: Previous exercise
- **Unit Testing**: 15 Vitest unit tests verifying curriculum integrity, schema validations, BigInt serialization, and floating-point tolerances.
- **Legacy CLI Preservation**: The previous terminal Python TUI version is preserved on the [`cli`](https://github.com/haydermuhib/learn-duckdb/tree/cli) branch.

---

## [0.1.1] - 2026-09-21
- Added playground sidebar tree and custom SQL syntax theme.
- Enabled query draft auto-saving and task persistence.

## [0.1.0] - 2026-09-19
- Initial release of the interactive DuckDB terminal TUI application.
