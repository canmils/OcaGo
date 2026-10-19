# Local data layer and future service boundaries

## Implemented in this milestone

OcaGo is a static browser game with a pure TypeScript rules engine. Its opponents run on the same device. There is no server, account system, online multiplayer, payment flow, or remote economy.

`src/storage.ts` provides a versioned local match snapshot under `ocago.match`. `loadMatch()` returns a validated independent game value or `null`. `saveMatch(game)` returns whether the snapshot was saved. `clearMatch()` removes it. These accept an optional `StorageLike` adapter for deterministic tests; their default is browser localStorage.

Validation enforces the current three-player rules engine's bounds, allowed die results, finite skipped turns, and consistent victory state. Corrupt, obsolete, and oversized snapshots are discarded. Storage denial or quota errors return failure without preventing gameplay. Snapshots contain only game state; no credentials or personal account information. Browser storage is local, editable by the user, and may be cleared by browser settings. It is a convenience, not a trusted competitive record.

Integration: initialize with `loadMatch() ?? newGame()`. Save each completed state transition before presentation animations; this allows refresh to resume a resolved turn rather than reroll it. Starting a fresh match replaces the saved snapshot. A restored computer turn should enter the same scheduling path as a new computer turn. Persist finished games so a refresh preserves the result.

## Validation

`npm test` passed 12 tests after this module was added, including four storage tests: round trip and object isolation; malformed/old/unsafe snapshot recovery; unavailable storage and quota failures; victory persistence and invalid-write protection. `npx tsc --noEmit` passed. Browser integration and visual validation belong to the frontend and QA acceptance pass.

## Online architecture for a later milestone

An online service must own match state, random dice generation, turn order, rule validation, and results. A client should submit an intent such as “roll” with match identity and expected revision; the service should authenticate the player, authorize their turn, atomically apply one transition, and return the canonical state plus events. Duplicate requests must be idempotent, and stale revisions must trigger resynchronization. The client animates returned events rather than deciding a competitive result.

Online scope would additionally require reconnect handling, timeout policy, accessible bot takeover rules, rate limits, privacy and retention decisions, and tests for concurrency and reconnects. Any future progression or rewards ledger must be server owned and transactional. Local snapshots must never become authoritative balances or competitive results. Infrastructure/provider selection and account requirements remain intentionally undecided until online play is an actual approved milestone.
