# OcaGo: first playable specification

## Outcome
An original, Spanish-first browser game that makes a complete match of La Oca easy to understand and satisfying to finish on a phone. The player competes against two local computer players. No login, purchase, download, or network service is required after loading the application.

This document specifies a deliberate accessible house variant, not a claim that every Spanish family uses these rules. Traditional La Oca has regional differences. The rules shown in the application must match the implementation.

## First session
1. See a recognizable spiral of 63 numbered squares, three distinct tokens, current player, and a prominent **Lanzar dado** button.
2. Roll, see the die result and movement, and receive a short Spanish explanation of any special square.
3. Computer turns run automatically with understandable feedback. Input is disabled during their turns and while a roll resolves.
4. Reach square 63 exactly, celebrate the winner, and choose **Nueva partida**. **Cómo jugar** remains available throughout.

The complete board and its numbers must remain legible. On narrow screens use available space efficiently; a functional scrollable board is preferable to microscopic cells. Essential actions must not require hovering.

## Deterministic rules contract

- Players: one human, two bots; fixed round-robin order, human first. All begin at position 0 outside the board, with zero skipped turns.
- A turn rolls one ordinary six-sided die, with equally likely integers 1–6. Bots follow identical rules and require no strategic choices.
- Advance by the die result. If movement passes 63, reflect the excess: e.g. 61 + 5 lands on 60. Landing exactly on 63 wins immediately; no further turns occur.
- Resolve only the square on which the move finishes, after reflection. No events occur on squares passed along the way.
- Multiple tokens can occupy a square. There is no capture, swapping, blocking, or release mechanism.
- A skipped turn decrements that player's remaining skip count by one, produces an explanation, and advances to the next player without rolling.
- No special first-roll or two-dice exception applies.

| Square | Effect | Turn afterwards |
| --- | --- | --- |
| Geese: 5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 50, 54, 59 | Jump to the next goose; 59 jumps to finish 63 | Same player rolls again unless they win |
| Bridge: 6 | Jump to 12 | Same player rolls again |
| Inn: 19 | Set one future skipped turn | Next player |
| Well: 31 | Set two future skipped turns | Next player |
| Maze: 42 | Return to 30 | Next player |
| Prison: 52 | Set two future skipped turns | Next player |
| Death: 58 | Return to start 0 | Next player |
| Finish: 63 | Win immediately | Match ends |
| All others, including 12 | No effect | Next player |

A forced move is resolved once, without recursively triggering its destination. Thus a goose jump stops on the next goose and awards one extra turn; it never chains across all geese in one roll. The jump from 59 ends at 63 and wins. Landing on a goose after a reflected move still activates it. Skipped turns cannot accidentally produce a die roll or extra turn. Restart clears winner, positions, skip counts, turn state, pending animation/timers, and event feedback.

The well and prison use finite penalties so a local match cannot deadlock while waiting for another token. Traditional dice squares are ordinary cells in this variant. Explain these deliberate simplifications in player-facing help.

## Original presentation

Working theme: a sunny illustrated goose journey through a Spanish countryside garden. Use a cream paper-like surface, forest-green board accents, golden sunlight, terracotta hazards, and distinct teal/coral/purple tokens. A friendly original goose emblem and simple original vector or CSS icons are sufficient. Do not reuse MONOPOLY GO! mascots, logos, artwork, currency, board layouts, or UI assets.

The spiral is the visual anchor. Highlight the active token, distinguish special squares with both symbols and labels, and keep the latest event visible near the die. Use concise feedback such as “De oca a oca: avanzas hasta la 14 y vuelves a tirar.” Movement and die transitions should be brief and readable; respect reduced-motion preferences. Avoid full-screen interruptions during routine turns.

Buttons need visible keyboard focus, semantic labels, comfortable touch targets, and sufficient contrast. Announce meaningful turn changes and outcomes accessibly. Color must not be the only means of identifying a player. Rules must be accessible without losing match state.

## First playable acceptance criteria

- A fresh checkout can install reproducibly, start locally, test the engine, and produce a production build using documented commands.
- A human can complete a match with two automatic opponents, receive a clear winner, and restart without reloading.
- All rules in the table behave as documented. Deterministic tests cover exact finish, reflected movement, goose/bridge extra turns, finite penalties, death reset, maze return, and terminal victory.
- Computer turns never require human clicks; human input cannot trigger a bot roll or multiple concurrent rolls.
- Initial state, current turn, die result, token positions, special outcomes, and victory remain understandable in Spanish.
- The board, action controls, and help are usable on a narrow mobile viewport and desktop. Core actions work with keyboard; reduced-motion settings are respected where animation is present.
- No copied proprietary assets, paid service, account, or secret is required.

Record actual validation separately in STATUS.md. An acceptance criterion is not evidence that it has passed.

## Follow-on milestones

1. After a stable match: locally saved match/resume, optional sound toggle, and a compact match history. Explain that browser storage can be cleared.
2. Add earned cosmetic goose tokens and landscape variations, with a transparent non-purchasable progression track. Never gate ordinary play on energy, payment, or timers.
3. Explore a daily seeded challenge and short optional objectives with clear reward previews. Validate enjoyment and completion rates before expanding.
4. Consider online friends play only after defining hosting, reconnect, fairness, privacy, moderation, and operating costs. Accounts, servers, purchases, and public deployment require separate scope and authorization.

Public product research may inform cadence, feedback, collection, and social goals. Treat observations as evidence about the visible experience, not proof of Scopely's internal code, algorithms, economics, or success drivers.
