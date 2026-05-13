"""User progress persistence using a local DuckDB file."""

from __future__ import annotations

from pathlib import Path

import duckdb

from src.content.models import UserStats


# Store progress outside the repo so git pull never overwrites it
DEFAULT_PROGRESS_DIR = Path.home() / ".local" / "share" / "learn-duckdb"
DEFAULT_PROGRESS_DB = DEFAULT_PROGRESS_DIR / "progress.duckdb"


class ProgressTracker:
    """Tracks which tasks a user has completed across lectures.

    Data is stored in a local DuckDB file at ~/.local/share/learn-duckdb/progress.duckdb
    """

    def __init__(self, db_path: Path | None = None):
        self._db_path = db_path or DEFAULT_PROGRESS_DB
        self._conn: duckdb.DuckDBPyConnection | None = None

    def _ensure_connected(self) -> duckdb.DuckDBPyConnection:
        if self._conn is None:
            self._db_path.parent.mkdir(parents=True, exist_ok=True)
            self._conn = duckdb.connect(str(self._db_path))
            self._conn.execute("""
                CREATE TABLE IF NOT EXISTS completed_tasks (
                    lecture_id VARCHAR NOT NULL,
                    task_id INTEGER NOT NULL,
                    completed_at TIMESTAMP DEFAULT current_timestamp,
                    PRIMARY KEY (lecture_id, task_id)
                )
            """)
        return self._conn

    def mark_completed(self, lecture_id: str, task_id: int) -> None:
        """Record that a user completed a specific task."""
        conn = self._ensure_connected()
        conn.execute(
            "INSERT OR IGNORE INTO completed_tasks (lecture_id, task_id) VALUES (?, ?)",
            [lecture_id, task_id],
        )

    def is_completed(self, lecture_id: str, task_id: int) -> bool:
        """Check if a specific task has been completed."""
        conn = self._ensure_connected()
        result = conn.execute(
            "SELECT 1 FROM completed_tasks WHERE lecture_id = ? AND task_id = ?",
            [lecture_id, task_id],
        ).fetchone()
        return result is not None

    def get_progress(self, lecture_id: str) -> set[int]:
        """Get the set of completed task IDs for a lecture."""
        conn = self._ensure_connected()
        rows = conn.execute(
            "SELECT task_id FROM completed_tasks WHERE lecture_id = ?",
            [lecture_id],
        ).fetchall()
        return {row[0] for row in rows}

    def get_lecture_completion(self, lecture_id: str, total_tasks: int) -> tuple[int, int]:
        """Return (completed_count, total_count) for a lecture."""
        completed = len(self.get_progress(lecture_id))
        return (completed, total_tasks)

    def get_overall_stats(self, lectures: list[tuple[str, int]]) -> UserStats:
        """Compute aggregate stats across all lectures.

        Args:
            lectures: list of (lecture_id, task_count) tuples.
        """
        total_tasks = sum(tc for _, tc in lectures)
        total_lectures = len(lectures)
        completed_tasks = 0
        completed_lectures = 0

        for lecture_id, task_count in lectures:
            done = len(self.get_progress(lecture_id))
            completed_tasks += done
            if done >= task_count:
                completed_lectures += 1

        return UserStats(
            total_lectures=total_lectures,
            completed_lectures=completed_lectures,
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
        )

    def reset_lecture(self, lecture_id: str) -> None:
        """Clear all progress for a specific lecture."""
        conn = self._ensure_connected()
        conn.execute(
            "DELETE FROM completed_tasks WHERE lecture_id = ?",
            [lecture_id],
        )

    def reset_all(self) -> None:
        """Clear all progress."""
        conn = self._ensure_connected()
        conn.execute("DELETE FROM completed_tasks")

    def close(self) -> None:
        if self._conn:
            self._conn.close()
            self._conn = None
