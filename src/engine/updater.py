"""Modular auto-update checker and installer for learn-duckdb."""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen

CURRENT_VERSION = "0.1.1"
GITHUB_REPO = "haydermuhib/learn-duckdb"
GITHUB_RAW_PYPROJECT = f"https://raw.githubusercontent.com/{GITHUB_REPO}/main/pyproject.toml"
GITHUB_RELEASES_API = f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest"


@dataclass
class UpdateInfo:
    """Information about an available software update."""
    current_version: str
    latest_version: str
    release_notes: str = ""
    is_newer: bool = False


def _parse_version(v_str: str) -> tuple[int, ...]:
    """Parse version string like 'v0.2.1' or '0.2.1' into comparable tuple."""
    clean = re.sub(r"^[^\d]*", "", v_str.strip())
    nums = re.findall(r"\d+", clean)
    return tuple(int(n) for n in nums) if nums else (0, 0, 0)


class UpdateManager:
    """Checks for and performs non-blocking application updates."""

    def __init__(self, current_version: str = CURRENT_VERSION):
        self.current_version = current_version

    def check_for_updates(self, timeout: float = 2.0) -> UpdateInfo | None:
        """Check GitHub for newer versions. Returns UpdateInfo if newer, else None.
        
        Designed to be ultra-fast and fail-safe (never raises on offline or timeout).
        """
        try:
            # 1. Try GitHub Releases API first
            req = Request(
                GITHUB_RELEASES_API,
                headers={"User-Agent": "learn-duckdb-updater"},
            )
            with urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    latest_tag = data.get("tag_name", "")
                    notes = data.get("body", "")
                    if latest_tag:
                        latest_v = _parse_version(latest_tag)
                        curr_v = _parse_version(self.current_version)
                        if latest_v > curr_v:
                            return UpdateInfo(
                                current_version=self.current_version,
                                latest_version=latest_tag.lstrip("v"),
                                release_notes=notes,
                                is_newer=True,
                            )
                        return None
        except Exception:
            pass

        # 2. Fallback: Check raw pyproject.toml on main branch
        try:
            req = Request(
                GITHUB_RAW_PYPROJECT,
                headers={"User-Agent": "learn-duckdb-updater"},
            )
            with urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    content = resp.read().decode("utf-8")
                    match = re.search(r'version\s*=\s*"([^"]+)"', content)
                    if match:
                        latest_ver_str = match.group(1)
                        latest_v = _parse_version(latest_ver_str)
                        curr_v = _parse_version(self.current_version)
                        if latest_v > curr_v:
                            return UpdateInfo(
                                current_version=self.current_version,
                                latest_version=latest_ver_str,
                                release_notes="Latest updates and improvements from GitHub main.",
                                is_newer=True,
                            )
        except Exception:
            pass

        return None

    def perform_update(self) -> tuple[bool, str]:
        """Perform the update in-place based on execution environment."""
        # 1. Check if uv tool is managing this
        if shutil.which("uv"):
            try:
                cmd = ["uv", "tool", "install", "--force", f"git+https://github.com/{GITHUB_REPO}.git"]
                proc = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
                if proc.returncode == 0:
                    return True, "Updated successfully via uv tool. Please restart learn-duckdb."
            except Exception as e:
                pass

        # 2. Check if git workspace
        repo_root = Path(__file__).resolve().parent.parent.parent
        git_dir = repo_root / ".git"
        if git_dir.exists() and shutil.which("git"):
            try:
                proc = subprocess.run(["git", "pull"], cwd=repo_root, capture_output=True, text=True, timeout=30)
                if proc.returncode == 0:
                    return True, "Repository pulled successfully. Please restart learn-duckdb."
            except Exception:
                pass

        # 3. Fallback to pip
        try:
            proc = subprocess.run(
                [sys.executable, "-m", "pip", "install", "--upgrade", f"git+https://github.com/{GITHUB_REPO}.git"],
                capture_output=True,
                text=True,
                timeout=60,
            )
            if proc.returncode == 0:
                return True, "Updated successfully via pip. Please restart learn-duckdb."
            return False, f"Update failed: {proc.stderr[:200]}"
        except Exception as e:
            return False, f"Update failed: {str(e)}"
