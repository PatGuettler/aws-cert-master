#!/usr/bin/env python3
"""Scan data/exams/*.json and write data/exams-index.json for the static app."""
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXAMS_DIR = ROOT / "data" / "exams"
INDEX_PATH = ROOT / "data" / "exams-index.json"

REQUIRED_FIELDS = ("id", "name", "exam", "domains", "questions")


def validate_exam(data: dict, path: Path) -> list[str]:
    errors = []
    for field in REQUIRED_FIELDS:
        if field not in data:
            errors.append(f"missing '{field}'")
    if "id" in data and not isinstance(data["id"], str):
        errors.append("id must be a string")
    if "questions" in data and not isinstance(data["questions"], list):
        errors.append("questions must be an array")
    if errors:
        return [f"{path.name}: " + ", ".join(errors)]
    return []


def build_index() -> dict:
    if not EXAMS_DIR.is_dir():
        EXAMS_DIR.mkdir(parents=True, exist_ok=True)

    exams = []
    errors = []

    for path in sorted(EXAMS_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"{path.name}: invalid JSON ({exc})")
            continue

        if not isinstance(data, dict):
            errors.append(f"{path.name}: root must be an object")
            continue

        file_errors = validate_exam(data, path)
        if file_errors:
            errors.extend(file_errors)
            continue

        exams.append({
            "id": data["id"],
            "name": data["name"],
            "code": data.get("code", ""),
            "dataFile": f"data/exams/{path.name}",
            "questionCount": len(data["questions"]),
        })

    if errors:
        raise SystemExit("Exam validation failed:\n" + "\n".join(errors))

    return {
        "exams": exams,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
    }


def main() -> None:
    payload = build_index()
    INDEX_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(payload['exams'])} exam(s) to {INDEX_PATH}")
    for exam in payload["exams"]:
        print(f"  - {exam['id']}: {exam['name']} ({exam['questionCount']} questions)")


if __name__ == "__main__":
    main()
