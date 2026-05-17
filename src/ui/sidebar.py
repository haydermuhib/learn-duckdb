"""Sidebar widget — lecture navigation tree + VS Code DBCode-style schema viewer."""

from __future__ import annotations

from pathlib import Path

from textual.app import ComposeResult
from textual.containers import Vertical
from textual.message import Message
from textual.widgets import Static, Tree

from src.content.models import ColumnInfo, LectureMeta, TableInfo


class LectureSelected(Message):
    """Posted when a lecture is selected in the sidebar."""

    def __init__(self, lecture_id: str) -> None:
        self.lecture_id = lecture_id
        super().__init__()


class SandboxSelected(Message):
    """Posted when the sandbox/playground is selected."""
    pass


class SandboxDatabaseSelected(Message):
    """Posted when a specific sandbox database is selected."""

    def __init__(self, db_path: Path) -> None:
        self.db_path = db_path
        super().__init__()


class NewDatabaseRequested(Message):
    """Posted when user wants to create a new sandbox database."""
    pass


class LectureSidebar(Vertical):
    """Left sidebar with lecture list and schema viewer (DBCode-style)."""

    def __init__(self, **kwargs) -> None:
        super().__init__(id="sidebar", **kwargs)
        self._lectures: list[LectureMeta] = []
        self._completed: dict[str, tuple[int, int]] = {}

    def compose(self) -> ComposeResult:
        yield Static("🦆 learn-duckdb", id="sidebar-title")
        yield Tree("📚 Lectures", id="lecture-tree")
        yield Vertical(
            Static("📋 Schema Explorer", id="schema-title"),
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

        # Add sandbox/playground section
        sandbox_node = tree.root.add("🏗️  Playground", data="__sandbox__")
        sandbox_node.expand()

    def set_sandbox_databases(self, databases: list[Path], active: Path | None = None) -> None:
        """Populate sandbox database entries in the lecture tree."""
        tree = self.query_one("#lecture-tree", Tree)

        # Find or recreate the sandbox node
        sandbox_node = None
        for child in tree.root.children:
            if child.data == "__sandbox__":
                sandbox_node = child
                break

        if sandbox_node is None:
            return

        # Clear existing DB entries under sandbox
        sandbox_node.remove_children()

        for db_path in databases:
            is_active = active and db_path == active
            icon = "🟢" if is_active else "💾"
            sandbox_node.add_leaf(
                f"{icon} {db_path.stem}",
                data=f"__sandbox_db__{db_path}",
            )

        # Add "New Database" option
        sandbox_node.add_leaf("➕ New Database...", data="__new_db__")

    def update_completion(self, lecture_id: str, done: int, total: int) -> None:
        """Update the completion indicator for a specific lecture."""
        self._completed[lecture_id] = (done, total)
        self.set_lectures(self._lectures, self._completed)

    def set_schema(self, tables: list[TableInfo]) -> None:
        """Display table schemas in the DBCode-style schema tree.

        Layout per table:
          📄 table_name (description)
           ├─ 🔑 id  INTEGER  PK NOT NULL
           ├─ 📎 dept_id  INTEGER  FK→departments(id)
           ├─ ⭐ email  VARCHAR  UNIQUE
           ├─ ── name  VARCHAR  NOT NULL
           └─ ── score  DECIMAL(10,2)  DEFAULT 0.0
        """
        schema_tree = self.query_one("#schema-tree", Tree)
        schema_tree.clear()
        schema_tree.root.expand()

        if not tables:
            schema_tree.root.add_leaf("  (no tables)")
            return

        for table in tables:
            # Table node with description
            desc_part = f"  — {table.description}" if table.description else ""
            table_node = schema_tree.root.add(
                f"📄 {table.name}{desc_part}",
                expand=True,
            )

            # Columns sub-node
            cols_node = table_node.add("Columns", expand=True)
            for col in table.columns:
                label = _format_column(col)
                cols_node.add_leaf(label)

            # Constraints summary sub-node
            pks = [c for c in table.columns if c.is_primary_key]
            fks = [c for c in table.columns if c.is_foreign_key]
            uniques = [c for c in table.columns if c.is_unique]

            if pks or fks or uniques:
                constraints_node = table_node.add("Constraints", expand=False)
                for c in pks:
                    constraints_node.add_leaf(f"🔑 PRIMARY KEY ({c.name})")
                for c in uniques:
                    constraints_node.add_leaf(f"⭐ UNIQUE ({c.name})")
                for c in fks:
                    constraints_node.add_leaf(f"📎 FK {c.name} → {c.fk_references}")

    def on_tree_node_selected(self, event: Tree.NodeSelected) -> None:
        """Handle lecture/sandbox/database selection from the tree."""
        if event.node.data is None:
            return

        node_id = event.node.data

        if node_id == "__sandbox__":
            self.post_message(SandboxSelected())
        elif node_id == "__new_db__":
            self.post_message(NewDatabaseRequested())
        elif isinstance(node_id, str) and node_id.startswith("__sandbox_db__"):
            db_path = Path(node_id.replace("__sandbox_db__", ""))
            self.post_message(SandboxDatabaseSelected(db_path=db_path))
        elif isinstance(node_id, str) and not node_id.startswith("__"):
            self.post_message(LectureSelected(lecture_id=node_id))


def _format_column(col: ColumnInfo) -> str:
    """Format a column entry with constraint badges (DBCode-style)."""
    # Icon based on constraint type
    if col.is_primary_key:
        icon = "🔑"
    elif col.is_foreign_key:
        icon = "📎"
    elif col.is_unique:
        icon = "⭐"
    else:
        icon = "──"

    # Type
    parts = [f"{icon} {col.name}  {col.dtype}"]

    # Badges
    badges = []
    if col.is_primary_key:
        badges.append("PK")
    if not col.nullable:
        badges.append("NOT NULL")
    if col.is_unique:
        badges.append("UNIQUE")
    if col.is_foreign_key:
        badges.append(f"FK→{col.fk_references}")
    if col.default_value is not None:
        badges.append(f"={col.default_value}")

    if badges:
        parts.append("  " + " · ".join(badges))

    return "".join(parts)
