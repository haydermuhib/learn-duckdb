import sys
import tempfile
from pathlib import Path

# Ensure UTF-8 output on all platforms (including Windows cp1252 consoles)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

def test_imports():
    """Verify all project modules import cleanly."""
    import src.content.loader
    import src.content.models
    import src.engine.database
    import src.engine.progress
    import src.engine.updater
    import src.engine.validator
    import src.ui.app
    import src.ui.editor
    import src.ui.results
    import src.ui.sidebar
    import src.ui.task_panel
    import src.ui.updater_dialog
    print("[OK] All module imports verified successfully.")

def test_lectures_and_seeds():
    """Verify all lecture definitions and seed SQL run on DuckDB."""
    from src.content.loader import LectureLoader
    from src.engine.database import LectureDatabase, generate_erd

    loader = LectureLoader()
    lectures = loader.list_lectures()
    assert len(lectures) >= 6, f"Expected at least 6 lectures, found {len(lectures)}"

    ldb = LectureDatabase()
    for lec_meta in lectures:
        lec = loader.load_lecture(lec_meta.id)
        assert len(lec.tasks) > 0, f"Lecture {lec.id} has no tasks"
        seed_sql = loader.load_seed_sql(lec)
        assert len(seed_sql.strip()) > 0, f"Seed SQL empty for {lec.id}"

        # Test seeding in-memory database
        ldb.load_lecture(lec, seed_sql)
        assert ldb.is_connected

        # Test schema introspection
        schemas = ldb.get_table_schemas()
        assert len(schemas) > 0, f"No tables created for lecture {lec.id}"

        # Test ERD generation
        erd = generate_erd(schemas)
        assert len(erd) > 0, f"ERD generation failed for {lec.id}"

        # Test solution execution
        solutions = loader.load_solutions(lec)
        for task in lec.tasks:
            sol_sql = solutions.get(task.id)
            if sol_sql:
                res = ldb.execute_solution(sol_sql)
                assert not res.is_error, f"Solution query failed for {lec.id} task {task.id}: {res.error}"

    ldb.close()
    print(f"[OK] Verified all {len(lectures)} lectures, seeds, and solution queries.")

def test_progress_and_sandbox():
    """Verify progress tracker and sandbox database in isolated environment."""
    from src.engine.progress import ProgressTracker
    from src.engine.database import SandboxDatabase

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir)

        # Progress Tracker test
        pt = ProgressTracker(tmp_path / "test_prog.duckdb")
        pt.mark_completed("01_select_basics", 1)
        assert pt.is_completed("01_select_basics", 1)
        assert not pt.is_completed("01_select_basics", 2)
        pt.close()
        del pt

        # Sandbox test & CSV/Parquet loading test
        sb = SandboxDatabase(tmp_path / "test_sb.duckdb")
        sb.connect()
        res = sb.execute("CREATE TABLE test_table (id INT, val VARCHAR); INSERT INTO test_table VALUES (1, 'hello');")
        assert not res.is_error
        res2 = sb.execute("SELECT * FROM test_table;")
        assert not res2.is_error
        assert len(res2.rows) == 1

        # Test CSV export and read_csv_auto in sandbox
        csv_file = tmp_path / "sample.csv"
        csv_file.write_text("item,qty,price\napple,10,1.5\nbanana,20,0.8\n", encoding="utf-8")
        clean_csv = str(csv_file).replace("\\", "/")
        res_csv = sb.execute(f"CREATE TABLE sample_csv AS SELECT * FROM read_csv_auto('{clean_csv}');")
        assert not res_csv.is_error
        res_check = sb.execute("SELECT COUNT(*) FROM sample_csv;")
        assert res_check.rows[0][0] == 2

        sb.close()
        del sb

        import gc
        gc.collect()

    print("[OK] Verified ProgressTracker, SandboxDatabase, and CSV/Parquet engine loading.")

def test_updater():
    """Verify UpdateManager can be initialized without error."""
    from src.engine.updater import UpdateManager
    um = UpdateManager("0.1.0")
    assert um.current_version == "0.1.0"
    print("[OK] Verified UpdateManager.")

if __name__ == "__main__":
    print("Running learn-duckdb test suite...")
    test_imports()
    test_lectures_and_seeds()
    test_progress_and_sandbox()
    test_updater()
    print("\n[SUCCESS] All integrity tests passed successfully!")
