# Independent quality assurance

## Current reference redesign — verified 2026-10-20

The final browser run exercised the production preview on port 4173, bundle `index-BVNSs9bz.js`, using system Chromium and Playwright. This is evidence for the actual English illustrated-board implementation, not a pass based on design documents. The coordinator owns GitHub deployment/public-site verification separately.

`npm test` passed 19 tests: engine rules, 378 position/die combinations, terminal/skip/collision cases, versioned saves and Spanish-save migration, and ordered/bounded/nonoverlapping board geometry. TypeScript and `npm run build -- --base=./` passed. The complete production-browser script exited successfully with zero JavaScript page errors.

## Reference-specific acceptance

At 320×740, 360×800, 390×844, and 1440×1000:

- All three player cards are visible simultaneously in the initial viewport. The roster is above the mobile board; it is not hidden under a fixed action dock.
- All three starting tokens are visible inside the illustrated START apron at the bottom left. Numbered square 1 is a larger vignette: its area is at least 1.8 times ordinary square 2. The route begins to the right, and finish square 63 is centrally located.
- Every numbered square 1–63 contains SVG illustration. Cell numbers, thematic special squares and original English scene labels remain available. The engine still starts players at position 0; the first roll moves onto numbered cells.
- No horizontal document overflow. The primary roll control is visible and measures 45px high on phones, 51px on desktop.
- Zoom enlarges artwork by more than 1.5× and provides internal panning without horizontal page overflow. Returning to overview restores the normal layout.

At both 320px and 390px, fixtures placed all three players together on portrait square 3 and landscape square 10. Assertions verified three distinct initials, nonzero footprint, each token completely inside its cell, no pairwise overlap, and no token concealing the number-badge center. [Shared-square screenshot](screenshots/game-shared-390.png).

## English and gameplay

- The HTML language is `en`. The welcome, normal screen, help/rules, square explorer, victory and live outcomes pass an explicit check against the former Spanish vocabulary.
- A real version-1 save with `Tú` and a Spanish bridge result migrates to version 2, English `You` and English resume status, preserving the player's position. Custom names are still safely rendered as text; an injected markup fixture creates no element.
- Keyboard navigation has one board tab stop; arrows follow the route, Home/End jump to its ends, and Enter opens the correct square detail. Escape restores focus. Square navigator controls and numeric picker are at least 44px high.
- Saved bot turns resume automatically. Bots remain paused while a rules dialog is open and continue after it closes.
- Restart during movement cancels stale work and leaves all three players at START. A separate normal-motion check verified a real dice animation followed by cancellation and a stable reset after 1.6 seconds.
- Rest turns decrement the skip counter without a dice animation or roll-note frequencies. The turn transcript retains the human result while both bots play and is capped at 12 entries.
- Forced exact human and bot victories display the result, disable rolling, persist across reload, and permit replay. A complete seeded match from START to victory completed in 15 virtual-clock batches; the human used the visible roll button and bots ran automatically.

## Actual animation and audio behavior

A separate normal-motion Chromium page observed **five running idle animations** in the integrated board. The same page was given a simulated `document.hidden` state plus a `visibilitychange` event: the idle root became paused and its CSS animations were paused. Switching to reduced motion removed all idle animations. This tests the implementation's visibility handler; it is not a claim of exhaustive real-device background lifecycle coverage.

Sound starts off. User opt-in creates an AudioContext; preference persists across reload, and mute updates correctly. A saved sound opt-in plus restored bot turn creates **zero AudioContexts without a new user gesture**. Cues are synthesized locally; these checks instrument context and oscillator behavior, not subjective listening quality or physical speakers.

## Defects found and corrected

1. Desktop board initially extended below a 1000px viewport, hiding START tokens. The desktop fit was corrected; the strict initial-visibility assertions now pass.
2. Portrait/landscape art cropped heads and objects under cover scaling. Art direction introduced aspect-aware subjects with full-bleed backgrounds before the final captures.
3. Shared pawns could clip in narrow cells. Frontend added compact, orientation-aware occupancy layouts, and QA now checks real token rectangles rather than only counting DOM elements.

One early paused-bot virtual-clock check failed transiently during concurrent rebuilds. An isolated reproduction and subsequent complete unchanged runs passed. The final assertions remain strict; none were disabled to obtain the result.

## Screenshots

- [320px mobile](screenshots/game-320.png)
- [360px mobile](screenshots/game-360.png)
- [390px mobile](screenshots/game-390.png)
- [1440px desktop](screenshots/game-1440.png)
- [Shared-square example](screenshots/game-shared-390.png)

These are captures of the final reference redesign, not the earlier grid prototype.

## Reproduce

Start the production preview after building, then run from the repository root:

```sh
npm run build -- --base=./
npm run preview -- --port 4173
# In a second terminal, with Playwright available:
PLAYWRIGHT_MODULE_PATH=/path/to/playwright CHROMIUM_PATH=/usr/bin/chromium QA_URL=http://localhost:4173 node scripts/qa-browser.cjs
```

The script writes fresh screenshots to `docs/screenshots/` and emits measured acceptance results. `PLAYWRIGHT_MODULE_PATH` can be omitted when Playwright is installed normally. It is an optional QA tool, not a production runtime dependency. Browser timing is virtualized for deterministic complete-match fixtures; normal-motion cancellation/idle checks use a separate page with real time.

## Limits

No real participant playtest, iOS/Safari run, screen-reader audit, exhaustive contrast audit, physical-device listening, server multiplayer, or long-term fun/retention outcome is established. At phone overview scale, some individual art and numbers are small; zoom and the large square explorer are provided as alternatives. This is an improved original playable prototype, not evidence of Scopely production parity. Public deployment must be checked independently after GitHub Actions finishes.

## Public deployment verification — 2026-10-20

Coordinator verified GitHub Actions run39388226511 completed build and Pages deployment successfully for source commit d88bded. The site https://canmils.github.io/OcaGo/ serves the English HTML and all16 deployed HTML/JS/CSS/art files match the independently browser-tested production build byte-for-byte, downloaded with TLS certificate verification enabled. Direct public Chromium navigation failed with ERR_CERT_AUTHORITY_INVALID in the environment proxy; validation was not bypassed. Functional browser evidence above is from the identical local production build, while HTTPS verification establishes the published artifact identity. This distinction does not claim an end-to-end browser run against the public hostname.

## Keyboard order verification — 2026-10-23 (issue #16 / UX-006)

Chromium at 320×740, 390×844 and 1440×1000, welcome dismissed, fresh storage.

- The first Tab stop is the visible `Skip to roll the die` link (rendered at top 8px when focused).
- Enter on it moves focus to `#roll`, fully visible with no scrolling needed — one Tab and one Enter instead of seven Tabs.
- Board roving focus still works: `#cell-1` + ArrowRight -> `#cell-2` -> `#cell-3`.
- Dialog focus return holds: rules opened from `#help` returns focus to `#help` on Escape; square detail opened from `#legend` returns to `#legend`.
- Zero page errors at all three viewports.
