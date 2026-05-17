"""SQL editor widget wrapping Textual's TextArea with SQL syntax highlighting."""

from __future__ import annotations

from textual.app import ComposeResult
from textual.containers import Vertical
from textual.message import Message
from textual.widgets import Static, TextArea


class QuerySubmitted(Message):
    """Posted when the user submits a query (Ctrl+Enter)."""

    def __init__(self, sql: str) -> None:
        self.sql = sql
        super().__init__()


class SQLEditor(Vertical):
    """SQL code editor with syntax highlighting and run controls."""

    def __init__(self, **kwargs) -> None:
        super().__init__(id="editor-section", **kwargs)

    def compose(self) -> ComposeResult:
        yield Static(" SQL Editor", id="editor-label")
        yield TextArea.code_editor(
            "",
            language="sql",
            id="sql-editor",
            theme="monokai",
        )
        with Vertical(id="run-bar"):
            yield Static(
                "  ^J Run │ ^H Hint │ ^R Reset │ ^B/N Prev/Next │ ^L Clear │ ^G Run Selection",
                id="run-hint",
            )

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
    def runnable_sql(self) -> str:
        """Return selected text if any, otherwise full editor text."""
        sel = self.selected_sql
        return sel if sel else self.current_sql

    def set_text(self, text: str) -> None:
        """Set the editor content."""
        self.text_area.load_text(text)

    def clear(self) -> None:
        """Clear the editor."""
        self.text_area.load_text("")

    def focus_editor(self) -> None:
        """Focus the TextArea for typing."""
        self.text_area.focus()
