"""Download and normalize MIT/open-licensed practice questions into RawQuestion tuples."""
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path
from typing import Any

from question_bank.common import RawQuestion
from question_bank.stem_quality import is_scenario_stem

ROOT = Path(__file__).resolve().parents[2]
CACHE_DIR = ROOT / "data" / "open-source-cache"
CATALOG_PATH = Path(__file__).resolve().parent / "open_source_catalog.json"

# exam_id -> list of (keyword in stem, domain_id)
AWS_EXAM_KEYWORDS: dict[str, list[tuple[str, str]]] = {
    "cloud-practitioner": [
        ("s3", "cloud-concepts"),
        ("ec2", "cloud-concepts"),
        ("iam", "security"),
        ("cloudwatch", "technology"),
        ("billing", "billing"),
        ("cost", "billing"),
        ("support plan", "cloud-concepts"),
        ("well-architected", "cloud-concepts"),
    ],
    "solutions-architect-associate": [
        ("vpc", "design-resilient"),
        ("availability zone", "design-resilient"),
        ("load balancer", "design-resilient"),
        ("rds", "design-high-performing"),
        ("dynamodb", "design-high-performing"),
        ("s3", "design-high-performing"),
        ("cloudfront", "design-high-performing"),
        ("kms", "design-secure"),
        ("iam", "design-secure"),
    ],
    "developer-associate": [
        ("lambda", "deployment"),
        ("api gateway", "deployment"),
        ("dynamodb", "development"),
        ("sqs", "development"),
        ("codepipeline", "deployment"),
        ("cognito", "security"),
    ],
    "data-engineer-associate": [
        ("glue", "data-ingestion"),
        ("athena", "data-analytics"),
        ("redshift", "data-store"),
        ("kinesis", "data-ingestion"),
        ("emr", "data-ingestion"),
    ],
    "devops-engineer-professional": [
        ("codepipeline", "cicd"),
        ("cloudformation", "cicd"),
        ("systems manager", "monitoring"),
        ("cloudwatch", "monitoring"),
        ("ecs", "cicd"),
        ("eks", "cicd"),
    ],
    "security-specialty": [
        ("guardduty", "incident-response"),
        ("security hub", "incident-response"),
        ("kms", "data-protection"),
        ("waf", "infrastructure-protection"),
        ("macie", "data-protection"),
    ],
}

SECURITY_DOMAIN_KEYWORDS: list[tuple[str, str]] = [
    ("phish", "threats"),
    ("malware", "threats"),
    ("ransomware", "threats"),
    ("firewall", "architecture"),
    ("encryption", "general"),
    ("mfa", "general"),
    ("siem", "operations"),
    ("vulnerability", "threats"),
    ("zero trust", "architecture"),
    ("incident", "operations"),
    ("hipaa", "program"),
    ("risk", "program"),
]


def _fetch_json(url: str) -> Any:
    req = urllib.request.Request(url, headers={"User-Agent": "cert-master-importer/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _normalize_option_letter(raw: str) -> tuple[str, str]:
    raw = raw.strip()
    m = re.match(r"^([A-E])\.\s*(.*)$", raw, re.I)
    if m:
        return m[1].lower(), m[2].strip()
    return "a", raw


def _tinhtq_to_raw(items: list[dict], source_id: str) -> list[RawQuestion]:
    out: list[RawQuestion] = []
    for item in items:
        stem = (item.get("question") or "").strip()
        if not is_scenario_stem(stem):
            continue
        opts_raw = item.get("options") or []
        if len(opts_raw) < 4:
            continue
        options = [_normalize_option_letter(o) for o in opts_raw[:4]]
        correct_idx = int(item.get("correctAnswer", 0))
        if correct_idx < 0 or correct_idx >= len(options):
            correct_idx = 0
        correct_id = options[correct_idx][0]
        explanation = (item.get("explanation") or "See official AWS documentation.").strip()
        explanation += f" (Adapted from {source_id}, MIT License.)"
        exam_id = _map_aws_exam(stem)
        domain_id = _map_aws_domain(exam_id, stem)
        doc = ("AWS Documentation", "https://docs.aws.amazon.com/")
        out.append(
            (
                domain_id,
                "multiple-choice",
                stem,
                options,
                [correct_id],
                explanation,
                [doc],
            )
        )
    return out


def _map_aws_exam(stem: str) -> str:
    lower = stem.lower()
    scores: dict[str, int] = {}
    for exam_id, rules in AWS_EXAM_KEYWORDS.items():
        scores[exam_id] = sum(1 for kw, _ in rules if kw in lower)
    best = max(scores, key=scores.get, default="cloud-practitioner")
    if scores.get(best, 0) == 0:
        return "solutions-architect-associate"
    return best


def _map_aws_domain(exam_id: str, stem: str) -> str:
    lower = stem.lower()
    rules = AWS_EXAM_KEYWORDS.get(exam_id, [])
    for kw, domain_id in rules:
        if kw in lower:
            return domain_id
    from question_bank.exam_catalog import EXAM_BY_ID

    spec = EXAM_BY_ID.get(exam_id)
    if spec and spec.get("domains"):
        return spec["domains"][0]["id"]
    return "general"


def _anaxkgs_to_raw(items: list[dict], source_id: str) -> list[RawQuestion]:
    out: list[RawQuestion] = []
    for item in items:
        stem = (item.get("question") or item.get("text") or "").strip()
        if not is_scenario_stem(stem):
            continue
        answers = item.get("answers") or item.get("options") or []
        if len(answers) < 4:
            continue
        options: list[tuple[str, str]] = []
        for i, ans in enumerate(answers[:4]):
            if isinstance(ans, dict):
                options.append((chr(ord("a") + i), str(ans.get("text", ans.get("answer", "")))))
            else:
                options.append(_normalize_option_letter(str(ans)))
        correct = item.get("correct") or item.get("correctAnswer") or "a"
        if isinstance(correct, int):
            correct = chr(ord("a") + correct)
        correct = str(correct).lower().strip()[:1]
        if correct not in {o[0] for o in options}:
            correct = "a"
        domain_id = _map_security_domain(stem)
        explanation = (item.get("explanation") or "Review CompTIA Security+ objectives.").strip()
        explanation += f" (Adapted from {source_id}, MIT License.)"
        doc = ("CompTIA Security+", "https://www.comptia.org/certifications/security")
        out.append(
            (
                domain_id,
                "multiple-choice",
                stem,
                options,
                [correct],
                explanation,
                [doc],
            )
        )
    return out


def _map_security_domain(stem: str) -> str:
    lower = stem.lower()
    for kw, domain_id in SECURITY_DOMAIN_KEYWORDS:
        if kw in lower:
            return domain_id
    return "general"


def import_source(source_id: str, *, max_items: int | None = 500) -> list[RawQuestion]:
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    source = next((s for s in catalog["sources"] if s["id"] == source_id), None)
    if not source:
        raise ValueError(f"Unknown source {source_id}")

    data = _fetch_json(source["data_url"])
    fmt = source.get("format", "")
    if fmt == "tinhtq_json":
        raw = _tinhtq_to_raw(data if isinstance(data, list) else [], source_id)
    elif fmt == "anaxkgs_json":
        raw = _anaxkgs_to_raw(data if isinstance(data, list) else [], source_id)
    else:
        raise ValueError(f"Unsupported format {fmt}")

    if max_items:
        raw = raw[:max_items]
    return raw


def save_cache(source_id: str, raw: list[RawQuestion]) -> Path:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = CACHE_DIR / f"{source_id}.json"
    payload = [
        {
            "domain": r[0],
            "type": r[1],
            "text": r[2],
            "options": [{"id": o[0], "text": o[1]} for o in r[3]],
            "correct": r[4],
            "explanation": r[5],
            "docs": [{"title": t, "url": u} for t, u in r[6]],
        }
        for r in raw
    ]
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def load_cache(source_id: str) -> list[RawQuestion]:
    path = CACHE_DIR / f"{source_id}.json"
    if not path.is_file():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    out: list[RawQuestion] = []
    for q in data:
        options = [(o["id"], o["text"]) for o in q.get("options", [])]
        docs = [(d["title"], d["url"]) for d in q.get("docs", [])]
        out.append(
            (
                q["domain"],
                q.get("type", "multiple-choice"),
                q["text"],
                options,
                q.get("correct", ["a"]),
                q.get("explanation", ""),
                docs,
            )
        )
    return out


def merge_for_exam(
    exam_id: str,
    raw: list[RawQuestion],
    seen: set[str],
    *,
    max_add: int = 40,
) -> int:
    """Append cached open-source questions mapped to this exam_id."""
    added = 0
    for source_id in ("tinhtq-aws", "anaxkgs-security"):
        if source_id == "tinhtq-aws" and exam_id not in AWS_EXAM_KEYWORDS:
            continue
        if source_id == "anaxkgs-security" and exam_id != "comptia-security-plus":
            continue
        for row in load_cache(source_id):
            stem = row[2]
            if stem in seen or not is_scenario_stem(stem):
                continue
            if source_id == "tinhtq-aws" and _map_aws_exam(stem) != exam_id:
                continue
            seen.add(stem)
            raw.append(row)
            added += 1
            if added >= max_add:
                return added
    return added
