import _ from 'lodash';
import { put, select } from 'redux-saga/effects';
import createGraph from 'ngraph.graph';
import * as pathFinder from 'ngraph.path';
import { changeDirection } from '../actions/gameAction';
import { finishPathFind, pathNotFound, setGreedySolverState } from '../actions/pathFindingAction';
import { LEFT, RIGHT, UP, DOWN } from '../util/Direction';
import PositionUtil from '../util/PositionUtil';
import { computePerfectScore } from '../reducers/gameReducer';
import Action from '../actions/Action';
import {
  buildHamiltonianCycle,
  findCycleSafeNextPosition,
  findCycleShortcutNextPosition,
  isSnakeCycleOrdered,
} from './cycleSafePathFinding';
import findPathToHamiltonianCycle from './greedyRecoveryPathFinding';

const getNeighboringNodeDirections = ({ x, y, numRows, numCols, wallsAreFatal }) => {
  const left = wallsAreFatal && x - 1 < 0 ? null : { x: x - 1 < 0 ? numCols - 1 : x - 1, y, direction: LEFT };
  const right =
    wallsAreFatal && x + 1 > numCols - 1 ? null : { x: x + 1 > numCols - 1 ? 0 : x + 1, y, direction: RIGHT };
  const up = wallsAreFatal && y - 1 < 0 ? null : { y: y - 1 < 0 ? numRows - 1 : y - 1, x, direction: UP };
  const down = wallsAreFatal && y + 1 > numRows - 1 ? null : { y: y + 1 > numRows - 1 ? 0 : y + 1, x, direction: DOWN };
  const validDirections = [];
  if (left) validDirections.push(left);
  if (right) validDirections.push(right);
  if (up) validDirections.push(up);
  if (down) validDirections.push(down);
  return validDirections;
};

export const directionFromPath = (path, snake, { numRows, numCols, wallsAreFatal }) => {
  if (!path || (path && path.length === 0)) {
    return null;
  }
  const head = snake[0];
  const firstMove = path[0];
  const neighbors = getNeighboringNodeDirections({
    x: head.x,
    y: head.y,
    numRows,
    numCols,
    wallsAreFatal,
  });
  for (const n of neighbors) {
    if (firstMove.x === n.x && firstMove.y === n.y) {
      return n.direction;
    }
  }
  // console.log("No neighbors found to move to!")
  return null;
};

export const moveFromPath = (path, snake, board) => {
  const direction = directionFromPath(path, snake, board);
  return direction ? put(changeDirection(direction)) : null;
};

const positionId = ({ x, y }) => `x${x}y${y}`;

export const buildOccupancyCounts = parts => {
  const counts = new Map();
  for (const part of parts) {
    const id = positionId(part);
    counts.set(id, (counts.get(id) || 0) + 1);
  }
  return counts;
};

const willTailMove = (parts, occupancyCounts = buildOccupancyCounts(parts)) => {
  const tail = parts[parts.length - 1];
  return tail && occupancyCounts.get(positionId(tail)) === 1;
};

export const projectSnakeAlongPath = (parts, path, { growsAtEnd = false } = {}) => {
  if (!parts.length) {
    return [];
  }
  const projected = path.reduce((current, nextHead) => [nextHead, ...current.slice(0, -1)], [...parts]);
  return growsAtEnd ? [...projected, projected[projected.length - 1]] : projected;
};

const getNeighboringNodes = ({ x, y, numRows, numCols, wallsAreFatal }) => {
  const left = wallsAreFatal && x - 1 < 0 ? null : { x: x - 1 < 0 ? numCols - 1 : x - 1, y };
  const right = wallsAreFatal && x + 1 > numCols - 1 ? null : { x: x + 1 > numCols - 1 ? 0 : x + 1, y };
  const up = wallsAreFatal && y - 1 < 0 ? null : { y: y - 1 < 0 ? numRows - 1 : y - 1, x };
  const down = wallsAreFatal && y + 1 > numRows - 1 ? null : { y: y + 1 > numRows - 1 ? 0 : y + 1, x };

  return {
    left: left ? positionId(left) : left,
    right: right ? positionId(right) : right,
    up: up ? positionId(up) : up,
    down: down ? positionId(down) : down,
  };
};

const findLongestPathReduce = graph => (path, p1, idx) => {
  const { didExpand, pathSoFar, totalExpansions, numRows, numCols, wallsAreFatal } = path;
  if (didExpand) {
    return path;
  } // only allow one path modification per run
  if (pathSoFar[idx + 1]) {
    const p2 = pathSoFar[idx + 1];
    // see if we can expand both of these nodes in the any direction
    //  criteria:
    //    they are connected (the difference between their coords is one of the unit vectors)
    //    they are not occupied with snake (will mean suboptimal path but easier stuff later)
    //    the node attempting to be expanded to is not already in the path
    const p1Neighbors = getNeighboringNodes({
      ...p1.data.position,
      numRows,
      numCols,
      wallsAreFatal,
    });
    const p2Neighbors = getNeighboringNodes({
      ...p2.data.position,
      numRows,
      numCols,
      wallsAreFatal,
    });

    for (const d of ['left', 'up', 'right', 'down']) {
      if (
        p1Neighbors[d] &&
        graph.getLink(p1.id, p1Neighbors[d]) &&
        p2Neighbors[d] &&
        graph.getLink(p2.id, p2Neighbors[d])
      ) {
        const p1N = graph.getNode(p1Neighbors[d]);
        const p2N = graph.getNode(p2Neighbors[d]);
        if (graph.getLink(p1N.id, p2N.id) || graph.getLink(p2N.id, p1N.id)) {
          const inPathSoFar = pathSoFar.filter(p => p.id === p1N.id || p.id === p2N.id);
          if (!inPathSoFar.length) {
            pathSoFar.splice(idx + 1, 0, p1N, p2N);
            return {
              ...path,
              didExpand: true,
              totalExpansions: totalExpansions + 1,
              pathSoFar,
            };
          }
        }
      }
    }
  }
  return path;
};

// this computes the shortest distance taking into account wrapping of the playarea
// const computeBestDistance = (dx, width) => {
//   return Math.min(Math.abs(dx), Math.abs(dx + width), Math.abs(dx - width));
// };
//
// const heuristic = (fromNode, toNode, numRows, numCols) => {
//   const dx = fromNode.data.x - toNode.data.x;
//   const dy = fromNode.data.y - toNode.data.y;
//   const modifiedDx = computeBestDistance(dx, numCols);
//   const modifiedDy = computeBestDistance(dy, numRows);
//
//   return Math.sqrt(modifiedDx * modifiedDx + modifiedDy * modifiedDy);
// };

const graph = createGraph();
// todo add weighting to the stuff somehow (custom heuristic for use in heuristic fn?)
const searcher = pathFinder.nba(graph, {
  // distance: (from, to) => distance(from, to, numRows, numCols),
  // heuristic: (from, to) => heuristic(from, to, numRows, numCols),
});

const recordMetric = (metrics, name, value = 1) => {
  if (metrics) {
    Object.assign(metrics, { [name]: (metrics[name] || 0) + value });
  }
};

export const pathfind = (
  snake,
  goal,
  { numRows, numCols, wallsAreFatal, metrics, blockedPositions = [] },
  allowTail = false,
  returnEarly = false,
) => {
  if (!snake.parts[0]) {
    return [];
  }
  const [head, ...tailParts] = snake.parts;
  const tail = snake.parts[snake.parts.length - 1];
  const occupancyCounts = buildOccupancyCounts(snake.parts);
  const blockedPositionIds = new Set(blockedPositions.map(positionId));
  // EAT_FOOD duplicates the tail, so a repeated tail coordinate remains occupied through the next MOVE.
  const canMoveIntoTail = willTailMove(snake.parts, occupancyCounts);
  if (wallsAreFatal && (head.x < 0 || head.x >= numCols || head.y < 0 || head.y >= numRows)) {
    // don't attempt pathfinding if we are already out of bounds
    return [];
  }
  const graphBuildStarted = metrics ? performance.now() : 0;
  graph.clear();
  // create a node for each x,y position in the play area
  for (let x = 0; x < numCols; x += 1) {
    for (let y = 0; y < numRows; y += 1) {
      const position = { x, y };
      const posId = positionId(position);
      const isHead = head.x === x && head.y === y;
      const isSnake = occupancyCounts.has(posId) || blockedPositionIds.has(posId);
      const isTail = tail.x === x && tail.y === y;
      graph.addNode(posId, { position, isSnake, isHead, isTail });
    }
  }
  // link up the nodes
  graph.forEachNode(node => {
    const { position, isSnake, isHead } = node.data;
    const nodeId = positionId(position);
    const { left, right, up, down } = getNeighboringNodes({
      ...position,
      numRows,
      numCols,
      wallsAreFatal,
    });
    const linksToAdd = [];
    if (isHead) {
      // here need to add links to everything except for nodes which are themselves snakes
      for (const neighbor of [left, right, up, down]) {
        if (neighbor && !graph.getNode(neighbor).data.isSnake) {
          linksToAdd.push(neighbor);
        }
      }
    } else if (isSnake) {
      // tail sections need no links
    } else {
      for (const neighbor of [left, right, up, down]) {
        if (neighbor) {
          const neighborNode = graph.getNode(neighbor).data;
          if (!neighborNode.isSnake || neighborNode.isHead) {
            linksToAdd.push(neighbor);
          }
        }
      }
    }
    for (const link of linksToAdd) {
      graph.addLink(nodeId, link);
    }
  });
  if (tailParts.length > 0 && allowTail) {
    const tailPart = tailParts[tailParts.length - 1];
    const tailId = positionId(tailPart);
    const { left, right, up, down } = getNeighboringNodes({
      ...tailPart,
      numRows,
      numCols,
      wallsAreFatal,
    });
    for (const neighbor of [left, right, up, down]) {
      if (neighbor) {
        const neighborNode = graph.getNode(neighbor).data;
        if (
          neighborNode &&
          (!neighborNode.isSnake || neighborNode.isHead) &&
          (canMoveIntoTail || !neighborNode.isHead)
        ) {
          graph.addLink(tailId, neighbor);
        }
      }
    }
  }

  recordMetric(metrics, 'graphBuildCount');
  recordMetric(metrics, 'graphBuildDurationMs', metrics ? performance.now() - graphBuildStarted : 0);
  recordMetric(metrics, 'pathExpansionCount', 0);
  recordMetric(metrics, 'expansionDurationMs', 0);
  const searchStarted = metrics ? performance.now() : 0;
  const path = searcher.find(positionId(goal), positionId(head));
  recordMetric(metrics, 'searchCount');
  recordMetric(metrics, 'searchDurationMs', metrics ? performance.now() - searchStarted : 0);
  if (path.length >= 2 && allowTail && !returnEarly) {
    const expansionStarted = metrics ? performance.now() : 0;
    let modifiedPath = {
      didExpand: false,
      pathSoFar: path,
      totalExpansions: 0,
      numRows,
      numCols,
    };
    do {
      modifiedPath = _.reduce(path, findLongestPathReduce(graph), {
        ...modifiedPath,
        didExpand: false,
        wallsAreFatal,
      });
    } while (modifiedPath.didExpand && modifiedPath.totalExpansions < 4);
    recordMetric(metrics, 'pathExpansionCount', modifiedPath.totalExpansions);
    recordMetric(metrics, 'expansionDurationMs', metrics ? performance.now() - expansionStarted : 0);
    // since we really only care about the first move, most of the "longest path"
    // will not matter for this context, so break early to avoid unnecessary computations

    const pathPositions = _.map(modifiedPath.pathSoFar, p => p.data.position);
    if (pathPositions.length && pathPositions[0].x === head.x && pathPositions[0].y === head.y) {
      return pathPositions.slice(1);
    }
    // console.log("first point in path is not head")

    return pathPositions;
  }
  const pathPositions = _.map(path, p => p.data.position);
  if (pathPositions.length && pathPositions[0].x === head.x && pathPositions[0].y === head.y) {
    return pathPositions.slice(1);
  }
  return pathPositions;
};

// if it has no food to pathfind to, just try not to collide with itself
export const findSurvivalDirection = (
  snake,
  { numRows, numCols, wallsAreFatal },
  orderNeighbors = neighbors => _.shuffle(neighbors),
) => {
  const head = snake.parts[0];
  const tail = snake.parts[snake.parts.length - 1];
  const occupancyCounts = buildOccupancyCounts(snake.parts);
  const canMoveIntoTail = willTailMove(snake.parts, occupancyCounts);
  const neighbors = getNeighboringNodeDirections({
    x: head.x,
    y: head.y,
    numRows,
    numCols,
    wallsAreFatal,
  });
  for (const n of orderNeighbors(neighbors)) {
    const isOccupied = occupancyCounts.has(positionId(n));
    const isVacatingTail = canMoveIntoTail && PositionUtil.isSamePosition(n, tail);
    if (!isOccupied || isVacatingTail) {
      return n.direction;
    }
  }
  // console.log("No neighbors found to move to for survival mode")
  return null;
};

export const survivalMode = (snake, board) => {
  const direction = findSurvivalDirection(snake, board);
  return direction ? put(changeDirection(direction)) : null;
};

const isFood = (point, food) => point && food && point.x === food.x && point.y === food.y;

export const tryPathFindingToTail = (
  snake,
  { numRows, numCols, wallsAreFatal, metrics },
  { returnEarly = false, lookForAlternates = false, food } = {},
) => {
  let pathToTail = pathfind(
    snake,
    snake.parts[snake.parts.length - 1],
    { numRows, numCols, wallsAreFatal, metrics },
    true,
    returnEarly,
  );
  if (food && pathToTail.some(point => isFood(point, food))) {
    pathToTail = pathfind(
      snake,
      snake.parts[snake.parts.length - 1],
      { numRows, numCols, wallsAreFatal, metrics, blockedPositions: [food] },
      true,
      returnEarly,
    );
  }
  if (!pathToTail || pathToTail.length <= 0) {
    return [];
  }
  if (pathToTail && pathToTail.length === 1 && lookForAlternates) {
    // todo it looks like this behavior should happen even if the length is up to like 5 or so :|
    // try and see if there is any other safe move that can be made other than directly chasing the tail
    // this sometimes has the effect of removing cycles at the end of the game
    const [head] = snake.parts;
    const neighbors = getNeighboringNodeDirections({
      x: head.x,
      y: head.y,
      numRows,
      numCols,
      wallsAreFatal,
    });
    const occupancyCounts = buildOccupancyCounts(snake.parts);
    for (const n of neighbors) {
      if (!occupancyCounts.has(positionId(n))) {
        const newSnake = projectSnakeAlongPath(snake.parts, [{ x: n.x, y: n.y }]);
        // as an optimization we don't need to do the longest path search here; SP is good enough
        // todo this doesn't seem needed anymore
        const pathToShiftedSnakeTail = pathfind(
          { parts: newSnake },
          newSnake[newSnake.length - 1],
          { numRows, numCols, wallsAreFatal, metrics },
          true,
          returnEarly,
        );
        if (pathToShiftedSnakeTail.length >= 1 && !isFood(n, food)) {
          // console.log("Found alternate path to tail...");
          // todo it would be better to collect up these choices and compare them to pathToTail
          //  maybe only take alternative if it moves you further away from food the the tail?
          return [{ x: n.x, y: n.y }];
        }
      }
    }
  }
  return pathToTail;
};

export const pathfindGreedy = (snake, food, { numRows, numCols, wallsAreFatal, metrics }) => {
  if (!food) {
    return [];
  }
  if (snake.parts[0].x === food.x && snake.parts[0].y === food.y && snake.parts.length >= 4) {
    return tryPathFindingToTail(snake, { numRows, numCols, wallsAreFatal, metrics });
  }
  const pathToFood = pathfind(snake, food, { numRows, numCols, wallsAreFatal, metrics });
  if (pathToFood === null || !pathToFood.length) {
    return tryPathFindingToTail(snake, { numRows, numCols, wallsAreFatal, metrics }, { lookForAlternates: true, food });
  }
  if (snake.parts.length >= 4) {
    if (snake.parts.length === computePerfectScore(numRows, numCols)) {
      // don't need to worry about path out if this is the winning move...
      // console.log("YOLO")
      return pathToFood;
    }
    const newSnake = projectSnakeAlongPath(snake.parts, pathToFood, { growsAtEnd: true });
    // as an optimization we don't need to do the longest path search here; SP is good enough
    // todo this doesn't seem needed anymore
    const pathToShiftedSnakeTail = tryPathFindingToTail(
      { parts: newSnake },
      { numRows, numCols, wallsAreFatal, metrics },
    );
    if (pathToShiftedSnakeTail.length > 1) {
      return pathToFood;
    }
    // if (pathToShiftedSnakeTail.length === 1
    //       && snake.parts.length >= computePerfectScore(numCols, numRows)*0.95
    //       && Math.random() <= 0.33){
    //   // todo shift 1 more time and see if there is still a path to the tail
    //   // note in this situation the tail won't move in the shifted snake
    //   //  if there is a path to this new thing with length >=1 then this move is legit and return it
    //   //  else return pathfinding to the tail
    //   console.log("1 path to shifted tail - YOLO")
    //   return pathToFood;
    // }
    return tryPathFindingToTail(snake, { numRows, numCols, wallsAreFatal, metrics }, { lookForAlternates: true, food });
  }
  return pathToFood;
};

const createGreedySolverState = (solverState, score) => {
  const previous = solverState || { lastScore: score, mode: 'greedy', stalledFrames: 0 };
  return {
    ...previous,
    lastScore: score,
    stalledFrames: previous.lastScore === score ? previous.stalledFrames + 1 : 0,
  };
};

const remainingRecoveryPath = (path, head) =>
  path && path.length && PositionUtil.isSamePosition(path[0], head) ? path.slice(1) : path || [];

export const pathfindGreedyWithRecovery = (
  snake,
  food,
  { numRows, numCols, wallsAreFatal, metrics },
  { frameCount = 0, score = snake.parts.length - 1, solverState } = {},
) => {
  const board = { numRows, numCols, wallsAreFatal };
  const area = numRows * numCols;
  const cycle = buildHamiltonianCycle(board);
  let nextSolverState = createGreedySolverState(solverState, score);
  const recoveryCycle = cycle && nextSolverState.cycleDirection === 'reverse' ? [...cycle].reverse() : cycle;
  const isOrdered = recoveryCycle && isSnakeCycleOrdered(snake.parts, recoveryCycle);

  if (nextSolverState.mode === 'recovery') {
    const recoveryPath = remainingRecoveryPath(nextSolverState.recoveryPath, snake.parts[0]);
    if (!isOrdered && recoveryPath.length) {
      return { path: recoveryPath, solverState: { ...nextSolverState, recoveryPath } };
    }
    nextSolverState = { ...nextSolverState, recoveryPath };
  }

  if (nextSolverState.mode === 'cycle' || (nextSolverState.mode === 'recovery' && isOrdered)) {
    const next = findCycleShortcutNextPosition(snake, food, board, {
      reverse: nextSolverState.cycleDirection === 'reverse',
    });
    if (next) {
      return { path: [next], solverState: { ...nextSolverState, mode: 'cycle', recoveryPath: [] } };
    }
    nextSolverState = { ...nextSolverState, mode: 'greedy', recoveryPath: [] };
  }

  const greedyPath = pathfindGreedy(snake, food, { ...board, metrics });
  const reachesFood = greedyPath.length > 0 && PositionUtil.isSamePosition(greedyPath[greedyPath.length - 1], food);
  let riskDetected = false;
  if (snake.parts.length >= Math.ceil(area * 0.5) && reachesFood && nextSolverState.riskCheckedScore !== score) {
    const projected = projectSnakeAlongPath(snake.parts, greedyPath, { growsAtEnd: true });
    // This is a cheap conservative probe. Exhausting the small budget enters
    // recovery early; it never certifies an unsafe projected body as safe.
    riskDetected = !findPathToHamiltonianCycle({ parts: projected }, null, board, { maxNodes: 500 });
    nextSolverState = { ...nextSolverState, riskCheckedScore: score };
  }

  const recoveryRetryFrames = area;
  const stalled =
    nextSolverState.stalledFrames >= area &&
    frameCount - (nextSolverState.lastRecoveryAttemptFrame || 0) >= recoveryRetryFrames;
  if (riskDetected || stalled) {
    nextSolverState = { ...nextSolverState, lastRecoveryAttemptFrame: frameCount };
    // Wrapping and larger boards add enough branching to make the 6x6 proof
    // budget visibly pause the UI without improving the measured cohorts.
    const recoveryMaxNodes = wallsAreFatal && area <= 36 ? 50000 : 1000;
    const recovery = findPathToHamiltonianCycle(snake, food, board, { maxNodes: recoveryMaxNodes });
    if (recovery) {
      const recoveryState = {
        ...nextSolverState,
        cycleDirection: recovery.cycleDirection,
        mode: recovery.path.length ? 'recovery' : 'cycle',
        recoveryPath: recovery.path,
      };
      if (recovery.path.length) return { path: recovery.path, solverState: recoveryState };
      const next = findCycleShortcutNextPosition(snake, food, board, {
        reverse: recovery.cycleDirection === 'reverse',
      });
      if (next) return { path: [next], solverState: recoveryState };
    }
  }

  return { path: greedyPath, solverState: { ...nextSolverState, mode: 'greedy', recoveryPath: [] } };
};

export const pathfindHamiltonian = (snake, food, { numRows, numCols, wallsAreFatal }) => {
  const nextPosition = findCycleSafeNextPosition(snake, food, { numRows, numCols, wallsAreFatal });
  return nextPosition ? [nextPosition] : [];
};

export const pathfindHamiltonianShortcut = (snake, food, { numRows, numCols, wallsAreFatal }) => {
  const nextPosition = findCycleShortcutNextPosition(snake, food, { numRows, numCols, wallsAreFatal });
  return nextPosition ? [nextPosition] : [];
};

export function* pathFindingSaga() {
  // while (true) {
  //   yield take([Action.MOVE_FINISHED]);
  const state = yield select();
  if (state.aiConfig.algorithm === Action.ALGORITHMS.astar) {
    const { snake } = state.game;
    const { food } = state.game;
    const { numRows, numCols, wallsAreFatal } = state.game.game;
    if (food.length > 1) {
      // console.warn("TOO MUCH FOOD!!!")
    } else if (food.length === 0) {
      // this case doesn't seem to happen because of the current order of events
      // leaving here in case this chages in the future...
      yield survivalMode(snake, { numRows, numCols, wallsAreFatal });
      return; // don't do logic which requires food being present
    }
    const head = snake.parts[0];
    if (PositionUtil.isSamePosition(head, food[0])) {
      yield survivalMode(snake, { numRows, numCols, wallsAreFatal });
    } else {
      // here hoping at least most of the time pathfind will return before the board state changes
      // because of a tick/move or something similar
      const path = pathfind(snake, food[0], {
        numRows,
        numCols,
        wallsAreFatal,
      });
      if (path === null || !path.length) {
        yield put(pathNotFound());
        yield survivalMode(snake, { numRows, numCols, wallsAreFatal });
      } else {
        yield put(finishPathFind(path));
        yield moveFromPath(path, snake.parts, {
          numRows,
          numCols,
          wallsAreFatal,
        });
      }
    }
  } else if (state.aiConfig.algorithm === Action.ALGORITHMS.greedy) {
    const { snake } = state.game;
    const { food } = state.game;
    const { numRows, numCols, wallsAreFatal } = state.game.game;
    const pathToFood = pathfindGreedy(snake, food[0], { numRows, numCols, wallsAreFatal });
    if (pathToFood === null || !pathToFood.length) {
      yield put(pathNotFound());
      yield survivalMode(snake, { numRows, numCols, wallsAreFatal });
    } else {
      yield put(finishPathFind(pathToFood));
      yield moveFromPath(pathToFood, snake.parts, {
        numRows,
        numCols,
        wallsAreFatal,
      });
    }
  } else if (state.aiConfig.algorithm === Action.ALGORITHMS.greedyRecovery) {
    const { snake } = state.game;
    const { food } = state.game;
    const { numRows, numCols, wallsAreFatal, frameCount, score } = state.game.game;
    const { path: pathToFood, solverState } = pathfindGreedyWithRecovery(
      snake,
      food[0],
      { numRows, numCols, wallsAreFatal },
      { frameCount, score, solverState: state.pathFinding.greedySolverState },
    );
    yield put(setGreedySolverState(solverState));
    if (pathToFood === null || !pathToFood.length) {
      yield put(pathNotFound());
      yield survivalMode(snake, { numRows, numCols, wallsAreFatal });
    } else {
      yield put(finishPathFind(pathToFood));
      yield moveFromPath(pathToFood, snake.parts, {
        numRows,
        numCols,
        wallsAreFatal,
      });
    }
  } else if (state.aiConfig.algorithm === Action.ALGORITHMS.hamiltonian) {
    const { snake } = state.game;
    const { food } = state.game;
    const { numRows, numCols, wallsAreFatal } = state.game.game;
    const path = pathfindHamiltonian(snake, food[0], { numRows, numCols, wallsAreFatal });
    if (!path.length) {
      yield put(pathNotFound());
      yield survivalMode(snake, { numRows, numCols, wallsAreFatal });
    } else {
      yield put(finishPathFind(path));
      yield moveFromPath(path, snake.parts, { numRows, numCols, wallsAreFatal });
    }
  } else if (state.aiConfig.algorithm === Action.ALGORITHMS.hamiltonianShortcut) {
    const { snake } = state.game;
    const { food } = state.game;
    const { numRows, numCols, wallsAreFatal } = state.game.game;
    const path = pathfindHamiltonianShortcut(snake, food[0], { numRows, numCols, wallsAreFatal });
    if (!path.length) {
      yield put(pathNotFound());
      yield survivalMode(snake, { numRows, numCols, wallsAreFatal });
    } else {
      yield put(finishPathFind(path));
      yield moveFromPath(path, snake.parts, { numRows, numCols, wallsAreFatal });
    }
  }
  // }
}
