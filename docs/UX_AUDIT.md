# OcaGo UI/UX Audit

Audit date: 2026-10-22
Auditor: UI/UX auditor (this session)
Repository: canmils/OcaGo
Dev server: http://localhost:5173 (Chromium via Playwright MCP)
Gates: `npm ci` OK, `npm test` 19/19 pass, `npm run build` OK

## Summary scorecard

| Area | Score (1–5) | One-line verdict |
| --- | --- | --- |
| Visual hierarchy | 3 | Board is the main surface, but the status line — the key feedback channel — is set at 10px on small screens, and the masthead h1 competes for top attention. |
| Layout and spacing | 4 | No horizontal overflow at any viewport; roster, board and the primary roll control all fit at 320×740. |
| Typography | 2 | Status/feedback copy is 10–12px, below the 13px minimum; headings are well sized (22–32px). |
| Color and contrast | 4 | Status text measures 6.43:1 on the turn card and the roll button 6.50:1 — both pass AA. |
| Touch targets | 2 | Multiple controls fall below the 44×44px minimum: "?" (36×40), "Zoom out" (59×32), "Explore squares" (91×32), "Start a new game" (122×36). |
| Feedback and motion | 4 | Die animation, token movement, status messages, turn history, and victory dialog all work; idle motion respects reduced motion. |
| Onboarding and comprehension | 4 | Welcome dialog, rules dialog, square explorer, and turn history are all present and in English. |
| Control states | 3 | Disabled states work (game-finished button disabled), but several small controls lack comfortable target sizes. |
| Accessibility | 3 | Contrast passes AA and the keyboard roving focus works (20 stops, not 63), but four controls are under 44×44px and the roll button is 8th in tab order. |
| Consistency and polish | 4 | English throughout, consistent honey-gold/cream palette, all 63 cells illustrated and numbered. |

> Two P0 scores in the first pass (contrast and fold) were measurement errors and have been
> retracted; the scores above reflect the corrected measurements. See the correction notice in the
> backlog table.

## Backlog

| ID | Severity | Area | Finding | Evidence | Owner | Issue |
| --- | --- | --- | --- | --- | --- | --- |
| UX-001 | ~~P0~~ retracted | area:a11y | Status text contrast measured against the page background instead of the turn card it sits on. Real ratio 6.43:1, passes AA | Measured 6.43:1 against `.turn-card` `rgb(37,91,80)`; 1.05:1 was against the body background | — | #3 closed |
| UX-002 | ~~P0~~ retracted | area:interaction | Roll button measured while the board was still zoomed. Default state has it fully visible at y=581–626 | Default 581–626 (visible), zoomed 757–802 (below fold) | — | #4 closed |
| UX-003 | P1 | area:interaction | Four controls are below the 44×44px touch-target minimum: "?" (36×40), "Zoom out" (59×32), "Explore squares" (91×32), "Start a new game" (122×36) | Measured bounding boxes at 320×740; see focus-order measurement in Method | visual-designer | #5 |
| UX-004 | P1 | area:visual | Status/feedback font size is 10px at 320×740 and 12px at 1440×1000, below the 13px minimum for body/event copy | Measured computed font size at both viewports | visual-designer | #6 |
| UX-005 | P2 | area:visual | Roll button is 45px high at 320×740, below the 48px recommended height for the primary action | Measured 222×45px at 320×740 (51px at 1440×1000) | visual-designer | — |
| UX-006 | P2 | area:a11y | Roll button is 8th in tab order; keyboard users tab through 7 header/board elements before reaching the primary action | Measured focusable count = 20; first ten listed in Method | interaction-engineer | — |

Sprint 1 (top five by player impact per effort): UX-003, UX-004, UX-005, UX-006, and any new finding from the next audit pass.

**Correction notice.** UX-001 and UX-002 were filed as P0 by the first audit pass and were retracted by the coordinator after an independent re-measurement showed both were measurement bugs (wrong background for the contrast ratio, leftover zoom state for the layout). The audit methodology in [.opencode/agent/ux-auditor.md](../.opencode/agent/ux-auditor.md) now requires the effective background, the default state, a self-check against the passing browser suite, and reproduction twice before filing.

## Findings

### UX-001 — Status/feedback text contrast is 1.05:1 (P0, area:a11y)

> **RETRACTED on 2026-10-22 by the coordinator — measurement error, not a product defect.**
> The ratio was computed against the **page** background (`rgb(246,237,221)`) instead of the
> surface the status text actually sits on: the dark green turn card (`.turn-card`,
> `rgb(37,91,80)`). Measured against its effective background the status text is
> **6.43:1**, which passes WCAG AA for normal text. Issue #3 closed.
> The 10px font size of UX-004 is real and stays open.

**Problem statement.** The turn status line that announces rolls, special-square results, and wins has a contrast ratio of only 1.05:1 against the cream page background. The text is effectively invisible, so players cannot read what just happened on their turn or on bot turns.

**Observation (measured).** At both 320×740 and 1440×1000, the `[role="status"]` element has computed color `rgb(230,236,210)` on body background `rgb(246,237,221)`, yielding a contrast ratio of `1.05:1`. The WCAG minimum for normal text is `4.5:1`. This was measured live in the running dev server, not inferred from source.

**Hypothesis (interpretation).** Because the status color is nearly identical to the background, players — especially on small screens or in bright conditions — cannot read turn outcomes. This directly undermines the core feedback loop ("You roll 4 and reach square 4", "Bruno rolls 6 and reaches the start", "You win!").

**Impact on a real player.** A player rolls the die and cannot tell what the result was or whether a special square triggered. They must rely on watching the token move or checking the turn history journal, which is an extra step for information that should be immediate.

**Proposed fix.** Change the status text color to a dark ink color with at least 4.5:1 contrast against `rgb(246,237,221)` (e.g. a dark forest green or charcoal), and/or increase the font size to at least 13px. Preserve the existing status role and polite live-region behavior.

**Acceptance criteria.**
- [ ] The `[role="status"]` text has a computed contrast ratio ≥ 4.5:1 against the page background at 320×740 and 1440×1000.
- [ ] Status font size is ≥ 13px at 320×740.
- [ ] A human roll, a bot roll, a special-square result, and a victory all produce legible status text visible without opening the journal.
- [ ] Reduced-motion and high-contrast/forced-colors preferences do not regress the fix.

**Suggested owner.** interaction-engineer (with visual-designer for color selection).

---

### UX-002 — Primary roll button is below the viewport fold at 320×740 (P0, area:interaction)

> **RETRACTED on 2026-10-22 by the coordinator — measurement error, not a product defect.**
> The measurement was taken while the board was still **zoomed** from the earlier zoom test. The
> zoomed board is 470×470 instead of 294×294, which pushes everything below it down by 176px.
> Re-measured in the default state (fresh load, zoom off, no dialog open, `scrollY=0`) the roll
> button is at **y=581–626**, fully inside the 740px viewport: `rollButtonInViewport = true`. The
> existing browser suite already asserts this and passes.
> Corrected evidence: default 581–626 (visible), zoomed 757–802 (below fold). Issue #4 closed.

**Problem statement.** At 320×740 with the page at scrollY=0, the roll button's bounding box is y=757–802, which is below the 740px viewport height. The primary action of the game is not visible on first screen; the player must scroll down to reach it.

**Observation (measured).** At 320×740: `scrollY=0`, `viewportHeight=740`, roll button top=757, bottom=802, `rollButtonInViewport=false`. The button itself is 222×45px (height meets the 44px minimum) but is not fully on screen. This violates hard constraint #4 ("Roll control at least 44px high and fully on screen" at 320/360/390/1440px).

**Hypothesis (interpretation).** The board plus roster plus masthead consume more vertical space than a 740px-tall viewport allows, pushing the action dock below the fold. Players opening the game on a small phone (e.g. iPhone SE-class screen) do not see the roll button immediately and may not realize they need to scroll to start playing.

**Impact on a real player.** The most important interaction in the game — rolling the die — is hidden on load at the smallest supported viewport. This creates a poor first impression and can make the game appear broken or unresponsive.

**Proposed fix.** Reclaim vertical space so the roll button is fully visible at 320×740 without scrolling: reduce masthead height, tighten roster spacing, or compress the board cell size slightly at the smallest breakpoint while keeping cell numbers legible (≥10px). Verify the button is fully in viewport at scrollY=0.

**Acceptance criteria.**
- [ ] At 320×740 with scrollY=0, the roll button's full bounding box is within the viewport (bottom ≤ viewport height).
- [ ] The roll button remains ≥ 44px high.
- [ ] All three roster cards remain visible above the board (hard constraint #2).
- [ ] No horizontal overflow at 320/360/390/1440px (hard constraint #3).
- [ ] Cell numbers remain ≥ 10px at 390px width (per UX brief P0).

**Suggested owner.** interaction-engineer (layout) with visual-designer.

---

### UX-003 — Four controls are below the 44×44px touch-target minimum (P1, area:interaction)

**Problem statement.** Several tappable controls are smaller than the 44×44px minimum, making them difficult to hit reliably with a thumb on a phone.

**Observation (measured).** At 320×740, computed bounding boxes:
- "?" (How to play): 36×40px — width 36px < 44px
- "Zoom out": 59×32px — height 32px < 44px
- "Explore squares": 91×32px — height 32px < 44px
- "Start a new game": 122×36px — height 36px < 44px

By contrast, the roll button is 222×45px and the sound/turns buttons are 67×44px and 46×44px, which meet the minimum.

**Hypothesis (interpretation).** Secondary controls were sized for compactness rather than touch comfort. On a phone, a 32px-high target is easy to miss, especially while the board animates or in motion.

**Impact on a real player.** A player trying to open the rules, zoom, explore squares, or restart may miss the tap and accidentally trigger a neighboring cell or action, causing frustration.

**Proposed fix.** Increase padding/min-height on these controls so each is at least 44×44px, without changing their visible labels. Re-verify at 320×740 and 390×844.

**Acceptance criteria.**
- [ ] "?", "Zoom out", "Explore squares", and "Start a new game" each measure ≥ 44×44px at 320×740.
- [ ] No control overlaps another after resizing.
- [ ] The roll button remains the largest primary target.

**Suggested owner.** visual-designer.

---

### UX-004 — Status/feedback font size is below the 13px minimum (P1, area:visual)

**Problem statement.** Body/event copy (the status line) is 10px at 320×740 and 12px at 1440×1000, below the 13px minimum specified in the UX brief acceptance checks.

**Observation (measured).** Computed font size of `[role="status"]`: `10px` at 320×740, `12px` at 1440×1000. The UX brief requires body/event copy ≥ 13px and primary state copy ≥ 14px.

**Hypothesis (interpretation).** The status text was styled small to fit near the die, but at 10–12px it is hard to read, compounded by the contrast failure in UX-001.

**Impact on a real player.** Turn outcomes are harder to read than necessary, especially for players with mild visual impairment or on lower-quality phone screens.

**Proposed fix.** Set the status font size to at least 13px (mobile) and adjust surrounding spacing so it still fits beside the die. Combine with the contrast fix in UX-001.

**Acceptance criteria.**
- [ ] Status font size ≥ 13px at 320×740 and ≥ 13px at 1440×1000.
- [ ] Status text remains on one line or wraps gracefully without covering the die or roll button.

**Suggested owner.** visual-designer.

---

### UX-005 — Roll button is 45px high at 320×740, below the 48px recommended height (P2, area:visual)

**Problem statement.** The roll button measures 45px high at 320×740. The UX brief recommends the primary action be ≥ 48px; QA.md recorded 45px on phones. It meets the 44px accessibility minimum but falls short of the 48px primary-action target.

**Observation (measured).** Roll button: 222×45px at 320×740; 231×51px at 1440×1000.

**Hypothesis (interpretation).** The button was sized to the 44px floor rather than the 48px comfort target for the primary action.

**Impact on a real player.** Marginal — the button is still easy to tap — but a 48px primary action is more comfortable for repeated tapping throughout a match.

**Proposed fix.** Increase roll button height to 48px at mobile breakpoints, adjusting width/padding as needed.

**Acceptance criteria.**
- [ ] Roll button height ≥ 48px at 320×740 and 390×844.
- [ ] Button remains fully on screen at 320×740 (coordinate with UX-002).

**Suggested owner.** visual-designer.

---

### UX-006 — Roll button is 8th in tab order (P2, area:a11y)

**Problem statement.** Keyboard users must tab through 7 elements (home link, sound, turns, help, zoom out, cell 1, explore squares) before reaching the roll button, which is 8th in the tab order.

**Observation (measured).** At 320×740 there are 20 focusable elements (not 63 — roving focus is used on the board, which is good). The first ten in tab order are: home link, "Sound off", "Turns", "?", "Zoom out", cell 1, "Explore squares", "Roll the die", "Start a new game", close (×). The roll button is 8th.

**Hypothesis (interpretation).** Document order places header controls and the board before the action dock, so keyboard order does not match the visual prominence of the roll action.

**Impact on a real player.** Keyboard users reach the primary action after several tabs, which is inefficient but not blocking (only 20 stops total, and arrow keys navigate the board).

**Proposed fix.** Add a visible skip link to the turn action near the top of the page, or reorder so the roll control is reachable in a few Tab presses, while preserving board roving navigation.

**Acceptance criteria.**
- [ ] From page load, a keyboard user reaches the roll button in no more than 4 Tab presses.
- [ ] Board arrow-key navigation and Home/End/Enter inspection continue to work.
- [ ] Focus returns correctly from dialogs.

**Suggested owner.** interaction-engineer.

---

## Preserved

The following already work well and must not regress during any fixes:

- All 63 cells are illustrated and numbered; cell 1 is a larger bottom-left start vignette; square 63 is the central Goose Garden (verified via square explorer on 6, 19, 42, 63 and the full board snapshot).
- All three players (You, Lola, Bruno) are visible above the board at every viewport; shared tokens on a square keep all identities visible and never conceal the square number (verified at square 15 with You + Bruno, and square 10 with You alone).
- No horizontal page overflow at 320×740, 360×800, 390×844, 768×1024, or 1440×1000 (measured scrollWidth = clientWidth at 320×740 and 1440×1000).
- Roll control is ≥ 44px high (45px at 320×740, 51px at 1440×1000) and has good contrast (6.50:1).
- Keyboard route works: arrow keys follow the numbered route, Home/End jump to the ends, Enter inspects a square, Escape restores focus (20 focusable stops via roving focus, not 63).
- Tokens on shared squares stay visible with distinct initials (Y, L, B) and do not conceal the number-badge center.
- Reduced motion disables idle animation; hidden tab pauses it (documented in QA.md; not re-tested in this session).
- Interface language is English throughout (welcome, rules, journal, status, square explorer, victory — all verified in English).
- Rules behave as documented: exact finish on 63, overshoot bounce, goose hops grant another roll, bridge 6→12, inn 19 rests 1, well 31 and prison 52 rest 2, maze 42→30, death 58→start (verified via natural play: goose at 23→27, maze at 42→30, death/bounce sent Bruno to start, inn "Rest 1", well "Rest 2"; bridge and all squares verified via explorer).
- Welcome dialog, rules dialog, turn-history journal, square explorer, victory dialog, and restart ("Play again" resets all to position 0) all function.
- Zoom control ("Zoom in"/"Zoom out") is present and functional.
- `npm test`: 19/19 pass; `npm run build`: clean TypeScript and production bundle.

## Method

**Commands run.**
- `git checkout main && git pull --ff-only` — already on main, up to date with origin/main.
- `npm ci` — 18 packages added, 0 vulnerabilities.
- `npm test` — 19 passed, 0 failed.
- `npm run build` — tsc + vite build clean.
- `npm run dev -- --port 5173` — dev server started on port 5173 (backgrounded, PID 75778), stopped at end of session.

**Viewports tested (screenshots in `docs/screenshots/audit/`).**
- 320×740: `audit-320-fresh-board.png`
- 360×800: `audit-360-fresh-board.png`
- 390×844: `audit-390-fresh-board.png`, `audit-390-welcome.png`, `audit-390-midgame-shared15.png`, `audit-390-victory.png`, `audit-390-zoomed.png`
- 768×1024: `audit-768-fresh-board.png`
- 1440×1000: `audit-1440-fresh-board.png`
- Initial load: `audit-390-initial.png`

**Gameplay covered (real browser, not source-only).**
- First run: welcome dialog, "Let's play" start button.
- Full human turn: roll, die animation, token movement, status message.
- Computer turns: automatic, with status feedback.
- Special squares landed on naturally: goose (23→27 with extra turn), maze (42→30), death/bounce (Bruno at 61 rolled 6 → "reaches the start"), inn (Bruno at 19 "Rest 1"), well (Bruno at 31 "Rest 2").
- Special squares via square explorer: 6 (bridge, "Cross to square 12 and roll again"), 19 (inn, "Rest for one turn"), 42 (maze, "The maze sends you back to square 30"), 63 (finish, "reach this square with an exact roll to win"; Next button disabled).
- Rules dialog ("How to play"): full English rules for all special squares.
- Turn-history journal ("Turns"): 9 entries with named actors, die values, and goose bonuses.
- Victory dialog: "The garden is yours!", "Play again", "View the board"; status "You win! Welcome to the Goose Garden."
- Restart via "Play again": all three players reset to position 0.
- Zoom: "Zoom in"/"Zoom out" buttons present.

**Measurements taken live in the page (computed styles, bounding boxes, contrast ratios computed via WCAG relative-luminance formula).**
- 320×740: no horizontal overflow; roll button 222×45px at y=581–626 in the default state (fully visible; y=757–802 only while the board is zoomed); status 10px, contrast 6.43:1 against the turn card; focusable count 20; roll button 8th in tab order; touch targets below 44×44px for "?", "Zoom out", "Explore squares", "Start a new game".
- 1440×1000: no horizontal overflow; roll button 231×51px; status 12px, contrast 6.43:1 against the turn card.

**Corrections applied after the coordinator's independent re-measurement (2026-10-22).**
- UX-001 (P0, contrast) retracted: the 1.05:1 ratio was computed against the page background, not the turn card the status line sits on. Effective contrast is 6.43:1 and passes AA. Issue #3 closed.
- UX-002 (P0, roll button below the fold) retracted: the layout was measured with the board still zoomed from the zoom test. In the default state the roll button is fully visible, which the passing browser suite already asserts. Issue #4 closed.
- The audit methodology now requires the effective background, the default state, reconciliation with the passing browser suite, and reproduction twice before a finding is filed.

**What was not tested.**
- Screen-reader output (no screen reader available in this environment).
- Physical device testing (iOS/Safari, real touch devices).
- Real audio playback / subjective sound quality (sound toggle verified off by default; AudioContext behavior documented in QA.md).
- Exhaustive contrast audit of every element (only status, roll button, and body were measured).
- Real-user playtesting / enjoyment studies.
- Public-site deployment browsing (proxy certificate trust error prevents direct Chromium navigation to https://canmils.github.io/OcaGo/; local build verified instead).
