#!/usr/bin/env python3
"""Regenerate Azure, GCP, and cloud-factory CompTIA exam JSON, index, and slug map."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"


def run(name: str) -> None:
    print(f"\n=== {name} ===")
    subprocess.run([sys.executable, str(SCRIPTS / name)], cwd=str(ROOT), check=True)


def main() -> int:
    for script in (
        "generate_azure_exams.py",
        "generate_gcp_exams.py",
        "generate_comptia_exams.py",
        "build-exams-index.py",
        "build-questions-slugs.py",
    ):
        run(script)
    print("\nDone. Commit data/exams/*.json, data/exams-index.json, data/questions-slugs.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
