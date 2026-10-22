# OcaGo delivery status — 2026-10-22

## UI/UX improvement program

An executable agent team now runs the improvement loop from inside the repository (`.opencode/`, documented in [.opencode/README.md](../.opencode/README.md) and [TEAM.md](TEAM.md)):

`ux-auditor` audits the running game → coordinator ranks the backlog → `visual-designer` / `interaction-engineer` / `motion-designer` / `accessibility-engineer` implement on branches → `qa-verifier` checks the PR against acceptance criteria. Commands: `/ocago-audit`, `/ocago-improve`, `/ocago-implement <issue>`, `/ocago-verify <pr>`.

**Audit state (pass 2 of 2026-10-22, [UX_AUDIT.md](UX_AUDIT.md)).** Two audit passes ran against the live game in Chromium at 320/360/390/768/1440px. Pass 1 filed two P0 findings that were **retracted as measurement errors**: the contrast ratio had been computed against the page background instead of the turn card (real ratio 6.43:1, passes AA), and the roll button had been measured while the board was still zoomed (in the default state it is fully visible at 581–626 in a 740px viewport). The methodology now requires the effective background, the default state, reconciliation with the passing browser suite and reproduction twice; pass 2 produced zero false P0s.

Open backlog:

| Issue | Severity | Finding |
| --- | --- | --- |
| #5 | P1 | Four controls below 44×44px at mobile ("?" 36×40, Zoom 51×32, Explore 91×32, Start 122×36); all pass at ≥768px |
| #6 | P1 | Status line is 10px at 320/360, 11px at 390 and 12px at ≥768, below the 13px minimum |
| #8 | P2 | Die faces are Unicode emoji (`src/main.ts:18`) rather than SVG, so they render differently per OS |

Recorded without an issue yet: the roll button is 45px rather than 48px at mobile, and it is 8th in the tab order.

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

Repository: https://github.com/canmils/OcaGo . GitHub Pages is now enabled at https://canmils.github.io/OcaGo/ . The English redesign is publicly deployed and verified. GitHub Actions run 39388226511 built and deployed commit d88bded8ca520a99d0ea78c8af0a62eb28653ab6 successfully. HTTPS requests with certificate verification enabled fetched all16 published HTML/JS/CSS/art files; each matches the locally browser-tested production output byte-for-byte. The public HTML declares lang=en. Direct public-site Chromium navigation encountered this environment’s proxy-certificate trust error; verification used TLS-verified downloads plus the independent local production-browser suite, without disabling certificate validation.

The install/start instructions were saved in the environment draft for reuse. Official Scopely/Monopoly GO research pages remain blocked by proxy policy. Required domains were saved while preserving existing allowlist entries; review/save changes in environment settings and publish to activate configuration. This saved draft is not an applied runtime change. No live Scopely gameplay audit is claimed; retrieved-source limits are explicit in REFERENCE_UX.md.

## Remaining limitations and next queue

- Real-user enjoyment studies, physical-device audio listening, Safari/iOS, screen-reader and exhaustive contrast audits are not established by Chromium checks.
- Ring-transition cues and tiny board microdetail still benefit from zoom/explorer; further art refinement should follow real playtesting.
- Local opponents only. Online multiplayer, accounts, persistent server progression and live events are not implemented; their earlier documents are proposals.
- Continue from actual evidence and incomplete acceptance criteria, not a claim of parity with a major mobile-game production. Use the existing checkout, read AGENTS.md and do not create a worktree unless requested.
