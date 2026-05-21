"""Build practice question pools from fact banks and scenario templates."""
from __future__ import annotations

import itertools
import random
from typing import Any

from question_bank.common import RawQuestion, dedupe_raw
from question_bank.exam_catalog import EXAM_BY_ID
from question_bank.fact_banks import BANKS, Fact
from question_bank.fact_banks_more import BANKS_MORE
from question_bank.fact_banks_pro import BANKS_PRO

SCENARIO_PREFIXES = [
    "A solutions architect needs to",
    "A development team must",
    "An organization wants to",
    "For a regulated workload, you should",
    "To improve operational excellence,",
    "When designing for high availability,",
    "A startup is building on AWS and needs to",
    "An enterprise platform team plans to",
]

MULTI_RESPONSE_TEMPLATES: list[tuple[str, str, list[str], list[str], str, list[tuple[str, str]]]] = [
    (
        "Which TWO practices align with the AWS Well-Architected Framework? (Select TWO.)",
        "well-architected",
        [
            ("a", "Design for failure and automate recovery"),
            ("b", "Ignore monitoring to reduce cost"),
            ("c", "Test recovery procedures"),
            ("d", "Use single-AZ for all production data stores"),
            ("e", "Document architecture decisions"),
        ],
        ["a", "c", "e"],
        "Reliability and operational excellence emphasize automation, testing, and learning from failure.",
        [("Well-Architected Framework", "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html")],
    ),
    (
        "Which are AWS services used for encryption or key management? (Select TWO.)",
        "security",
        [
            ("a", "AWS KMS"),
            ("b", "Amazon Route 53"),
            ("c", "AWS Secrets Manager"),
            ("d", "Amazon CloudFront only for DNS"),
            ("e", "AWS Batch"),
        ],
        ["a", "c"],
        "KMS manages keys; Secrets Manager stores and rotates secrets.",
        [("AWS KMS", "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html")],
    ),
]


def _merged_banks() -> dict[str, dict[str, list[Fact]]]:
    merged: dict[str, dict[str, list[Fact]]] = {}
    for source in (BANKS, BANKS_MORE, BANKS_PRO):
        for exam_id, domains in source.items():
            merged.setdefault(exam_id, {})
            for domain_id, facts in domains.items():
                merged[exam_id].setdefault(domain_id, []).extend(facts)
    return merged


ALL_BANKS = _merged_banks()


def _fact_to_mcq(domain: str, fact: Fact, prefix: str | None = None) -> RawQuestion:
    stem_suffix, correct, wrong, explanation, doc_title, doc_url = fact
    stem = f"{prefix} {stem_suffix}." if prefix else f"Which AWS service or feature is BEST to {stem_suffix}?"
    options = [("a", correct), ("b", wrong[0]), ("c", wrong[1]), ("d", wrong[2])]
    return (
        domain,
        "multiple-choice",
        stem,
        options,
        ["a"],
        explanation,
        [(doc_title, doc_url)],
    )


def _variant_facts(fact: Fact) -> list[RawQuestion]:
    """Generate alternate stems for the same concept."""
    domain = ""  # filled by caller
    stem_suffix, correct, wrong, explanation, doc_title, doc_url = fact
    variants: list[RawQuestion] = []
    stems = [
        f"Which service should you use to {stem_suffix}?",
        f"What is the MOST appropriate AWS solution to {stem_suffix}?",
        f"A team must {stem_suffix}. Which option meets the requirement?",
    ]
    for stem in stems:
        options = [("a", correct), ("b", wrong[0]), ("c", wrong[1]), ("d", wrong[2])]
        variants.append(
            (
                domain,
                "multiple-choice",
                stem,
                options,
                ["a"],
                explanation,
                [(doc_title, doc_url)],
            )
        )
    return variants


def _scenario_questions(domain: str, facts: list[Fact], count: int, rng: random.Random) -> list[RawQuestion]:
    out: list[RawQuestion] = []
    for fact in facts:
        if len(out) >= count:
            break
        prefix = rng.choice(SCENARIO_PREFIXES)
        out.append(_fact_to_mcq(domain, fact, prefix))
    return out


def _pad_domain(
    exam_id: str,
    domain_id: str,
    facts: list[Fact],
    target: int,
    rng: random.Random,
) -> list[RawQuestion]:
    raw: list[RawQuestion] = []
    for fact in facts:
        raw.append(_fact_to_mcq(domain_id, fact))
    for fact in facts:
        if len(raw) >= target:
            break
        for variant in _variant_facts(fact):
            variant_list = list(variant)
            variant_list[0] = domain_id
            raw.append(tuple(variant_list))  # type: ignore[arg-type]
    raw.extend(_scenario_questions(domain_id, facts, max(0, target - len(raw)), rng))
    # Generic service comparison from facts if still short
    idx = 0
    while len(raw) < target and facts:
        f1, f2 = facts[idx % len(facts)], facts[(idx + 1) % len(facts)]
        idx += 1
        _, c1, w1, e1, t1, u1 = f1
        _, c2, _, e2, t2, u2 = f2
        stem = (
            f"Which capability is provided by {c1} rather than {c2} for a workload that needs to {f1[0]}?"
        )
        raw.append(
            (
                domain_id,
                "multiple-choice",
                stem,
                [("a", c1), ("b", c2), ("c", w1[0]), ("d", w1[1])],
                ["a"],
                f"{e1} Compare with {c2}: {e2}",
                [(t1, u1), (t2, u2)],
            )
        )
    return raw[: max(target, len(raw))]


def _multi_response_for_exam(exam_id: str, domains: list[dict], rng: random.Random) -> list[RawQuestion]:
    """Add a few multiple-response items using domain resources."""
    out: list[RawQuestion] = []
    domain_ids = [d["id"] for d in domains]
    for i, template in enumerate(MULTI_RESPONSE_TEMPLATES):
        text, _tag, opts, correct, explanation, docs = template
        domain = domain_ids[i % len(domain_ids)]
        out.append((domain, "multiple-response", text, opts, correct, explanation, docs))
    # Domain-specific multi-response from first domain resources
    if domains:
        d0 = domains[0]
        res = d0.get("resources", [])
        if len(res) >= 2:
            out.append(
                (
                    d0["id"],
                    "multiple-response",
                    f"Which TWO official AWS resources help you prepare for {EXAM_BY_ID[exam_id]['name']}? (Select TWO.)",
                    [
                        ("a", res[0]["title"]),
                        ("b", "Unofficial leaked exam dumps"),
                        ("c", res[1]["title"] if len(res) > 1 else "Random blogs only"),
                        ("d", "Disable all logging"),
                        ("e", "Share root account keys"),
                    ],
                    ["a", "c"],
                    "Use official AWS exam guides, Skill Builder, and AWS documentation—not real exam content.",
                    [(res[0]["title"], res[0]["url"])],
                )
            )
    rng.shuffle(out)
    return out


def _build_devops_raw_questions(min_total: int, seed: int) -> list[RawQuestion]:
    """DOP-C02: scenario-first pool aligned to exam guide topics (original stems)."""
    from question_bank.dop_c02_scenarios import DOP_SCENARIO_QUESTIONS

    spec = EXAM_BY_ID["devops-engineer-professional"]
    domains = spec["domains"]
    rng = random.Random(seed + hash("devops-engineer-professional") % 10000)
    exam_facts = ALL_BANKS.get("devops-engineer-professional", {})

    raw: list[RawQuestion] = list(DOP_SCENARIO_QUESTIONS)
    total_weight = sum(d["weight"] for d in domains)

    for domain in domains:
        did = domain["id"]
        weight = domain["weight"]
        by_domain = sum(1 for r in raw if r[0] == did)
        target = max(8, int(min_total * weight / total_weight) + 3)
        if by_domain >= target:
            continue
        facts = exam_facts.get(did, [])
        if not facts:
            continue
        domain_raw = _pad_domain("devops-engineer-professional", did, facts, target - by_domain, rng)
        raw.extend(domain_raw)

    raw.extend(_multi_response_for_exam("devops-engineer-professional", domains, rng))
    raw = dedupe_raw(raw)

    fact_pool = list(itertools.chain.from_iterable(exam_facts.values()))
    attempt = 0
    seen = {r[2] for r in raw}
    while len(raw) < min_total and fact_pool and attempt < min_total * 4:
        fact = fact_pool[attempt % len(fact_pool)]
        domain_id = domains[attempt % len(domains)]["id"]
        prefix = rng.choice(SCENARIO_PREFIXES)
        candidate = _fact_to_mcq(domain_id, fact, prefix)
        if candidate[2] not in seen:
            raw.append(candidate)
            seen.add(candidate[2])
        attempt += 1

    if len(raw) < min_total:
        raise SystemExit(
            f"devops-engineer-professional: generated {len(raw)} unique questions, need {min_total}."
        )
    return raw


def build_raw_questions(exam_id: str, min_total: int, seed: int = 42) -> list[RawQuestion]:
    if exam_id == "devops-engineer-professional":
        return _build_devops_raw_questions(min_total, seed)

    spec = EXAM_BY_ID[exam_id]
    domains = spec["domains"]
    rng = random.Random(seed + hash(exam_id) % 10000)
    exam_facts = ALL_BANKS.get(exam_id, {})

    raw: list[RawQuestion] = []
    total_weight = sum(d["weight"] for d in domains)

    for domain in domains:
        did = domain["id"]
        weight = domain["weight"]
        target = max(8, int(min_total * weight / total_weight) + 3)
        facts = exam_facts.get(did, [])
        if not facts:
            # Fallback: borrow facts from SAA resilient domain shape
            facts = exam_facts.get(list(exam_facts.keys())[0], []) if exam_facts else []
        domain_raw = _pad_domain(exam_id, did, facts, target, rng)
        raw.extend(domain_raw)

    raw.extend(_multi_response_for_exam(exam_id, domains, rng))

    # Exam-specific conceptual questions from domain resources
    for domain in domains:
        for res in domain.get("resources", [])[:2]:
            raw.append(
                (
                    domain["id"],
                    "multiple-choice",
                    f"According to AWS best practices documented in '{res['title']}', what should you do FIRST when addressing {domain['name'].split(':')[-1].strip()} objectives?",
                    [
                        ("a", "Review the official AWS documentation and align designs to the exam guide domains"),
                        ("b", "Disable security logging to reduce noise"),
                        ("c", "Use root user credentials for daily operations"),
                        ("d", "Skip backup and recovery planning"),
                    ],
                    ["a"],
                    f"Official guides such as {res['title']} describe domain objectives; practice designs should follow AWS documented best practices.",
                    [(res["title"], res["url"])],
                )
            )

    raw = dedupe_raw(raw)

    # Ensure minimum count with combinatorial scenario wraps
    fact_pool = list(itertools.chain.from_iterable(exam_facts.values()))
    attempt = 0
    seen = {r[2] for r in raw}
    while len(raw) < min_total and fact_pool and attempt < min_total * 4:
        fact = fact_pool[attempt % len(fact_pool)]
        domain_id = domains[attempt % len(domains)]["id"]
        prefix = rng.choice(SCENARIO_PREFIXES)
        candidate = _fact_to_mcq(domain_id, fact, prefix)
        if candidate[2] not in seen:
            raw.append(candidate)
            seen.add(candidate[2])
        attempt += 1

    if len(raw) < min_total:
        raise SystemExit(
            f"{exam_id}: generated {len(raw)} unique questions, need {min_total}. "
            "Add more facts to question_bank for this exam."
        )
    return raw


def build_exam_payload(exam_id: str) -> dict[str, Any]:
    spec = EXAM_BY_ID[exam_id]
    min_q = spec.get("min_questions", 70)
    raw = build_raw_questions(exam_id, min_q)
    if len(raw) < min_q:
        raise SystemExit(f"{exam_id}: only generated {len(raw)} questions, need {min_q}")

    prefix = exam_id.replace("-", "")[:6]
    if exam_id == "ai-practitioner":
        prefix = "aif"
    elif exam_id == "solutions-architect-associate":
        prefix = "saa"
    elif exam_id == "developer-associate":
        prefix = "dva"
    elif exam_id == "machine-learning-engineer-associate":
        prefix = "mla"
    elif exam_id == "data-engineer-associate":
        prefix = "dea"
    elif exam_id == "cloudops-engineer-associate":
        prefix = "soa"
    elif exam_id == "solutions-architect-professional":
        prefix = "sap"
    elif exam_id == "devops-engineer-professional":
        prefix = "dop"
    elif exam_id == "generative-ai-developer-professional":
        prefix = "aip"
    elif exam_id == "advanced-networking-specialty":
        prefix = "ans"
    elif exam_id == "security-specialty":
        prefix = "scs"

    from question_bank.common import build_questions

    questions = build_questions(raw, prefix)
    return {
        "id": spec["id"],
        "name": spec["name"],
        "code": spec["code"],
        "vendor": "aws",
        "exam": spec["exam"],
        "domains": spec["domains"],
        "questions": questions,
    }
