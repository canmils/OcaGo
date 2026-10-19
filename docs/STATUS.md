# OcaGo status and autonomous handoff

## Current milestone
Build and validate the first playable local match described in [DESIGN.md](DESIGN.md). The user has supplied the product direction and authorized autonomous agent coordination; routine product and implementation choices do not need further prompting.

## Durable team instructions
Read [AGENTS.md](../AGENTS.md) before working. This repository is the durable handoff; live research, design, and development agents only run during an active session. Resume from recorded artifacts and actual validation results. Use this existing isolated checkout rather than creating a worktree unless requested.

## Design decisions
- Spanish-first mobile web prototype; one human and two local bots.
- Single die, 63-square spiral, exact finish and reflected overshoot.
- Finite well/prison penalties, no collision rules, no special first-roll exception.
- Goose jumps stop after one forced move; square 59 jumps to finish.
- No backend, account, monetization, or externally published deployment in the first milestone.

## Work recorded
- Autonomous mission and team ownership are established in AGENTS.md.
- DESIGN.md defines the rules contract, original art direction, first-session flow, acceptance criteria, and later milestones.
- Development and research are concurrent tasks. Their final implementation and evidence must be checked before marking acceptance criteria passed.

## Validation record
MVP implemented. Eight engine tests and the production build passed. Chromium checks passed desktop/mobile layouts, rolling, automatic bots, help, restart, and a complete match through victory. GitHub Pages workflow added; deployment and public URL remain unverified because GitHub API access returns Forbidden in this environment.

## Next actions
1. Align the implemented engine and in-app rules with DESIGN.md; explicitly document any agreed deviation.
2. Run deterministic engine tests and production build.
3. Start the application and exercise a representative match, restart, keyboard controls, and narrow viewport using available browser tooling.
4. Record commands, outcomes, limitations, and the next incomplete milestone here. Keep README setup instructions consistent with the actual project.
