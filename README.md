# ClaimLens — Check a claim before you act on it

**Event:** Apart Research — AI × Epistemics Research Sprint, 13–15 Nov 2026 · Track 3: Epistemic Products
**Official page:** https://apartresearch.com/sprints/ai-x-epistemics-research-sprint-2026-11-13-to-2026-11-15
**Submissions close:** Sun 15 Nov 2026, 23:59 AoE (= Mon 16 Nov 11:59 IST)
**Prizes:** $2,000 cash (1st $1,000 / 2nd $500 / 3rd $300 / 4th–5th $100)
**Eligibility (verified on official page 12 Nov 2026):** free to join; online; teams of 1–5 (solo OK); no prior AI-safety background required; no country restriction stated on the page.

## What it does

Paste any claim, piece of advice, or AI answer. ClaimLens:

1. Splits it into checkable sub-claims (sentence-level).
2. Scores every claim 0–100 on a **transparent, published rubric** (numbers, dates, named sources, calibrated hedging raise the score; absolutes, weasel attribution and hype lower it). Every point is explained in the UI.
3. Shows an overall verdict — Solid (≥70) / Shaky (40–69) / Unverifiable (<40).
4. Plots the claims as a **3D evidence constellation** (height = score; drag to tilt; click a point to inspect it).
5. For each claim, states **what would change its mind** — the missing evidence that would move the score.
6. Builds a **decision brief** you can download as Markdown or copy, and keeps a local-only history (localStorage, nothing leaves the device).

No network calls, no model, no API key, no account. Everything runs in the browser.

## Why this fits the sprint

Track 3 asks for epistemic products: tools that improve real decisions and make advice trustworthy at the moment of decision. ClaimLens is exactly the "guardian angel / reflection scaffolding" sketch from the sprint's own reading list — it intervenes *before* a decision you would later regret, and its scoring is auditable by design (the failure mode the sprint warns about: tools that accumulate trust whether or not they deserve it).

## Run locally

```bash
node tests/test.js        # unit tests (no dependencies)
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy (Vercel)

Static site. Import the repo in Vercel with framework preset **Other**, no build command, output directory `.` (`vercel.json` is included). No environment variables.

## Files

- `index.html` — the app
- `styles.css` — Cinematic/Film Noir + Swiss editorial theme
- `app.js` — scoring engine (pure functions) + browser wiring
- `tests/test.js` — 12 unit tests, zero dependencies
- `design/DESIGN_CONSTITUTION.md`, `design/RESEARCH.md`
- `qa/INTERACTION_INVENTORY.md`
- `deployment/DEPLOYMENT_RUNBOOK.md`
- `submission/SUBMISSION_PACK.md`

## Status — IN_PROGRESS (honest, per the ABHI_22 rulebook)

- Gates A (design) / B (working product) / C (3D) / D (tests): PASS locally.
- Gate E (GitHub repo + live HTTPS): BLOCKED — repo not yet created, not deployed (parent handles both).
- Gate F (demo video from live URL): BLOCKED — needs the live URL first.
- Gate G (submission): NOT SUBMITTED. Submit via the Apart sprint page before Sun 15 Nov 23:59 AoE, with repo link + write-up + demo video.

## Author

M S Abhishek (MSAbhishek22) — Shobhit University, Meerut, BTech CSE 7th sem.
