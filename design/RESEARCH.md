# ClaimLens — Research notes (12 Nov 2026)

Honest scope: this is a sprint build (hours, not days). Full five-reference
design research was not completed; the notes below record what was actually
inspected and what was taken from it. No reference is claimed that was not read.

## What was actually inspected

1. **Apart Research sprint page** (official, read in full 12 Nov 2026):
   https://apartresearch.com/sprints/ai-x-epistemics-research-sprint-2026-11-13-to-2026-11-15
   - Track 3 (Epistemic Products) framing: advice users act on, "angels-on-the-shoulder"
     designs, guardian agents that intervene before a regretted decision, and the
     warning that early epistemic tools accumulate trust whether or not they deserve it.
   - Taken: the product concept (pre-decision claim screen), the "what would change
     my mind" feature, and the insistence that scoring be auditable — the method
     table on the page is a direct answer to the trust-accumulation warning.
   - Not copied: no sprint branding, colours or copy reused.

2. **Forethought "Design Sketches for a More Sensible World"** (linked from the
   sprint Resources tab; concept known via the sprint page summary, full text not
   re-read in this session): 19 buildable tool sketches spanning all four tracks.
   - Taken: the sketch format — a tool that assembles evidence and trade-offs
     *before* a decision.

3. **The sprint's own example direction** ("several projects need no ML skills at
   all"): confirmed a no-model, rule-based, fully client-side tool is a legitimate
   sprint entry — ClaimLens needs no API key and no backend.

## What was NOT done
- No separate competitive-product UI audit (no five live sites inspected).
  If the project advances past the sprint, do that audit before any redesign.
- No user testing beyond the author's own passes and the automated tests.

## Original decisions
- Rubric published in the product itself (method table) rather than hidden.
- Score shown as number + word + position in 3D, so no single channel carries it.
- Local-only history: epistemic tools should not phone home with what you doubt.
