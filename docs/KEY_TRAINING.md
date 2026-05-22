# KeyTrain's Key Training

Hands-on cybersecurity practice aligned to the KeyTrain simulation domains (identity, email, data protection, endpoint, network, system hygiene, application, financial, physical, and compliance).

## Three ways to study

| Mode | Where | Behavior |
|------|--------|----------|
| **Practice test** | Browse → KeyTrain's Key Training, or `/key-training/` | Full timed-style bank, feedback optional, pause & resume |
| **Workshop** | `/key-training/workshops/` | Interactive SVG diagrams (step-through flows, compare panels, hotspots, ordering drills) plus lessons and quizzes |
| **KeyTrain certification** | KeyTrain hub → Key Training section, or `/keytrain/kt-keytrain-*` | Formal pass/fail (750/1000), post-exam review with core concepts, PDF certificate on pass |

## Categories (10)

1. Identity & Access Security  
2. Email Security  
3. Data Protection  
4. Endpoint Security  
5. Network Security  
6. System Hygiene  
7. Application Security  
8. Financial Security  
9. Physical Security  
10. Compliance & Governance  

## Regenerate content

```bash
python3 scripts/generate_key_training_exams.py
```

This writes `data/exams/keytrain-*.json`, rebuilds `data/exams-index.json`, and updates `data/keytrain-index.json` (with `"group": "key-training"`).

Question banks include scenario items from `key_training_questions.py` plus balanced extensions in `key_training_questions_extended.py`. The generator pads distractor length so the correct answer is not guessable by word count alone.

Certificate PDFs use `vendor/jspdf.umd.min.js` with a jsDelivr fallback (cdnjs 2.5.2 URLs are broken).

## Data

- Vendor: `keytraining` in exam JSON  
- Exam ids: `keytrain-identity-access`, `keytrain-email-security`, …  
- KeyTrain formal ids: `kt-keytrain-identity-access`, …
