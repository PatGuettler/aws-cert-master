# AdSense & site readiness checklist

Use this before applying for or re-reviewing Google AdSense on **practicecert.com**.

## Content & policies

- [x] **Original practice content** — questions and workshops are written for learning; no exam dumps or scraped banks.
- [x] **Policy-safe topics** — cloud/IT certification study only; no adult, violence, hate, or restricted categories.
- [x] **About** — [/about/](../about/) explains mission, independence, and content types.
- [x] **Contact** — [/contact/](../contact/) lists `patguettlerpages@gmail.com` for feedback and policy mail.
- [x] **Privacy** — [/privacy/](../privacy/) covers localStorage, AdSense cookies, and user choices.

## Navigation & UX

- [x] Clear header brand link and footer nav on home + SEO pages.
- [x] Drawer links: About, Contact, Privacy.
- [x] Browse hub, question library, cert landings — linked from footers.
- [ ] **Post-deploy**: confirm all trust URLs return 200 on production (CI runs `scripts/build-question-pages.py`).

## SEO

- [x] `robots.txt` + `sitemap.xml` (includes about, contact, privacy).
- [x] Per-page `<title>`, meta description, canonical on trust and SEO pages.
- [x] JSON-LD on home and trust pages.
- [ ] Submit sitemap in [Google Search Console](https://search.google.com/search-console).
- [ ] Verify `site:practicecert.com` after deploy.

## Ads implementation

- [x] `ads.txt` in repo root.
- [x] AdSense client in `data/ads-config.json`; bar placement in app (not disguised as nav).
- [ ] **Do not click your own ads** or ask others to; use Analytics for traffic only.
- [ ] No pop-ups, interstitials blocking content, or modified ad code that inflates clicks.

## Performance

- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) on home and a question page.
- Static site + minimal JS; workshops load extra modules only when opened.

## Ongoing quality

- Regenerate SEO pages when questions change: `python3 scripts/build-question-pages.py`
- Keep `CONTACT_EMAIL` in `scripts/build-question-pages.py` accurate for policy mail.
- Update privacy “Last updated” by re-running the build script after policy edits.

## Deploy

GitHub Actions runs the SEO/trust build on push to `main`/`master` with `SITE_ORIGIN=https://practicecert.com`. Trust pages are written to `about/`, `contact/`, and `privacy/` at deploy time (not gitignored).
