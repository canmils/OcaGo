# Creative direction: El jardín secreto

## Baseline and honest target

Reviewed `docs/screenshots/game-390.png` and `src/main.ts` / `src/style.css`. The current prototype has an original garden palette, a recognizable spiral, useful route arrows and an immediately visible roll control. Its flat repeated grid, tiny central mascot, platform-dependent emoji portraits and very small secondary labels still read as a browser board prototype. This is not yet the visual production quality of a major mobile title. Publicly observable polish is a reference for craft, not an instruction to reproduce Scopely's characters, assets or interface.

The deliverable for this cycle is one more expressive, coherent local match, not a simulated live-service shell. Keep the existing rules and 63-square route.

## Original identity and hierarchy

**Fantasy:** three friendly travelers race to a hidden goose garden. Our hero is a cream goose with a coral scarf. The world uses rounded garden islands, ponds, bridges and soft organic silhouettes. Teal provides depth and structure; cream keeps the route readable; honey gold marks player action, geese and arrival. Coral identifies the human traveler. Opponents retain distinct blue and purple identification without relying on color alone.

Use a single illustration vocabulary: rounded outlines, a consistent light direction, restrained warm shadows, clear silhouettes. Icons, portraits, mascot and goal should feel drawn for the same game. Avoid stock emoji as final character art. Keep player names and token letters so character identification remains accessible.

Priority order on mobile: board and current traveler; available roll action; readable outcome; other travelers; secondary rules and restart. Decorative labels are optional. Goal explanations and game outcomes are not decorative labels and must stay readable.

## Three implementation priorities

1. **Unify the cast and strengthen the destination.** Replace the three emoji avatar portraits with original SVG portraits under `public/art/`. Reuse a consistent goose identity in brand, welcome and goal. Increase contrast and apparent depth of the existing central island and mascot; keep decorative art entirely behind the route so all 63 cells and tokens remain visible. A recognizable hero at a glance matters more than additional texture.
2. **Make outcomes feel authored.** Every special landing has a short Spanish event title plus its actual mechanical consequence in the status area: for example, “¡De oca a oca!” followed by destination and extra turn, or “Un descanso” followed by turns remaining. Coordinate matching existing motion and optional user-enabled sound: buoyant for goose/bridge, restrained for setbacks, celebratory for a win. Do not imply a bonus the engine did not award. Keep feedback within the current turn flow and honor reduced motion and mute.
3. **Give the action panel a clear mobile hierarchy.** Maintain a minimum 44px roll button and readable 12px-or-larger outcome text. The dock must never make the last roster entry or restart unreachable: verify initial view and scrolled view at 320, 390 and 1440px widths. Reduce low-value microcopy before squeezing important text. Victory must name the actual winner and offer a clear replay action.

Frontend owns integration. Technical art owns illustration work. Sound owns optional audio and its setting. Producer protects the slice scope. QA checks the integrated experience, not separate deliverables.

## Review rubric and evidence

Score each criterion 0 (missing), 1 (partial), 2 (complete). A playable vertical slice requires no zero and at least 10/12; this is an internal acceptance rubric, not a claim of commercial parity.

| Criterion | Complete means | Evidence |
| --- | --- | --- |
| Cohesive identity | Hero, portraits, special tiles and island use compatible original art; no emoji portraits remain | Mobile and desktop screenshots |
| Visual hierarchy | Board, active traveler, goal and primary action are distinguishable immediately; numbers remain legible | 320px and 390px screenshots |
| Action feedback | Die, movement, special outcome and next actor agree; outcome copy explains actual effect | Browser play covering ordinary, goose and setback turns |
| Character and depth | Center destination and hero have a clear silhouette and layered depth without covering cells | Before/after screenshot comparison |
| Accessible interaction | Keyboard works; 44px roll target; readable outcomes; reduced motion and audio mute work | Browser checks and setting behavior |
| Complete emotional arc | Welcome explains goal, match reaches a correct winner, replay clears the prior match | Full-match browser run and test suite |

Do not report a criterion as passed from this brief. Record actual new screenshots and observed outcomes in QA/STATUS after integration. Existing screenshots are baseline evidence only.

## Remaining production gap

A major mobile game's finish also needs bespoke character animation, richer environment composition, professional audio, repeated playtesting, device performance work and a coherent progression layer. Those are later investments. Adding more panels, timers or currencies now would not close the present visual and feel gap. The next review should judge the integrated garden match before broadening scope.

## Integrated review: current production preview

Captured and visually inspected the running production preview at `http://localhost:4173`, with welcome dismissed, at 390×844 and 1440×1000. Review images: `/tmp/creative-390.png` and `/tmp/creative-1440.png` (temporary local review artifacts, not published evidence). This review did not exercise a full match, audio playback or keyboard navigation; QA owns those results.

| Criterion | Current evidence | Assessment |
| --- | --- | --- |
| Cohesive identity | Original goose, fox and bear portraits replace roster emoji; garden icon vocabulary is compatible | 2/2 visually |
| Visual hierarchy | Full mobile board and roll action visible; header controls fit; player roster begins behind fixed dock at the initial scroll | 1/2: legible primary action, secondary information still compressed |
| Action feedback | Event and journal integration reported by coordinator, not exercised in this static review | Pending interaction verification |
| Character and depth | Illustrated island, distinct hero silhouette, dimensional die and action button; board remains pale and repetitive | 1/2: improved prototype, stronger bespoke environment art remains future work |
| Accessible interaction | Sound toggle visible and off; controls visibly separated | Pending QA behavior checks |
| Complete emotional arc | Welcome dismissed successfully; win/replay not exercised in this review | Pending full-match QA |

No new must-fix visual issue is established by these screenshots. QA should verify roster and restart are reachable by scrolling at the small viewport sizes. Do not total pending rubric entries or present this static review as full acceptance. This is a coherent playable prototype moving toward a polished vertical slice, not evidence of commercial production parity. The most valuable subsequent creative work is a more expressive original environment/character treatment and larger important explanatory text, rather than more interface panels.
