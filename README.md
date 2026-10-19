# OcaGo

An original, Spanish, mobile-first La Oca browser game. Play a complete local match against Lola and Bruno: 63-square spiral, animated movement, one six-sided die, special squares, automatic opponents, exact finish, victory, rules dialog, and restart. No account, payment, backend, or credentials required.

## Progress and screenshots

See [current delivery status](docs/STATUS.md), [specialist team](docs/TEAM.md), and [independent QA evidence](docs/QA.md). Actual browser captures: [mobile](docs/screenshots/game-390.png) · [small mobile](docs/screenshots/game-320.png) · [desktop](docs/screenshots/game-1440.png). GitHub Actions shows build/deployment runs; screenshots are evidence of the local build, not a public game link.

## Run

Node.js 22.12+ or 24 LTS and npm are required.

```sh
npm ci --cache /tmp/ocago-npm-cache
npm run dev -- --port 5173
```

Open http://localhost:5173 when running locally. This onboarding environment does not provide a public port preview.

## GitHub Pages

The workflow `.github/workflows/pages.yml` tests and builds pushes to `main`, then deploys the static game. In repository Settings → Pages, select **GitHub Actions** as the build source. The deployment job reports the actual playable URL after a successful run. The build uses relative asset URLs to support a repository project site.

```sh
npm test          # deterministic engine checks and a complete simulated match
npm run build    # TypeScript checking and production bundle
npm run preview -- --port 4173
```

`dist/` is the deployable static output. There are no runtime services. System fonts, original artwork and gameplay run without external runtime requests.

## Rules

One human and two automatic players start at 0. Each turn rolls one d6. The first player to reach 63 exactly wins; excess movement bounces backward from 63. Special squares also apply when reached after bouncing.

- Geese: 5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 50, 54, 59. Advance to the next goose and roll again. From 59, advance to 63 and win. Apply only one goose jump per roll.
- Bridge: 6 → 12 and another turn. Landing directly on 12 has no effect.
- Inn (19): skip one turn.
- Well (31) and prison (52): skip two turns, then resume without rescue.
- Maze: 42 → 30.
- Death: 58 → 0.

This documented OcaGo variant has no collision effects or first-roll exception. Bots use the same rules and fair randomness as the human. Skipped turns require no die roll. During a human skipped turn, select “Descansar este turno.”

## Structure and accessibility

`src/game.ts` is a pure, immutable transition engine. `src/main.ts` renders the board, controls turns and cancels stale animation work on restart. `src/style.css` provides responsive layouts and a mobile action dock. `src/animation.ts` provides abortable dice, tile and victory motion with reduced-motion support. `src/storage.ts` validates and persists versioned local matches. Original SVG illustrations are in `public/art/`. `tests/game.test.ts` verifies every special square, bounce, win, skip, immutability, and complete seeded simulation.

Controls support keyboard focus; the rules dialog supports Escape and focus trapping through the native dialog element. Status changes use a polite live region, tokens have player initials as well as colors, and reduced-motion preference suppresses animation. Dice use browser cryptographic randomness without modulo bias.

The first visit includes a short welcome. Player cards show progress; starting tokens stay visible at Salida. New adventures ask for confirmation, and a victory panel offers replay.

## Scope and continuation

This is a complete local prototype, not a published service. Matches automatically save in this browser after every resolved turn; refreshing resumes the saved match, including computer turns and completed games. Storage failure or corrupt saves recover safely. Online play, long-term progression, sound controls, events, and cosmetic collection are future milestones. No Scopely assets, branding, or private implementation are used. See `AGENTS.md` for the durable autonomous brief and `docs/` for research, design, and handoff.
