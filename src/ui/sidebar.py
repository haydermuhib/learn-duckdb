"""Sidebar widget — lecture navigation tree + table schema viewer."""

from __future__ import annotations

from textual.app import ComposeResult
from textual.containers import Vertical
from textual.message import Message
from textual.widgets import Static, Tree

from src.content.models import LectureMeta, TableInfo


class LectureSelected(Message):
    """Posted when a lecture is selected in the sidebar."""

    def __init__(self, lecture_id: str) -> None:
        self.lecture_id = lecture_id
        super().__init__()


class SandboxSelected(Message):
    """Posted when the sandbox/playground is selected."""
    pass


class LectureSidebar(Vertical):
    """Left sidebar with lecture list and schema viewer."""

    def __init__(self, **kwargs) -> None:
        super().__init__(id="sidebar", **kwargs)
        self._lectures: list[LectureMeta] = []
        self._completed: dict[str, tuple[int, int]] = {}

    def compose(self) -> ComposeResult:
        yield Static("🦆 learn-duckdb", id="sidebar-title")
        yield Tree("📚 Lectures", id="lecture-tree")
        yield Vertical(
            Static("📋 Schema", id="schema-title"),
            Tree("Tables", id="schema-tree"),
            id="schema-section",
        )

    def set_lectures(
        self,
        lectures: list[LectureMeta],
        completed: dict[str, tuple[int, int]] | None = None,
    ) -> None:
        """Populate the lecture tree with available lectures."""
        self._lectures = lectures
        self._completed = completed or {}

        tree = self.query_one("#lecture-tree", Tree)
        tree.clear()
        tree.root.expand()

        for lec in lectures:
            done, total = self._completed.get(lec.id, (0, lec.task_count))
            if done >= total and total > 0:
                icon = "✅"
            elif done > 0:
                icon = "🔵"
            else:
                icon = "⬜"

            label = f"{icon} {lec.title}  ({done}/{total})"
            tree.root.add_leaf(label, data=lec.id)

        # Add sandbox entry
        tree.root.add_leaf("🏗️  Playground", data="__sandbox__")

    def update_completion(self, lecture_id: str, done: int, total: int) -> None:
        """Update the completion indicator for a specific lecture."""
        self._completed[lecture_id] = (done, total)
        # Refresh the full tree for simplicity
        self.set_lectures(self._lectures, self._completed)

    def set_schema(self, tables: list[TableInfo]) -> None:
        """Display table schemas in the schema tree."""
        schema_tree = self.query_one("#schema-tree", Tree)
        schema_tree.clear()
        schema_tree.root.expand()

        for table in tables:
            table_node = schema_tree.root.add(
                f"📄 {table.name}",
                expand=True,
            )
            for col in table.columns:
                nullable = "?" if col.nullable else "!"
                table_node.add_leaf(f"  {col.name} [{col.dtype}]{nullable}")

    def on_tree_node_selected(self, event: Tree.NodeSelected) -> None:
        """Handle lecture/sandbox selection from the tree."""
        if event.node.data is None:
            return

        node_id = event.node.data
        if node_id == "__sandbox__":
            self.post_message(SandboxSelected())
        else:
            self.post_message(LectureSelected(lecture_id=node_id))
