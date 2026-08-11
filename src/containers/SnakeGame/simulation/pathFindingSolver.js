import {
  pathfindGreedy,
  directionFromPath,
  findSurvivalDirection,
  pathfindGreedyWithRecovery,
  pathfindHamiltonian,
  pathfindHamiltonianShortcut,
} from '../sagas/pathFindingSagas';

const stableOrder = neighbors => neighbors;

const createGreedyPathFindingSolver =
  ({ orderSurvivalNeighbors = stableOrder } = {}) =>
  state => {
    const path = pathfindGreedy(state.snake, state.food, state.board);
    if (path && path.length) {
      const direction = directionFromPath(path, state.snake.parts, state.board);
      return direction ? { direction } : null;
    }

    const direction = findSurvivalDirection(state.snake, state.board, orderSurvivalNeighbors);
    return direction ? { direction } : null;
  };

export const createGreedyRecoveryPathFindingSolver =
  ({ orderSurvivalNeighbors = stableOrder } = {}) =>
  state => {
    const { path, solverState } = pathfindGreedyWithRecovery(state.snake, state.food, state.board, {
      frameCount: state.frameCount,
      score: state.score,
      solverState: state.solverState,
    });
    if (path && path.length) {
      const direction = directionFromPath(path, state.snake.parts, state.board);
      return direction ? { direction, solverState } : null;
    }

    const direction = findSurvivalDirection(state.snake, state.board, orderSurvivalNeighbors);
    return direction ? { direction, solverState } : null;
  };

export const createHamiltonianPathFindingSolver = () => state => {
  const path = pathfindHamiltonian(state.snake, state.food, state.board);
  if (!path.length) return null;
  const direction = directionFromPath(path, state.snake.parts, state.board);
  return direction ? { direction } : null;
};

export const createHamiltonianShortcutPathFindingSolver = () => state => {
  const path = pathfindHamiltonianShortcut(state.snake, state.food, state.board);
  if (!path.length) return null;
  const direction = directionFromPath(path, state.snake.parts, state.board);
  return direction ? { direction } : null;
};

export default createGreedyPathFindingSolver;
