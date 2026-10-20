# OcaGo delivery status — 2026-10-20

## Latest user direction

English throughout. Follow the supplied illustrated board's composition: large bottom-left start, route moving right then around broad illustrated rings, central finish, drawing in every cell, visible players and restrained idle motion. This direction replaces the earlier Spanish/grid prototype.

## Implemented and independently verified

- English interface, help, square explorer, accessibility labels, metadata, engine outcomes and saved-match migration. Version-1 Spanish saves preserve positions/penalties and migrate to English version 2.
- 63 original illustrated, numbered, nonoverlapping cells; large bottom-left START vignette, clockwise outer/inner route and large central Goose Garden.
- Aspect-aware art keeps complete characters/objects within narrow and wide panels. Every cell contains a drawing; scenery has no extra rule effect.
- You, Lola and Bruno are visible above the board. All starting pawns are visible. Shared pawns adapt to cell shape instead of clipping each other; numbers remain readable.
- Inline mobile turn controls no longer cover the roster. Desktop board fits normal-height windows; zoom and the larger square explorer provide detail.
- Actual idle goose breathing/blinking, leaf flutter, water shimmer and token halo. Motion pauses hidden, stops for reduced motion, and does not override character placement.
- Roll/bots, all special rules, exact finish/bounce, replay, cancellation, saved games, opt-in sound, turn history and keyboard exploration remain functional.

## Validation evidence

`npm test`: **19 passed**, zero failed/skipped, including board bounds/nonoverlap/start/finish and legacy-save migration. `npm run build -- --base=./`: TypeScript and production bundle pass.

Independent production-browser suite passed 320/360/390px mobile and 1440px desktop: English, all63 drawings, starting geometry, visible roster/start tokens, shared pawns on portrait/landscape squares, zoom/pan, sounds/persistence, complete match, win/replay, restart during movement, keyboard and dialogs. Ordinary motion showed five idle animations; reduced motion showed none; simulated hidden state paused them. Zero JavaScript page errors. See [QA.md](QA.md) for exact assertions and limitations.

Actual captures: [mobile](screenshots/game-390.png), [small mobile](screenshots/game-320.png), [desktop](screenshots/game-1440.png), [shared pawns](screenshots/game-shared-390.png).

## Team and autonomy

[Current brief](REFERENCE_SPRINT.md), [team](TEAM.md), [design](REFERENCE_DESIGN.md), [art](REFERENCE_ART.md), [UX](REFERENCE_UX.md), [motion](REFERENCE_MOTION.md). Specialists exchanged geometry, illustration and motion contracts; frontend integrated; QA independently found and retested desktop-start clipping, art cropping and shared-pawn clipping.

The agents operate autonomously within an active session. Their briefs persist; the processes do not run indefinitely after the session. [AUTONOMY.md](AUTONOMY.md) specifies a coordinated task loop and what a separately provisioned authenticated runner needs for unattended operation. No always-on runner is installed.

## GitHub and public delivery

Repository: https://github.com/canmils/OcaGo . GitHub Pages is now enabled at https://canmils.github.io/OcaGo/ . The old deployment was reachable before this update; the coordinator must verify the new English build after pushing and deployment. A push or local test alone does not prove the public version.

The install/start instructions were saved in the environment draft for reuse. Official Scopely/Monopoly GO research pages remain blocked by proxy policy. Required domains were saved while preserving existing allowlist entries; review/save changes in environment settings and publish to activate configuration. This saved draft is not an applied runtime change. No live Scopely gameplay audit is claimed; retrieved-source limits are explicit in REFERENCE_UX.md.

## Remaining limitations and next queue

- Real-user enjoyment studies, physical-device audio listening, Safari/iOS, screen-reader and exhaustive contrast audits are not established by Chromium checks.
- Ring-transition cues and tiny board microdetail still benefit from zoom/explorer; further art refinement should follow real playtesting.
- Local opponents only. Online multiplayer, accounts, persistent server progression and live events are not implemented; their earlier documents are proposals.
- Continue from actual evidence and incomplete acceptance criteria, not a claim of parity with a major mobile-game production. Use the existing checkout, read AGENTS.md and do not create a worktree unless requested.
