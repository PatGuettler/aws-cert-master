# AWS Cert Master

Unofficial **static** practice exams for AWS certifications, designed for [GitHub Pages](https://pages.github.com/). No login, no backend — each exam is a JSON file under `data/exams/`.

## Live site

After enabling GitHub Pages (see [Deploy](#deploy)), your site will be at:

`https://<your-github-username>.github.io/aws-cert-master/`

## Exams (dynamic list)

The hamburger menu loads exams from **`data/exams-index.json`**, which is built automatically from every `*.json` file in **`data/exams/`**.

| Exam | Code | File |
|------|------|------|
| AWS Certified Cloud Practitioner | CLF-C02 | [`data/exams/cloud-practitioner.json`](data/exams/cloud-practitioner.json) |

**Add an exam:** drop `data/exams/my-exam.json` (valid exam schema) → run `python3 scripts/build-exams-index.py` → commit both the JSON and updated `data/exams-index.json` → push.

**Remove an exam:** delete its JSON from `data/exams/` → rebuild the index → push.

GitHub Actions runs the index builder on every Pages deploy, so pushes that only change exam JSON still refresh the menu after deploy.

## Exam format (CLF-C02 example)

The practice test mirrors the official [CLF-C02 exam guide](https://docs.aws.amazon.com/aws-certification/latest/examguides/cloud-practitioner-02.html):

| Official domain | Weight | Questions per attempt |
|-----------------|--------|------------------------|
| Domain 1: Cloud Concepts | 24% | ~16 |
| Domain 2: Security and Compliance | 30% | ~20 |
| Domain 3: Cloud Technology and Services | 34% | ~22 |
| Domain 4: Billing, Pricing, and Support | 12% | ~8 |

Each attempt **randomly** selects 65 questions from the bank using those weights, then:

- **Shuffles** question order and answer option order
- Marks **50 scored** and **15 unscored** (like the real exam; unscored items do not affect your score)
- **90 minutes** (toggle off in the menu)
- **Passing score 700 / 1000** (scaled approximation from scored answers only)

Open the **hamburger menu → Exams** (nested section) to switch exams and configure options.

## Updating questions

1. Edit the exam file under **`data/exams/`** (e.g. `cloud-practitioner.json`).
2. Run `python3 scripts/build-exams-index.py` if you added or removed an exam file (not required for question-only edits).
3. Commit and push to `main`.

### Exam JSON shape (top level)

```json
{
  "id": "cloud-practitioner",
  "name": "AWS Certified Cloud Practitioner",
  "code": "CLF-C02",
  "exam": {
    "totalQuestions": 65,
    "scoredQuestions": 50,
    "timeLimitMinutes": 90,
    "passingScore": 700,
    "maxScore": 1000
  },
  "domains": [{ "id": "cloud-concepts", "name": "...", "weight": 24, "resources": [] }],
  "questions": []
}
```

Each question:

```json
{
  "id": "clf-q001",
  "domain": "cloud-concepts",
  "type": "multiple-choice",
  "text": "Question stem here?",
  "options": [{ "id": "a", "text": "Answer A" }],
  "correct": ["a"],
  "explanation": "Why this answer is correct.",
  "docs": [{ "title": "...", "url": "https://docs.aws.amazon.com/..." }]
}
```

- **`id`** (exam): must be unique across files; used in the menu and URL hash (`#cloud-practitioner`).
- **`domains[].weight`**: should sum to **100** for weighted random selection.
- **`scored`** on questions: optional; each attempt assigns 50 scored / 15 unscored at random.

### Regenerate the CLF-C02 question bank

```bash
python3 scripts/generate-questions.py
```

Writes `data/exams/cloud-practitioner.json` and refreshes `data/exams-index.json`.

## Project layout

```
index.html
css/styles.css
js/                     # cert-loader loads exams-index + exam JSON
data/
  exams-index.json      # Auto-generated manifest (commit this file)
  exams/
    cloud-practitioner.json
scripts/
  build-exams-index.py  # Scan data/exams/*.json → exams-index.json
  generate-questions.py
```

## Local preview

```bash
cd aws-cert-master
python3 scripts/build-exams-index.py   # if you changed data/exams/
python3 -m http.server 8080
```

Open `http://localhost:8080/`. ES modules require HTTP (not `file://`).

## Deploy

1. Push to GitHub on `main`.
2. Enable **GitHub Pages** (Actions workflow in `.github/workflows/pages.yml` runs `build-exams-index.py` before deploy).

Or use **Settings → Pages → Deploy from branch `main` / root** and run the index script locally before each push if you do not use Actions.

## Optional ad bar

A small sponsored area (bottom or side) can be enabled without affecting the exam UI. Ads are **hidden during active exams**.

See **[docs/ADS_SETUP.md](docs/ADS_SETUP.md)** for Google AdSense integration, `ads.txt`, and `data/ads-config.json` options.

## Disclaimer

This project is **not affiliated with Amazon Web Services**. Questions are community-maintained study aids. Scores are approximate and do not guarantee exam results. Always use [official AWS exam guides](https://docs.aws.amazon.com/aws-certification/latest/examguides/cloud-practitioner-02.html) and [AWS Training](https://aws.amazon.com/training/) for authoritative information.
