# OcaGo production brief: one complete garden expedition

## Outcome and scope

Make the existing Spanish local match feel intentional, readable and worth replaying. This cycle covers the journey from welcome to the first human roll, automatic opponents, meaningful special-square events, victory and another match. It does not add game rules, accounts, multiplayer, purchases, energy or a server. A polished vertical slice demonstrates a quality direction; it is not evidence of commercial quality or equivalence to MONOPOLY GO!.

The creative director owns coherence: an original garden expedition, cream goose with coral scarf, warm gold for rewards, and deep teal structural depth. Larger center mascot and consistent illustrated portraits should reinforce this identity rather than add decorative interface density. Existing exact-finish and finite-penalty house rules in DESIGN.md remain authoritative.

## This cycle: three priorities

### 1. Understand every turn

Moment to moment, the player should know who acts, what they rolled, where they landed, why an effect occurred and who acts next. The immediate objective is to reach 63 exactly; the round-to-round goal is to regain the lead without having to memorize the board. A match remains a chance-driven race, not an unimplemented strategic experience.

Implementation guidance: keep the actor visible throughout resolution. Present short actor/roll feedback after the die settles; preserve the final effect explanation until the next action. During a bonus jump, show the landing square and destination instead of only its final number. Human skipped turns must say rest rather than imply a die roll. The current implementation animates the die even when `takeTurn` skips; this is a concrete clarity defect to correct if turn feedback is touched.

Acceptance criteria:
- At 390px and 320px widths, the active player, roll/rest action and most recent result remain readable without horizontal page scrolling.
- For goose, bridge, maze, death and overshoot, browser QA can identify actor, destination and next-turn ownership from visible Spanish text, with no need to open help.
- A deterministic skipped-turn scenario shows no die result or dice animation and announces the remaining penalty.
- A roll cannot start another roll while resolving; bots progress without human input. Help, restart and persisted resume remain usable.

### 2. Give the garden one visual and audio language

Use the same goose identity, silhouettes, palette and treatment across welcome, board, player portraits and finish. Motion should explain anticipation, movement, special effect and arrival. A small original synthesized sound vocabulary can reinforce these stages without adding downloaded audio dependencies.

Acceptance criteria:
- Remove unrelated emoji player portraits when approved original portraits are available; all three players remain identifiable by names/token letters as well as color.
- Distinguish positive travel, waiting and setback outcomes through an icon plus text; do not rely on color or sound alone.
- Audio initializes only after a user gesture, has a visible accessible mute control, persists the preference safely and falls back to silent gameplay if unavailable. No automatic background music is required.
- Reduced motion eliminates nonessential hops/confetti without hiding results; restart cancels stale motion and audio. Background tabs do not accumulate overlapping cues.
- Capture one mobile and one desktop screenshot and record an actual visual review. Checklist completion alone does not establish art quality.

### 3. Finish with an understandable arrival and an immediate replay

Every match should end deliberately, for either a human or bot winner. Keep the final board available and offer a clear replay with no reward gate. The garden arrival can use a short shared visual/audio motif; a loss should remain warm without falsely calling the player the winner.

Acceptance criteria:
- Human and bot victories name the correct winner and prevent further turns. Final board and replay are both reachable by keyboard and touch.
- Replay clears positions, penalties, saved match and pending effects, then starts a new human turn without a reload.
- A complete seeded match passes in a production browser without uncaught errors; restart during movement and resume after a bot turn are covered.
- A manually reviewed 60–90 second recording or observed browser run documents the welcome-to-first-special-effect sequence. Report whether this review occurred; do not fabricate it.

## Team handoffs and decisions

Producer owns scope and acceptance criteria, creative director owns presentation coherence, technical artist owns original portraits/effects and audio designer owns cue implementation. Frontend/coordinator integrates these independent deliverables. QA verifies the combined production bundle and distinguishes observed behavior from product hypotheses. Progression/economy designer records a later proposal without introducing currencies into this cycle.

Before integration, agree on asset paths, sound exports and cancellation behavior. Keep game.ts rules and saved-match schema stable unless a genuine defect requires correction. New preference keys must be separate from match saves, tolerate unavailable storage and never block a match. Specialists leave committing and GitHub publication to the coordinator.

## Validation and readiness

Run existing deterministic rules/storage tests, TypeScript/production build and browser smoke against the final combined changes. Browser checks should include narrow mobile, desktop, keyboard, reduced motion, muted/unmuted audio, actual special-square scenarios, restart, resume and both winners. Record failures and fixes in STATUS/QA; do not imply that requirements listed here have already passed.

A playable local build and a reachable deployed URL are separate outcomes. Public readiness requires a successful GitHub Pages deployment and an actual successful request to its game page. If network policy blocks verification, report that precise limitation instead of inventing a playable link.

## Later roadmap, gated by evidence

1. Observe actual first-time players: can they explain the objective, recognize an extra roll and recover from a setback? Record observations as research only after sessions happen. Improve comprehension before expanding the feature set.
2. If replay interest is supported, introduce a small local cosmetic journey earned by completing matches. Preview rewards clearly, preserve ordinary free play and avoid payment, energy, fear-of-missing-out timers or infinite reward schedules. Progression remains optional and stored locally.
3. Consider a daily seeded expedition as an optional mode after defining seed/version reproducibility and a fair rules contract. A date label is not evidence of an online service or competitive fairness.
4. Before online friends play, explicitly design authoritative turns, reconnect, privacy, abuse handling, hosting cost and persistence. Scope and authorize an actual backend; do not add mock accounts or pretend local bots are people.
5. Live events require a stable content pipeline, event configuration, rollback and measured player interest. A broad live-operations economy is not a prerequisite for a delightful complete La Oca match.
