# ClaimLens — Submission Pack (Apart Research Sprint)

- **Event:** AI × Epistemics Research Sprint, Apart Research, 13–15 Nov 2026
- **Track:** 3 — Epistemic Products
- **Official page:** https://apartresearch.com/sprints/ai-x-epistemics-research-sprint-2026-11-13-to-2026-11-15
- **Submit by:** Sun 15 Nov 2026, 23:59 AoE (Mon 16 Nov 11:59 IST)
- **How to submit:** register/join on the sprint page, then submit the project
  (repo link + write-up + demo video) before the deadline. Team: solo.
- **Repo:** https://github.com/MSAbhishek22/claimlens — created + pushed 12 Nov 2026 (commit `c5831c09`, branch `main`, 13 files)
- **Live URL:** TBD — Vercel deploy in flight via browser task; verify public before submitting
- **Demo video:** TBD — record from the live URL after deploy (60–90s: viral-claim demo — one click, 85 Solid / 25 Unverifiable / 45 Shaky split — then verdict + 3D map + brief export)
- **Measured proof (actual run, 12 Nov 2026):** 23/23 tests (12 unit + 11 hardening). Poison suite: 4/4 corrupted claims declined, never stamped Solid — fabricated citation 40 Shaky, misquoted source 25 Unverifiable, invented statistic 30 Unverifiable, cherry-picked excerpt 20 Unverifiable; paired clean controls 85 Solid; clean-vs-poison gap 43 (73 vs 30). Viral demo: 85 / 25 / 45, overall 52 Shaky. Honest limit: signal-based screen, not a fact-checker — it cannot verify whether a named journal exists; it guarantees it never endorses corruption detectable in its own signals.
- **One-line pitch:** "ClaimLens checks a claim before you act on it — it splits
  any advice into checkable parts, scores each on a transparent, auditable
  rubric, and tells you what evidence would change its mind."
- **What it is NOT:** not a fact-checker, not an LLM wrapper, not a black box.
  It measures how checkable and how overclaimed a statement is.
