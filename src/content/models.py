"""Data models for the learn-duckdb application."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path


class Difficulty(Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class ValidationStatus(Enum):
    PASS = "pass"
    FAIL = "fail"
    ERROR = "error"


@dataclass
class TableInfo:
    """Schema information for a table in a lecture database."""
    name: str
    description: str = ""
    columns: list[ColumnInfo] = field(default_factory=list)


@dataclass
class ColumnInfo:
    """Column metadata from a DuckDB table."""
    name: str
    dtype: str
    nullable: bool = True


@dataclass
class Task:
    """A single exercise within a lecture."""
    id: int
    title: str
    instruction: str
    hint: str = ""
    expected_columns: list[str] = field(default_factory=list)
    expected_row_count: int | None = None
    order_matters: bool = False


@dataclass
class Lecture:
    """A complete lecture with metadata and tasks."""
    id: str
    title: str
    description: str
    difficulty: Difficulty
    path: Path
    tables: list[TableInfo] = field(default_factory=list)
    tasks: list[Task] = field(default_factory=list)

    @property
    def seed_sql_path(self) -> Path:
        return self.path / "seed.sql"

    @property
    def solutions_sql_path(self) -> Path:
        return self.path / "solutions.sql"


@dataclass
class LectureMeta:
    """Lightweight lecture info for the sidebar listing."""
    id: str
    title: str
    difficulty: Difficulty
    task_count: int
    path: Path


@dataclass
class QueryResult:
    """Result of executing a user's SQL query."""
    columns: list[str]
    rows: list[tuple]
    row_count: int
    execution_time_ms: float = 0.0
    error: str | None = None

    @property
    def is_error(self) -> bool:
        return self.error is not None

    @staticmethod
    def from_error(error: str) -> QueryResult:
        return QueryResult(columns=[], rows=[], row_count=0, error=error)


@dataclass
class ValidationResult:
    """Outcome of comparing user query output against expected solution."""
    status: ValidationStatus
    message: str
    details: str = ""
    expected_columns: list[str] = field(default_factory=list)
    actual_columns: list[str] = field(default_factory=list)
    missing_rows: list[tuple] = field(default_factory=list)
    extra_rows: list[tuple] = field(default_factory=list)


@dataclass
class UserStats:
    """Aggregate progress statistics."""
    total_lectures: int = 0
    completed_lectures: int = 0
    total_tasks: int = 0
    completed_tasks: int = 0

    @property
    def completion_pct(self) -> float:
        if self.total_tasks == 0:
            return 0.0
        return (self.completed_tasks / self.total_tasks) * 100
