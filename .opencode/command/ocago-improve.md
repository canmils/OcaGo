---
description: Run a full OcaGo UI/UX improvement cycle — audit, plan, parallel specialist implementation, QA, and review-ready pull requests.
agent: coordinator
---

Run a complete OcaGo UI/UX improvement cycle now.

Scope from the user: $ARGUMENTS

Run your whole cycle:

1. **Baseline.** Clean `main`, install, `npm test`, `npm run build -- --base=./`, and the browser
   suite `bash -c 'source scripts/browser-env.sh && QA_URL=http://localhost:5173 node scripts/qa-browser.cjs'`
   with `npm run dev -- --port 5173` running. Record exact results. A red baseline stops the cycle
   and gets reported.
2. **Backlog.** Read `docs/UX_AUDIT.md` and `gh issue list --repo canmils/OcaGo --label ux-audit`.
   If the audit is missing or stale relative to `main`, dispatch `ux-auditor` first and wait.
3. **Plan.** Select the highest-severity issues, default three, respecting the audit's "Sprint 1"
   marks and grouping by owning agent so parallel work never touches the same file. Write the plan
   down before dispatching.
4. **Dispatch.** Use the task tool with the matching specialist per issue. Specialists work on
   `feat/<area>-<issue-number>-<slug>` branches cut from an up-to-date `main`, open a PR, and report
   their evidence. Run owners in parallel when their files are disjoint.
5. **Verify.** Dispatch `qa-verifier` against each branch. The verdict must come from QA.
6. **Integrate.** Keep QA-passed PRs open for the user to review and merge. Merge only with explicit
   user approval. Update `docs/STATUS.md` and `docs/TEAM.md`.

Report: the plan, the PR per issue with its QA verdict, what is waiting for review, what failed and
why, and the next queue.
