# ClaimLens — Deployment Runbook

## Stack
Static HTML/CSS/JS. No build step, no backend, no environment variables,
no dependencies. Node is needed only to run the tests.

## Deploy (Vercel, parent handles via browser)
1. Create GitHub repo `MSAbhishek22/claimlens` (public), push the manifest files.
2. Vercel → Add New Project → import `claimlens`.
3. Framework preset: **Other**. Build command: (none). Output directory: `.`
   (`vercel.json` already sets this).
4. Deploy. No env vars.
5. Verify: open the live URL in a fresh browser, paste the "Miracle cure"
   sample, confirm verdict **Unverifiable** and the 3D map renders; check
   console for errors.
6. If Vercel shows a Deployment Protection login wall (as happened with
   Grace Notes), turn Deployment Protection OFF before recording the demo.

## Rollback
Static site — redeploy any earlier commit, or revert the Vercel deployment
from the dashboard. No data to migrate (localStorage only, per-device).

## Health check (after deploy)
- `GET /` returns 200 and contains "ClaimLens".
- No external requests in the network tab (fully self-contained).
