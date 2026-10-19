# OcaGo autonomous development brief

## Mission and authorization
Build an original, polished, mobile-first La Oca game, informed by publicly observable product lessons from Scopely's MONOPOLY GO!. The user wants autonomous execution, not repeated planning conversations. Make reasonable product and engineering decisions, document them, and carry milestones through implementation and validation. Use the existing isolated checkout; do not create worktrees unless requested.

The user has authorized creating project source, tests, dependency manifests, documentation, and local development configuration. This is a product development task following environment onboarding. Do not purchase services, publish externally, send messages to third parties, or require paid infrastructure. Ask only for an external prerequisite that genuinely blocks useful progress. Never claim agents continue running after this session ends; this file is the durable handoff.

## Product direction
Ship a responsive browser prototype first, suitable for touch and desktop, with Spanish as the initial interface language. Start with a complete local match against computer opponents. Use a recognizable 63-square spiral La Oca board, geese, bridges, inn, well, maze, prison, death, exact finish, and overshoot bounce. Clearly document the chosen regional rule variant and expose understandable rules to players.

Make play legible, lively, and welcoming: a distinctive original goose identity, readable board, animated dice and movement, clear turn feedback, accessible controls, reduced-motion support, and reliable small-screen layout. Use original or properly licensed assets; avoid copied Scopely branding, artwork, proprietary code, or misleading affiliation. Treat the supplied historical board as a structural reference, not a required asset.

Prioritize the playable core over speculative scope. Follow with locally persisted progression and cosmetic rewards if the complete match is stable. Events, online multiplayer, accounts, server economy, and monetization are later milestones, not prerequisites. Avoid manipulative monetization and paid dependencies.

## Team and working agreements
The active specialist team and file ownership are recorded in [docs/TEAM.md](docs/TEAM.md): UI/UX, art, animation, frontend, backend/data, QA, and coordinator. These roles supplement the initial research/design/development roles below. Read the current status before starting work to avoid repeating completed tasks.

- Research agent: analyze public evidence about La Oca and MONOPOLY GO! product systems; cite sources and separate observations, inferences, and recommendations. Do not invent research or claim access to internal systems.
- Game design agent: define rules, first-session experience, presentation, acceptance criteria, and later progression. Own design documents, not implementation files.
- Development agent: build the runnable prototype and meaningful tests. Own application source and tooling. Read research/design as they arrive; proceed with documented defaults when they are pending.
- Coordinator: maintain shared goals, integrate findings, resolve conflicts, validate the complete workflow, and report concrete outcomes and limitations.

Each agent owns its assigned files and records decisions, evidence, results, and remaining work in repository documentation. Do not overwrite another agent's work. Coordinate interface changes explicitly. Do not commit or push unless requested.

The user has now explicitly requested GitHub delivery to `canmils/OcaGo`. The coordinator may commit and push integrated, validated work to `main`; specialist agents leave committing and pushing to the coordinator. GitHub Pages is the requested playable delivery path. Do not describe an unverified deployment as live.

## Milestones and quality gate
1. Research and concise product/rules specification.
2. Complete playable local match: human plus bots, all special squares, turn sequencing, victory, restart, and rules help.
3. Original responsive visual presentation and useful feedback; persistence only where it adds value.
4. Validate rules using deterministic tests, run production build, start the application and exercise representative gameplay using browser automation when available. Check mobile layout and keyboard usability. Distinguish tested behavior from untested claims.

Prefer a small TypeScript web stack with reproducible dependency installation and few runtime dependencies. Keep game logic independent of rendering for testing. Seed or inject randomness in tests. Avoid unnecessary backend services or credentials.

## Completion and handoff
Maintain README instructions for installation, development, build, and tests. Record current status and next milestone in docs/STATUS.md. Report actual commands and outcomes, repository defects, and external blockers. Finish the playable milestone rather than stopping at plans or scaffolding. Persistent instructions allow a future session to resume; live agent processes are session-bound.
