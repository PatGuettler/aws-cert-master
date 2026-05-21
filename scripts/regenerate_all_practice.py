#!/usr/bin/env python3
"""Regenerate all practice exam JSON with scenario-style stems."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    import_script = ROOT / "scripts" / "import_open_source_questions.py"
    cache_dir = ROOT / "data" / "open-source-cache"
    if import_script.is_file() and not any(cache_dir.glob("*.json")):
        print("=== import_open_source_questions (first-time cache) ===")
        rc = subprocess.call([sys.executable, str(import_script)], cwd=str(ROOT))
        if rc != 0:
            print("Warning: open-source import failed; continuing with fact banks only.")

    scripts = [
        ROOT / "scripts" / "generate_all_aws_exams.py",
        ROOT / "scripts" / "generate_all_vendors.py",
        ROOT / "scripts" / "generate_key_training_exams.py",
    ]
    for script in scripts:
        if not script.is_file():
            print(f"Skip missing {script}")
            continue
        print(f"\n=== {script.name} ===")
        rc = subprocess.call([sys.executable, str(script)], cwd=str(ROOT))
        if rc != 0:
            return rc
    print("\nAll practice exams regenerated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
