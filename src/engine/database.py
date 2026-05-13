"""DuckDB connection management for lecture sessions and sandbox."""

from __future__ import annotations

import time
from pathlib import Path

import duckdb

from src.content.models import ColumnInfo, Lecture, QueryResult, TableInfo


class LectureDatabase:
    """Manages an in-memory DuckDB instance seeded from a lecture's SQL file.

    The lecture data is loaded into memory so the user can query freely
    without ever modifying the original seed files. Use reset() to
    re-initialize if the user corrupts the in-memory state.
    """

    def __init__(self):
        self._conn: duckdb.DuckDBPyConnection | None = None
        self._lecture: Lecture | None = None
        self._seed_sql: str = ""

    @property
    def is_connected(self) -> bool:
        return self._conn is not None

    def load_lecture(self, lecture: Lecture, seed_sql: str) -> None:
        """Create a fresh in-memory DB and run the seed SQL."""
        self.close()
        self._lecture = lecture
        self._seed_sql = seed_sql
        self._conn = duckdb.connect(":memory:")
        self._conn.execute(seed_sql)

    def execute_user_query(self, sql: str) -> QueryResult:
        """Run user SQL and return structured results or an error."""
        if not self._conn:
            return QueryResult.from_error("No database loaded. Select a lecture first.")

        sql = sql.strip()
        if not sql:
            return QueryResult.from_error("Empty query. Write some SQL!")

        start = time.perf_counter()
        try:
            result = self._conn.execute(sql)
            elapsed_ms = (time.perf_counter() - start) * 1000

            # DML statements (INSERT, UPDATE, DELETE) return no description
            if result.description is None:
                return QueryResult(
                    columns=[],
                    rows=[],
                    row_count=0,
                    execution_time_ms=elapsed_ms,
                )

            columns = [desc[0] for desc in result.description]
            rows = result.fetchall()

            return QueryResult(
                columns=columns,
                rows=rows,
                row_count=len(rows),
                execution_time_ms=elapsed_ms,
            )

        except duckdb.Error as e:
            elapsed_ms = (time.perf_counter() - start) * 1000
            return QueryResult.from_error(str(e))

    def execute_solution(self, solution_sql: str) -> QueryResult:
        """Run a solution query (used internally by the validator)."""
        return self.execute_user_query(solution_sql)

    def get_table_schemas(self) -> list[TableInfo]:
        """Introspect all user tables and return schema info."""
        if not self._conn:
            return []

        tables = []
        table_rows = self._conn.execute(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema = 'main' ORDER BY table_name"
        ).fetchall()

        for (table_name,) in table_rows:
            col_rows = self._conn.execute(
                "SELECT column_name, data_type, is_nullable "
                "FROM information_schema.columns "
                "WHERE table_schema = 'main' AND table_name = ? "
                "ORDER BY ordinal_position",
                [table_name],
            ).fetchall()

            columns = [
                ColumnInfo(
                    name=col_name,
                    dtype=dtype,
                    nullable=(nullable == "YES"),
                )
                for col_name, dtype, nullable in col_rows
            ]

            # Try to match description from lecture metadata
            desc = ""
            if self._lecture:
                for t in self._lecture.tables:
                    if t.name == table_name:
                        desc = t.description
                        break

            tables.append(
                TableInfo(name=table_name, description=desc, columns=columns)
            )

        return tables

    def reset(self) -> None:
        """Drop everything and re-seed from the original SQL."""
        if self._conn and self._seed_sql:
            self._conn.close()
            self._conn = duckdb.connect(":memory:")
            self._conn.execute(self._seed_sql)

    def close(self) -> None:
        """Close the current connection."""
        if self._conn:
            self._conn.close()
            self._conn = None
            self._lecture = None
            self._seed_sql = ""


class SandboxDatabase:
    """Full-access DuckDB connection for the playground.

    Users can create/drop tables, load CSV/Parquet, and experiment freely.
    The database is persisted to a .duckdb file so work survives restarts.
    """

    def __init__(self, db_path: Path | None = None):
        self._db_path = db_path or (
            Path(__file__).resolve().parent.parent.parent / "data" / "sandbox" / "sandbox.duckdb"
        )
        self._conn: duckdb.DuckDBPyConnection | None = None

    @property
    def db_path(self) -> Path:
        return self._db_path

    def connect(self) -> None:
        """Open (or create) the sandbox database file."""
        self._db_path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = duckdb.connect(str(self._db_path))

    def execute(self, sql: str) -> QueryResult:
        """Run any SQL with full privileges."""
        if not self._conn:
            self.connect()

        sql = sql.strip()
        if not sql:
            return QueryResult.from_error("Empty query.")

        start = time.perf_counter()
        try:
            result = self._conn.execute(sql)
            elapsed_ms = (time.perf_counter() - start) * 1000

            if result.description is None:
                return QueryResult(
                    columns=[], rows=[], row_count=0,
                    execution_time_ms=elapsed_ms,
                )

            columns = [desc[0] for desc in result.description]
            rows = result.fetchall()
            return QueryResult(
                columns=columns, rows=rows, row_count=len(rows),
                execution_time_ms=elapsed_ms,
            )
        except duckdb.Error as e:
            elapsed_ms = (time.perf_counter() - start) * 1000
            return QueryResult.from_error(str(e))

    def get_table_schemas(self) -> list[TableInfo]:
        """List all tables in the sandbox."""
        if not self._conn:
            return []

        tables = []
        table_rows = self._conn.execute(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema = 'main' ORDER BY table_name"
        ).fetchall()

        for (table_name,) in table_rows:
            col_rows = self._conn.execute(
                "SELECT column_name, data_type, is_nullable "
                "FROM information_schema.columns "
                "WHERE table_schema = 'main' AND table_name = ? "
                "ORDER BY ordinal_position",
                [table_name],
            ).fetchall()

            columns = [
                ColumnInfo(name=cn, dtype=dt, nullable=(n == "YES"))
                for cn, dt, n in col_rows
            ]
            tables.append(TableInfo(name=table_name, columns=columns))

        return tables

    def create_new_database(self, name: str) -> Path:
        """Create a new empty .duckdb file in the sandbox directory."""
        self.close()
        new_path = self._db_path.parent / f"{name}.duckdb"
        self._db_path = new_path
        self.connect()
        return new_path

    def list_sandbox_databases(self) -> list[Path]:
        """List all .duckdb files in the sandbox directory."""
        sandbox_dir = self._db_path.parent
        if not sandbox_dir.exists():
            return []
        return sorted(sandbox_dir.glob("*.duckdb"))

    def switch_database(self, db_path: Path) -> None:
        """Switch to a different sandbox database file."""
        self.close()
        self._db_path = db_path
        self.connect()

    def close(self) -> None:
        if self._conn:
            self._conn.close()
            self._conn = None
