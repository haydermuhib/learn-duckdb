"""Main Textual application — wires sidebar, editor, results, and engine together."""

from __future__ import annotations

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical
from textual.widgets import Footer, Header

from src.content.loader import LectureLoader
from src.content.models import Lecture, Task, ValidationStatus
from src.engine.database import LectureDatabase, SandboxDatabase
from src.engine.progress import ProgressTracker
from src.engine.validator import QueryValidator
from src.ui.editor import QuerySubmitted, SQLEditor
from src.ui.results import ResultsPanel
from src.ui.sidebar import LectureSelected, LectureSidebar, SandboxSelected
from src.ui.task_panel import TaskPanel


class LearnDuckDBApp(App):
    """Interactive SQL learning TUI powered by DuckDB."""

    TITLE = "learn-duckdb 🦆"
    SUB_TITLE = "Interactive SQL Learning"

    CSS_PATH = "styles.tcss"

    BINDINGS = [
        Binding("ctrl+j", "run_query", "Run Query", show=True),
        Binding("ctrl+h", "toggle_hint", "Toggle Hint", show=True),
        Binding("ctrl+r", "reset_db", "Reset DB", show=True),
        Binding("ctrl+n", "next_task", "Next Task", show=True),
        Binding("ctrl+p", "prev_task", "Prev Task", show=True),
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
                yield SQLEditor()
                yield ResultsPanel()
        yield Footer()

    def on_mount(self) -> None:
        """Initialize the app on mount."""
        self._load_sidebar()
        # Show welcome
        task_panel = self.query_one(TaskPanel)
        task_panel.set_welcome()
        # Focus the editor
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

        # Connect sandbox DB
        self._sandbox_db.connect()

        # Update UI
        task_panel = self.query_one(TaskPanel)
        task_panel.set_sandbox_mode()

        results = self.query_one(ResultsPanel)
        results.clear()

        editor = self.query_one(SQLEditor)
        editor.clear()
        editor.focus_editor()

        # Show sandbox schema
        sidebar = self.query_one(LectureSidebar)
        sidebar.set_schema(self._sandbox_db.get_table_schemas())

    # ─── Key Binding Actions ───

    def action_run_query(self) -> None:
        """Execute the current SQL query."""
        editor = self.query_one(SQLEditor)
        sql = editor.current_sql

        if self._is_sandbox_mode:
            self._run_sandbox_query(sql)
        else:
            self._run_lecture_query(sql)

    def action_toggle_hint(self) -> None:
        """Show or hide the hint for the current task."""
        task_panel = self.query_one(TaskPanel)
        task_panel.toggle_hint()

    def action_reset_db(self) -> None:
        """Reset the current lecture database to its original state."""
        if self._is_sandbox_mode:
            return
        if self._lecture_db.is_connected:
            self._lecture_db.reset()
            self.notify("Database reset to original state", title="Reset", severity="information")

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

        # Find first uncompleted task
        completed = self._progress.get_progress(lecture_id)
        self._current_task_index = 0
        for i, task in enumerate(lecture.tasks):
            if task.id not in completed:
                self._current_task_index = i
                break

        # Update sidebar schema
        sidebar = self.query_one(LectureSidebar)
        sidebar.set_schema(self._lecture_db.get_table_schemas())

        # Show task
        self._show_current_task()

        # Clear editor and results
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
            # All tasks done
            task_panel = self.query_one(TaskPanel)
            task_panel.set_completed_message(self._current_lecture.title)
            return

        task = tasks[self._current_task_index]
        task_panel = self.query_one(TaskPanel)
        task_panel.set_task(task, self._current_task_index + 1, len(tasks))

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

        # Run user query
        user_result = self._lecture_db.execute_user_query(sql)
        results_panel.show_results(user_result)

        if user_result.is_error:
            return

        # Validate against solution
        solution_sql = self._solutions.get(task.id)
        if solution_sql:
            solution_result = self._lecture_db.execute_solution(solution_sql)
            validation = self._validator.validate(user_result, solution_result, task)
            results_panel.show_validation(validation)

            if validation.status == ValidationStatus.PASS:
                self._on_task_passed(task)
        else:
            # No solution available — just show results
            self.notify("No solution found for this task", severity="warning")

    def _on_task_passed(self, task: Task) -> None:
        """Handle successful task completion."""
        if not self._current_lecture:
            return

        lecture = self._current_lecture

        # Save progress
        self._progress.mark_completed(lecture.id, task.id)

        # Update sidebar
        done, total = self._progress.get_lecture_completion(lecture.id, len(lecture.tasks))
        sidebar = self.query_one(LectureSidebar)
        sidebar.update_completion(lecture.id, done, total)

        # Auto-advance after a moment
        if self._current_task_index < len(lecture.tasks) - 1:
            self.notify(
                f"Task {task.id} complete! Press Ctrl+N for next task.",
                title="🎉 Correct!",
                severity="information",
            )
        else:
            # Lecture complete!
            self.notify(
                f"You've completed {lecture.title}!",
                title="🏆 Lecture Complete!",
                severity="information",
            )
            task_panel = self.query_one(TaskPanel)
            task_panel.set_completed_message(lecture.title)

    def _run_sandbox_query(self, sql: str) -> None:
        """Execute a query in sandbox mode (no validation)."""
        result = self._sandbox_db.execute(sql)
        results_panel = self.query_one(ResultsPanel)
        results_panel.show_results(result)
        results_panel.show_sandbox_result(result)

        # Refresh schema in case tables were created/dropped
        sidebar = self.query_one(LectureSidebar)
        sidebar.set_schema(self._sandbox_db.get_table_schemas())

    def on_unmount(self) -> None:
        """Cleanup on app exit."""
        self._lecture_db.close()
        self._sandbox_db.close()
        self._progress.close()
