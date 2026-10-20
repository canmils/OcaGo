# Illustrated-board redesign — 2026-10-20

## User requirements replacing earlier direction

English is the complete application language, including saved-match messages, dialogs, accessibility labels and metadata. The latest supplied illustrated La Oca board is the layout and art reference: large bottom-left opening, broad picture-filled cells going right along the bottom and then clockwise inward, large central finish. All three players must remain visible during normal mobile and desktop play. Original characters and objects must fill every cell. Add restrained idle motion, preserve reduced-motion behavior, and validate a complete game.

## Autonomous session team

| Specialist | Concrete ownership | Gate |
| --- | --- | --- |
| Game design | REFERENCE_DESIGN.md | Exact route, start/finish, unchanged documented rules |
| Art direction/production | tile-art.ts, REFERENCE_ART.md | Original illustration in every cell, coherent picturebook style |
| UX research | REFERENCE_UX.md, AUTONOMY.md | Evidence labelled; visible opponents and obvious next action |
| Animation | idle.ts/css, REFERENCE_MOTION.md | Actual idle life, hidden-page pause, reduced motion |
| Frontend | main/style/board-layout, README | Integrate the reference into the playable game |
| QA | Browser suite/report/screenshots | Verify English, geometry, art, players, motion and complete gameplay |
| Coordinator | English engine/save migration, integration, GitHub | Resolve decisions, run gates, deploy and verify actual public build |

The agents operate independently within assigned ownership and exchange interface contracts directly. Routine choices do not require user prompts. Persistent briefs are not a background runtime; see AUTONOMY.md for the additional runner required between active sessions.

## Required acceptance

- 63 nonoverlapping illustrated numbered cells, bottom-left enlarged start, large central finish.
- English fresh and migrated saves; positions and penalties survive migration.
- All three players and their positions visible at 320px, 390px and desktop during normal play.
- All player tokens visible at start and on shared squares; active player identifiable.
- Roll, bots, all special rules, exact finish, replay, saved match and opt-in sound still work.
- Idle motion is visible with normal motion, pauses hidden, and stops with reduced motion.
- Real screenshots and repeatable browser assertions from the integrated production build.
- Confirm GitHub Actions succeeds and the deployed URL loads the English redesign before claiming it is public.

## Evidence and constraints

The existing Spanish version was reachable at https://canmils.github.io/OcaGo/ before this redesign. GitHub Pages is now enabled. Earlier deployment-blocker notes are historical.

Official Scopely/Monopoly GO research destinations are currently denied by the environment proxy. Required domains were added to the editable environment draft while preserving existing network rules. This save does not apply or publish configuration; research remains explicitly unverified until access is enabled. It does not block original reference-based implementation.

## Completed delivery

The reference redesign passed all19 unit tests and the strict production-browser suite; see QA.md. GitHub Actions [run39388226511](https://github.com/canmils/OcaGo/actions/runs/39388226511) successfully deployed source commit d88bded. The English game is live at https://canmils.github.io/OcaGo/ . All16 deployed HTML/JS/CSS/art files were fetched with HTTPS certificate validation enabled and matched the tested build byte-for-byte. Current screenshots show the actual integrated board, not a design mockup.
