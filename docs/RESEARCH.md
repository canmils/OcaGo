# OcaGo research and product lessons

Research status: 19 October 2026. This document informs an original prototype; it does not claim access to Scopely's code, telemetry, economy configuration, or internal design documents.

## Evidence and access limits

The only directly inspectable visual reference supplied for this task is the historical `Jeu de l’Oie` board in the conversation. It visibly uses a numbered spiral, illustrated special spaces, geese, and a central rules area. It supports the direction of an illustrated spiral board; it does not establish every Spanish regional rule or grant a license to reuse the image.

Live retrieval was attempted using Python's standard HTTPS client for the three URLs below. All requests failed with `Tunnel connection failed: 403 Forbidden`. No search or browser connector was available to this agent. Consequently these are **source leads, not successfully retrieved citations**. Product descriptions below are general background knowledge and design hypotheses, not findings from a current hands-on audit. Verify current details against these sources before making public research claims.

| Source lead | Intended verification | Retrieval status |
| --- | --- | --- |
| https://www.scopely.com/en/games/monopoly-go | Publisher description and current game positioning | Blocked, proxy 403 |
| https://monopolygo.com/ | Official product and download entry point | Blocked, proxy 403 |
| https://en.wikipedia.org/wiki/Game_of_the_Goose | Historical overview and regional rule variants; secondary source | Blocked, proxy 403 |

No fresh app-store review analysis, monetization measurement, player interviews, or direct play session was conducted. Do not invent performance metrics or retention estimates.

## La Oca: background and choices that must be explicit

La Oca is a traditional race game commonly played on a 63-space spiral. Players move by dice, geese reward progress, special spaces interrupt or redirect movement, and the final space commonly requires an exact roll with excess movement bouncing backward. Regional and household rules vary considerably. In particular, the number of dice, goose resolution, bridge behavior, penalties at the inn and prison, rescue rules at the well, and opening-roll exceptions differ.

A common two-dice tradition includes special handling of an opening nine (often 3+6 to 26 and 4+5 to 53). This matters because repeatedly applying the rolled distance from goose spaces can otherwise produce surprising chains. Do not combine traditions accidentally: the implementation must state its own complete rule set and test it.

For an approachable first browser prototype, recommend an explicitly named **OcaGo quick-play house variant** with one die. This is a product recommendation, not an assertion that it is the unique official rule set:

- Start at 0 and finish at 63; overshoots bounce backward.
- Geese on 5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 50, 54, 59 move to the next goose and grant another roll. Resolve only the original landing; the destination goose does not recursively trigger another jump. The final goose may lead to the finish, if the design explicitly chooses this behavior.
- Bridge 6 advances to 12; choose and explain whether it grants a bonus roll.
- Inn 19 loses one turn; well 31 and prison 52 lose two turns. Fixed penalties let a local solo match continue without another player's rescue.
- Maze 42 returns to 30; death 58 returns to the start.
- Shared spaces are permitted, with no capturing. Bots use identical movement rules.

The game design specification is authoritative if it chooses a different coherent variant. The user-facing rules must match the implementation. Explain fixed well/prison penalties and next-goose movement as deliberate simplifications. Preserve the recognizable goose, bridge, hazard, spiral, and exact-finish identity.

## MONOPOLY GO!: background versus inference

General public product background, **not freshly verified in this run**: MONOPOLY GO! translates a familiar board-game identity into mobile dice sessions with board progression, landmark building, collection systems such as sticker albums, social interactions, and recurring events. These features and their current details should be checked against official material before expanding the roadmap.

The useful lesson is the relationship between recognizable actions and immediate feedback, rather than copying a specific screen or economy. The following are original design inferences:

| Product hypothesis | OcaGo recommendation | Scope |
| --- | --- | --- |
| A familiar central action makes first play understandable | Make “Lanzar dado” prominent and explain each move in plain Spanish | First milestone |
| Anticipation and visible resolution can make chance enjoyable | Brief dice animation, stepped token movement, readable destination and result message | First milestone |
| Board identity makes progress tangible | An original illustrated goose trail with clear numbering and recognizable landmarks | First milestone |
| Short-term goals can support return play | Optional local win count and earned cosmetic goose palettes | After complete match works |
| Collection and event layers can add variety | Consider cosmetic postcards and deterministic daily challenges | Later; validate fun first |
| Social competition can create motivation | Start with transparent computer opponents; evaluate pass-and-play before online services | Later |

These are hypotheses to test through play, not proven causal explanations of Scopely's commercial results. An enjoyable complete match is the prototype's success criterion; monetization and engagement metrics are outside the first milestone.

## Practical implementation recommendations

1. Keep rules independent of rendering, with injectable dice results. Deterministic checks should cover overshoot, goose movement, skipped turns, bridge, maze, death, winner selection, and turn handoff.
2. Use one rules engine for every player. Dice results should be uniform and independent of purchases, progression, and whether the player is human.
3. Show the current player, die result, position change, and reason for every special effect. Keep the last result visible after animations stop.
4. Make the board legible on narrow screens. Number every square and provide a text status alternative; color alone must not distinguish players or hazards.
5. Use original visuals, names, writing, and interface composition. Do not copy Scopely assets or imply affiliation.
6. Do not add energy timers, paid dice, loot boxes, account creation, fake social notifications, or a backend to validate the local match.
7. Respect reduced motion, keyboard operation, and sufficient tap targets. A local match should remain playable if animation is disabled.

## Follow-up research when network access is available

Retrieve and archive official product descriptions with dates; inspect a real current play session; distinguish first-session onboarding from mature progression; record exact evidence for each mechanic. Compare at least two published La Oca rule sets before describing anything as traditional. Seek permission or a clear license for any external assets. Expand the prototype only after validating that the core match is understandable and enjoyable.
