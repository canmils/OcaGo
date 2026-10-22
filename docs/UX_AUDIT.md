# OcaGo UI/UX Audit

Audit date: 2026-10-22
Auditor: UI/UX auditor (this session)
Repository: canmils/OcaGo
Dev server: http://localhost:5173 (Chromium via Playwright MCP)
Gates: `npm ci` OK, `npm test` 19/19 pass, `npm run build` OK

## Summary scorecard

| Area | Score (1–5) | One-line verdict |
| --- | --- | --- |
| Visual hierarchy | 3 | Board is the main surface, but the status line — the key feedback channel — is set at 10–12px, and the die is rendered as OS emoji instead of an SVG icon, breaking the illustrated-board identity. |
| Layout and spacing | 4 | No horizontal overflow at any viewport; the roll button is fully on screen at every viewport in the default state; roster, board and action dock all fit at 320×740. |
| Typography | 2 | Status/feedback copy is 10–12px across all viewports, below the 13px minimum; headings are well sized (22–32px). |
| Color and contrast | 4 | Status text measures 6.43:1 and the roll button 6.5:1 against their effective backgrounds — both pass WCAG AA. |
| Touch targets | 2 | Multiple controls fall below the 44×44px minimum at mobile: "?" (36×40), "Zoom out" (51×32), "Explore squares" (91×32), "Start a new game" (122×36) at 320×740. |
| Feedback and motion | 4 | Die animation, token movement, status messages, turn history, and victory dialog all work; idle motion respects reduced motion. |
| Onboarding and comprehension | 4 | Welcome dialog, rules dialog, square explorer, and turn history are all present and in English. |
| Control states | 3 | Disabled states work (game-finished button disabled), but several small controls lack comfortable target sizes. |
| Accessibility | 3 | Contrast passes AA and the keyboard roving focus works (20 stops, `:focus-visible` outlines present), but four controls are under 44×44px and the roll button is 8th in tab order. |
| Consistency and polish | 3 | English throughout, consistent honey-gold/cream palette, all 63 cells illustrated and numbered — but the die face is an OS emoji (⚄) rather than an original SVG icon. |

## Backlog

| ID | Severity | Area | Finding | Evidence | Owner | Issue |
| --- | --- | --- | --- | --- | --- | --- |
| UX-001 | ~~P0~~ retracted | area:a11y | Status text contrast measured against the page background instead of the turn card it sits on. Real ratio 6.43:1, passes AA | Measured 6.43:1 against `.turn-card` `rgb(37,91,80)`; 1.05:1 was against the body background | — | #3 closed |
| UX-002 | ~~P0~~ retracted | area:interaction | Roll button measured while the board was still zoomed. Default state has it fully visible at y=581–626 | Default 581–626 (visible), zoomed 757–802 (below fold) | — | #4 closed |
| UX-003 | P1 | area:interaction | Four controls are below the 44×44px touch-target minimum at 320×740: "?" (36×40), "Zoom out" (51×32), "Explore squares" (91×32), "Start a new game" (122×36). Same failures at 360×800; at 390×844 "?" passes but Zoom/Explore/Start still fail. | Measured bounding boxes at 320×740, 360×800, 390×844 in the default state | visual-designer | #5 |
| UX-004 | P1 | area:visual | Status/feedback font size is 10px at 320×740 and 360×800, 11px at 390×844, 12px at 768×1024 and 1440×1000 — below the 13px minimum for body/event copy at every viewport | Measured computed font size of `[role="status"]` at all five viewports in the default state | visual-designer | #6 |
| UX-005 | P2 | area:visual | Roll button is 45px high at 320×740, 360×800 and 390×844 — below the 48px recommended height for the primary action. Meets 48px at 768×1024 and 1440×1000 (51px) | Measured 222×45px at 320×740; 262×45px at 360×800; 286×45px at 390×844; 51px at 768×1024 and 1440×1000 | visual-designer | — |
| UX-006 | P2 | area:a11y | Roll button is 8th in tab order; keyboard users tab through 7 header/board elements before reaching the primary action. 20 focusable stops total at every viewport | Measured focusable count = 20; roll button index 8; first ten listed in Method | interaction-engineer | — |
| UX-007 | P2 | area:visual | Die face is rendered as an OS-dependent emoji character (⚄) instead of an original SVG icon, breaking the illustrated-board identity and the UX brief's P0 requirement for consistent SVG icons | Die element `#dice` contains only the text node "⚄"; no SVG or img child | visual-designer | #8 |

Sprint 1 (top five by player impact per effort): UX-003, UX-004, UX-005, UX-006, UX-007.

**Correction notice.** UX-001 and UX-002 were filed as P0 by the first audit pass and were retracted by the coordinator after an independent re-measurement showed both were measurement bugs (wrong background for the contrast ratio, leftover zoom state for the layout). The audit methodology requires the effective background, the default state, a self-check against the passing browser suite, and reproduction twice before a finding is filed. Both retractions stand; this pass re-confirms them.

## Findings

### UX-001 — Status/feedback text contrast (P0, area:a11y)

> **RETRACTED on 2026-10-22 by the coordinator — measurement error, not a product defect.**
> The ratio was computed against the **page** background (`rgb(246,237,221)`) instead of the surface the status text actually sits on: the dark green turn card (`.turn-card`, `rgb(37,91,80)`). Measured against its effective background the status text is **6.43:1**, which passes WCAG AA for normal text. Issue #3 closed.
> The 10px font size of UX-004 is real and stays open.

**Problem statement.** The turn status line that announces rolls, special-square results, and wins appeared to have a contrast ratio of only 1.05:1 against the cream page background, which would make turn outcomes effectively invisible.

**Observation (measured).** At 320×740 and 1440×1000, the `[role="status"]` element has computed color `rgb(230,236,210)`. Against the **page** background `rgb(246,237,221)` the ratio is `1.05:1`, but against its **effective background** — the turn card `rgb(37,91,80)` — the ratio is **6.43:1**, which passes WCAG AA (minimum 4.5:1). The roll button measures `rgb(57,70,49)` on `rgb(250,201,103)` = **6.5:1**, also passing AA.

**Hypothesis (interpretation).** The original 1.05:1 figure was a measurement artifact: the status line lives inside a dark turn card, not directly on the page background. Once the effective background is used, contrast is compliant.

**Impact on a real player.** None — status text is legible against its actual background. No fix needed for contrast.

**Acceptance criteria.**
- [ ] The `[role="status"]` text has a computed contrast ratio ≥ 4.5:1 against the turn card background at 320×740 and 1440×1000. (Already passes: 6.43:1.)

**Suggested owner.** — (retracted, no owner)

---

### UX-002 — Primary roll button below the viewport fold (P0, area:interaction)

> **RETRACTED on 2026-10-22 by the coordinator — measurement error, not a product defect.**
> The measurement was taken while the board was still **zoomed** from the earlier zoom test. The zoomed board is larger, which pushes everything below it down. Re-measured in the default state (fresh load, zoom off, no dialog open, `scrollY=0`) the roll button is fully inside the viewport at every tested width. The existing browser suite already asserts this and passes. Issue #4 closed.

**Problem statement.** The roll button was reported as below the 740px viewport at 320×740 (y=757–802), which would hide the primary action on first screen.

**Observation (measured).** Re-measured in the default state at 320×740: roll button bounding box is **y=581–626**, bottom=626, fully inside the 740px viewport (`rollButtonInViewport = true`). At 360×800: y=617.5–662.5. At 390×844: y=660–705. At 768×1024: y=459–510. At 1440×1000: y=482.69–533.69. The button is ≥44px high (45px at mobile, 51px at desktop) and fully on screen at every viewport. The `scripts/qa-browser.cjs` assertion "Visible 44px roll control" passes at 320/360/390/1440px.

**Hypothesis (interpretation).** The original below-fold figure was a measurement artifact: the board was left in the zoomed state from a prior test, inflating the board height and pushing the action dock below the fold.

**Impact on a real player.** None — the roll button is fully visible on load at every supported viewport. No fix needed for layout.

**Acceptance criteria.**
- [ ] At 320×740 with scrollY=0, the roll button's full bounding box is within the viewport (bottom ≤ viewport height). (Already passes: bottom=626 ≤ 740.)

**Suggested owner.** — (retracted, no owner)

---

### UX-003 — Four controls are below the 44×44px touch-target minimum (P1, area:interaction)

**Problem statement.** Several tappable controls are smaller than the 44×44px minimum, making them difficult to hit reliably with a thumb on a phone.

**Observation (measured).** Computed bounding boxes in the default state:

| Control | 320×740 | 360×800 | 390×844 | Passes 44×44? |
| --- | --- | --- | --- | --- |
| "?" (How to play) | 36×40 ✗ | 36×40 ✗ | 44×44 ✓ | Fails at 320/360 |
| "Zoom out" | 51×32 ✗ | 51×32 ✗ | 51×35 ✗ | Fails at all three |
| "Explore squares" | 91×32 ✗ | 91×32 ✗ | 91×35 ✗ | Fails at all three |
| "Start a new game" | 122×36 ✗ | 122×36 ✗ | 122×36 ✗ | Fails at all three |

By contrast, the roll button is 222×45px at 320×740 and the sound/turns buttons are 67×44px and 46×44px, which meet the minimum. At 768×1024 and 1440×1000 all four controls meet 44×44px.

**Hypothesis (interpretation).** Secondary controls were sized for compactness rather than touch comfort. On a phone, a 32px-high target is easy to miss, especially while the board animates or in motion.

**Impact on a real player.** A player trying to open the rules, zoom, explore squares, or restart may miss the tap and accidentally trigger a neighboring cell or action, causing frustration. This is most severe at 320×740 where all four controls fail.

**Proposed fix.** Increase padding/min-height on these controls so each is at least 44×44px, without changing their visible labels. Re-verify at 320×740, 360×800 and 390×844.

**Acceptance criteria.**
- [ ] "?", "Zoom out", "Explore squares", and "Start a new game" each measure ≥ 44×44px at 320×740, 360×800 and 390×844.
- [ ] No control overlaps another after resizing.
- [ ] The roll button remains the largest primary target.

**Suggested owner.** visual-designer.

---

### UX-004 — Status/feedback font size is below the 13px minimum (P1, area:visual)

**Problem statement.** Body/event copy (the status line) is below the 13px minimum at every viewport, making turn outcomes harder to read than necessary.

**Observation (measured).** Computed font size of `[role="status"]` in the default state:

| Viewport | Status font size | Meets 13px? |
| --- | --- | --- |
| 320×740 | 10px ✗ | No |
| 360×800 | 10px ✗ | No |
| 390×844 | 11px ✗ | No |
| 768×1024 | 12px ✗ | No |
| 1440×1000 | 12px ✗ | No |

The UX brief requires body/event copy ≥ 13px and primary state copy ≥ 14px. The roll button text is 13px at mobile and 14px at desktop, which meets the primary-state bar — but the status line does not.

**Hypothesis (interpretation).** The status text was styled small to fit near the die, but at 10–12px it is hard to read, especially for players with mild visual impairment or on lower-quality phone screens.

**Impact on a real player.** Turn outcomes (rolls, special-square results, wins) are harder to read than necessary. This is the primary feedback channel for the game and is undersized at every viewport.

**Proposed fix.** Set the status font size to at least 13px at all viewports and adjust surrounding spacing so it still fits beside the die. Combine with the contrast compliance already in place (6.43:1).

**Acceptance criteria.**
- [ ] Status font size ≥ 13px at 320×740, 360×800, 390×844, 768×1024 and 1440×1000.
- [ ] Status text remains on one line or wraps gracefully without covering the die or roll button.

**Suggested owner.** visual-designer.

---

### UX-005 — Roll button is 45px high at mobile, below the 48px recommended height (P2, area:visual)

**Problem statement.** The roll button measures 45px high at 320×740, 360×800 and 390×844. The UX brief recommends the primary action be ≥ 48px. It meets the 44px accessibility minimum but falls short of the 48px primary-action target.

**Observation (measured).** Roll button: 222×45px at 320×740; 262×45px at 360×800; 286×45px at 390×844; 186×51px at 768×1024; 231×51px at 1440×1000. The button is fully on screen at every viewport (bottom ≤ viewport height).

**Hypothesis (interpretation).** The button was sized to the 44px floor rather than the 48px comfort target for the primary action.

**Impact on a real player.** Marginal — the button is still easy to tap — but a 48px primary action is more comfortable for repeated tapping throughout a match.

**Proposed fix.** Increase roll button height to 48px at mobile breakpoints, adjusting width/padding as needed. Verify the button remains fully on screen at 320×740.

**Acceptance criteria.**
- [ ] Roll button height ≥ 48px at 320×740, 360×800 and 390×844.
- [ ] Button remains fully on screen at 320×740 (bottom ≤ viewport height).

**Suggested owner.** visual-designer.

---

### UX-006 — Roll button is 8th in tab order (P2, area:a11y)

**Problem statement.** Keyboard users must tab through 7 elements (home link, sound, turns, help, zoom, cell 1, explore squares) before reaching the roll button, which is 8th in the tab order.

**Observation (measured).** At every viewport there are 20 focusable elements (roving focus on the board, not 63). The first ten in tab order are: home link ("OcaGo home"), "Sound off", "Turns", "?", "Zoom in", cell 1, "Explore squares", "Roll the die", "Start a new game", close (×). The roll button is 8th.

**Hypothesis (interpretation).** Document order places header controls and the board before the action dock, so keyboard order does not match the visual prominence of the roll action.

**Impact on a real player.** Keyboard users reach the primary action after several tabs, which is inefficient but not blocking (only 20 stops total, and arrow keys navigate the board).

**Proposed fix.** Add a visible skip link to the turn action near the top of the page, or reorder so the roll control is reachable in a few Tab presses, while preserving board roving navigation.

**Acceptance criteria.**
- [ ] From page load, a keyboard user reaches the roll button in no more than 4 Tab presses.
- [ ] Board arrow-key navigation and Home/End/Enter inspection continue to work.
- [ ] Focus returns correctly from dialogs.

**Suggested owner.** interaction-engineer.

---

### UX-007 — Die face is an OS emoji instead of an original SVG icon (P2, area:visual)

**Problem statement.** The die face is rendered as an OS-dependent emoji character (`⚄`) rather than an original SVG icon. This breaks the illustrated-board identity and the UX brief's P0 requirement: "Use original consistent SVG icons instead of OS-dependent emoji for major tile types and dice."

**Observation (measured).** The `#dice` element contains only the text node `⚄` — no SVG or `img` child. Emoji rendering varies by OS and browser, so the die may look different on iOS, Android, Windows, and Linux, and will not match the game's original storybook art style.

**Hypothesis (interpretation).** The die was implemented with a text emoji for simplicity rather than an original SVG icon consistent with the rest of the illustrated board.

**Impact on a real player.** The die is the most frequently interacted element in the game. An OS emoji die looks inconsistent with the original storybook art and may render differently across devices, weakening the game's visual identity.

**Proposed fix.** Replace the emoji die face with an original SVG icon matching the game's art style, with distinct faces for values 1–6.

**Acceptance criteria.**
- [ ] The `#dice` element contains an SVG (or img) icon, not a bare emoji text node.
- [ ] Die faces for values 1–6 are visually distinct and consistent with the game's art style.
- [ ] The die still animates on roll and shows the final face before token movement.

**Suggested owner.** visual-designer (with art for the SVG icon).

---

## Preserved

The following already work well and must not regress during any fixes:

- All 63 cells are illustrated and numbered; cell 1 is a larger bottom-left start vignette; square 63 is the central Goose Garden (verified via square explorer on 6, 19, 42, 63 and the full board snapshot).
- All three players (You, Lola, Bruno) are visible above the board at every viewport; shared tokens on a square keep all identities visible and never conceal the square number (verified at square 21 with Lola + Bruno).
- No horizontal page overflow at 320×740, 360×800, 390×844, 768×1024, or 1440×1000 (measured `scrollWidth = clientWidth` at all five viewports).
- Roll control is ≥ 44px high (45px at mobile, 51px at desktop) and has good contrast (6.5:1); it is fully on screen at every viewport in the default state.
- Keyboard route works: arrow keys follow the numbered route, Home/End jump to the ends, Enter inspects a square, Escape restores focus (20 focusable stops via roving focus, `:focus-visible` outlines present).
- Tokens on shared squares stay visible with distinct initials (Y, L, B) and do not conceal the number-badge center.
- Reduced motion disables idle animation; hidden tab pauses it (documented in QA.md; verified by the QA browser suite).
- Interface language is English throughout (welcome, rules, journal, status, square explorer, victory — all verified in English).
- Rules behave as documented: exact finish on 63, overshoot bounce, goose hops grant another roll, bridge 6→12, inn 19 rests 1, well 31 and prison 52 rest 2, maze 42→30, death 58→start (verified via natural play: goose jumps, maze at 42→30, death/bounce sent You to start via square 58, inn "Rest 1", well "Rest 2"; bridge and all squares verified via explorer).
- Welcome dialog, rules dialog, turn-history journal, square explorer, victory dialog, and restart ("Play again" resets all to position 0) all function.
- Zoom control ("Zoom in"/"Zoom out") is present and functional (verified zoom enlarges art >1.5× with internal pan, no page overflow).
- `npm test`: 19/19 pass; `npm run build`: clean TypeScript and production bundle.

## Method

**Commands run.**
- `git checkout main && git pull --ff-only` — already on main, up to date with origin/main.
- `npm ci` — 5 packages are looking for funding, 0 vulnerabilities.
- `npm test` — 19 passed, 0 failed.
- `npm run build` — tsc + vite build clean.
- `npm run dev -- --port 5173` — dev server started on port 5173 (backgrounded), stopped at end of session.

**Viewports tested (screenshots in `docs/screenshots/audit/`).**
- 320×740: `audit-320-fresh-board.png`
- 360×800: `audit-360-fresh-board.png`
- 390×844: `audit-390-fresh-board.png`, `audit-390-welcome.png`, `audit-390-human-turn.png`, `audit-390-midgame.png`, `audit-390-midgame2.png`, `audit-390-rules.png`, `audit-390-journal.png`, `audit-390-explorer.png`, `audit-390-explorer-6.png`, `audit-390-explorer-19.png`, `audit-390-explorer-42.png`, `audit-390-explorer-63.png`, `audit-390-zoomed.png`, `audit-390-pre-victory.png`, `audit-390-victory.png`
- 768×1024: `audit-768-fresh-board.png`
- 1440×1000: `audit-1440-fresh-board.png`

**Gameplay covered (real browser, not source-only).**
- First run: welcome dialog, "Let's play" start button.
- Full human turn: roll, die animation, token movement, status message.
- Computer turns: automatic, with status feedback.
- Special squares landed on naturally: goose jumps (extra turn), well (Lola at 31 "Rest 2"), death/bounce (You at 62 rolled 6 → bounced to 58 → start).
- Special squares via square explorer: 6 (bridge, "Cross to square 12 and roll again"), 19 (inn, "Rest for one turn"), 42 (maze, "The maze sends you back to square 30"), 63 (finish, "reach this square with an exact roll to win"; Next button disabled).
- Rules dialog ("How to play"): full English rules for all special squares.
- Turn-history journal ("Turns"): entries with named actors, die values, and goose bonuses.
- Victory dialog: "The garden is yours!", "Play again", "View the board"; status "You win! Welcome to the Goose Garden."
- Zoom: "Zoom in"/"Zoom out" buttons present and functional.

**Measurements taken live in the page (computed styles, bounding boxes, contrast ratios computed via WCAG relative-luminance formula).** All layout measurements taken in the **default state**: `localStorage`/`sessionStorage` cleared, fresh reload, welcome dialog dismissed, board viewport not zoomed (`#board-viewport` does not contain `zoomed`), all dialogs closed, `scrollY=0`. Verified after each measurement.

| Viewport | Overflow | Roll (w×h, y-range) | Status font | "?" | "Zoom" | "Explore" | "Start" | Focusable | Roll tab pos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 320×740 | false | 222×45, 581–626 | 10px | 36×40 ✗ | 51×32 ✗ | 91×32 ✗ | 122×36 ✗ | 20 | 8th |
| 360×800 | false | 262×45, 617.5–662.5 | 10px | 36×40 ✗ | 51×32 ✗ | 91×32 ✗ | 122×36 ✗ | — | — |
| 390×844 | false | 286×45, 660–705 | 11px | 44×44 ✓ | 51×35 ✗ | 91×35 ✗ | 122×36 ✗ | 20 | 8th |
| 768×1024 | false | 186×51, 459–510 | 12px | 44×44 ✓ | 55×44 ✓ | 115×44 ✓ | 130×44 ✓ | — | — |
| 1440×1000 | false | 231×51, 482.69–533.69 | 12px | 44×44 ✓ | 55×44 ✓ | 115×44 ✓ | 130×44 ✓ | 20 | 8th |

Contrast (effective background): status `rgb(230,236,210)` on turn card `rgb(37,91,80)` = **6.43:1** (passes AA); roll `rgb(57,70,49)` on `rgb(250,201,103)` = **6.5:1** (passes AA). Measured against the page background `rgb(246,237,221)` the status ratio would be 1.05:1 — that is the measurement error from UX-001, not a defect.

**Die inspection.** `#dice` contains only the text node `⚄` (OS emoji), no SVG or `img` child — the basis for UX-007.

**Focus inspection.** `:focus-visible` rules exist for buttons (3px outline, rgb(212,91,56)) and cells (4px outline, rgb(249,182,62)) — focus indicators are implemented; no finding.

**Reproduction.** Every P0/P1 number in this audit was measured twice in a row from a fresh default-state load and reproduced identically. No finding was filed that did not reproduce.

**What was not tested.**
- Screen-reader output (no screen reader available in this environment).
- Physical device testing (iOS/Safari, real touch devices).
- Real audio playback / subjective sound quality.
- Real-user playtesting / enjoyment studies.
- Public-site deployment browsing (proxy certificate trust error prevents direct Chromium navigation to https://canmils.github.io/OcaGo/; local build verified instead).
