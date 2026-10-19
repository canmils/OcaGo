# Progression proposal: a journey worth keeping

Status: future backlog, not implemented or validated. The current delivery priority is the complete match, visual polish and optional audio. All numbers below are tunable design proposals, not observed player behavior or a balanced economy.

## Product purpose
Give an occasional player a pleasant record of journeys and an original goose to personalize. A return visit must always allow an ordinary full match immediately. No purchases, energy, paid currency, randomized rewards, required accounts, attendance streaks, expiry, loss of earned items or timers. The classic board and rules remain available from first launch.

La Oca in this variant has no meaningful strategic choices. Rewarding wins or faster finishes would largely reward luck; neither should determine progression. Never imply that cosmetics improve odds, movement or bot behavior.

## Smallest local milestone
After a completed match, show a compact Spanish receipt: “Partida completada · +1 sello de viaje”. Award one journey stamp whether the human or a bot wins, provided the human participated with at least one resolved roll. No reward for an abandoned or restarted match. This participation condition is a simple local eligibility rule, not an anti-cheat guarantee. A player who prefers shorter sessions can resume a saved match without losing eligibility.

Proposed initial track:

| Total completed matches | Guaranteed cosmetic | Presentation |
| --- | --- | --- |
| 1 | Broche de pluma | Small feather accessory on the existing goose portrait |
| 3 | Lazo del huerto | Garden ribbon, outside the token's identifying silhouette |
| 6 | Postal del atardecer | Optional landscape treatment behind the board |

Art direction: cream goose and coral scarf remain the base identity; teal structure and honey-gold reward accents fit the garden expedition. These are cumulative thresholds, not spend prices. Stamps are a visible completion count, not a currency wallet. A threshold unlock is automatic, permanent within this browser's storage, and can be equipped or ignored. Default artwork always remains selectable. Do not require collecting every item to reach a later threshold. Future art names and feasibility require creative-direction review.

Collection view: show earned items first, next guaranteed unlock and exact remaining match count. Use text and icons together. Preview locked cosmetics without a purchase-style call to action. “Disponible tras 3 partidas completadas” is clearer than a progress percentage alone. No notification badge that cannot be dismissed.

## Concrete acceptance criteria for the local backlog
1. A human win, bot win and resumed completion each award exactly one stamp; a reload of the completed result awards zero additional stamps. Persist completion identity and progression together so a repeated receipt is idempotent.
2. Restart before completion awards zero. Replay after completion creates a new match identity and can earn one stamp on its own completion.
3. A bot victory after a human never rolled awards zero and explains the eligibility rule only when relevant. Match rules and turn order remain unchanged.
4. Crossing thresholds 1, 3 and 6 unlocks the specified item once. Jumping multiple thresholds through a future migration still unlocks every eligible item.
5. Equipping every item leaves tile numbers, active-player distinction, focus indicators and special-square icons legible at 320px. Information cannot depend on color or sound. Reduced motion replaces reward movement with a static receipt.
6. The receipt does not block “Nueva partida”; any optional collection detail can be closed using keyboard and touch. Screen-reader feedback announces the reward once.
7. Corrupt or unknown-version progression data falls back safely without executing markup or preventing a match. Clearly warn that clearing browser storage removes local progress. Never claim cloud backup.
8. Tests cover the eligibility/duplicate-award contract and migration boundary, rather than only reproducing UI markup. Browser validation covers receipt dismissal, cosmetic selection and reload.

## Replay goals and fair expectations
Optional goals can offer direction without becoming chores: finish a match, inspect three special-square explanations, try the reduced-motion setting. Goals may grant a commemorative journal mark, not extra stamps or stronger pieces. Never incentivize disabling accessibility features. A chance-based goal such as landing on a bridge must say that it depends on luck, remain optional and have no deadline. Do not require repeated losses or restarting until a favorable roll occurs.

The initial track should be assessed with voluntary playtests: can people explain the next reward, do they enjoy another match without a reward, and does the celebration interrupt play? Completion count alone cannot establish enjoyment. No analytics SDK or personal telemetry is authorized by this proposal.

## Local versus online boundary
Local browser storage can be edited, duplicated or cleared. That is acceptable for solo cosmetics; do not add client-side anti-cheat or promise scarcity. No leaderboard, tradable item, public rank, shared inventory or globally limited reward should trust this state.

An authoritative online system is a separate future project requiring explicit scope for accounts, privacy, hosting costs, server-issued match IDs, validated results, idempotent awards, replay/reconnect behavior and time semantics. Design that system before shipping competitive or shared rewards. Do not build backend placeholders in the current slice.
