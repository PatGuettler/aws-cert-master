#!/usr/bin/env python3
"""Generate KeyTrain's Key Training exam JSON files under data/exams/."""
from __future__ import annotations

import importlib.util
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXAMS_DIR = ROOT / "data" / "exams"
sys.path.insert(0, str(ROOT / "scripts"))

from question_bank.common import write_exam  # noqa: E402
from question_bank.stem_quality import is_scenario_stem  # noqa: E402
from question_bank.key_training_catalog import BY_ID, KEY_TRAINING_CATEGORIES  # noqa: E402
from question_bank.key_training_questions import QUESTIONS_BY_DOMAIN  # noqa: E402
from question_bank.key_training_questions_extended import EXTENDED_BY_DOMAIN  # noqa: E402
from question_bank.key_training_option_balance import (  # noqa: E402
    assert_no_length_bias,
    balance_mcq_options,
)
from question_bank.near_miss_distractors import upgrade_wrong_options  # noqa: E402
from question_bank.key_training_domain_concepts import DOMAIN_CONCEPTS  # noqa: E402

DEFAULT_DOCS = [
    (
        "NIST Cybersecurity Framework",
        "https://www.nist.gov/cyberframework",
    ),
    (
        "CISA Cybersecurity Guidance",
        "https://www.cisa.gov/topics/cybersecurity-best-practices",
    ),
]

EXAM_TOTAL = 20
EXAM_SCORED = 20
EXAM_MINUTES = 45
PASSING = 750
MAX_SCORE = 1000
MIN_POOL = 16


def _merged_templates(domain_id: str) -> list:
    base = list(QUESTIONS_BY_DOMAIN.get(domain_id, []))
    base.extend(EXTENDED_BY_DOMAIN.get(domain_id, []))
    return base


def _options(correct: str, wrong: list[str]) -> list[tuple[str, str]]:
    upgraded_wrong = upgrade_wrong_options(correct, wrong)
    balanced_correct, balanced_wrong = balance_mcq_options(correct, upgraded_wrong)
    texts = [balanced_correct, *balanced_wrong]
    assert_no_length_bias(balanced_correct, texts)
    items = [(balanced_correct, balanced_correct)] + [
        (w, w) for w in balanced_wrong
    ]
    random.shuffle(items)
    labels = ["a", "b", "c", "d"]
    return [(labels[i], text) for i, (_, text) in enumerate(items)]


def _correct_ids(opts: list[tuple[str, str]], correct_text: str) -> list[str]:
    for oid, text in opts:
        if text == correct_text:
            return [oid]
    return ["a"]


def validate_key_training_pool(questions: list[dict], domains: list[dict]) -> None:
    by_domain: dict[str, int] = {}
    for q in questions:
        by_domain[q["domain"]] = by_domain.get(q["domain"], 0) + 1
    errors: list[str] = []
    if len(questions) < MIN_POOL:
        errors.append(f"pool has {len(questions)} questions, need at least {MIN_POOL}")
    for d in domains:
        if by_domain.get(d["id"], 0) < 2:
            errors.append(f"{d['id']}: need at least 2 questions in bank")
    if errors:
        raise SystemExit("Question pool validation failed:\n" + "\n".join(errors))


def build_questions_for_category(cat_id: str) -> list[dict]:
    cat = BY_ID[cat_id]
    prefix = cat.code.lower().replace("-", "")
    questions: list[dict] = []
    n = 0
    for domain in cat.domains:
        templates = _merged_templates(domain.id)
        if not templates:
            raise SystemExit(f"Missing questions for domain {domain.id} in {cat_id}")
        for stem, correct, wrong, explanation in templates:
            n += 1
            opts = _options(correct, wrong)
            balanced_correct, _ = balance_mcq_options(correct, upgrade_wrong_options(correct, wrong))
            concept = DOMAIN_CONCEPTS.get(domain.id, domain.name)
            questions.append(
                {
                    "id": f"{prefix}-q{n:03d}",
                    "domain": domain.id,
                    "type": "multiple-choice",
                    "text": stem,
                    "options": [{"id": oid, "text": text} for oid, text in opts],
                    "correct": _correct_ids(opts, balanced_correct),
                    "explanation": explanation,
                    "concept": concept,
                    "docs": [{"title": t, "url": u} for t, u in DEFAULT_DOCS],
                }
            )
    return questions


def build_payload(cat_id: str) -> dict:
    cat = BY_ID[cat_id]
    questions = build_questions_for_category(cat_id)
    pool_size = len(questions)
    exam_count = min(EXAM_TOTAL, pool_size)
    if pool_size < MIN_POOL:
        raise SystemExit(f"{cat_id}: pool {pool_size} < {MIN_POOL}")
    domains = [
        {
            "id": d.id,
            "name": d.name,
            "weight": d.weight,
            "resources": [{"title": t, "url": u} for t, u in DEFAULT_DOCS],
        }
        for d in cat.domains
    ]
    return {
        "id": cat.id,
        "name": f"KeyTrain's Key Training — {cat.name}",
        "code": cat.code,
        "vendor": "keytraining",
        "program": "key-training",
        "exam": {
            "totalQuestions": exam_count,
            "scoredQuestions": exam_count,
            "timeLimitMinutes": EXAM_MINUTES,
            "passingScore": PASSING,
            "maxScore": MAX_SCORE,
            "selectionMode": "weighted-random",
        },
        "domains": domains,
        "questions": questions,
    }


def rebuild_index() -> None:
    spec = importlib.util.spec_from_file_location(
        "build_exams_index",
        ROOT / "scripts" / "build-exams-index.py",
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.main()


def rebuild_keytrain_index() -> None:
    spec = importlib.util.spec_from_file_location(
        "build_keytrain_index",
        ROOT / "scripts" / "build-keytrain-index.py",
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.main()


def main() -> int:
    random.seed(42)
    for cat in KEY_TRAINING_CATEGORIES:
        payload = build_payload(cat.id)
        if len(payload["questions"]) < MIN_POOL:
            raise SystemExit(
                f"{cat.id}: only {len(payload['questions'])} scenario questions (need {MIN_POOL})"
            )
        validate_key_training_pool(payload["questions"], payload["domains"])
        out = EXAMS_DIR / f"{cat.id}.json"
        write_exam(out, payload)
        print(f"Wrote {len(payload['questions'])} questions -> {out.name}")

    rebuild_index()
    rebuild_keytrain_index()
    print("Rebuilt exams-index.json and keytrain-index.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
