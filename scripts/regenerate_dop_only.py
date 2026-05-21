#!/usr/bin/env python3
"""Regenerate data/exams/devops-engineer-professional.json only."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from question_bank.common import validate_pool, write_exam  # noqa: E402
from question_bank.exam_catalog import EXAM_BY_ID  # noqa: E402
from question_bank.official_docs import assert_official_exam  # noqa: E402
from question_bank.question_factory import build_exam_payload  # noqa: E402

EXAM_ID = "devops-engineer-professional"


def main() -> int:
    spec = EXAM_BY_ID[EXAM_ID]
    payload = build_exam_payload(EXAM_ID)
    validate_pool(payload["questions"], payload["domains"], spec.get("min_questions", 70))
    assert_official_exam(payload)
    out = ROOT / "data" / "exams" / f"{EXAM_ID}.json"
    write_exam(out, payload)
    print(f"OK: {len(payload['questions'])} questions -> {out}")
    print(payload["questions"][0]["text"][:100])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
