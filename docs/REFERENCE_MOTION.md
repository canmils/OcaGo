# Reference-led motion pass

The user's illustrated reference is a board full of characters and objects, not an empty tile grid. Idle animation should make a small cast feel present while preserving the board's physical clarity. Motion does not substitute for artwork on every cell.

## Implemented module

Import `createIdleScene` from `src/idle.ts` after the board and illustration markup are inserted. Call `createIdleScene(board)` once; retain the returned `destroy()` for unmount or replacement. Both HTML and SVG roots work. The module imports its own CSS and observes child replacement, so rerendered tokens and artwork remain supported without another initialization call.

Original artwork exposes dedicated decorative groups with these attributes:

| Attribute | Motion | Maximum moving groups |
| --- | --- | --- |
| `data-idle="goose"` | Quiet breathing/bob and slight tilt | 1 |
| `data-idle="blink"` | Brief eye blink approximately every 7 seconds | 1 |
| `data-idle="flutter"` | Leaf or flag sway | 1 |
| `data-idle="water"` | Gentle opacity shimmer | 1 |

Add `data-idle-priority` to a central-destination group to prefer it over a repeated route illustration. Attach attributes to decorative character/eye/leaf/water groups, never whole tile containers containing numbers or tokens. Repeated scene attributes are allowed, but only the first selected group for each role moves. `.current-token` receives a subtle shadow halo; token transforms remain exclusively controlled by movement animation.

## Accessibility and resource behavior

- `prefers-reduced-motion` disables all idle animations and reacts to live preference changes.
- Hidden documents pause CSS animation without continuous animation-frame loops or timers.
- No Web Audio, randomness, gameplay state changes, cell movement or turn delays are introduced.
- At most four decorative groups and the current-player token animate. The 63-cell board never becomes 63 simultaneous idle animations.
- Destroy disconnects the observer, removes listeners and effect classes, and is safe to call twice.

## Validation

`npx tsc --noEmit` passed. A standalone Chromium/Playwright fixture (`/tmp/ocago-idle-check.cjs`, temporary review script) passed on 2026-10-20:

- Exactly one goose group selected, preferring the explicitly prioritized destination group.
- Five expected CSS animations active: four decorative groups and one token halo.
- Token computed transform remains `none`; the idle halo does not take over movement transforms.
- Simulated hidden-document visibility event pauses every fixture animation.
- Live reduced-motion preference change removes all fixture idle animations.
- Replacing artwork selects the new decorative group; double destroy is safe and removes animation/classes.

The visibility test changes `document.hidden` in the controlled fixture and dispatches its event; physical browser background/tab behavior remains an integration/device check. Integrated production validation belongs to frontend and QA: verify actual scene groups are selected, initial player tokens remain visible, moving tokens do not inherit a transform conflict, normal idle animation is active, reduced-motion has zero idle animation, and a hidden document pauses it. Do not interpret a standalone fixture as proof frontend integrated it.
