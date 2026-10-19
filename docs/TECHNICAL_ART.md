# Garden technical art

The technical art module gives the existing original garden artwork a quiet material treatment: lit tile surfaces, a shaded board rim, a warm central clearing, a two-square movement trail, and a persistent active-player outline. Trail length is bounded; changing players clears the previous trail. Outlines reuse each traveler's color and remain secondary to tile numbers and tokens.

Special landings use a short expanding ring: gold for geese, teal for bridges, lavender for rest, terracotta for setbacks and cream/gold for the finish. These reinforce the existing messages and illustrations; they do not encode rules by color alone. The atmosphere needs no copied artwork, remote requests, extra images, continuous animation loops or dependencies.

Two additional original vector portraits, `public/art/atmosphere-lola.svg` and `public/art/atmosphere-bruno.svg`, replace platform-dependent fox/bear emoji. They share the existing goose mascot's teal outlines, cream highlights and scarf motif. Their scarves retain the player palette (blue for Lola, lavender for Bruno). Both have a 160×160 view box and need no network assets. Integrate inside the existing avatar using a decorative empty `alt`; the adjacent player name supplies the accessible identity. Render with `width:100%;height:100%;object-fit:contain`.

## Integration

Import `createBoardAtmosphere` from `src/technical-art.ts`; CSS loads with the module. Create it once with the board element. After rendering call `focus(position, playerIndex)` for the active traveler. Position zero clears focus. Await `arrive(position, kind, abortSignal)` at special landings when appropriate; it finishes within 420 ms. Call `reset()` during restart and `destroy()` when removing the board. `kind` is `goose`, `bridge`, `rest`, `setback` or `finish`.

All effects are decorative and hidden from assistive technology. Reduced motion suppresses arrivals and trails, preserving the static active-square outline. Forced colors supplies an outline. Abort, reset and destroy remove temporary nodes and cancel their animations; cancellation settles awaiting callers. Existing token transforms belong to the animation module and are never overwritten.

## Validation

`npx tsc --noEmit` passed after implementation. Static review checked bounded trails, revisiting squares during bounce, changing players, position zero, abort and teardown. Visual/browser integration validation belongs to the coordinator; this module alone does not establish device/browser quality or a Scopely-equivalent presentation.
