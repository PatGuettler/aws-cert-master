#!/usr/bin/env python3
"""Download MIT-licensed practice questions and cache them for exam generation."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from question_bank.open_source_import import import_source, save_cache  # noqa: E402
from question_bank.stem_quality import is_scenario_stem  # noqa: E402


def main() -> int:
    catalog_path = ROOT / "scripts" / "question_bank" / "open_source_catalog.json"
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    for source in catalog["sources"]:
        sid = source["id"]
        print(f"Importing {sid} from {source['url']} …")
        try:
            limit = 800 if sid == "anaxkgs-security" else 200
            raw = import_source(sid, max_items=limit)
        except Exception as exc:
            print(f"  FAILED: {exc}", file=sys.stderr)
            continue
        scenario = [r for r in raw if is_scenario_stem(r[2])]
        path = save_cache(sid, scenario)
        print(f"  Saved {len(scenario)} scenario questions -> {path}")
    print("\nDone. Run scripts/regenerate_all_practice.py to merge into exam JSON.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
