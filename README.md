# ClaimLens — Check a claim before you act on it

**Event:** Apart Research — AI × Epistemics Research Sprint, 13–15 Nov 2026 · Track 3: Epistemic Products
**Official page:** https://apartresearch.com/sprints/ai-x-epistemics-research-sprint-2026-11-13-to-2026-11-15
**Submissions close:** Sun 15 Nov 2026, 23:59 AoE (= Mon 16 Nov 11:59 IST)
**Prizes:** $2,000 cash (1st $1,000 / 2nd $500 / 3rd $300 / 4th–5th $100)
**Eligibility (verified on official page 12 Nov 2026):** free to join; online; teams of 1–5 (solo OK); no prior AI-safety background required; no country restriction stated on the page.

## Sprint disclosure (Apart Research — pre-existing work)

Per the sprint Guidelines, prior work must be clearly identified. **ClaimLens was built on 12 November 2026, before the sprint (13–15 November 2026).** The prototype, the scoring rubric, the 23-test suite (including the poison suite), the live deployment and the demo video are **pre-existing work**. Work done during the sprint window: the research report (`submission/claimlens-research-report.pdf`) and a fresh evaluation re-run (§4.5 of the report, executed 13–15 November). No sprint-window result is claimed before it is run.

## What it does

Paste any claim, piece of advice, or AI answer. ClaimLens:

1. Splits it into checkable sub-claims (sentence-level).
2. Scores every claim 0–100 on a **transparent, published rubric** (numbers, dates, named sources, calibrated hedging raise the score; absolutes, weasel attribution and hype lower it). Every point is explained in the UI.
3. Shows an overall verdict — Solid (≥70) / Shaky (40–69) / Unverifiable (<40).
4. Plots the claims as a **3D evidence constellation** (height = score; drag to tilt; click a point to inspect it).
5. For each claim, states **what would change its mind** — the missing evidence that would move the score.
6. Builds a **decision brief** you can download as Markdown or copy, and keeps a local-only history (localStorage, nothing leaves the device).

No network calls, no model, no API key, no account. Everything runs in the browser.

## Measured proof — the validator is tested against corruption

**Poison suite (10 tests, in `tests/test.js`).** Four deliberately corrupted
claims are fed to the rubric — fabricated citation, misquoted source,
invented statistic, cherry-picked excerpt. Measured outcomes (actual run,
12 Nov 2026):

| Poison input | Score | Verdict | Cited reasons |
|---|---|---|---|
| Fabricated citation — claims a study, names nothing checkable | 40/100 | Shaky | absolute language, statistic with no source/date |
| Misquoted source — real institution invoked, no checkable source | 25/100 | Unverifiable | weasel attribution, absolute distortion |
| Invented statistic — precise figure, no source, no date | 30/100 | Unverifiable | unsourced statistic, weasel, absolute |
| Cherry-picked excerpt — one dramatic partial result | 20/100 | Unverifiable | unsourced statistic, weasel, absolute, hype |

**No poisoned input is ever stamped Solid** (sweep test, 4/4). The brief for
each refuses to act ("Do not act on this / Do not act on this yet") and
carries the not-a-fact-checker disclaimer. Paired clean controls prove the
rubric discriminates: the same statistic/trial style, properly sourced,
scores 85/100 Solid; same recovery topic, clean 73 Solid vs poison 30
Unverifiable (gap 43). New rubric signal added for this: a number/statistic
with no source or date to check scores −10 (a precise figure with nowhere
to check it is a claim, not evidence).

**Viral-claim demo (1 test).** One click runs a made-up viral post
(EXAMPLE, not a real quote) through the rubric live: three claims score
**85 Solid / 25 Unverifiable / 45 Shaky**, overall **52/100 Shaky** — the
rubric visibly tells them apart in under 30 seconds. This is the hero demo
path for the video: click "Try the viral claim", show the verdict + 3D
constellation + brief.

**Honest limit, stated in the tests:** ClaimLens is a signal-based screen,
not a fact-checker. It cannot verify whether a named journal exists — a
well-formed fabricated citation with all surface signals would still score
high. The poison suite proves what the tool actually guarantees: it never
endorses a claim whose corruption is detectable in its own signals, and it
refuses to act on anything it cannot ground.

## Why this fits the sprint

Track 3 asks for epistemic products: tools that improve real decisions and make advice trustworthy at the moment of decision. ClaimLens is exactly the "guardian angel / reflection scaffolding" sketch from the sprint's own reading list — it intervenes *before* a decision you would later regret, and its scoring is auditable by design (the failure mode the sprint warns about: tools that accumulate trust whether or not they deserve it).

## Run locally

```bash
node tests/test.js        # 23 tests (12 unit + 11 hardening: 10 poison + 1 viral demo), no dependencies
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy (Vercel)

Static site. Import the repo in Vercel with framework preset **Other**, no build command, output directory `.` (`vercel.json` is included). No environment variables.

## Files

- `index.html` — the app
- `styles.css` — Cinematic/Film Noir + Swiss editorial theme
- `app.js` — scoring engine (pure functions) + browser wiring
- `tests/test.js` — 23 tests (12 unit + 11 hardening), zero dependencies
- `design/DESIGN_CONSTITUTION.md`, `design/RESEARCH.md`
- `qa/INTERACTION_INVENTORY.md`
- `deployment/DEPLOYMENT_RUNBOOK.md`
- `submission/SUBMISSION_PACK.md`

## Status — IN_PROGRESS (honest, per the ABHI_22 rulebook)

- Gates A (design) / B (working product) / C (3D) / D (tests): PASS locally — **23/23 tests (12 unit + 11 hardening: 10 poison + 1 viral demo)**.
- Gate E (GitHub repo + live HTTPS): repo ✅ created + pushed (commit `c5831c09`, branch `main`, 13 files, per parent dispatch 12 Nov 2026); live deploy in flight via browser task — parent verifies the public URL before calling it live.
- Gate F (demo video from live URL): BLOCKED — needs the live URL first. Hero shot is ready: the viral-claim demo (one click → 85/25/45 split, verdict + 3D map + brief export).
- Gate G (submission): NOT SUBMITTED. Submit via the Apart sprint page before Sun 15 Nov 23:59 AoE, with repo link + write-up + demo video.

## Author

M S Abhishek (MSAbhishek22) — Shobhit University, Meerut, BTech CSE 7th sem.
