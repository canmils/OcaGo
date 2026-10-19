# OcaGo original art direction

The garden expedition uses warm cream raised tiles, deep teal structure, mint foliage, coral highlights, and golden action accents. Art is original vector artwork created for OcaGo; it contains no Scopely or Monopoly assets, external image dependencies, or embedded fonts.

## Reusable assets

| File under `public/art/` | Purpose | View box |
| --- | --- | --- |
| `mascot-goose.svg` | Main cream goose with coral expedition scarf | 160 × 160 |
| `garden-island.svg` | Illustrated floating garden, pond, bridge, trees, rose arch | 480 × 290 |
| `world-garden.svg` | Mint landscape background with subtle foliage | 1000 × 1000 |
| `goose.svg` | Goose square illustration | 160 × 160 |
| `bridge.svg` | Bridge square illustration | 160 × 160 |
| `inn.svg` | Inn square illustration | 160 × 160 |
| `well.svg` | Well square illustration | 160 × 160 |
| `maze.svg` | Maze square illustration | 160 × 160 |
| `prison.svg` | Prison square illustration | 160 × 160 |
| `skull.svg` | Return-to-start square illustration | 160 × 160 |
| `finish.svg` | Finish flag illustration | 160 × 160 |

Use `import.meta.env.BASE_URL + 'art/filename.svg'` so URLs resolve under GitHub Pages' repository path. Serve assets locally; no art CDN is required. Decorative images should have `alt=""`; gameplay labels remain in accessible HTML. Keep square numbers separate from illustrations and preserve their contrast. At small sizes, favor the silhouette and make numbers and player pieces the highest visual priority.

## Composition

Place the garden island in the board's central clearing, with the goose above or beside it, without covering playable squares. Layer the world background beneath the board with restrained contrast. The goose scarf establishes coral as the player's highlight; reserve stronger gold for the primary roll action and finish. Shadows may add depth but must not reduce small-screen legibility. Do not depend on art alone to explain tile effects.

## Palette

- Forest outline: `#21564B`
- Cream goose and highlights: `#FFF8E4`
- Mint grass: `#AAD986`
- Coral scarf: `#ED7863`
- Golden beak and feet: `#F4AE46`
- Pond: `#58B9C3`

## Validation

All 11 SVG files passed XML parsing. Chromium rendered a combined asset contact sheet and it was visually inspected at `/tmp/ocago-art-preview.png`. The contact sheet is a local QA artifact, not a runtime dependency. Frontend integration and final responsive screenshots are separate checks owned by frontend and QA.
