# Specialist delivery team

The initial functional prototype is a baseline, not the final quality target. The user requested a specialist team to improve the actual game. All roles below are executing within this session; these instructions do not create an unattended background service.

| Role | Concrete ownership | Required delivery |
| --- | --- | --- |
| UI/UX | docs/UX.md | Audit actual screens; specify mobile hierarchy, interaction states, readable navigation, accessibility |
| Art | public/art/, docs/ART.md | Cohesive original goose, garden, and special-square assets integrated into the game |
| Animation | src/animation.ts, src/animation.css, docs/ANIMATION.md | Dice, movement, events, victory, cancellation and reduced motion |
| Frontend | main.ts, style.css, index.html, README | Integrate specialists into a substantially improved playable interface |
| Backend/data | src/storage.ts, tests/storage.test.ts, docs/BACKEND.md | Validated versioned local saves; future server boundaries explicitly distinguished |
| QA | docs/QA.md, tests/qa-*.test.ts | Independent rule regressions and browser checks at desktop and mobile sizes |
| Coordinator | Integration and GitHub delivery | Resolve ownership, review evidence, update status, publish validated changes to the requested repository |

## Delivery gate

Do not call the redesign finished from documents alone. Integrate assets, motion and persistence, run tests and production build, and check the resulting screens and full match in Chromium. Record exact evidence and remaining defects. GitHub Actions and Pages are the intended delivery path; do not claim a live public URL until verified. The current environment can push Git commits but GitHub API operations returned Forbidden, so Pages configuration/deployment status may require repository-owner action.
