import _ from 'lodash';
import {  put, select, take, takeLatest } from 'redux-saga/effects';
import Easystarjs from 'easystarjs';

import Action from '../actions/Action';
import { changeDirection } from '../actions/gameAction';
import { finishPathFind, pathNotFound, startPathFind, ignoringStaleResult } from '../actions/pathFindingAction';
import Direction from '../util/Direction';
import GridState from '../util/GridState';
import Position from '../util/Position';
import PositionUtil from '../util/PositionUtil';

// eslint-disable-next-line new-cap
const aStar = new Easystarjs.js();

// todo the return values here are not actually used, only yield. this is weird
function* moveFromPath (path, snake, snakeDirection) {
  if (!path || (path && path.length === 0)) {
    return false;
  }
  const head = snake[0];
  const firstMove = path[1] || path[0]; // idx 0 is usually the current node the snake is on
  let directionsToMove = [];
  if (firstMove.x !== head.x) {
    if (firstMove.x < head.x) {
      directionsToMove.push(Direction.LEFT);
    } else {
      directionsToMove.push(Direction.RIGHT);
    }
  }
  if (firstMove.y !== head.y) {
    if (firstMove.y < head.y) {
      directionsToMove.push(Direction.UP);
    } else {
      directionsToMove.push(Direction.DOWN);
    }
  }
  if (directionsToMove.length) {
    // don't allow the snake to make a move that would eat itself
    if (snake.length > 1) {
      const validDs = directionsToMove.filter(d => !PositionUtil.oppositeDirection(d, snakeDirection));
      for (const directionToMove of validDs) {
        if (!validDs.length) {
          // console.log("No valid non-opposite direction moves found for path");
          yield put(ignoringStaleResult({ currentHead: head, direction: snakeDirection, pathHead: path[0] }));
          continue;
        }
        const newHeadPosition = Position(head.x + directionToMove.x, head.y + directionsToMove.y);
        const collisions = snake.filter(s => PositionUtil.isSamePosition(s, newHeadPosition));
        if (collisions.length) {
          // console.log("About to make move that would cause collision");
          yield put(ignoringStaleResult({ currentHead: head, direction: snakeDirection, pathHead: path[0] }));
        }else  if (PositionUtil.isSamePosition(snakeDirection, directionsToMove)) {
          // console.log("Ignore NOOP change direction");
        } else {
          yield put(changeDirection(directionToMove));
        }
      }
    } else {
      // not any need to do collision detection or avoid reversing direction if the snake's length
      // is exactly 1 (moving just a head has no restrictions within the game)
      yield put(changeDirection(directionsToMove[0]));
    }

  }
  // console.warn('Path is noop somehow');
  return false;
}

const increaseWeightOfNodesSurroundingSnake = (newSnake, grid) => {
  return _.reduce(
    newSnake,
    (accGrid, snake) => {
      const cloned = _.map(accGrid, _.clone);
      cloned[snake.y][snake.x] = GridState.OBSTRUCTED;
      // todo make the weights configurable based on current state select
      return PositionUtil.createSurroundingNodes(snake.x, snake.y, cloned);
    },
    grid,
  );
};

const pathFindPromise = ({
    newSnake, food, newGrid,
    nodesSurroundingSnakeCostMultiplier, normalNodeCostMultiplier
}) => new Promise(resolve => {
  const head = newSnake[0];

  aStar.setGrid(newGrid);
  const allowedStates = [GridState.WALKABLE, GridState.WALKABLE_PENALTY];
  aStar.setAcceptableTiles(allowedStates);
  // nodesSurroundingSnakeCostMultiplier
  // nodesInCurrentDirectionOfTravelCostMultiplier
  // normalNodeCostMultiplier
  aStar.setTileCost(GridState.WALKABLE_PENALTY, nodesSurroundingSnakeCostMultiplier);
  aStar.setTileCost(GridState.WALKABLE, normalNodeCostMultiplier);
  aStar.findPath(
    head.x,
    head.y,
    food.x,
    food.y,
    (path) => {
      resolve(path);
    },
  );
  aStar.calculate();
});

function* pathfind (newSnake, food, numRows, numCols, aiConfig){
  if (!newSnake[0]) {
    return;
  }
  // todo implement some kind of wrapping awareness
  // could probably just build up an extended array as such (assuming 0 is bad space and a 4x4 board):
  // | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
  // | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
  // | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
  // | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
  // | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
  // | 1 | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 1 | 0 | 0 | 1 |
  // | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
  // | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
  // | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
  // | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
  // | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
  // | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
  // so basically add 4 identical maps around each side of the original play area and make the
  // diagonals non-enterable

  const grid = _.map(_.range(numRows), () =>
    _.map(_.range(numCols), () => GridState.WALKABLE),
  );
  const newGrid =
    newSnake.length === 1 ? grid : increaseWeightOfNodesSurroundingSnake(newSnake, grid);
  yield put(startPathFind(newGrid));
  const path = yield pathFindPromise({
    ...aiConfig,
    newSnake, food, newGrid,
  });
  if (path === null || !path.length) {
    yield put(pathNotFound())
  } else {
    yield put(finishPathFind(path));
  }
}

export function* pathFindMover(action) {
  const s = yield select();
  const currentHead = s.game.snake.parts[0];
  const direction = s.game.snake.direction;
  const pathHead = action.payload[0];
  if (s.pathFinding.path.length && (pathHead.x !== currentHead.x && pathHead.y !== currentHead.y)){
    yield put(ignoringStaleResult({currentHead, direction, pathHead}));
  } else {
    yield moveFromPath(s.pathFinding.path, s.game.snake.parts, direction);
  }
}

export function* pathFindingSaga() {
  yield takeLatest(finishPathFind.toString(),  pathFindMover);
  while (true) {
    yield take([Action.MOVE]);
    const state = yield select();
    if (state.aiConfig.enableAI) {
      const snake = state.game.snake.parts;
      const food = state.game.food;
      const { numRows, numCols } = state.game.game;
      if (food.length > 1){
        // console.warn("TOO MUCH FOOD!!!")
      }else if (food.length === 0){
        // console.warn("No food found to path find to");
        // todo survival mode?
        continue;
      }
      yield pathfind(snake, food[0], numRows, numCols, state.aiConfig);
      // const s = yield select();
      // yield takeLatest(
      //   finishPathFind.toString(),
      //   moveFromPath, s.pathFinding.path, s.game.snake.parts[0]
      // );
      // yield moveFromPath(s.pathFinding.path, s.game.snake.parts[0]
    }
  }
}