"""Query result validation — compares user output against expected solutions."""

from __future__ import annotations

from src.content.models import QueryResult, Task, ValidationResult, ValidationStatus


class QueryValidator:
    """Compares user query output with the expected solution output."""

    def validate(
        self,
        user_result: QueryResult,
        solution_result: QueryResult,
        task: Task,
    ) -> ValidationResult:
        """Compare user and solution results, returning detailed feedback."""

        # If user query errored, fail immediately
        if user_result.is_error:
            return ValidationResult(
                status=ValidationStatus.ERROR,
                message=f"Query error: {user_result.error}",
            )

        # If solution errored, that's a bug in our content
        if solution_result.is_error:
            return ValidationResult(
                status=ValidationStatus.ERROR,
                message="Internal error: solution query failed. Please report this bug.",
                details=solution_result.error or "",
            )

        # --- Column validation ---
        user_cols = [c.lower() for c in user_result.columns]
        solution_cols = [c.lower() for c in solution_result.columns]

        # If task specifies expected columns, validate against those
        if task.expected_columns:
            expected_cols = [c.lower() for c in task.expected_columns]
        else:
            expected_cols = solution_cols

        if sorted(user_cols) != sorted(expected_cols):
            missing = set(expected_cols) - set(user_cols)
            extra = set(user_cols) - set(expected_cols)
            parts = []
            if missing:
                parts.append(f"Missing columns: {', '.join(sorted(missing))}")
            if extra:
                parts.append(f"Unexpected columns: {', '.join(sorted(extra))}")

            return ValidationResult(
                status=ValidationStatus.FAIL,
                message="Column mismatch — check your SELECT list.",
                details="\n".join(parts),
                expected_columns=list(expected_cols),
                actual_columns=user_cols,
            )

        # --- Row count check ---
        if task.expected_row_count is not None:
            if user_result.row_count != task.expected_row_count:
                return ValidationResult(
                    status=ValidationStatus.FAIL,
                    message=f"Expected {task.expected_row_count} rows, got {user_result.row_count}.",
                    details="Check your WHERE clause or table selection.",
                )

        # --- Row data comparison ---
        # Normalize both result sets for comparison
        user_rows = self._normalize_rows(user_result.rows)
        solution_rows = self._normalize_rows(solution_result.rows)

        if task.order_matters:
            if user_rows != solution_rows:
                return self._row_diff(user_rows, solution_rows, ordered=True)
        else:
            user_sorted = sorted(user_rows)
            solution_sorted = sorted(solution_rows)
            if user_sorted != solution_sorted:
                return self._row_diff(user_sorted, solution_sorted, ordered=False)

        # All checks passed
        return ValidationResult(
            status=ValidationStatus.PASS,
            message="Correct! Great job! 🎉",
        )

    def _normalize_rows(self, rows: list[tuple]) -> list[tuple]:
        """Normalize row values for comparison (handle floats, None, etc.)."""
        normalized = []
        for row in rows:
            norm_row = []
            for val in row:
                if isinstance(val, float):
                    # Round floats to avoid precision issues
                    norm_row.append(round(val, 4))
                elif val is None:
                    norm_row.append(None)
                else:
                    norm_row.append(val)
            normalized.append(tuple(norm_row))
        return normalized

    def _row_diff(
        self,
        user_rows: list[tuple],
        solution_rows: list[tuple],
        ordered: bool,
    ) -> ValidationResult:
        """Build a detailed diff between user and expected rows."""
        user_set = set(user_rows)
        solution_set = set(solution_rows)

        missing = list(solution_set - user_set)
        extra = list(user_set - solution_set)

        parts = []
        if len(user_rows) != len(solution_rows):
            parts.append(f"Row count: expected {len(solution_rows)}, got {len(user_rows)}")

        if missing:
            parts.append(f"Missing {len(missing)} expected row(s)")
        if extra:
            parts.append(f"Got {len(extra)} unexpected row(s)")

        if ordered and not missing and not extra:
            parts.append("Rows are correct but in wrong order. Check your ORDER BY clause.")

        return ValidationResult(
            status=ValidationStatus.FAIL,
            message="Row data doesn't match the expected output.",
            details="\n".join(parts) if parts else "Results differ from expected output.",
            missing_rows=missing[:5],  # Cap to avoid huge diffs
            extra_rows=extra[:5],
        )
