# Playtest and usability review

## Evidence and scope

2026-10-19: specialist heuristic review, source inspection, existing 390px screenshot inspection, and an actual Chromium/Playwright walkthrough of the running development server at `http://localhost:5173`, viewport 390×844 with reduced motion. This is not research with real participants and does not establish enjoyment, retention, or Scopely-level production quality.

The browser walkthrough started with clean storage and verified:

- Welcome dialog appears and its primary action opens the game.
- A controlled first roll of six moves the human from start through the bridge to 12. The status explicitly says the bridge grants another roll, and the roll button becomes usable.
- Inspecting square 6 explains its destination and extra turn.
- A controlled exact-finish fixture at 62 plus one opens victory.
- Victory's `Otra aventura` resets all three positions to zero and enables rolling.

Fixture randomness and positions were controlled to exercise representative outcomes; these are not observations from an ordinary random match. Existing independent QA additionally records full seeded-match completion, multiple widths, persistence, and cancellation checks in `QA.md`.

## Top three actionable issues

### 1. Special-square inspection is too small for reliable touch

Observed cell 6 measures 34.22×34.22 CSS pixels at 390px width. All cells are clickable and their explanations are useful, but tightly packed targets increase accidental selection. Simply increasing every square to 44px breaks the existing compact board.

Recommended change: provide a prominent 44px `Tu casilla` or `Último evento` action that opens the relevant existing explanation. Keep the compact board as a secondary inspection surface. Test at 320 and 390px with thumb use; consider board zoom only if participant evidence justifies its added complexity.

Acceptance: a player can discover their current effect without targeting a small square, and the explanation identifies destination and whether they roll again or wait.

### 2. Outcome explanation has no persistent review

Source shows a single mutable `#status` for every player's outcome and automatic bots scheduled 1,100ms after completed moves. Each later outcome replaces the previous message. The bridge test confirms the message itself is useful; slower readers can lose their own event explanation during ensuing bot turns. There is no event history or explicit acknowledgement. This is an identified risk from timing and source, not a measured participant failure.

Recommended change: retain the last human outcome in a small event card or accessible recent-moves list while bots play. A special-event moment should identify player, landed square, consequence, and next action. Preserve an unambiguous current-turn label. Do not force repeated blocking dialogs for ordinary rolls.

Acceptance: after both bots move, the player can still explain their own most recent special-square result. Reduced motion and muted sound must preserve the same information.

### 3. Keyboard users traverse every cell before the primary action

Source assigns `tabIndex=0` to all 63 cells, and the board precedes the roll button in document order. The screenshot makes rolling visually dominant but keyboard order does not match that prominence. Existing QA proves individual cell keyboard operation, not efficiency of navigating the whole interface.

Recommended change: add a visible-on-focus skip link to the turn action and use roving focus with arrow keys within the board, with instructions. Alternatively place a board-inspection entry point before a separately navigable board. Do not remove inspection access.

Acceptance: from the page start a keyboard player reaches roll in a few Tab presses; board navigation remains available and focus returns correctly from dialogs.

## Real-human playtest protocol

Recruit five Spanish-speaking participants with a mix of La Oca familiarity and mobile game experience. Use their ordinary phones where possible. Explain that the game is being evaluated, not their skill; obtain consent before any recording. Do not lead participants with explanations of intended controls.

Tasks:

1. Open a fresh session and start playing without help. Ask what winning means and whose turn it is.
2. Play five ordinary turns. Observe recognition of their token, direction of travel, bot turns, and extra rolls.
3. Use separately labelled test fixtures for bridge, goose, skipped turn, setback, overshoot, and victory. Ask participants to explain what happened before revealing rules.
4. Ask how they would find a special square's meaning, resume after reload, and start another match.
5. Invite an optional second match, then ask what motivated that choice. Avoid treating the choice alone as proof of retention.

Record task completion, wrong taps, help requests, misunderstandings, time to first roll, and verbatim reactions. Report raw counts and representative observations; five participants cannot support population-wide claims. Record device, browser, motion setting, and any sound preference.

## Unanswered fun and product questions

- Is a mostly chance-driven race enjoyable beyond one match, or does it need optional choices that preserve La Oca's identity?
- Are setbacks amusing and recoverable, or does death-to-start produce abandonment?
- Does movement take long enough to feel satisfying without making bot turns tedious?
- Do the garden theme and characters create attachment, or simply decorate the board?
- Does the exact-finish bounce feel like suspense or stalled progress?
- Would players voluntarily replay this core before we add progression, collectibles, events, or online play?

Prioritize observed comprehension and game feel before investing in retention systems. Follow-up testing should compare integrated animation and audio with muted/reduced-motion conditions. Audio and particles must support, not replace, readable outcomes.

## Integrated slice follow-up

A second actual Chromium walkthrough used the production preview on port 4173 at 390×844, reduced motion, on 2026-10-19. No participants were involved. The three review findings above now have implemented mitigations:

- `Explorar casillas` opens the navigator without selecting a tiny tile. Entering 6 shows the correct bridge explanation. The measured `Siguiente` control is 44px tall.
- After a controlled ordinary human roll and both bot turns, `Turnos` contains all three outcomes with named actors and die values; the human outcome remains reviewable.
- Exactly one board cell has `tabindex=0`. ArrowRight moves focus from square 1 to 2, and the following Tab exits to `Explorar casillas`, avoiding 63 sequential stops.

The sound toggle starts off (`aria-pressed=false`) and becomes enabled after user activation. This verifies opt-in state, not subjective sound quality or physical speaker output. No horizontal overflow was present at the checked width.

No release-blocking usability defect was observed in this targeted recheck. The remaining participant questions and physical-device/accessibility coverage limits still apply; the small board targets remain a secondary interaction surface, with the larger navigator providing an alternative.
