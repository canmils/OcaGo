# Illustrated board art direction

## Reference read

The user's attached board is a picture book expressed as a route: a large opening vignette at the bottom left, narrow/broad rectangular and corner cards arranged in an inward spiral, and a large central destination. Crucially, ordinary cells are pictures too. Its warmth comes from varied coloured scenes, outlined characters and objects, and confident composition—not a mostly empty pale grid with icons on a few special cells.

The artwork in `src/tile-art.ts` is original. It does not trace or extract the supplied commercial board illustrations or use Scopely assets. It takes the structural lessons: editorial ink contours, flat warm colour, whimsical animals, oversized story objects, varied backdrops and illustrated start/finish scenes.

## Implemented asset contract

- `tileArt(n, aspect=1)` returns a standalone, full-bleed SVG illustration for each numbered cell 1–63. The optional actual card aspect ratio keeps the subject proportional and completely visible while the background fills the card. Each valid cell produces distinct composition markup; no ordinary cell is a dot or empty placeholder.
- `tileArtLabel(n)` returns its English picture name for accessible tile descriptions and the inspector.
- `startArt()` returns a broad 300×180 scene with two geese at a nest.
- `finishArt()` returns a broad 300×180 destination scene with a crowned goose, pond, foliage, sun and companion geese.
- No external font, network request, embedded bitmap, user content, SVG IDs or cross-document references are used. The frontend supplies numbers, route boundaries and player-token overlays.

The 63 pictures include a fox on a unicycle, singing kettle, travelling bear, bridges, friendly cloud, explorer's boot, fish balloon, gardener turtle, owl, honey pot, acorn house, woodland band, inn, mushroom village, paper boat, badger, harvest basket, lighthouse snail, bicycle, pocket watch, windmill, wishing well, train, lantern mouse, picnic, sailboat, painter rabbit, sunflower lion, elephant, maze, musical house, scarf, reading cat, flying teacup, beetle, gate, telescope, tower, dice, piano, hot-air balloon, sleeping dragon, return-to-start skull, dragonfly and frog. Goose cells retain one recognizable character with varied contextual props.

## Integration and motion

Fill the panel with the scene, then place a high-contrast number badge above it. Keep the token ring and letter distinct from the palette below. Avoid clipping an animal's face with a number badge; art has its main character toward the middle/lower part of its square frame.

The large destination exposes `data-idle="goose"`, `blink`, `flutter`, and `water` on isolated decorative groups for the animator. Do not animate the numbered cell or its hit area. The animator owns reduced-motion and pause/cancellation behavior.

Pass the actual card width/height to `tileArt` for board panels. The SVG uses `preserveAspectRatio="none"` for full-bleed scenery, while an inverse-aspect transform on its centered subject cancels physical stretch: portrait subjects scale vertically by the aspect ratio; landscape subjects scale horizontally by its inverse. This preserves subject proportion and keeps the complete head/object visible. The explorer omits the argument for a square scene. The wide start/finish exports remain separate and unchanged.

## Validation

All 63 generated SVGs plus start/finish parse as XML. All 63 cell outputs are unique. `npx tsc --noEmit` passed. A Chromium contact sheet was captured and visually inspected at `/tmp/ocago-storybook-contact.png`; every cell has visible character/object drawing and varied full-frame scenery. That temporary sheet validates asset rendering, not final board usability. Integrated board screenshot review belongs to the subsequent frontend/QA pass and is not assumed complete from the contact sheet.

## Integrated board review

Reviewed the frontend's actual 390px and 1440px screenshots (`/tmp/reference-fe-390.png`, `/tmp/reference-fe-1440.png`) and the running production preview on port 4173. The large bottom-left start, rightward first run, inward route and central goose garden now visibly follow the reference's composition. All 63 panels contain a picture and the palette/contours form one coherent visual vocabulary. The three-player roster is visible above the board in the mobile screenshot.

Normal-motion verification at 390×844 sampled the central goose four times over 1.5 seconds. It had one active idle animation, remained completely within the finish panel, and retained the stable outer placement `translate(115 85) scale(1.1)`. Idle transform is applied to a nested, transform-free group rather than overriding layout positioning. Screenshot: `/tmp/reference-art-normal-motion.png` (temporary review artifact).

The initial review found cover-cropped heads/objects in broad cards. That defect was fixed in this iteration with the optional aspect-ratio contract described above. The frontend passes actual inset-adjusted card dimensions. Post-fix production captures of square 10 (balloon fish), 19 (inn), and 61 (frog) were visually inspected at `/tmp/reference-art-safe-{10,19,61}.png`; all three subjects are complete and their measured bounds remain within their cards. The frog is intentionally small in its very shallow side card; the enlarged explorer is still useful for detail. This review does not establish printed-board reproduction, bespoke hand-painted commercial fidelity, or the gameplay QA gate.
