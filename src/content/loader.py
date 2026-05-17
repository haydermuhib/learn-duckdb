"""Discovers and loads lecture content from data/lectures/."""

from __future__ import annotations

from pathlib import Path

import yaml

from src.content.models import Difficulty, Lecture, LectureMeta, TableInfo, Task


DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "lectures"


class LectureLoader:
    """Discovers and loads lecture content from the data/lectures/ directory."""

    def __init__(self, data_dir: Path | None = None):
        self.data_dir = data_dir or DATA_DIR

    def list_lectures(self) -> list[LectureMeta]:
        """Return lightweight metadata for all available lectures, sorted by folder name."""
        lectures = []
        if not self.data_dir.exists():
            return lectures

        for lecture_dir in sorted(self.data_dir.iterdir()):
            if not lecture_dir.is_dir():
                continue
            yaml_path = lecture_dir / "lecture.yaml"
            if not yaml_path.exists():
                continue

            with open(yaml_path, "r") as f:
                data = yaml.safe_load(f)

            lectures.append(
                LectureMeta(
                    id=lecture_dir.name,
                    title=data.get("title", lecture_dir.name),
                    difficulty=Difficulty(data.get("difficulty", "beginner")),
                    task_count=len(data.get("tasks", [])),
                    path=lecture_dir,
                )
            )

        return lectures

    def load_lecture(self, lecture_id: str) -> Lecture:
        """Load a full lecture with all tasks and table info."""
        lecture_dir = self.data_dir / lecture_id
        yaml_path = lecture_dir / "lecture.yaml"

        if not yaml_path.exists():
            raise FileNotFoundError(f"Lecture not found: {lecture_id}")

        with open(yaml_path, "r") as f:
            data = yaml.safe_load(f)

        tables = [
            TableInfo(
                name=t.get("name", ""),
                description=t.get("description", ""),
            )
            for t in data.get("tables", [])
        ]

        tasks = [
            Task(
                id=t.get("id", i + 1),
                title=t.get("title", f"Task {i + 1}"),
                instruction=t.get("instruction", ""),
                hint=t.get("hint", ""),
                expected_columns=t.get("expected_columns", []),
                expected_row_count=t.get("expected_row_count"),
                order_matters=t.get("order_matters", False),
            )
            for i, t in enumerate(data.get("tasks", []))
        ]

        return Lecture(
            id=lecture_id,
            title=data.get("title", lecture_id),
            description=data.get("description", ""),
            difficulty=Difficulty(data.get("difficulty", "beginner")),
            path=lecture_dir,
            tables=tables,
            tasks=tasks,
        )

    def load_seed_sql(self, lecture: Lecture) -> str:
        """Read the seed SQL file for a lecture."""
        seed_path = lecture.seed_sql_path
        if not seed_path.exists():
            raise FileNotFoundError(f"Seed SQL not found: {seed_path}")
        return seed_path.read_text()

    def load_solutions(self, lecture: Lecture) -> dict[int, str]:
        """Parse solutions.sql into a dict of {task_id: solution_sql}."""
        solutions_path = lecture.solutions_sql_path
        if not solutions_path.exists():
            raise FileNotFoundError(f"Solutions not found: {solutions_path}")

        text = solutions_path.read_text()
        solutions: dict[int, str] = {}
        current_task_id: int | None = None
        current_lines: list[str] = []

        for line in text.splitlines():
            stripped = line.strip()
            if stripped.startswith("-- TASK"):
                # Save previous task
                if current_task_id is not None and current_lines:
                    solutions[current_task_id] = "\n".join(current_lines).strip()
                # Parse new task ID: "-- TASK 3", "-- TASK 3 --", "-- TASK 3: Title"
                parts = stripped.replace("--", "").strip().split()
                if len(parts) >= 2:
                    try:
                        # Handle "TASK 3:" (colon after number)
                        num_str = parts[1].rstrip(":")
                        current_task_id = int(num_str)
                    except ValueError:
                        current_task_id = None
                current_lines = []
            else:
                current_lines.append(line)

        # Save the last task
        if current_task_id is not None and current_lines:
            solutions[current_task_id] = "\n".join(current_lines).strip()

        return solutions
