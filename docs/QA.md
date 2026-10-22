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

## UX-004 status font size — verified 2026-10-22 (PR #12, branch `fix/status-font-size` @ c5b95fc)

Independent verification of finding UX-004 / issue #6 against PR #12. The PR changes only `src/style.css` (`.status` font-size 12px→13px base, 11px→13px in the ≤650px block, 10px→13px in the ≤360px block), adds a `statusFont` assertion to `scripts/qa-browser.cjs`, and refreshes screenshots. No engine, `main.ts` or `index.html` changes.

Gates on the PR branch, after `npm ci`:

- `npm test` — 22/22 pass (19 pre-existing + 3 new), exit 0.
- `npm run build -- --base=./` — clean TypeScript + Vite build, exit 0.
- `source scripts/browser-env.sh && QA_URL=http://localhost:5173 node scripts/qa-browser.cjs` against `npm run dev -- --port 5173` — exit 0, **0 page errors**, result object printed (complete seeded match, reduced motion, idle, zoom, shared tokens).

Independent measurements (throwaway Playwright script, real Chromium, default state after dismissing welcome):

| Viewport | `.status` font | Roll on screen | Horizontal overflow | Status overlaps die/roll/controls | Roster visible |
| --- | --- | --- | --- | --- | --- |
| 320×740 | **13px** ✓ | 45px, fully on screen ✓ | none (scrollW 320) ✓ | none ✓ | 3/3 ✓ |
| 360×800 | **13px** ✓ | 45px, fully on screen ✓ | none (scrollW 360) ✓ | none ✓ | 3/3 ✓ |
| 390×844 | **13px** ✓ | 45px, fully on screen ✓ | none (scrollW 390) ✓ | none ✓ | 3/3 ✓ |
| 768×1024 | **13px** ✓ | 51px, fully on screen ✓ | none (scrollW 768) ✓ | none ✓ | 3/3 ✓ |
| 1440×1000 | **13px** ✓ | 51px, fully on screen ✓ | none (scrollW 1440) ✓ | none ✓ | 3/3 ✓ |

The browser suite itself does not cover 768×1024; that viewport was measured in the independent run above. Mid-game status messages after real rolls (e.g. "You roll 3 and reach square 32. Goose to goose! …") were also measured at 320/390/768/1440: 13px, no overlap, no overflow, roster visible, 0 page errors.

Regression checks:

- **54px min-height reserve**: base `.status` still declares `min-height:54px` and measures exactly 54px at 768×1024 and 1440×1000 in the default state. Mobile keeps its 16px minimum.
- **Desktop aside/board fit**: at 1440×1000 the board bottom is 933px and the aside bottom 819.75px, both within the 1000px viewport; the layout bottom is 989px. The `@media(min-width:651px)` fit rule is unaffected.
- **Long status wrapping**: a forced 260-character status string wraps to 5/4/7/5 lines at 320/390/768/1440 respectively, stays inside the turn-card box, has no horizontal text overflow, and covers no button, input, link, the die or the roll control at any of those viewports.
- **Contrast unchanged**: computed `.status` color `rgb(230,236,210)` on turn-card `rgb(37,91,80)` = **6.43:1**, matching the audited value and passing WCAG AA.

Acceptance criteria (issue #6 / UX-004): both criteria pass — ≥13px at all five viewports, and the text stays on one line or wraps gracefully without covering the die or roll button. Verdict: **PASS**.

Regression test added: `tests/qa-visual.test.ts` pins the CSS contract in `npm test` — `.status` font-size ≥13px in the base rule and in the ≤650px and ≤360px media blocks, the 54px desktop reserve, and the 6.43:1 contrast floor. Proven to fail on `main`'s `style.css` (restored in place: `AssertionError: base .status font-size 12px < 13px`, 21/22) and to pass on the PR branch (22/22).
