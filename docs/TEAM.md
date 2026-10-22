# Specialist delivery team

## Current reference-based iteration

The latest user correction takes priority: **English**, an illustrated board matching the supplied start/route/finish composition, every cell drawn, all players visible, and actual idle animation. See [REFERENCE_SPRINT.md](REFERENCE_SPRINT.md) for acceptance gates. Game design, art direction, UX research, animator, frontend and QA worked in parallel and shared concrete layout/module contracts. Root integrated English engine messages and migration of old saves. Relevant evidence: [design](REFERENCE_DESIGN.md), [art](REFERENCE_ART.md), [UX](REFERENCE_UX.md), [motion](REFERENCE_MOTION.md), and [QA](QA.md). [AUTONOMY.md](AUTONOMY.md) explains the active-session task loop and the additional runner needed for continuous unattended operation.

The initial functional prototype is a baseline, not the final quality target. The user requested a specialist team to improve the actual game. All roles below are executing within this session; these instructions do not create an unattended background service.

| Role | Concrete ownership | Required delivery |
| --- | --- | --- |
| UI/UX | docs/UX.md | Audit actual screens; specify mobile hierarchy, interaction states, readable navigation, accessibility |
| Art | public/art/, docs/ART.md | Cohesive original goose, garden, and special-square assets integrated into the game |
| Animation | src/animation.ts, src/animation.css, docs/ANIMATION.md | Dice, movement, events, victory, cancellation and reduced motion |
| Frontend | main.ts, style.css, index.html, README | Integrate specialists into a substantially improved playable interface |
| Backend/data | src/storage.ts, tests/storage.test.ts, docs/BACKEND.md | Validated versioned local saves; future server boundaries explicitly distinguished |
| QA | docs/QA.md, tests/qa-*.test.ts | Independent rule regressions and browser checks at desktop and mobile sizes |
| Coordinator | Integration and GitHub delivery | Resolve ownership, review evidence, update status, publish validated changes to the requested repository |

## Added specialists for the vertical slice

| Role | Concrete ownership | Delivery |
| --- | --- | --- |
| Creative director | docs/CREATIVE_DIRECTION.md | Original identity, prioritized art decisions, screenshot-based quality rubric |
| Game designer / producer | docs/PRODUCTION.md | Focused gameplay milestone, measurable acceptance, specialist coordination |
| Technical artist | src/technical-art.*, public/art/atmosphere-*, docs/TECHNICAL_ART.md | Original cast portraits, garden depth, current-player focus, trails and arrival effects |
| Sound designer | src/audio.ts, docs/AUDIO.md | Original opt-in synthesized cues, persisted mute, bounded overlap and safe cleanup |
| Playtest / usability analyst | docs/PLAYTEST.md | Actual heuristic browser walkthrough, actionable findings, future human playtest protocol |
| Progression / economy and live-events designer | docs/PROGRESSION.md, docs/LIVE_EVENTS.md | Scoped later cosmetic progression and optional event specifications; no economy or server claimed as implemented |

The coordinator integrates modules into the actual game; QA independently validates the combined production build. This is a coordinated session team with durable handoff documents, not a permanently running autonomous service. The next task should resume from STATUS.md and incomplete acceptance criteria rather than respawning every role without a concrete need.

## Executable agent team

The roles above are now also opencode agents under [.opencode/agent](../.opencode/README.md), with a coordinator that groups work by file ownership so parallel branches never conflict, and an independent QA agent that verifies each change before it reaches review. The audit agent plays the running game in a real browser and converts what it finds into the prioritized backlog in `docs/UX_AUDIT.md` plus GitHub issues labelled `ux-audit`. Commands: `/ocago-audit`, `/ocago-improve`, `/ocago-implement`, `/ocago-verify`. Agents open pull requests; a human merges.

## Delivery gate

Do not call the redesign finished from documents alone. Integrate assets, motion and persistence, run tests and production build, and check the resulting screens and full match in Chromium. Record exact evidence and remaining defects. GitHub Actions and Pages are the intended delivery path; do not claim a live public URL until verified. The current environment can push Git commits but GitHub API operations returned Forbidden, so Pages configuration/deployment status may require repository-owner action.
