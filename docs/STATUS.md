# OcaGo delivery status

## Current milestone
Specialist redesign of the playable local MVP is implemented and independently validated. Public hosting is not verified. This is a local browser game against bots, not online multiplayer or a finished commercial product.

## Team and visible evidence
- [Specialist team and ownership](TEAM.md): UI/UX, art, animation, frontend, backend/data, QA, coordinator.
- [Mobile screenshot](screenshots/game-390.png), [small mobile](screenshots/game-320.png), [desktop](screenshots/game-1440.png).
- [Independent QA report](QA.md) and repeatable browser suite at `scripts/qa-browser.cjs`.
- [UX audit](UX.md), [art direction](ART.md), [motion](ANIMATION.md), [data architecture](BACKEND.md), [rules/design](DESIGN.md), [research limitations](RESEARCH.md).

These are actual deliverables, not a live agent dashboard. Agents run within an active session; durable instructions and files allow later sessions to resume.

## Shipped implementation
Spanish La Oca with one human and two bots, 63-square spiral, exact finish/reflection, single goose jump and extra roll, bridge, finite inn/well/prison penalties, maze and death. Original SVG garden and goose artwork, visible start tokens, route arrows, tile inspection, mobile action dock, progress cards, welcome/rules/restart/victory dialogs, cancellation-safe effects, reduced motion, and validated versioned local saves. No external runtime font dependency, account, payments, or server required.

## Verified in this environment
- Fresh `npm ci --cache /tmp/ocago-npm-cache` succeeded using the lockfile.
- `npm test`: 16 passed, zero failed/skipped, including 378 position/die combinations and persistence recovery.
- `npm run build -- --base=./`: TypeScript and production bundle passed.
- Independent Chromium production-browser suite: 320/360/390px mobile and 1440px desktop; no overflow; mobile roll control at least 44px and visible; board above action dock; keyboard tile inspection/help; bots and resumed turns; skip; restart during movement; persisted human/bot victory; complete seeded match; zero JavaScript errors.
- Ordinary/reduced-motion cancellation checks passed. Production smoke found no broken images or HTTP errors.
- QA found and frontend fixed persisted-name markup injection, undersized touch targets and mobile restart obstruction.

See QA.md for limits: Safari/iOS, screen readers, comprehensive contrast compliance, public hosting and long-term enjoyment are not established by these checks.

## GitHub delivery and hosting
Repository: https://github.com/canmils/OcaGo . Coordinator pushes integrated validated work to main under the user's explicit GitHub delivery instruction. GitHub Actions workflow tests/builds and deploys to Pages when configured. A push alone does not prove deployment.

The environment returned proxy 403 for api.github.com and canmils.github.io, so deployment configuration/status and the public game cannot be verified here. Required domain additions were saved in the environment draft alongside tested install/start instructions. Saving the draft does not apply or publish it. Review/save changes in environment settings and publish the environment to activate them. If repository Pages is not configured, use Settings → Pages → GitHub Actions; the deployment job supplies the actual URL.

## Next milestone
1. Verify GitHub Actions deployment and a real public playable request once network/Pages access is available.
2. Assess the actual playable experience and iterate on board legibility, motion and onboarding; do not call a first redesign commercial polish.
3. Add long-term progression/cosmetics only after the match experience is accepted. Online play, events, sound and a server economy remain future work.

Read AGENTS.md before continuing. Use the existing isolated checkout; do not create a worktree unless requested. Make routine decisions autonomously, preserve user work, and record evidence rather than claiming unrun checks.
