"""Main Textual application — wires sidebar, editor, results, and engine together."""

from __future__ import annotations

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical
from textual.widgets import Footer, Header, Input, Static, TabbedContent, TabPane

from src.content.loader import LectureLoader
from src.content.models import Lecture, Task, ValidationStatus
from src.engine.database import LectureDatabase, SandboxDatabase, generate_erd
from src.engine.progress import ProgressTracker
from src.engine.validator import QueryValidator
from src.ui.editor import QuerySubmitted, SQLEditor
from src.ui.results import ResultsPanel
from src.ui.sidebar import (
    LectureSelected,
    LectureSidebar,
    NewDatabaseRequested,
    SandboxDatabaseSelected,
    SandboxSelected,
    TablePreviewRequested,
)
from src.ui.task_panel import TaskPanel


class LearnDuckDBApp(App):
    """Interactive SQL learning TUI powered by DuckDB."""

    TITLE = "learn-duckdb 🦆"
    SUB_TITLE = "Interactive SQL Learning"

    CSS_PATH = "styles.tcss"

    BINDINGS = [
        Binding("ctrl+j", "run_query", "Run All", show=True),
        Binding("ctrl+g", "run_selection", "Run Selection", show=True),
        Binding("ctrl+h", "toggle_hint", "Hint", show=True),
        Binding("ctrl+r", "reset", "Reset", show=True),
        Binding("ctrl+n", "next_task", "Next", show=True),
        Binding("ctrl+b", "prev_task", "Prev", show=True),
        Binding("ctrl+l", "clear_editor", "Clear Editor", show=True),
        Binding("ctrl+t", "show_erd", "ERD", show=True),
        Binding("q", "quit", "Quit", show=True),
    ]

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        self._loader = LectureLoader()
        self._lecture_db = LectureDatabase()
        self._sandbox_db = SandboxDatabase()
        self._validator = QueryValidator()
        self._progress = ProgressTracker()

        # State
        self._current_lecture: Lecture | None = None
        self._current_task_index: int = 0
        self._solutions: dict[int, str] = {}
        self._is_sandbox_mode: bool = False

    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal(id="main-container"):
            yield LectureSidebar()
            with Vertical(id="content-area"):
                yield TaskPanel()
                with TabbedContent(id="editor-tabs"):
                    with TabPane("✏️  SQL Editor", id="tab-editor"):
                        yield SQLEditor()
                    with TabPane("📊 ERD", id="tab-erd"):
                        yield Static(
                            "Press Ctrl+T to generate the ERD diagram.",
                            id="erd-display",
                        )
                with TabbedContent(id="results-tabs"):
                    with TabPane("📋 Results", id="tab-results"):
                        yield ResultsPanel()
                    with TabPane("📄 Table Preview", id="tab-preview"):
                        yield Static(
                            "Click a table in the schema explorer to preview its data.",
                            id="preview-display",
                        )
        yield Footer()

    def on_mount(self) -> None:
        """Initialize the app on mount."""
        self._load_sidebar()
        task_panel = self.query_one(TaskPanel)
        task_panel.set_welcome()
        editor = self.query_one(SQLEditor)
        editor.focus_editor()

    # ─── Sidebar Event Handlers ───

    def on_lecture_selected(self, event: LectureSelected) -> None:
        """Handle lecture selection from the sidebar."""
        self._is_sandbox_mode = False
        self._load_lecture(event.lecture_id)

    def on_sandbox_selected(self, event: SandboxSelected) -> None:
        """Switch to sandbox/playground mode."""
        self._is_sandbox_mode = True
        self._current_lecture = None
        self._solutions = {}

        self._sandbox_db.connect()
        self._refresh_sandbox_ui()

    def on_sandbox_database_selected(self, event: SandboxDatabaseSelected) -> None:
        """Switch to a specific sandbox database."""
        self._is_sandbox_mode = True
        self._current_lecture = None
        self._solutions = {}

        self._sandbox_db.switch_database(event.db_path)
        self._refresh_sandbox_ui()
        self.notify(
            f"Switched to '{event.db_path.stem}'",
            title="💾 Database",
            severity="information",
        )

    def on_new_database_requested(self, event: NewDatabaseRequested) -> None:
        """Prompt user for a new database name."""
        self._is_sandbox_mode = True
        self._current_lecture = None
        self._solutions = {}

        # Use a simple input prompt via push_screen
        self._prompt_new_db_name()

    # ─── Key Binding Actions ───

    def action_run_query(self) -> None:
        """Execute the full editor content."""
        editor = self.query_one(SQLEditor)
        sql = editor.current_sql
        self._execute_sql(sql)

    def action_run_selection(self) -> None:
        """Execute only the selected text. Falls back to full text if nothing is selected."""
        editor = self.query_one(SQLEditor)
        sql = editor.runnable_sql
        self._execute_sql(sql)

    def action_toggle_hint(self) -> None:
        """Show or hide the hint for the current task."""
        task_panel = self.query_one(TaskPanel)
        task_panel.toggle_hint()

    def action_reset(self) -> None:
        """Context-aware reset: lecture mode resets progress, sandbox mode drops all tables."""
        if self._is_sandbox_mode:
            self._reset_sandbox()
        elif self._current_lecture:
            self._reset_lecture()

    def action_clear_editor(self) -> None:
        """Clear only the SQL editor, nothing else."""
        editor = self.query_one(SQLEditor)
        editor.clear()
        editor.focus_editor()
        self.notify("Editor cleared", severity="information")

    def action_next_task(self) -> None:
        """Advance to the next task in the current lecture."""
        if self._is_sandbox_mode or not self._current_lecture:
            return
        tasks = self._current_lecture.tasks
        if self._current_task_index < len(tasks) - 1:
            self._current_task_index += 1
            self._show_current_task()
            editor = self.query_one(SQLEditor)
            editor.clear()
            editor.focus_editor()
            results = self.query_one(ResultsPanel)
            results.clear()

    def action_prev_task(self) -> None:
        """Go back to the previous task."""
        if self._is_sandbox_mode or not self._current_lecture:
            return
        if self._current_task_index > 0:
            self._current_task_index -= 1
            self._show_current_task()
            editor = self.query_one(SQLEditor)
            editor.clear()
            editor.focus_editor()
            results = self.query_one(ResultsPanel)
            results.clear()

    # ─── Execution ───

    def _execute_sql(self, sql: str) -> None:
        """Route SQL execution based on current mode."""
        if self._is_sandbox_mode:
            self._run_sandbox_query(sql)
        else:
            self._run_lecture_query(sql)

    def _run_lecture_query(self, sql: str) -> None:
        """Execute and validate a user query against the current task."""
        if not self._current_lecture:
            self.notify("Select a lecture first", severity="warning")
            return

        tasks = self._current_lecture.tasks
        if self._current_task_index >= len(tasks):
            self.notify("All tasks complete! Select another lecture.", severity="information")
            return

        task = tasks[self._current_task_index]
        results_panel = self.query_one(ResultsPanel)

        user_result = self._lecture_db.execute_user_query(sql)
        results_panel.show_results(user_result)

        if user_result.is_error:
            return

        solution_sql = self._solutions.get(task.id)
        if solution_sql:
            solution_result = self._lecture_db.execute_solution(solution_sql)
            validation = self._validator.validate(user_result, solution_result, task)
            results_panel.show_validation(validation)

            if validation.status == ValidationStatus.PASS:
                self._on_task_passed(task)
        else:
            self.notify("No solution found for this task", severity="warning")

    def _run_sandbox_query(self, sql: str) -> None:
        """Execute a query in sandbox mode (no validation)."""
        result = self._sandbox_db.execute(sql)
        results_panel = self.query_one(ResultsPanel)
        results_panel.show_results(result)
        results_panel.show_sandbox_result(result)

        # Refresh schema in case tables were created/dropped
        sidebar = self.query_one(LectureSidebar)
        sidebar.set_schema(self._sandbox_db.get_table_schemas())

    # ─── Reset Logic ───

    def _reset_lecture(self) -> None:
        """Reset the current lecture — database tables AND progress."""
        lecture = self._current_lecture
        if not lecture:
            return

        if self._lecture_db.is_connected:
            self._lecture_db.reset()

        self._progress.reset_lecture(lecture.id)
        self._current_task_index = 0
        self._show_current_task()

        sidebar = self.query_one(LectureSidebar)
        sidebar.update_completion(lecture.id, 0, len(lecture.tasks))

        editor = self.query_one(SQLEditor)
        editor.clear()
        editor.focus_editor()

        results = self.query_one(ResultsPanel)
        results.clear()

        self.notify(
            f"'{lecture.title}' reset — progress cleared, back to Task 1",
            title="🔄 Reset",
            severity="information",
        )

    def _reset_sandbox(self) -> None:
        """Drop all tables in the current sandbox database."""
        self._sandbox_db.reset_current()

        sidebar = self.query_one(LectureSidebar)
        sidebar.set_schema(self._sandbox_db.get_table_schemas())

        results = self.query_one(ResultsPanel)
        results.clear()

        self.notify(
            f"Sandbox '{self._sandbox_db.db_name}' cleared — all tables dropped",
            title="🔄 Reset",
            severity="information",
        )

    # ─── Sandbox Database Management ───

    def _refresh_sandbox_ui(self) -> None:
        """Update all UI elements for sandbox mode."""
        task_panel = self.query_one(TaskPanel)
        task_panel.set_sandbox_mode(self._sandbox_db.db_name)

        results = self.query_one(ResultsPanel)
        results.clear()

        editor = self.query_one(SQLEditor)
        editor.clear()
        editor.focus_editor()

        sidebar = self.query_one(LectureSidebar)
        sidebar.set_schema(self._sandbox_db.get_table_schemas())

        # Show available databases in sidebar
        dbs = self._sandbox_db.list_sandbox_databases()
        sidebar.set_sandbox_databases(dbs, active=self._sandbox_db.db_path)

    def _prompt_new_db_name(self) -> None:
        """Ask user for a new database name via the built-in Input widget."""
        # Remove any existing input first (prevent duplicates)
        try:
            existing = self.query_one("#new-db-input")
            existing.remove()
        except Exception:
            pass

        input_widget = Input(
            placeholder="Enter database name (e.g. my_experiments) — Esc to cancel",
            id="new-db-input",
        )
        self.query_one("#content-area").mount(input_widget, before=0)
        input_widget.focus()

    def _dismiss_db_input(self) -> None:
        """Remove the new-db input if it exists."""
        try:
            widget = self.query_one("#new-db-input")
            widget.remove()
        except Exception:
            pass

    def on_input_submitted(self, event: Input.Submitted) -> None:
        """Handle new database name submission."""
        if event.input.id == "new-db-input":
            name = event.value.strip()
            event.input.remove()

            if not name:
                self.notify("Database name cannot be empty", severity="warning")
                return

            new_path = self._sandbox_db.create_new_database(name)
            self._refresh_sandbox_ui()
            self.notify(
                f"Created '{new_path.stem}.duckdb'",
                title="✅ New Database",
                severity="information",
            )

    def on_descendant_blur(self, event) -> None:
        """Auto-dismiss the new-db input when it loses focus."""
        try:
            widget = event.widget
            if hasattr(widget, "id") and widget.id == "new-db-input":
                widget.remove()
        except Exception:
            pass

    def key_escape(self) -> None:
        """Dismiss the new-db input on Escape key."""
        self._dismiss_db_input()

    # ─── Table Preview & ERD ───

    def on_table_preview_requested(self, event: TablePreviewRequested) -> None:
        """Preview a table's data when clicked in the schema explorer."""
        table_name = event.table_name
        sql = f'SELECT * FROM "{table_name}" LIMIT 50'

        if self._is_sandbox_mode:
            result = self._sandbox_db.execute(sql)
        elif self._lecture_db.is_connected:
            result = self._lecture_db.execute_user_query(sql)
        else:
            self.notify("No database loaded", severity="warning")
            return

        # Render as formatted text in the preview tab
        preview_text = _format_result_as_text(result, table_name)
        self.query_one("#preview-display", Static).update(preview_text)

        # Switch to the preview tab
        self.query_one("#results-tabs", TabbedContent).active = "tab-preview"

    def action_show_erd(self) -> None:
        """Show an ASCII Entity-Relationship Diagram in the ERD tab."""
        if self._is_sandbox_mode:
            schemas = self._sandbox_db.get_table_schemas()
            db_name = self._sandbox_db.db_name
        elif self._lecture_db.is_connected:
            schemas = self._lecture_db.get_table_schemas()
            db_name = self._current_lecture.title if self._current_lecture else "Lecture"
        else:
            self.notify("No database loaded", severity="warning")
            return

        erd_text = generate_erd(schemas)
        header = f"ERD: {db_name}\n{'─' * 44}\n\n"
        self.query_one("#erd-display", Static).update(header + erd_text)

        # Switch to the ERD tab
        self.query_one("#editor-tabs", TabbedContent).active = "tab-erd"

        table_count = len(schemas)
        fk_count = sum(1 for t in schemas for c in t.columns if c.is_foreign_key)
        self.notify(
            f"{table_count} tables, {fk_count} FK relationships",
            title="📊 ERD Generated",
            severity="information",
        )


    # ─── Internal Logic ───

    def _load_sidebar(self) -> None:
        """Populate the sidebar with available lectures and progress."""
        lectures = self._loader.list_lectures()
        completed = {}
        for lec in lectures:
            done, total = self._progress.get_lecture_completion(lec.id, lec.task_count)
            completed[lec.id] = (done, total)

        sidebar = self.query_one(LectureSidebar)
        sidebar.set_lectures(lectures, completed)

    def _load_lecture(self, lecture_id: str) -> None:
        """Load a lecture and display its first uncompleted task."""
        try:
            lecture = self._loader.load_lecture(lecture_id)
            seed_sql = self._loader.load_seed_sql(lecture)
            self._solutions = self._loader.load_solutions(lecture)
        except FileNotFoundError as e:
            self.notify(str(e), title="Error", severity="error")
            return

        self._current_lecture = lecture
        self._lecture_db.load_lecture(lecture, seed_sql)

        completed = self._progress.get_progress(lecture_id)
        self._current_task_index = 0
        for i, task in enumerate(lecture.tasks):
            if task.id not in completed:
                self._current_task_index = i
                break

        sidebar = self.query_one(LectureSidebar)
        sidebar.set_schema(self._lecture_db.get_table_schemas())

        self._show_current_task()

        editor = self.query_one(SQLEditor)
        editor.clear()
        editor.focus_editor()

        results = self.query_one(ResultsPanel)
        results.clear()

    def _show_current_task(self) -> None:
        """Update the task panel with the current task."""
        if not self._current_lecture:
            return

        tasks = self._current_lecture.tasks
        if self._current_task_index >= len(tasks):
            task_panel = self.query_one(TaskPanel)
            task_panel.set_completed_message(self._current_lecture.title)
            return

        task = tasks[self._current_task_index]
        task_panel = self.query_one(TaskPanel)
        task_panel.set_task(task, self._current_task_index + 1, len(tasks))

    def _on_task_passed(self, task: Task) -> None:
        """Handle successful task completion."""
        if not self._current_lecture:
            return

        lecture = self._current_lecture
        self._progress.mark_completed(lecture.id, task.id)

        done, total = self._progress.get_lecture_completion(lecture.id, len(lecture.tasks))
        sidebar = self.query_one(LectureSidebar)
        sidebar.update_completion(lecture.id, done, total)

        if self._current_task_index < len(lecture.tasks) - 1:
            self.notify(
                f"Task {task.id} complete! Press Ctrl+N for next task.",
                title="🎉 Correct!",
                severity="information",
            )
        else:
            self.notify(
                f"You've completed {lecture.title}!",
                title="🏆 Lecture Complete!",
                severity="information",
            )
            task_panel = self.query_one(TaskPanel)
            task_panel.set_completed_message(lecture.title)

    def on_unmount(self) -> None:
        """Cleanup on app exit."""
        self._lecture_db.close()
        self._sandbox_db.close()
        self._progress.close()


def _format_result_as_text(result, table_name: str) -> str:
    """Render a QueryResult as an aligned ASCII table for the preview tab."""
    from src.content.models import QueryResult

    if result.is_error:
        return f"[red]Error: {result.error}[/red]"

    if not result.columns:
        return f"📄 {table_name} — (empty table)"

    # Format each cell
    def fmt(v) -> str:
        if v is None:
            return "NULL"
        if isinstance(v, bool):
            return "true" if v else "false"
        return str(v)

    rows_str = [[fmt(v) for v in row] for row in result.rows]
    headers = list(result.columns)

    # Compute column widths
    col_widths = [len(h) for h in headers]
    for row in rows_str:
        for i, cell in enumerate(row):
            col_widths[i] = max(col_widths[i], len(cell))

    sep = "─┼─".join("─" * w for w in col_widths)
    sep = f"─{sep}─"

    def fmt_row(cells):
        return " │ ".join(f"{c:<{col_widths[i]}}" for i, c in enumerate(cells))

    header_line = fmt_row(headers)
    divider = "─" * len(header_line)

    lines = [
        f"📄 {table_name}  ({result.row_count} rows)",
        divider,
        header_line,
        divider,
    ]
    for row in rows_str:
        lines.append(fmt_row(row))

    return "\n".join(lines)
