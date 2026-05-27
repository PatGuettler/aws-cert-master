"""Build CompTIA practice exam JSON payloads from fact banks."""
from __future__ import annotations

import random
from typing import Any

from question_bank.common import RawQuestion, build_questions, dedupe_raw
from question_bank.comptia_catalog import COMPTIA_BY_ID
from question_bank.comptia_fact_banks import FACT_BANKS
from question_bank.comptia_acronyms import ACRONYMS_BY_EXAM
from question_bank.open_source_import import merge_for_exam
from question_bank.vendor_mcq_hardening import finalize_vendor_raw_pool, harden_exam_payload


def _mcq(
    domain: str,
    stem: str,
    correct: str,
    wrong: tuple[str, str, str],
    explanation: str,
    doc: tuple[str, str],
) -> RawQuestion:
    return (
        domain,
        "multiple-choice",
        stem,
        [("a", correct), ("b", wrong[0]), ("c", wrong[1]), ("d", wrong[2])],
        ["a"],
        explanation,
        [doc],
    )


def _multi(
    domain: str,
    stem: str,
    options: list[tuple[str, str]],
    correct: list[str],
    explanation: str,
    doc: tuple[str, str],
) -> RawQuestion:
    return (domain, "multiple-response", stem, options, correct, explanation, [doc])


def _domain_doc(spec: dict, domain_id: str) -> tuple[str, str]:
    for domain in spec["domains"]:
        if domain["id"] == domain_id and domain.get("resources"):
            res = domain["resources"][0]
            return res["title"], res["url"]
    fallback = spec["domains"][0]["resources"][0]
    return fallback["title"], fallback["url"]


def _expand_bank(exam_id: str, bank: dict[str, list[tuple]]) -> list[RawQuestion]:
    spec = COMPTIA_BY_ID[exam_id]
    raw: list[RawQuestion] = []

    for domain_id, items in bank.items():
        doc = _domain_doc(spec, domain_id)
        for item in items:
            if len(item) == 5:
                stem, correct, wrong, expl, alt_stem = item
                raw.append(_mcq(domain_id, stem, correct, wrong, expl, doc))
                if alt_stem:
                    raw.append(
                        _mcq(domain_id, alt_stem, correct, wrong, expl, doc)
                    )
            elif len(item) == 6:
                stem, opts, correct, expl, _, _ = item
                raw.append(_multi(domain_id, stem, opts, correct, expl, doc))

    return raw


def build_comptia_payload(exam_id: str) -> dict[str, Any]:
    spec = COMPTIA_BY_ID[exam_id]
    bank = FACT_BANKS[exam_id]
    raw = dedupe_raw(_expand_bank(exam_id, bank))
    seen = {r[2] for r in raw}
    merge_for_exam(exam_id, raw, seen, max_add=60)
    peer_map: dict[str, list[str]] = {}
    for domain_id, items in bank.items():
        peers: list[str] = []
        for item in items:
            if len(item) >= 3 and isinstance(item[1], str):
                peers.append(item[1])
        peer_map[domain_id] = peers
    seed = 42 + hash(exam_id) % 10000
    raw = finalize_vendor_raw_pool(raw, peer_map, "comptia", seed)
    prefix = exam_id.replace("comptia-", "cpt").replace("-", "")[:6]
    questions = build_questions(raw, prefix)

    payload = {
        "id": spec["id"],
        "name": spec["name"],
        "code": spec["code"],
        "vendor": spec["vendor"],
        "exam": spec["exam"],
        "domains": spec["domains"],
        "questions": questions,
        "acronyms": ACRONYMS_BY_EXAM.get(exam_id, []),
    }
    return harden_exam_payload(payload, seed=seed)
