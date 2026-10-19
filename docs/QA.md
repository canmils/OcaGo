# Independent quality assurance

QA owns this evidence, additional engine regressions, and browser checks. Product/design statements elsewhere are requirements, not evidence.

## Engine and build

`npm test` passed 16 tests (the original eight, four persistence tests, and four independent QA regressions). `npm run build` passed TypeScript and the production Vite build.

`tests/qa-rules.test.ts` exercises all 378 position/die combinations, including reflected landings and single-effect resolution. It also checks input preservation, unchanged opponents, both bot victory identities, terminal states, all-player skipped-turn cycles and round increments, and shared-square noncapture. This supplements, rather than duplicates, the original representative-rule tests.

## Redesigned browser evidence

Chromium through Playwright, HTTP development and production preview servers, on 2026-10-19. Clean integrated runs passed:

- 320×740, 360×800, 390×844, and 1440×1000: no horizontal overflow. Mobile board remains above the fixed action dock, with the roll action visible without scrolling. Final measured mobile roll height: 44px; cell numbers: 10px.
- Keyboard opening of rules with Enter, Escape dismissal, and return of focus to the help button.
- Tile inspection with Enter and Space, readable bridge destination, Escape dismissal, and keyboard focus restored to the selected tile. These checks also passed against the production preview on port 4173.
- Reload of a saved bot turn schedules automatic movement.
- Restart while a move is in flight leaves all three players at zero and cancels stale work.
- Human skipped-turn action; forced human and bot victory; terminal state survives reload; new match is playable.
- A complete seeded match, from all players at zero to victory, finished in 24 simulated clock cycles in the initial redesign and 15 cycles in the final specialist slice. Clock cycles measure harness batching, not gameplay turns. The human rolled through the visible button, and both bots ran automatically.
- Persisted name containing `<em id="injected">X</em>` displays as text; no injected element exists after the frontend fix.
- Zero JavaScript page errors in the clean integrated run. An earlier missing-export error occurred during concurrent hot reload; that transitional observation is excluded from the final pass.

Screenshots: [390px mobile](screenshots/game-390.png), [320px mobile](screenshots/game-320.png), [360px mobile](screenshots/game-360.png), [desktop](screenshots/game-1440.png). These show the redesigned application, not the previous baseline. Desktop uses vertical page scroll for the complete board.

## Bugs found and follow-up

- Fixed: persisted player names were interpolated as HTML. Regression browser case verifies literal rendering.
- Fixed: mobile primary action measured 41px and narrow labels measured 9px. Final measurements are 44px and 10px.
- Fixed: mobile restart scrolled beneath the fixed action dock and could not receive pointer input at 390×844. Increased bottom spacing and scroll margins restore access. The final suite performs gameplay interactions at mobile size, and a separate ordinary-motion browser run confirms stable restart after cancellation.

## Reproduce

Start `npm run dev -- --port 5173`, then run from the repository root:

```sh
PLAYWRIGHT_MODULE_PATH=/path/to/playwright CHROMIUM_PATH=/usr/bin/chromium node scripts/qa-browser.cjs
```

The browser suite accepts `QA_URL` (default `http://localhost:5173`) and writes fresh screenshots to `docs/screenshots/`. It uses deterministic browser randomness for finish fixtures and the complete seeded match. Playwright is an optional QA prerequisite, not an application dependency.

The final production-preview run used `QA_URL=http://localhost:4173` and passed the full suite, including its asserted layout measurements and a complete seeded match, with zero page errors. Published screenshots were refreshed by that production run.

Not established by these checks: public deployment, Safari/iOS behavior, screen-reader usability, contrast compliance, offline reload caching, or long-term retention/enjoyment. Reduced-motion gameplay was exercised. Separate 390×844 ordinary/reduced-motion checks observed one/zero active animations immediately after rolling, respectively; both restarted cleanly, remained at zero after 1.8 seconds, and emitted no page errors. These are behavior checks, not a claim of an exhaustive accessibility audit.


## Final specialist slice validation

Rebuilt with `npm run build -- --base=./` (production bundle `index-8cRhdXRL.js`) and reran the expanded suite against port 4173. All 16 engine/storage tests pass. The final production browser suite passes with zero page errors and fresh screenshots at all four widths.

Additional assertions now cover:

- Sound defaults off and creates no AudioContext. Explicit activation creates one context and persists the preference; reload preserves the opt-in without creating a context, and mute updates the button/state. A restored bot turn with saved sound opt-in also creates no AudioContext automatically. These are headless API behavior checks; audio timbre and perceived loudness were not listened to.
- The board has exactly one cell in the tab order; ArrowRight, Home, and End move focus along the route. Enter/Space inspect tiles; previous/next and the numeric picker measure at least 44px high.
- Bots remain still while the rules dialog is open and resume after dismissal.
- A skipped human turn clears its skip counter without a dice animation or the distinctive roll-note frequencies. The two-note rest cue is allowed. The journal retains the skip message through subsequent bot turns; after a complete match its history is capped at 12 entries.
- Separate real-time, ordinary-motion mobile check: a goose arrival displays the actual result while two animations remain active and the roll button is disabled. The message reads “Tú saca 1 y llega a la casilla 9. ¡De oca a oca y tiro porque me toca!” Restart remains stable afterward and there are no page errors.

The final screenshots include sound/journal controls, original portraits, and the new board presentation. These checks do not establish that the journal survives a full page reload; its intended scope is the current session.
