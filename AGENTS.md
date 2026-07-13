# resume-andrew-paettie — Agent Guide

This repository is Drew/cazlo's personal resume and portfolio site. It is a
Vite/React application with a Redux/Redux-Saga snake game embedded under
`src/containers/SnakeGame/`.

The GitHub repository is `cazlo/resume-andrew-paettie`; `origin` is the SSH
remote for that repository.

## Repository Map

- `src/components/` — portfolio page components.
- `src/containers/Resume/` — resume presentation.
- `src/containers/SnakeGame/` — snake UI, Redux state, sagas, pathfinding, and
  tests.
- `public/` — static assets copied into the build.
- `lambda/emailForward/` — separate email-forward Lambda package.
- `.circleci/config.yml` — existing CI pipeline.
- `Dockerfile` — production container build.

Check for more specific instructions before changing a nested area.

## Local AI Plans

Local planning notes live under `ai-plans/`. The directory is intentionally
gitignored: use it to organize investigations and implementation work, but do
not stage or commit its contents.

Before creating a plan for an issue or recurring task, search existing notes by
repository-qualified issue number and likely keywords, for example:

```bash
rg -n -i 'resume-andrew-paettie#9|snake|tail' ai-plans
```

Update a matching plan instead of creating a duplicate.

## Snake Game Architecture And Invariants

- `sagas/gameSagas.js` owns the tick/move/collision/eat sequence.
- `reducers/gameReducer.js` owns snake movement and growth.
- `sagas/pathFindingSagas.js` contains both graph construction and the greedy
  solver; despite the directory name, most exported pathfinding functions are
  synchronous and are best tested as pure functions.
- `snake.parts[0]` is the head and the final item is the tail.
- Eating grows the snake by duplicating the final segment. On the following
  move one duplicate is removed, so that coordinate remains occupied for one
  extra tick. Preserve this invariant when reasoning about whether the tail is
  a legal next move.
- When `wallsAreFatal` is false, the board wraps on both axes. Pathfinding
  changes should cover fatal-wall and wrapping behavior where relevant.

## Development And Validation

Install dependencies with `npm install` when needed. Useful commands:

```bash
npm start
npm test -- --runInBand --coverage=false path/to/focused.test.js
npm run int-test-ci -- --runInBand path/to/focused.int.js
npm run lint
npm run build
```

Prefer deterministic, focused unit tests for snake board-state regressions.
Use the randomized full-game and performance integration tests as secondary
validation; do not make a probabilistic score threshold the only proof of a
correctness fix.

The focused pathfinding tests currently pass but emit repeated React invalid
element warnings from `src/common/techTheme.jsx` under Jest's asset mocks. Do
not confuse those pre-existing warnings with a pathfinding failure.

## Change Workflow

- For bug fixes, reproduce the smallest board state in a failing test before
  changing solver behavior, then make the smallest implementation change that
  turns it green.
- Keep pathfinding behavior changes separate from broad UI, dependency, or
  state-model rewrites unless the task explicitly requires them.
- Preserve user work and unrelated untracked files. Inspect `git status` before
  editing and do not clean generated or personal files without permission.
- Prefer `rg` and `rg --files` for searches.
- Do not commit or push unless Drew explicitly asks.
- Keep secrets and personal/private working notes out of committed files.
