# ClaimLens — Interaction Inventory

All controls verified by code inspection + local run (see tests/test.js).
Status PASS = works as labelled in the local build.

| Control | Action | Expected | Status |
|---|---|---|---|
| Sample chip ×3 | Click | Fills textarea with a sample claim and runs analysis | PASS |
| Viral-claim demo button | Click | Loads the made-up viral post (labelled EXAMPLE) and runs analysis immediately — hero demo path, < 30 s | PASS (logic covered by the viral-demo test: 85/25/45 split, overall 52 Shaky) |
| Claim textarea | Type/paste | Accepts any text; empty submit shows a hint, no crash | PASS |
| Analyse the claim | Click | Splits, scores, reveals verdict + map + list + brief | PASS |
| Clear | Click | Empties input, hides results, focuses input | PASS |
| Evidence node (button) | Click | Selects the claim; highlights node + list row | PASS |
| Evidence plane drag | Pointer drag | Tilts the 3D plane (rotateZ −40°…+30°) | PASS |
| Claim list row | Click / Enter / Space | Selects the claim; highlights node + row | PASS |
| Download brief (.md) | Click | Downloads `claimlens-brief.md` with score, claims, bottom line | PASS |
| Copy brief | Click | Copies brief to clipboard; button confirms, reverts after 1.5s | PASS |
| Clear history | Click | Wipes localStorage history, re-renders empty state | PASS |
| Masthead nav links | Click | Smooth-scroll to Analyser / Evidence map / Decision brief / Method | PASS |
| Method table | Read | Static reference, no interaction needed | PASS |

Known limits: clipboard copy can fail without a secure context/permissions —
the button then says so and Download remains available. Drag-tilt is
pointer-only; keyboard users use the list rows, which carry the same data.
