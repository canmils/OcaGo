# Illustrated-board redesign contract

## User reference and mandatory changes

The attached board reference supplied on 2026-10-20 is the visual layout authority for this iteration. Its start is a large illustrated landscape at the bottom left. The route travels right across the bottom, up the right, left across the top, down the left, then around an inner ring into a large central finish. Cells are broad illustrated cards, with portrait and landscape proportions following the perimeter. White gutters separate colorful scenes. This is materially different from the previous top-left-start 9×9 grid with small icons.

Use original art inspired by the reference's visual grammar: whimsical flat storybook characters and objects, confident outlines, varied saturated backgrounds, irregular scenic details. Do not reproduce the reference's exact copyrighted character drawings, logo, lettering, or scans. Every numbered cell must contain a readable original illustration, including ordinary non-rule squares. A repeated flower/dot on an otherwise blank pale tile does not satisfy this brief.

All interface text, rules, status messages, accessible names, help, errors, dialogs, page metadata, sound controls, and default player identity must be English. Named bot characters remain Lola and Bruno. Existing saved Spanish human names and status messages must not reintroduce Spanish into a resumed default match.

## Exact normalized geometry

Use a 1000×1000 board coordinate system with `aspect-ratio: 1`. SVG groups, percentage-positioned HTML cells, or a hybrid are acceptable. Preserve `.cell`, `#cell-N`, `.tokens` and inspectable keyboard controls where practical so motion and testing remain meaningful. The geometry below is deliberately implementable without a new rendering framework.

Coordinates are `[x, y, width, height]` before a 3–5-unit inset for white borders. Corner cards may use a clipped trapezoid/polygon as long as the route, illustration, label, token placement and hit target remain intact. Do not clip text or tokens to create decorative corners.

| Cells | Position formula | Route |
| --- | --- | --- |
| 1 | `[20,820,300,160]` | Large illustrated bottom-left opening scene |
| 2–9 | `[320+(n−2)×82.5,820,82.5,160]` | Right across the bottom |
| 10–18 | `[850,820−(n−9)×640/9,130,640/9]` | Up the right edge |
| 19–27 | `[20+(27−n)×830/9,20,830/9,160]` | Left across the top; extend cell 19's right edge to 980 to fill the top-right corner |
| 28–36 | `[20,180+(n−28)×640/9,130,640/9]` | Down the left edge |
| 37–44 | `[160+(n−37)×85,660,85,150]` | Right along the inner bottom |
| 45–50 | `[695,660−(n−44)×470/6,145,470/6]` | Up the inner right |
| 51–56 | `[160+(56−n)×535/6,190,535/6,140]` | Left along the inner top |
| 57–62 | `[160,330+(n−57)×55,145,55]` | Down the inner left |
| 63 | `[320,345,365,300]` | Large central arrival scene |

This yields exactly 63 numbered destinations with no overlapping card regions. The inner ring ends at x840, outer right begins at x850; inner top starts at y190, outer top ends at y180; inner bottom ends at y810, outer bottom starts at y820. The central finish fits between x305/695 and y330/660, leaving visible gutters.

Route order must remain obvious at the joins 9→10, 18→19, 27→28, 36→37, 44→45, 50→51, 56→57, and 62→63. Use short directional connectors or arrow accents in the gutters, with an especially explicit inward turn from 36 to 37. Avoid arrows on every drawing if they obscure the art. Illustrations and number badges remain upright and never require the user to rotate a phone.

## Start, tokens and game rules

The existing engine starts all players at position 0 and treats cell 1 as the first numbered move. Preserve that tested rule; do not silently change dice distances to make the picture fit. Integrate the unnumbered **START / Base camp** token apron into the large opening vignette at the bottom left, visually beside the cell 1 number badge. It must be clear that waiting players have not yet moved onto cell 1. A roll of 1 enters cell 1; a roll of 6 reaches bridge 6 and moves to 12.

Keep all three named players and distinct tokens visible from the initial mobile viewport. The roster belongs above the board, not below a fixed overlay. Show human/bot identity, position, active turn, and skipped-turn state. Display all same-square occupants with stable offset slots; do not replace them with only the active player. At start, all three tokens appear in the opening apron. On the board, a strong outline/halo distinguishes the active token without hiding its cell number or illustration.

The following rule variant remains unchanged: one d6; exact 63 with reflected overshoot; geese at 5,9,14,18,23,27,32,36,41,45,50,54,59 jump once to the next goose and grant another turn; 59 reaches 63; bridge 6→12 grants another turn; inn19 skips1; well31 and prison52 skip2; maze42→30; death58→0; no collision captures or opening-roll exceptions. Ordinary tile art has no hidden gameplay effect. Rules and square details explicitly distinguish decoration from special rules.

## Responsive game surface

Use a compact English masthead, a visible three-player strip, the board, and an inline primary roll/status surface. Remove the marketing hero from active mobile play. Do not use a fixed roll dock that overlaps players, the start area, the finish, or restart controls. On desktop, the board remains dominant and player/action controls may sit in a visible side panel.

At a 390px viewport, normalized 80×160 portrait cells are roughly 29×58px before borders; the drawings therefore use large recognizable silhouettes and quiet backgrounds. Do not promise 44px-wide physical targets for every square on a complete 63-cell board. Preserve the large **Explore board** navigator with 44px controls and square number input as an equivalent inspection path. Number badges need strong contrast and around 10px rendered text; large START and FINISH panels use larger labels. A board zoom feature is optional, not a substitute for a usable default composition.

## Idle, movement and feedback

Idle motion should make original characters feel alive: a slow goose head/body sway or blink, soft water glint, and restrained breathing/bobbing of the active player's portrait. Keep it subtle enough that every cell remains legible. Animate inner artwork, not token hit targets or cell geometry. Pause decorative motion while the document is hidden. Reduced-motion preference disables looping idle transforms and preserves a static attractive board.

Dice anticipation, individual path steps, special landing feedback, and victory must remain distinct. Rest turns show rest without rolling. The actor, die result, destination and any rule effect must be understandable before the next bot acts; the turn journal remains available for review. Restart aborts all in-flight effects and cannot advance the new match.

## Integration and acceptance

Game design owns this contract; art direction supplies per-cell original scenes; frontend owns coordinates, English composition and player visibility; animation owns actual idle/move behavior; UX research feeds evidence-backed interaction priorities; QA checks the integrated production build. Specialist documents alone do not constitute implementation.

Before claiming the redesign complete, verify:

1. A screenshot shows the large opening scene at bottom left, the ordered bottom/right/top/left route, the inward turn and a central63 finish; it cannot be mistaken for the previous square grid.
2. Every cell1–63 contains original illustrative content and a visible number; the start apron shows all three pawns at engine0.
3. All three player identities, positions and active state are visible during ordinary mobile play without scrolling to find a hidden roster.
4. English is complete in first-session, resumed, ordinary, special, rest, win/replay, help, accessibility and error states.
5. Bridge6→12, inward path movement, shared occupancy, exact/bounced finish, bot turns, rest, saved resume, victory and restart remain correct.
6. Idle motion runs in normal preference, is absent under reduced motion, and does not move the tile hit targets. Pausing/resuming and restart leave no stale effects.
7. Chromium mobile320/360/390 and desktop checks pass with no overflow, missing art or JavaScript errors. Real device/iOS and human playtest limits are stated explicitly.

## Current review evidence

The supplied reference image and prior implementation informed this contract. The replacement was then actually inspected in `/tmp/ocago-reference-390.png`, a current 390px integrated-game screenshot, on 2026-10-20. This is visual evidence, not a claim that all dynamic acceptance tests were executed by the game designer.

| Criterion | Observed result |
| --- | --- |
| Reference topology and starting location | Visually passed: large numbered1 opening vignette at bottom left,2–9 proceeding right along the bottom, outer right/top/left route, inward illustrated ring, and large central63 scene. The previous9×9 icon grid is gone. |
| Every numbered cell has art | Visually passed: all visible numbered1–63 cards contain a scene, character or object, including ordinary cells; none is represented by the old blank/dot treatment. |
| Starting players and roster | Visually passed: all three distinct starting tokens appear in the opening START scene, and You/Lola/Bruno are visible in the strip above the board with position0/63 and active state. The roll surface is below the board and does not cover the roster. |
| English first-play composition | Visually passed for the checked state: page title, player names/status, START, garden title, exploration, roll instruction, save note and restart are English. Resumed, help, special and terminal strings require the QA localization checks. |
| Mobile primary action | Visually passed at the checked screenshot size: board, three-player strip and roll action are apparent, with no fixed overlay hiding board cells. Narrow-cell readability is supported by visible Zoom in and Explore squares actions. Their behavior belongs to browser QA. |
| Motion, rules and restart | Not established from a still image. QA must exercise ordinary/reduced idle, shared occupants, path movement, special outcomes, victory, persistence and cancellation. |

No release-blocking visual defect was found in this comparison. Two remaining nonblocking polish opportunities are stronger inward-transition cues at36→37 and62→63, and improved small-screen scene/number separation where densely illustrated cards meet. The reference uses angled card silhouettes to help these transitions; the current rounded-card approximation is readable by number but can improve further. This does not invalidate the substantially corrected layout, and it does not establish parity with a commercial mobile game.
