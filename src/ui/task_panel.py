"""Task panel — displays the current task instructions and hints."""

from __future__ import annotations

from textual.app import ComposeResult
from textual.containers import Vertical
from textual.widgets import Static

from src.content.models import Task


class TaskPanel(Vertical):
    """Top panel showing current task instructions, hints, and progress."""

    def __init__(self, **kwargs) -> None:
        super().__init__(id="task-panel", **kwargs)
        self._current_task: Task | None = None
        self._hint_visible: bool = False

    def compose(self) -> ComposeResult:
        with Vertical(id="task-header"):
            yield Static("Select a lecture to begin", id="task-title")
            yield Static("", id="task-progress")
        yield Static("", id="task-instruction")
        yield Static("", id="task-hint")

    def set_task(self, task: Task, current: int, total: int) -> None:
        """Display a new task's instructions."""
        self._current_task = task
        self._hint_visible = False

        title = self.query_one("#task-title", Static)
        progress = self.query_one("#task-progress", Static)
        instruction = self.query_one("#task-instruction", Static)
        hint = self.query_one("#task-hint", Static)

        title.update(f"📝 Task {task.id}: {task.title}")
        progress.update(f"[{current}/{total}]")

        # Render instruction as plain text (strip markdown bold for TUI)
        text = task.instruction.replace("**", "").replace("`", "'").strip()
        instruction.update(text)

        # Prepare hint but keep it hidden
        if task.hint:
            hint.update(f"💡 Hint: {task.hint}")
            hint.display = False
        else:
            hint.update("")
            hint.display = False

    def set_welcome(self) -> None:
        """Show the welcome state."""
        title = self.query_one("#task-title", Static)
        progress = self.query_one("#task-progress", Static)
        instruction = self.query_one("#task-instruction", Static)
        hint = self.query_one("#task-hint", Static)

        title.update("👋 Welcome to learn-duckdb!")
        progress.update("")
        instruction.update("Select a lecture from the sidebar to start learning SQL with DuckDB.")
        hint.update("")
        hint.display = False

    def set_sandbox_mode(self) -> None:
        """Show sandbox mode instructions."""
        title = self.query_one("#task-title", Static)
        progress = self.query_one("#task-progress", Static)
        instruction = self.query_one("#task-instruction", Static)
        hint = self.query_one("#task-hint", Static)

        title.update("🏗️  Playground Mode")
        progress.update("")
        instruction.update(
            "Free SQL sandbox — full access. "
            "Create tables, load data, experiment. "
            "Your work is saved to a .duckdb file.\n"
            "Try: CREATE TABLE test (id INT, name VARCHAR);"
        )
        hint.update("💡 DuckDB tip: Use read_csv_auto('file.csv') to load CSV files directly!")
        hint.display = True

    def toggle_hint(self) -> None:
        """Show or hide the hint for the current task."""
        if not self._current_task or not self._current_task.hint:
            return
        hint = self.query_one("#task-hint", Static)
        self._hint_visible = not self._hint_visible
        hint.display = self._hint_visible

    def set_completed_message(self, lecture_title: str) -> None:
        """Show lecture completion message."""
        title = self.query_one("#task-title", Static)
        progress = self.query_one("#task-progress", Static)
        instruction = self.query_one("#task-instruction", Static)
        hint = self.query_one("#task-hint", Static)

        title.update(f"🎉 {lecture_title} — Complete!")
        progress.update("✅")
        instruction.update(
            "You've completed all tasks in this lecture. "
            "Select another lecture from the sidebar, or try the Playground!"
        )
        hint.update("")
        hint.display = False
