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
- A complete seeded match, from all players at zero to victory, finished in 24 simulated clock cycles. The human rolled through the visible button, and both bots ran automatically.
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

The final production-preview run used `QA_URL=http://localhost:4173` and passed the full suite, including its asserted layout measurements and 24-cycle seeded match, with zero page errors. Published screenshots were refreshed by that production run.

Not established by these checks: public deployment, Safari/iOS behavior, screen-reader usability, contrast compliance, offline reload caching, or long-term retention/enjoyment. Reduced-motion gameplay was exercised. Separate 390×844 ordinary/reduced-motion checks observed one/zero active animations immediately after rolling, respectively; both restarted cleanly, remained at zero after 1.8 seconds, and emitted no page errors. These are behavior checks, not a claim of an exhaustive accessibility audit.
