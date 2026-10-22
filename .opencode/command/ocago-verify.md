---
description: Independently verify an OcaGo pull request or branch against its acceptance criteria with tests, a production build and a real browser.
agent: qa-verifier
---

Verify the OcaGo change under review.

Target from the user: $ARGUMENTS

Accept a PR number, a branch name, or a URL. If none was given, list the open PRs with
`gh pr list --repo canmils/OcaGo` and verify the most recent one.

1. Fetch and check out the target. Read `git diff main...HEAD` and the linked finding in
   `docs/UX_AUDIT.md`.
2. Run the gates and record exact output and exit codes: `npm test`,
   `npm run build -- --base=./`, and the browser suite
   `bash -c 'source scripts/browser-env.sh && QA_URL=http://localhost:5173 node scripts/qa-browser.cjs'`
   with `npm run dev -- --port 5173` running.
3. Check every acceptance criterion individually in a real browser at the viewport it names, with
   measured values.
4. Check the shared contract for regressions: start vignette bottom-left and 1.8x an ordinary cell,
   central finish, 63 illustrated cells, all players visible at 320px, no horizontal overflow, 44px
   roll control, shared tokens visible and never covering the square number, keyboard route, reduced
   motion, hidden tab pauses idle, English interface, saved-match migration, victory and replay.
5. Add a regression test for the defect that was fixed and prove it fails without the fix.
6. Record the result in `docs/QA.md` and open a PR with the criteria table.

Report the verdict first: PASS, PASS WITH RISKS, or FAIL. Then the criteria table, the commands and
exit codes, the regression test, and what you could not verify.
