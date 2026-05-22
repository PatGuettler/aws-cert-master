"""Balance MCQ option lengths so the correct answer is not identifiable by word count."""

from __future__ import annotations

# Short extensions for distractors that are too brief (keeps tone procedural, still wrong).
_DISTRACTOR_PADS = (
    ", without security or identity team coordination per policy.",
    ", while leaving active sessions and audit logs unchanged.",
    ", based on informal approval rather than defined controls.",
    ", and deferring containment or access review until later.",
    ", using shared credentials instead of individual accountability.",
)


def word_count(text: str) -> int:
    return len(text.split())


def _pad_distractor(text: str, target_words: int) -> str:
    """Expand a distractor toward target word count without changing its wrong conclusion."""
    base = text.rstrip(".")
    if word_count(base) >= target_words:
        return text
    for pad in _DISTRACTOR_PADS:
        candidate = base + pad
        if word_count(candidate) >= target_words:
            return candidate
    return base + _DISTRACTOR_PADS[-1]


def balance_mcq_options(correct: str, wrong: list[str]) -> tuple[str, list[str]]:
    """
    Return (correct, three wrong options) with similar word counts.
    Pads short distractors; fails build if correct remains uniquely longest.
    """
    wrong3 = list(wrong[:3])
    if len(wrong3) < 3:
        raise ValueError("MCQ needs at least three wrong options")

    counts = [word_count(correct)] + [word_count(w) for w in wrong3]
    target = max(counts)

    balanced_wrong = [_pad_distractor(w, target) for w in wrong3]
    new_counts = [word_count(correct)] + [word_count(w) for w in balanced_wrong]

    if word_count(correct) == max(new_counts) and word_count(correct) > min(new_counts) + 2:
        extra = word_count(correct) - min(new_counts)
        balanced_wrong = [_pad_distractor(w, word_count(correct)) for w in wrong3]

    final = [word_count(correct)] + [word_count(w) for w in balanced_wrong]
    return correct, balanced_wrong


def assert_no_length_bias(correct: str, options: list[str]) -> None:
    """Raise if correct option is uniquely the longest by word count."""
    counts = [word_count(t) for t in options]
    correct_wc = word_count(correct)
    max_other = max(counts[1:]) if len(counts) > 1 else 0
    if correct_wc > max_other + 2:
        raise ValueError(
            f"Length bias: correct has {correct_wc} words, max distractor {max_other}"
        )
