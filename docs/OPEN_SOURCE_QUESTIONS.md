# Open-source practice question sources

Cert Master can merge **scenario-style** questions from MIT-licensed public repos into generated exam banks. Generic templated stems (for example “Which AWS service is BEST to …”) are **not** used.

## Catalog

See `scripts/question_bank/open_source_catalog.json`:

| Source | License | Used for |
|--------|---------|----------|
| [tinhtq/aws-certification-practice](https://github.com/tinhtq/aws-certification-practice) | MIT | AWS exams (keyword → domain mapping) |
| [AnaxKGS/AnaxKGS.github.io](https://github.com/AnaxKGS/AnaxKGS.github.io) | MIT | CompTIA Security+ (`comptia-security-plus`) |

Only stems that pass `stem_quality.is_scenario_stem()` are imported (company context, decision, no generic templates).

## Workflow

```bash
# 1) Download and cache (requires network)
python3 scripts/import_open_source_questions.py

# 2) Regenerate all practice JSON (merges cache + fact banks)
python3 scripts/regenerate_all_practice.py
```

Cached files: `data/open-source-cache/*.json` (gitignored by default; add to repo if you want CI to skip download).

## Quality rules

Generators (`question_factory.py`, `cloud_factory.py`, `generate_key_training_exams.py`):

- Use `scenario_stem_from_fact()` for fact-bank items
- Reject generic stem patterns in `stem_quality.py`
- Do **not** emit “exam prep meta” questions (“Which official resource…”) or tabletop KPI fillers

## Copyright

- Do **not** copy proprietary exam dumps or Skill Builder verbatim items.
- MIT sources are adapted with attribution appended to explanations: `(Adapted from <source>, MIT License.)`
- You are responsible for complying with each upstream license when redistributing.

## Adding a source

1. Confirm license allows use (MIT, Apache-2.0, CC-BY, etc.).
2. Add an entry to `open_source_catalog.json`.
3. Implement a converter in `open_source_import.py`.
4. Map questions to `exam_id` + `domain` in `merge_for_exam()`.
