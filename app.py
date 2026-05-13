#!/usr/bin/env python3
"""learn-duckdb — Interactive SQL learning in your terminal.

Usage:
    uv run app.py
"""

from src.ui.app import LearnDuckDBApp


def main():
    app = LearnDuckDBApp()
    app.run()


if __name__ == "__main__":
    main()
