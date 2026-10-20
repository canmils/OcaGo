# OcaGo delivery status

## Current milestone
The specialist vertical slice extends the playable local MVP with original cast portraits, technical-art depth/arrival effects, opt-in sound, persistent turn feedback and accessible board exploration. Public hosting is not verified. This is a local browser game against bots, not online multiplayer or a finished commercial product.

## Team and visible evidence
- [Specialist team and ownership](TEAM.md): UI/UX, art, animation, frontend, backend/data, QA, creative director, game designer/producer, technical artist, sound designer, playtest analyst, progression/economy/live-events designer, coordinator.
- [Mobile screenshot](screenshots/game-390.png), [small mobile](screenshots/game-320.png), [desktop](screenshots/game-1440.png).
- [Independent QA report](QA.md) and repeatable browser suite at `scripts/qa-browser.cjs`.
- [UX audit](UX.md), [art direction](ART.md), [motion](ANIMATION.md), [data architecture](BACKEND.md), [rules/design](DESIGN.md), [research limitations](RESEARCH.md).

These are actual deliverables, not a live agent dashboard. Agents run within an active session; durable instructions and files allow later sessions to resume.

## Shipped implementation
Spanish La Oca with one human and two bots, 63-square spiral, exact finish/reflection, single goose jump and extra roll, bridge, finite inn/well/prison penalties, maze and death. Original SVG garden and goose artwork, visible start tokens, route arrows, tile inspection, mobile action dock, progress cards, welcome/rules/restart/victory dialogs, cancellation-safe effects, reduced motion, and validated versioned local saves. No external runtime font dependency, account, payments, or server required. The expanded slice adds cohesive original Lola/Bruno portraits, garden depth/focus trails, distinct arrival effects, opt-in synthesized sound with safe mute/restart, a latest-12-turn transcript, a 44px square navigator, and roving board keyboard focus. Skipped turns no longer animate dice. Bots pause while dialogs are open. Audio requires a user gesture and does not initialize autonomously on restored bot turns.

## Verified in this environment
- Fresh `npm ci --cache /tmp/ocago-npm-cache` succeeded using the lockfile.
- `npm test`: 16 passed, zero failed/skipped, including 378 position/die combinations and persistence recovery.
- `npm run build -- --base=./`: TypeScript and production bundle passed.
- Independent Chromium production-browser suite: 320/360/390px mobile and 1440px desktop; no overflow; mobile roll control at least 44px and visible; board above action dock; keyboard tile inspection/help; bots and resumed turns; skip; restart during movement; persisted human/bot victory; complete seeded match; zero JavaScript errors.
- Ordinary/reduced-motion cancellation checks passed. Production smoke found no broken images or HTTP errors.
- QA found and frontend fixed persisted-name markup injection, undersized touch targets and mobile restart obstruction.

The expanded production-browser suite additionally verifies sound opt-in, stored preference/mute, no autonomous AudioContext on a restored bot turn, no dice motion/cue on rest, transcript retention, dialog-paused bots, and roving board navigation. See QA.md for exact results and limits: Safari/iOS, screen readers, comprehensive contrast compliance, public hosting and long-term enjoyment are not established by these checks.

## GitHub delivery and hosting
Repository: https://github.com/canmils/OcaGo . Coordinator pushes integrated validated work to main under the user's explicit GitHub delivery instruction. GitHub Actions workflow tests/builds and deploys to Pages when configured. A push alone does not prove deployment.

Verified 2026-10-20: GitHub API and the Pages hostname are now reachable. The public site returns HTTP 404; repository metadata confirms `has_pages: false`. GitHub Actions run 39293526486 passed dependency installation, tests and production build, then failed at `actions/configure-pages`; deployment was skipped. Attempting to enable Pages using the authenticated integration returned HTTP 403, `Resource not accessible by integration`. This is a GitHub integration permission blocker, not a game build failure. The repository owner must select Settings → Pages → GitHub Actions as the source, then rerun the deployment workflow. The expected project-site URL is https://canmils.github.io/OcaGo/ but it is not live as of this check. No agents are running in the background; specialist roles and handoffs are saved for active-session continuation.

## Specialist direction and honest quality bar

CREATIVE_DIRECTION.md and PRODUCTION.md define the next quality gates. PLAYTEST.md records a real heuristic/browser walkthrough, not a study with human participants. The interface is an improved original prototype; it does not establish parity with a large mobile-game production. A real-human playtest and device listening pass remain important next steps.

## Next milestone
1. Verify GitHub Actions deployment and a real public playable request once the repository owner enables Pages; API read access now works.
2. Assess the actual playable experience and iterate on board legibility, motion and onboarding; do not call a first redesign commercial polish.
3. Add long-term progression/cosmetics only after the match experience is accepted. Online play, events, music/voice work and a server economy remain future work. Cosmetic progression and event proposals are in PROGRESSION.md and LIVE_EVENTS.md; neither system is implemented. SOUND cues are implemented; subjective audible balance is untested.

Read AGENTS.md before continuing. Use the existing isolated checkout; do not create a worktree unless requested. Make routine decisions autonomously, preserve user work, and record evidence rather than claiming unrun checks.
