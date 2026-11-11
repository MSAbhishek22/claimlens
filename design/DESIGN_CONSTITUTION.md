# ClaimLens — Design Constitution

## Personality & tone
A sceptical editor's desk at midnight: serious, warm, unhurried. The product
never shouts "fake!" — it shows its working and lets the user judge.

## Visual metaphor
A **lens over a dark page**: claims are points of light on a tilted evidence
plane. Height = how well-evidenced a claim is. The darker the room, the
clearer the light.

## Palette (semantic)
- Ink `#0d0c0a` — page background (the dark room)
- Ink-2 `#171512` — cards (the desk)
- Paper `#f4efe6` — primary text
- Paper-dim `#cfc7b8` — secondary text
- Amber `#e8a33d` — evidence light, primary actions, score ring
- Red `#d95d4e` — weak / unverifiable claims
- Green `#7fb069` — solid claims

## Typography
- Display: Georgia serif — editorial, newspaper-like, trustworthy.
- Body/UI: system sans — readable at small sizes.
- Scores: monospace — numbers read as measurements, not decoration.

## Layout
Single column, max 960px. Masthead → hero + input → verdict card → 3D
evidence map → claim-by-claim list → decision brief → history → method table.
One job per screen section; the verdict is always above the fold after analysis.

## Motion (≥2 techniques, transform/opacity only)
1. Scroll reveal + stagger on the claim list and results.
2. Mask-style reveal on the results block (opacity + translateY).
3. 3D tilt: the evidence plane rotates in perspective; drag rotates it further.
`prefers-reduced-motion` disables all of it.

## 3D concept
The evidence constellation is a CSS-3D plane: each claim is a node whose
height (translateZ) and brightness encode its score. It exists so a user can
*see* at a glance whether a piece of advice is one solid claim or a pile of
shaky ones. Fallback: the claim list below it carries the same information in
plain text; the plane is never the only way to read a score.

## Responsive / accessibility
- Mobile: verdict card stacks; nodes shrink; plane height drops to 220px.
- All controls are real buttons/inputs with focus states; nodes are
  `<button>`s with aria-labels; list rows are keyboard-operable.
- Colour is never the only signal: every score also shows a number + word
  (Solid / Shaky / Unverifiable).

## Distinctness vs recent fleet work
Verity (Geek Room) is a light research agent with a 3D constellation of
*sources*; Grace Notes is a warm devotional Q&A. ClaimLens is dark,
editorial, serif-led, and its 3D object is a *tilted plane of claims* scored
by a published rubric — a different visual concept, hierarchy and interaction
model (analyse → inspect → export a brief).
