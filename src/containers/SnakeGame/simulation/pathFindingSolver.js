import { directionFromPath, findSurvivalDirection, pathfindGreedy } from '../sagas/pathFindingSagas';

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

export default createGreedyPathFindingSolver;
