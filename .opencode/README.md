# OcaGo UI/UX agent team

A repeatable loop that turns *looking at the game* into *shipped improvements*. One agent audits
the real game, the audit becomes a prioritized backlog, specialists implement the backlog on
separate branches, and an independent QA agent verifies every change before it reaches review.

Nothing here runs by itself. The agents are session-bound; this directory is the durable setup.

## The loop

```
        ┌──────────────┐
        │ ux-auditor   │  plays the real game, scores it, writes docs/UX_AUDIT.md,
        └──────┬───────┘  opens one GitHub issue per finding
               │  backlog (issues labelled ux-audit)
        ┌──────▼───────┐
        │ coordinator  │  groups issues by owner, dispatches specialists in parallel
        └──────┬───────┘  one branch + one PR per issue
     ┌─────────┼─────────┬──────────────┬────────────────┐
     ▼         ▼         ▼              ▼                ▼
  visual   interaction  motion     accessibility      qa-verifier
  designer  engineer   designer      engineer      (independent verdict)
     └─────────┴─────────┴──────────────┴──────────────┘
               │  PR + evidence
        ┌──────▼───────┐
        │    review    │  human merges after QA passes
        └──────────────┘
```

## The agents

| Agent | Kind | Owns | Takes |
| --- | --- | --- | --- |
| `ux-auditor` | subagent | `docs/UX_AUDIT.md`, `docs/screenshots/audit/`, GitHub issues | produces the backlog |
| `coordinator` | subagent | `docs/STATUS.md`, `docs/TEAM.md` | plans and dispatches the cycle |
| `visual-designer` | subagent | `src/style.css`, `src/technical-art.css`, `docs/VISUAL_SYSTEM.md` | `area:visual` |
| `interaction-engineer` | subagent | `src/main.ts`, `index.html`, `docs/UX_FLOW.md` | `area:interaction` |
| `motion-designer` | subagent | `src/animation.ts`, `src/animation.css`, `src/idle.ts`, `src/idle.css`, `docs/ANIMATION.md` | `area:motion` |
| `accessibility-engineer` | subagent | `src/a11y.ts`, `src/a11y.css`, `tests/a11y.test.ts`, `docs/ACCESSIBILITY.md` | `area:a11y` |
| `qa-verifier` | subagent | `tests/qa-*.test.ts`, `scripts/qa-browser.cjs`, `docs/QA.md` | verifies every PR |

Ownership is enforced three ways: the agents are told what they may edit, they work on separate
branches, and the coordinator never lets two agents touch the same file in one cycle.

## The commands

| Command | What it does |
| --- | --- |
| `/ocago-audit` | Plays the game in a real browser, scores it, writes `docs/UX_AUDIT.md`, opens the backlog issues |
| `/ocago-improve` | The whole cycle: baseline, backlog, plan, parallel specialists, QA, review-ready PRs |
| `/ocago-implement <issue>` | One issue end to end: owner -> branch -> implementation -> QA -> PR |
| `/ocago-verify <pr>` | Independent verification of a PR against its acceptance criteria |

Extra arguments are passed to the agent, for example `/ocago-improve focus on the 320px layout and
the turn feedback`.

## Running it without the TUI

```bash
cd ~/Projects/OcaGo
opencode run --agent ux-auditor "Audit the game and open the backlog issues"
opencode run --command ocago-improve
opencode run --command ocago-verify -- "12"
```

## Requirements

- The Playwright MCP server is configured in `.opencode/opencode.json` (`npx -y @playwright/mcp`).
  It uses the installed Google Chrome. The first run downloads the MCP package.
- The repository's own browser suite needs a Playwright module and a Chromium binary:

  ```bash
  bash -c 'source scripts/browser-env.sh && QA_URL=http://localhost:5173 node scripts/qa-browser.cjs'
  ```

  `scripts/browser-env.sh` resolves both automatically: a local `node_modules/playwright`, a cached
  npx install, and the newest cached Playwright Chromium. Override with `CHROMIUM_PATH` and
  `PLAYWRIGHT_MODULE_PATH` when needed.
- `gh` must be authenticated for a repository with push rights (`canmils/OcaGo`).

## Issue labels

The backlog is machine-readable through labels:

| Label | Meaning |
| --- | --- |
| `ux-audit` | created by the audit agent |
| `severity:P0` / `severity:P1` / `severity:P2` | player impact, P0 blocks release |
| `area:visual` / `area:interaction` / `area:motion` / `area:a11y` / `area:content` / `area:qa` | which specialist owns it |
| `audit:YYYY-MM-DD` | which audit produced it |

## Changing the team

- Edit an agent file in `.opencode/agent/`; the frontmatter controls its model, colour and
  permissions, the body is its prompt.
- Models are pinned only where the task needs them: the auditor, the visual designer and the QA
  verifier read screenshots, so they use a vision-capable model. The rest inherit the session
  model. Change the `model:` line to switch a specialist.
- The pinned models are the `opencode/*` free tier (`nemotron-3.5-super-vl-free`,
  `mimo-v2.6-flash-free`). The `opencode-go/*` models were rejected with an expired API key on
  this account, so they are not used.
- Agents are `mode: all`, so each one is also selectable directly in the TUI and runnable with
  `opencode run --agent <name>`.
- After any change here, restart opencode: the configuration is read once at startup.
