---
description: Audit the running OcaGo game for UI/UX defects and turn the findings into a prioritized backlog (docs/UX_AUDIT.md plus GitHub issues).
agent: ux-auditor
---

Audit the OcaGo game now and produce the improvement backlog.

Context from the user: $ARGUMENTS

Follow your full audit procedure: prepare the repo, build and serve the game, play it in a real
browser at 320/360/390/768/1440px with the Playwright MCP tools, capture evidence into
`docs/screenshots/audit/`, score the ten areas, write `docs/UX_AUDIT.md`, and create one GitHub
issue per P0/P1 finding with the `ux-audit`, `severity:*`, `area:*` and `audit:<date>` labels.

Rules for this run:
- Only `docs/UX_AUDIT.md` and `docs/screenshots/audit/` may be written. Game code is read-only.
- Every finding must cite a measured value or a screenshot path. Mark observations separately from
  hypotheses.
- Mark the five highest-impact findings as "Sprint 1" so the coordinator can dispatch them first.
- If the baseline gates fail (`npm test`, `npm run build`, the browser suite), report that first and
  still produce the audit for the parts you could exercise.

Finish with the scorecard, the top five findings, the created issue numbers, and what you could not
test.
