# OcaGo UX implementation brief

## Evidence and intended experience
Reviewed current `src/main.ts`, `src/style.css`, rules specification, and `/tmp/ocago-mobile.png` at 390px. The existing screen reads as a landing page followed by a board and sidebar. The first roll is near the bottom of a 1050px page; 7px cell numbers and 7–10px player copy do not support comfortable phone play. The recognizable goose, calm garden palette, and simple local match are useful foundations.

Target: a playful, tactile countryside board game with one immediately obvious next action. Keep Spanish interface copy and the documented rules. Build an original visual identity, not a reproduction of another game's screen.

## P0: active match hierarchy

1. Compact masthead, approximately 56–64px: OcaGo identity left, clearly named `Cómo jugar` button right. Avoid a navigation link that reloads the match. No hero headline above an active game on phones.
2. Compact three-player strip with avatar, name and position. Human marked `Tú`; bots marked `IA` somewhere visible. Active player uses an outline plus text indicator, not color alone. All three starting tokens appear in a visible `Salida` dock.
3. Board is the main visual surface. Board heading contains round and `Meta 63`; garden art must sit inside unused cells and never overlap a numbered cell. Use path connectors or direction arrows at corners and between nested rings: the current disconnected square tiles obscure the route.
4. Persistent mobile action panel after/over the lower viewport safe area. Contains die, `Tu turno`/`Turno de Lola`, one event sentence, and a primary `Lanzar dado` button of at least 48px height. Reserve layout space equal to the panel so it never covers the final board row. At 390×844 the player should see board and primary action without needing to hunt down the page.
5. Desktop retains board plus right action column; remove low-information motivational filler. Use that space for latest event or special-square explanation instead.

## P0: board legibility and inspection

- Aim for numbers ≥10px at 390px width, strongest contrast on tile number. Enlarging the board via reduced outer padding is preferable to decorative gutters. Do not shrink the board further to fit a marketing banner.
- Use original consistent SVG icons instead of OS-dependent emoji for major tile types and dice. Every tile retains its number even when occupied.
- Special tiles use icon plus distinct treatment: gold geese, teal bridge, warm red setbacks, green finish. Do not use color as the only meaning.
- Tapping any cell opens a compact inspector: `Casilla 19 · Posada`, `Descansas 1 turno`, occupants if any. Inspector is keyboard operable and dismissible; it does not pause or reset the match. Expose accessible cell name with rule and occupants.
- Each token contains a permanent letter or glyph matching the player strip. Active human token has a visible halo; overlapping tokens retain all identities. Position-zero tokens must be visible in the start dock.
- Keep path adjacency clear across 9→10, 17→18, 25→26, 32→33 and successive ring transitions. Tiny decorative dots in ordinary tiles compete with tokens; reduce/remove them.

## P0: complete interaction states

| State | Primary action and feedback |
| --- | --- |
| New match | `Tu turno` + `Lanza el dado para empezar`; show all three tokens at Salida |
| Human ready | Enabled `Lanzar dado`; die shows prior result or a neutral starting face |
| Roll resolving | Disable action immediately; `Lanzando…`; reveal final face before token movement |
| Moving | `Avanzas 4 casillas`; active token moves along the visible route |
| Special landing | Explain result before passing turn: `De oca a oca: 9 → 14. ¡Vuelves a tirar!` |
| Bot turn | `Lola está jugando…`; automatic turn, no misleading enabled human control |
| Penalty | `Descansas este turno · Queda 1`; explicit `Pasar turno` if human confirmation remains |
| Win/loss | Persistent winner panel: name, reached 63, `Jugar otra vez`; move focus to its heading |
| Restart | During an active match, confirm `¿Empezar una partida nueva?` with `Seguir jugando` as safe default; no confirmation before any roll or after victory |

Preserve readable event feedback for approximately 0.8–1.2 seconds before next bot begins. Do not let rapid bot animations overwrite the explanation before it can be read. Keep a small optional recent-turn log for reinspection if implementation time permits.

## P1: teaching without blocking play

First-session helper is one compact dismissible message beside the roll action: `Llega a 63 con una tirada exacta. Las ocas te dan otro turno.` No multi-step forced tutorial. On the first special landing provide the rule inline. Help opens over the existing match and returns focus to its button on close. Use a clear rule summary first, then full variant details. Explain bots and local-only play in the help.

## Motion contract for animation specialist

Die anticipation 300–500ms; final face visible before movement. Tile steps 70–110ms with an active halo; destination receives a 200–350ms landing pulse. Goose jump gets a distinct curved trail or short lift; bridge transit differs from ordinary steps. Show a special event banner for the result; avoid full-screen routine effects. Winner celebration can use a single brief decorative burst plus stable result panel. Restart cancels pending effects and timers. Reduced motion: immediate positions, no shaking, preserve final face and text feedback. Decorative animation never delays keyboard focus or blocks input past the actual resolving state.

## Accessibility and acceptance checks

- Visible focus on all controls; minimum 44×44px tap target, primary action ≥48px. Body/event copy ≥13px; primary state copy ≥14px. Normal text contrast ≥4.5:1.
- `aria-live=polite` announces final roll/result and turn change once per meaningful state, not each movement cell. Winner heading receives deliberate focus. Dialog has a label, native focus trapping and Escape support.
- 360×800, 390×844, 768×1024 and desktop: no horizontal page overflow; primary action reachable; bottom panel does not obscure board; help scrolls independently. At 200% zoom all controls remain usable.
- Keyboard: start match, roll, inspect a tile, open/close help, restart, finish match. Focus must survive re-rendering.
- Reduced motion: no continuous movement/rotation; readable outcomes remain.
- Complete one human win and one bot win; inspect stacked tokens and a skipped human turn. Validate mobile with actual screenshots, not only CSS review.

## Deferred

Online friends, currencies, energy, purchases, login, fabricated live events, and decorative collection screens are not prerequisites for this local MVP. Premium quality comes first from clear board topology, strong art, deliberate motion, and an understandable match loop.
