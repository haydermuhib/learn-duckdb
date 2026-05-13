"""Results panel — DataTable for query output + validation feedback bar."""

from __future__ import annotations

from textual.app import ComposeResult
from textual.containers import Vertical
from textual.widgets import DataTable, Static

from src.content.models import QueryResult, ValidationResult, ValidationStatus


class ResultsPanel(Vertical):
    """Bottom panel showing query results and pass/fail feedback."""

    def __init__(self, **kwargs) -> None:
        super().__init__(id="results-section", **kwargs)

    def compose(self) -> ComposeResult:
        with Vertical(id="results-header"):
            yield Static("📊 Results", id="results-title")
            yield Static("", id="results-stats")
        yield DataTable(id="results-table")
        yield Static(
            "Run a query to see results here",
            id="feedback-bar",
            classes="feedback-idle",
        )

    def show_results(self, result: QueryResult) -> None:
        """Display query results in the DataTable."""
        table = self.query_one("#results-table", DataTable)
        stats = self.query_one("#results-stats", Static)

        table.clear(columns=True)

        if result.is_error:
            self._show_feedback(
                f"⚠️  {result.error}",
                "feedback-error",
            )
            stats.update("")
            return

        if not result.columns:
            self._show_feedback(
                "✓ Query executed successfully (no rows returned)",
                "feedback-pass",
            )
            stats.update(f"{result.execution_time_ms:.1f}ms")
            return

        # Add columns
        for col in result.columns:
            table.add_column(col, key=col)

        # Add rows (cap at 200 for performance)
        display_rows = result.rows[:200]
        for row in display_rows:
            str_row = [self._format_value(v) for v in row]
            table.add_row(*str_row)

        # Update stats
        truncated = " (showing first 200)" if len(result.rows) > 200 else ""
        stats.update(
            f"{result.row_count} rows{truncated}  │  {result.execution_time_ms:.1f}ms"
        )

    def show_validation(self, validation: ValidationResult) -> None:
        """Display validation feedback."""
        if validation.status == ValidationStatus.PASS:
            msg = f"✅ {validation.message}"
            css_class = "feedback-pass"
        elif validation.status == ValidationStatus.FAIL:
            msg = f"❌ {validation.message}"
            if validation.details:
                msg += f"\n   {validation.details}"
            css_class = "feedback-fail"
        else:
            msg = f"⚠️  {validation.message}"
            css_class = "feedback-error"

        self._show_feedback(msg, css_class)

    def show_sandbox_result(self, result: QueryResult) -> None:
        """Display sandbox query results without validation."""
        self.show_results(result)
        if not result.is_error:
            if result.columns:
                self._show_feedback(
                    f"✓ {result.row_count} rows returned  │  {result.execution_time_ms:.1f}ms",
                    "feedback-pass",
                )
            else:
                self._show_feedback(
                    f"✓ Statement executed  │  {result.execution_time_ms:.1f}ms",
                    "feedback-pass",
                )

    def clear(self) -> None:
        """Reset the results panel to its initial state."""
        table = self.query_one("#results-table", DataTable)
        table.clear(columns=True)
        stats = self.query_one("#results-stats", Static)
        stats.update("")
        self._show_feedback("Run a query to see results here", "feedback-idle")

    def _show_feedback(self, text: str, css_class: str) -> None:
        """Update the feedback bar with styled text."""
        feedback = self.query_one("#feedback-bar", Static)
        feedback.update(text)
        # Remove all feedback classes and add the new one
        feedback.remove_class(
            "feedback-pass", "feedback-fail", "feedback-error", "feedback-idle"
        )
        feedback.add_class(css_class)

    def _format_value(self, value) -> str:
        """Format a cell value for display."""
        if value is None:
            return "NULL"
        if isinstance(value, bool):
            return "true" if value else "false"
        if isinstance(value, float):
            # Show reasonable precision
            if value == int(value):
                return str(int(value))
            return f"{value:.4f}".rstrip("0").rstrip(".")
        return str(value)
