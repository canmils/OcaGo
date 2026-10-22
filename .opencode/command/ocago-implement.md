---
description: Implement one OcaGo UI/UX issue end to end — pick the owning specialist, build the branch, verify it, and open a pull request.
agent: coordinator
---

Implement a single OcaGo UI/UX issue end to end.

Issue from the user: $ARGUMENTS

1. Read the issue with `gh issue view <number> --repo canmils/OcaGo` and its finding block in
   `docs/UX_AUDIT.md`. Extract the acceptance criteria; they are the definition of done.
2. Route it to the owner: `area:visual` -> `visual-designer`, `area:interaction` ->
   `interaction-engineer`, `area:motion` -> `motion-designer`, `area:a11y` ->
   `accessibility-engineer`. If the issue carries two areas, take the primary one and tell the
   coordinator which follow-up issue is needed for the other.
3. Dispatch that specialist with the issue number, the finding ID, the acceptance criteria, the
   branch name `feat/<area>-<number>-<slug>` cut from an up-to-date `main`, and the requirement to
   open a PR and report evidence.
4. Dispatch `qa-verifier` against the resulting branch. A PR without a QA verdict is not done.
5. Leave the PR open for review. Merge only if the user explicitly says so.
6. Update `docs/STATUS.md` if this changes the shipped status.

Report: the issue, the owner, the branch, the PR URL, the QA verdict, the criteria that were
measured, and anything left out.
