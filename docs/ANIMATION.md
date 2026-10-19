# Motion direction and integration

Motion explains the turn: anticipation before the real die result, a short hop at each destination, a distinct special-square response, and garden petals on victory. No motion is required to understand the match; status text and board state remain authoritative.

`src/animation.ts` imports its own stylesheet and exports:

- `animateDice(element, die, signal?)`: 440ms anticipation then final Unicode face and accessible label.
- `animateStep(destinationTile?, signal?)`: 115ms token landing. Pass the tile after rendering its new token.
- `animateEvent(tile, kind, signal?)`: 300ms feedback; kinds are `goose`, `bridge`, `setback`, `rest`.
- `celebrateVictory(board)`: decorative CSS petals; returns cleanup to call on restart.

Use one AbortController per active turn. Abort on restart before replacing game state. Animation promises settle on abort so callers can check their own generation guard. Do not retain the previous `.rolling` animation on the die while invoking this module. The board containing victory effects should have `position: relative`.

The module checks `prefers-reduced-motion` at invocation, skips all nonessential animation, and never plays sound or flashes. Victory decoration is hidden from assistive technology and removed after 2.6 seconds. Its 24 lightweight nodes use deterministic placement and do not affect game randomness.

Validation: TypeScript compiler (`npx tsc --noEmit`) passed after module implementation. Full visual integration and browser checks belong to the frontend and QA pass; this document does not claim they have passed yet.
