# Reference-led player experience

## Evidence and research status

Reviewed the board image supplied by the user on 2026-10-20 and the updated AGENTS.md brief. The latest user instruction supersedes the previous Spanish-first and small square-grid direction. All player-facing text, labels, help, results and accessibility descriptions must be English.

Actual read-only HTTPS retrieval was attempted for these official source leads on 2026-10-20:

| Source lead | Intended evidence | Observed retrieval result |
| --- | --- | --- |
| https://www.scopely.com/en/games/monopoly-go | Official product description and presentation | Proxy CONNECT denied HTTP 403; no page retrieved |
| https://www.monopolygo.com/ | Official game presentation | Proxy CONNECT denied HTTP 403; no page retrieved |
| https://monopolygo.helpshift.com/hc/en/3-monopoly-go/ | Official explanations of gameplay and interaction systems | Proxy CONNECT denied HTTP 403; no page retrieved |

These links are source leads, not citations supporting claimed findings. No current MONOPOLY GO gameplay session, screenshots, tutorial, events or economy were observed in this research run. No release date, conversion metric or retention claim is inferred. Required domains were reported to the coordinator; no credentials are needed for these public sources.

When access is available, capture source title, retrieval date, URL, the specific visible fact, and whether it is marketing copy, support documentation or directly observed interaction. Official marketing describes intended positioning; it does not prove an interaction is usable or enjoyable. Avoid treating unsupported assumptions about Scopely as acceptance evidence.

## What the user's image actually establishes

- Cell 1 is a broad illustrated vignette at the bottom left, rather than a small empty tile at the top left. The route continues right across the lower edge, then travels around the perimeter and inward.
- Cells have varying rectangular/trapezoid proportions and are densely illustrated. They read as individual places, characters or objects rather than identical boxes with decorative dots.
- The number remains identifiable on each cell. Illustrated subject matter and position communicate the journey together.
- The destination, 63, is a large central scene, with geese and a distinct warm backdrop. It is the goal of the surrounding inward path, not a corner of an unrelated grid.
- White separating channels and outlined cells give individual pictures separation. The actual geometry and count should be specified by the game-design agent rather than approximated with another conventional square grid.

The image does not show a digital HUD or player roster. Opponent visibility, action placement, motion and accessible controls are design decisions needed for the digital adaptation; they are not claims about the physical board or Scopely.

## Concrete implementation handoff

### 1. Establish who is playing before decorating the screen

Keep a compact three-player roster above the board during the ordinary mobile match. Each player needs an original portrait, name, current numbered position, and an active-turn indicator using text or shape as well as color. Show all starting tokens together in the bottom-left start area. Sharing a cell must not conceal another player's token. A roll dock cannot cover the roster.

### 2. Make the reference board the main surface

Use the game-design coordinate contract with the large bottom-left start and central finish. Every numbered cell gets original scene art. Number badges require an opaque backing, and tokens require a contrasting outline over art. Broad cells should retain the sense of illustrated panels. Remove marketing headlines above an active match if they consume the room needed for the board and other players.

### 3. Give each action one clear sequence

Before the action: show the active actor and an obvious Roll button. During it: disable repeat submission, reveal the final die, move the correct token, and then state any special-square consequence. After it: keep the result available in turn history and show whether the actor rolls again or the next player begins. Rest turns should say Rest/Skip without a pretend roll. Exact finish and overshoot must be explained in help and arrival feedback.

### 4. Use motion to clarify, then give the scene life

Idle goose breathing/blinking or small environmental drift can provide life, but numbers and tokens must remain stable. Pause or reduce idle effects while a move resolves, while the page is hidden, and when reduced motion is requested. Distinguish bonus movement, setbacks and victory without flashing the whole screen. Sound stays optional and gesture-enabled.

### 5. Provide a large-control alternative to small board targets

All cells being illustrated does not make phone-sized cells large touch targets. Keep an Explore Board control with at least 44px controls for selecting a cell, reading its rule and occupants, and moving to its neighbors. Keep one board tab stop with roving navigation, rather than forcing 63 sequential Tab presses. Help, exploration and restart should preserve the match and return focus predictably.

## Transferable product hypotheses to verify later

These are original recommendations for a mobile board game, not findings from the unavailable MONOPOLY GO audit: immediate action clarity, a visible social cast, legible reward/consequence feedback, coherent recurring characters, distinct emotional arrival, and short first-session teaching. The UX researcher should feed observed examples to design/art/frontend after source access is restored; nobody should copy another game's assets, exact screens or unverified economy.

## Acceptance evidence required

- Screenshots at 320, 390 and desktop widths show bottom-left start, central finish, art in all 63 cells, legible badge/token overlays, and all three roster entries visible during normal play.
- A real complete match verifies bots, shared-cell visibility, special consequences, exact finish, replay and save/resume.
- Browser checks verify English visible text and accessible names, keyboard exploration, no layout overflow, no covered primary controls, cancellation-safe restart and reduced-motion behavior.
- Art director and game designer inspect the actual integrated screenshots against the supplied reference. Their documents alone are not a pass.
- A future human playtest must assess comprehension and enjoyment; automated checks cannot establish either retention or commercial polish.
