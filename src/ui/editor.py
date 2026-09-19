"""SQL editor widget wrapping Textual's TextArea with SQL syntax highlighting and IntelliSense."""

from __future__ import annotations

import re
from textual.app import ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical
from textual.message import Message
from textual.widgets import Static, TextArea

# Standard SQL Keywords & Functions for IntelliSense
DEFAULT_SQL_KEYWORDS = [
    # Core Queries
    "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
    "JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "INNER JOIN", "CROSS JOIN",
    "ON", "AS", "WITH", "DISTINCT", "UNION", "UNION ALL", "INTERSECT", "EXCEPT",
    # DML & DDL
    "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE", "DROP TABLE",
    "ALTER TABLE", "PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "NOT NULL", "DEFAULT",
    # Logical & Conditions
    "AND", "OR", "NOT", "IN", "NOT IN", "BETWEEN", "LIKE", "ILIKE", "IS NULL", "IS NOT NULL",
    "CASE", "WHEN", "THEN", "ELSE", "END", "EXISTS",
    # Aggregates & Math
    "COUNT(*)", "COUNT()", "SUM()", "AVG()", "MIN()", "MAX()", "ROUND()", "ABS()", "COALESCE()",
    "NULLIF()", "CAST()",
    # Window Functions
    "ROW_NUMBER() OVER ()", "RANK() OVER ()", "DENSE_RANK() OVER ()", "LAG() OVER ()",
    "LEAD() OVER ()", "NTILE() OVER ()", "PARTITION BY",
    # DuckDB Specific
    "read_csv_auto('')", "read_parquet('')", "range()", "generate_series()", "DESCRIBE",
    "SHOW TABLES", "EXPLAIN",
]


class QuerySubmitted(Message):
    """Posted when the user submits a query."""

    def __init__(self, sql: str) -> None:
        self.sql = sql
        super().__init__()


class SQLEditor(Vertical):
    """SQL code editor with syntax highlighting, IntelliSense, and execution controls."""

    def __init__(self, **kwargs) -> None:
        super().__init__(id="editor-section", **kwargs)
        self._schema_tables: list[str] = []
        self._schema_columns: list[str] = []
        self._current_suggestions: list[str] = []
        self._selected_suggestion_idx: int = 0

    def compose(self) -> ComposeResult:
        with Horizontal(id="editor-header-bar"):
            yield Static(" 💻 SQL Editor", id="editor-label")
            yield Static("Press Tab to autocomplete", id="editor-status-indicator")

        yield TextArea.code_editor(
            "",
            language="sql",
            id="sql-editor",
            theme="monokai",
        )

        with Horizontal(id="run-bar"):
            yield Static(
                " ^J Run All │ ^G Run Selection/Stmt │ ^H Hint │ ^R Reset │ ^B Sidebar │ ^N/^P Tasks │ ^L Clear",
                id="run-hint",
            )
            yield Static("", id="intellisense-bar")

    @property
    def text_area(self) -> TextArea:
        return self.query_one("#sql-editor", TextArea)

    @property
    def current_sql(self) -> str:
        return self.text_area.text

    @property
    def selected_sql(self) -> str:
        """Return selected text, or empty string if nothing is selected."""
        return self.text_area.selected_text

    @property
    def current_statement_or_selection(self) -> str:
        """Return selected text if present; otherwise, statement under cursor."""
        sel = self.selected_sql.strip()
        if sel:
            return sel

        sql = self.current_sql
        if not sql.strip():
            return ""

        cursor_row, cursor_col = self.text_area.cursor_location
        lines = sql.split("\n")

        char_idx = 0
        for i, line in enumerate(lines):
            if i < cursor_row:
                char_idx += len(line) + 1
            elif i == cursor_row:
                char_idx += min(cursor_col, len(line))
                break

        # Locate surrounding semicolons
        prev_semi = sql.rfind(";", 0, char_idx)
        start_pos = 0 if prev_semi == -1 else prev_semi + 1

        next_semi = sql.find(";", char_idx)
        end_pos = len(sql) if next_semi == -1 else next_semi

        stmt = sql[start_pos:end_pos].strip()
        return stmt if stmt else sql.strip()

    @property
    def runnable_sql(self) -> str:
        """Alias for current_statement_or_selection."""
        return self.current_statement_or_selection

    def set_schema_tokens(self, tables: list[str], columns: list[str]) -> None:
        """Update schema tokens for dynamic IntelliSense autocomplete."""
        self._schema_tables = tables
        self._schema_columns = columns

    def set_text(self, text: str) -> None:
        """Set the editor content."""
        self.text_area.load_text(text)
        self._clear_suggestions()

    def clear(self) -> None:
        """Clear the editor."""
        self.text_area.load_text("")
        self._clear_suggestions()

    def focus_editor(self) -> None:
        """Focus the TextArea for typing."""
        self.text_area.focus()

    def on_text_area_changed(self, event: TextArea.Changed) -> None:
        """Analyze current token and update IntelliSense suggestions."""
        self._update_suggestions()

    def _get_current_word_info(self) -> tuple[str, tuple[int, int], tuple[int, int]]:
        """Return (word_prefix, start_location, end_location)."""
        cursor_row, cursor_col = self.text_area.cursor_location
        lines = self.text_area.text.split("\n")
        if cursor_row >= len(lines):
            return "", (cursor_row, cursor_col), (cursor_row, cursor_col)

        line = lines[cursor_row]
        col = min(cursor_col, len(line))
        prefix_line = line[:col]

        # Match identifier / keyword prefix
        match = re.search(r"([a-zA-Z_][a-zA-Z0-9_*]*)$", prefix_line)
        if match:
            word = match.group(1)
            start_col = match.start(1)
            return word, (cursor_row, start_col), (cursor_row, col)

        return "", (cursor_row, col), (cursor_row, col)

    def _update_suggestions(self) -> None:
        """Filter matching suggestions for the token under cursor."""
        word, start_loc, end_loc = self._get_current_word_info()
        hint_bar = self.query_one("#intellisense-bar", Static)

        if not word or len(word) < 1:
            self._clear_suggestions()
            return

        all_tokens = (
            self._schema_tables
            + self._schema_columns
            + DEFAULT_SQL_KEYWORDS
        )

        # Case-insensitive prefix match
        word_lower = word.lower()
        matches = []
        for token in all_tokens:
            if token.lower().startswith(word_lower) and token.lower() != word_lower:
                if token not in matches:
                    matches.append(token)

        self._current_suggestions = matches[:5]
        self._selected_suggestion_idx = 0

        if self._current_suggestions:
            suggs = []
            for i, s in enumerate(self._current_suggestions):
                if i == 0:
                    suggs.append(f"[bold #FEC62E]⇥ {s}[/]")
                else:
                    suggs.append(f"[dim]{s}[/]")
            hint_bar.update(f"💡 {'  '.join(suggs)}")
        else:
            hint_bar.update("")

    def _clear_suggestions(self) -> None:
        """Clear IntelliSense state."""
        self._current_suggestions = []
        self._selected_suggestion_idx = 0
        try:
            self.query_one("#intellisense-bar", Static).update("")
        except Exception:
            pass

    def apply_current_completion(self) -> bool:
        """Insert the top IntelliSense completion if available."""
        if not self._current_suggestions:
            return False

        completion = self._current_suggestions[self._selected_suggestion_idx]
        word, start_loc, end_loc = self._get_current_word_info()

        if not word:
            return False

        # Replace the prefix with the full completion
        self.text_area.replace(completion, start_loc, end_loc)
        # Position cursor right after the completion
        new_col = start_loc[1] + len(completion)
        self.text_area.cursor_location = (start_loc[0], new_col)
        self._clear_suggestions()
        return True
