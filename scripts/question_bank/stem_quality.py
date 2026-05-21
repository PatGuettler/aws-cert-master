"""Detect exam-style scenario stems vs generic/templated certification questions."""
from __future__ import annotations

import re

# Stems matching these are rejected from generated pools (case-insensitive).
GENERIC_STEM_PATTERNS: tuple[re.Pattern[str], ...] = tuple(
    re.compile(p, re.I)
    for p in (
        r"^Which (AWS |Microsoft |Google )?service (or feature )?is BEST\b",
        r"^Which service should you use\b",
        r"^What is the MOST appropriate (AWS )?solution\b",
        r"^A team must .+ Which option meets the requirement\?\s*$",
        r"^You are preparing for\b",
        r"^Which (TWO|THREE) official\b",
        r"^Which source aligns with\b",
        r"^During a tabletop on .+ measurable KPI\b",
        r"^An audit sampling .+ controls finds inconsistent enforcement between sites\b",
        r"\(variant \d+\)\s*\.",
        r"^Which option is correct\?\s*$",
        r"^What is the best practice for\b",
    )
)

MIN_SCENARIO_WORDS = 14


def is_scenario_stem(stem: str) -> bool:
    """True if stem reads like a practice-cert scenario (company context + decision)."""
    text = (stem or "").strip()
    if len(text) < 40:
        return False
    if len(text.split()) < MIN_SCENARIO_WORDS:
        return False
    for pat in GENERIC_STEM_PATTERNS:
        if pat.search(text):
            return False
    # Prefer narrative openers used on real practice exams
    narrative_markers = (
        "A company",
        "An organization",
        "A team",
        "A startup",
        "A hospital",
        "A financial",
        "A manufacturing",
        "A retail",
        "A healthcare",
        "A government",
        "After ",
        "During ",
        "While ",
        "The security",
        "The DevOps",
        "Operations ",
        "Finance ",
        "SOC ",
        "Your organization",
        "Leadership ",
        "A help desk",
        "A data engineer",
        "A solutions architect",
        "A development team",
        "For a regulated",
        "When ",
        "Users report",
        "Auditors ",
        "Investigators ",
    )
    if not any(m in text for m in narrative_markers):
        return False
    return True
