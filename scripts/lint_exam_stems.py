#!/usr/bin/env python3
"""Report non-scenario (generic) question stems in data/exams/*.json."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXAMS = ROOT / "data" / "exams"
sys.path.insert(0, str(ROOT / "scripts"))

from question_bank.stem_quality import is_scenario_stem  # noqa: E402


def main() -> int:
    bad: list[str] = []
    for path in sorted(EXAMS.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        for q in data.get("questions", []):
            stem = q.get("text", "")
            if not is_scenario_stem(stem):
                bad.append(f"{path.name} {q.get('id')}: {stem[:90]}…")
    if bad:
        print(f"Found {len(bad)} non-scenario stems:\n")
        for line in bad[:40]:
            print(line)
        if len(bad) > 40:
            print(f"… and {len(bad) - 40} more")
        return 1
    print("All exam stems pass scenario quality checks.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
