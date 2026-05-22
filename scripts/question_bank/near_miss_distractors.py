"""Upgrade weak MCQ distractors to near-miss, similar-length procedural options."""

from __future__ import annotations

from question_bank.key_training_option_balance import balance_mcq_options, word_count

# Appended to short wrong answers to make them plausible incomplete sequences.
_NEAR_MISS_SUFFIXES = (
    ", while leaving refresh tokens and OAuth consent grants active pending user callback",
    ", without preserving cloud audit logs or hunting mailbox rules and delegate permissions",
    ", using password reset alone and deferring session revocation until the next business day",
    ", but skipping enterprise-wide IOC blocking and cross-mailbox persistence hunts",
    ", after waiting for end-user confirmation before any containment or credential rotation",
    ", while disabling security tooling temporarily to reduce alert noise during investigation",
)


def _needs_upgrade(correct: str, wrong: str) -> bool:
    cw = word_count(correct)
    ww = word_count(wrong)
    if cw == 0:
        return False
    if ww >= max(cw * 0.75, cw - 3):
        return False
    return True


def _upgrade_one(correct: str, wrong: str, index: int) -> str:
    base = wrong.rstrip(".")
    suffix = _NEAR_MISS_SUFFIXES[index % len(_NEAR_MISS_SUFFIXES)]
    candidate = base + suffix
    target = word_count(correct)
    if word_count(candidate) < target:
        from question_bank.key_training_option_balance import _pad_distractor

        return _pad_distractor(candidate, target)
    return candidate


def upgrade_wrong_options(correct: str, wrong: list[str]) -> list[str]:
    """Return three near-miss distractors, then length-balanced against correct."""
    wrong3 = list(wrong[:3])
    if len(wrong3) < 3:
        raise ValueError("need at least three wrong options")
    upgraded = [
        _upgrade_one(correct, w, i) if _needs_upgrade(correct, w) else w.rstrip(".")
        for i, w in enumerate(wrong3)
    ]
    _, balanced = balance_mcq_options(correct, upgraded)
    return balanced
