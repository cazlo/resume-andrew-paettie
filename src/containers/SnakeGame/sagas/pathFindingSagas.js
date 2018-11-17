import _ from 'lodash';
import {  put, select, take } from 'redux-saga/effects';
import createGraph from "ngraph.graph";
import * as pathFinder from "ngraph.path";
import Action from '../actions/Action';
import { changeDirection } from '../actions/gameAction';
import { finishPathFind, pathNotFound } from '../actions/pathFindingAction';
import Direction from '../util/Direction';
import PositionUtil from '../util/PositionUtil';

const getNeighboringNodeDirections = ({x,y, numRows, numCols}) => ([{
    x: x-1 < 0 ? numRows-1 : x-1,
    y,
    direction: Direction.LEFT
  },
  {
    x: x+1 > numRows-1 ? 0 : x+1,
    y,
    direction: Direction.RIGHT
  },
  {
    y: y-1 < 0 ? numCols-1 : y-1,
    x,
    direction: Direction.UP
  },
  {
    y: y+1 > numCols-1 ? 0 : y+1,
    x,
    direction: Direction.DOWN
  }
]);

// todo the return values here are not actually used, only yield. this is weird
export function* moveFromPath (path, snake, snakeDirection, numRows, numCols) {
  if (!path || (path && path.length === 0)) {
    return;
  }
  const head = snake[0];
  const firstMove =  path[0];
  const neighbors = getNeighboringNodeDirections({x:head.x, y:head.y, numRows, numCols});
  for (const n of neighbors){
    if (firstMove.x === n.x && firstMove.y === n.y){
      yield put(changeDirection(n.direction));
    }
  }

}

const positionId = ({x,y}) => (`x${x}y${y}`);

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

const getNeighboringNodes = ({x,y, numRows, numCols}) => ({
  left: positionId({
    x: x-1 < 0 ? numRows-1 : x-1,
    y
  }),
  right: positionId({
    x: x+1 > numRows-1 ? 0 : x+1,
    y
  }),
  up: positionId({
    y: y-1 < 0 ? numCols-1 : y-1,
    x
  }),
  down: positionId({
    y: y+1 > numCols-1 ? 0 : y+1,
    x
  })
});

const graph = createGraph();
// todo add weighting to the stuff somehow (custom heuristic for use in heuristic fn?)
const searcher = pathFinder.nba(graph, {
  // distance: (from, to) => distance(from, to, numRows, numCols),
  // heuristic: (from, to) => heuristic(from, to, numRows, numCols),
});

export const pathfind = (snake, food, numRows, numCols, allowTail = false) => {
  if (!snake.parts[0]) {
    return [];
  }
  const [head, ...tailParts] = snake.parts;

  graph.clear();
  // create a node for each x,y position in the play area
  for (let x = 0; x < numRows; x+=1){
    for (let y = 0; y < numCols; y+=1){
      const position = {x,y};
      const posId = positionId(position);
      const matchingSnake = _.filter(tailParts, t => t.x === x && t.y === y);//todo may want to dictionary this for O(1)
      const isHead = head.x === x && head.y === y;
      const isSnake = matchingSnake.length > 0 || isHead;
      graph.addNode(posId, { position, isSnake, isHead });
    }
  }
  // link up the nodes
  graph.forEachNode((node) => {
    const { position, isSnake, isHead } = node.data;
    const nodeId = positionId(position);
    const { left, right, up, down } = getNeighboringNodes({...position, numRows, numCols});
    const linksToAdd = [];
    if (isHead){
      // here need to add links to everything except for nodes which are themselves snakes
      for (const neighbor of [left, right, up, down]){
        if (!graph.getNode(neighbor).data.isSnake){
          linksToAdd.push(neighbor);
        }
      }
    } else if (isSnake) {
      // tail sections need no links
    } else {
      for (const neighbor of [left, right, up, down]){
        const neighborNode = graph.getNode(neighbor).data;
        if (!neighborNode.isSnake || neighborNode.isHead){
          linksToAdd.push(neighbor);
        }
      }
    }
    for (const link of linksToAdd){
      graph.addLink(nodeId, link);
    }
  });
  if (tailParts.length > 0 && allowTail) {
    const tail = tailParts[tailParts.length - 1];
    const tailId = positionId(tail);
    const { left, right, up, down } = getNeighboringNodes({...tail, numRows, numCols});
    for (const neighbor of [left, right, up, down]){
      const neighborNode = graph.getNode(neighbor).data;
      if (!neighborNode.isSnake || neighborNode.isHead){
        graph.addLink(tailId, neighbor);
      }
    }
  }

  const path = searcher.find(positionId(food), positionId(head));
  const pathPositions = _.map(path, p => p.data.position);
  if (pathPositions.length && pathPositions[0].x===head.x && pathPositions[0].y===head.y){
    return pathPositions.slice(1);
  }
  return pathPositions;
};

// if it has no food to pathfind to, just try not to collide with itself
export function* survivalMode(snake, numRows, numCols) {
  const head = snake.parts[0];
  const neighbors = getNeighboringNodeDirections({x:head.x, y:head.y, numRows, numCols});
  for (const n of neighbors){
    const snakeMatches = snake.parts.filter(s => s.x === n.x && s.y === n.y);
    if (!snakeMatches.length){
      yield put(changeDirection(n.direction));
    }
  }
}

const tryPathFindingToTail = (snake, numRows, numCols) => {
  const pathToTail = pathfind(snake, snake.parts[snake.parts.length-1], numRows, numCols, true);
  if (!pathToTail || pathToTail.length <=1) {
    const head = snake.parts[0];
    const neighbors = getNeighboringNodeDirections({x:head.x, y:head.y, numRows, numCols});
    for (const n of neighbors){
      // todo weigh this choice somehow, e.g. prefer moving away from food
      const snakeMatches = snake.parts.filter(s => s.x === n.x && s.y === n.y);
      if (!snakeMatches.length){
        return [n];
      }
    }
    // console.log("no neighbor fallback found :(");
    return [];
  } else {
    return pathToTail;
  }
};

export const pathfindGreedy = (snake, food, numRows, numCols) => {
  const pathToFood = pathfind(snake, food, numRows, numCols);
  if (pathToFood === null || !pathToFood.length) {
    return tryPathFindingToTail(snake, numRows, numCols);
  } else if (snake.parts.length >= 5 ) {
    const snakeArr = _.clone(snake.parts);
    const snakeLen = snakeArr.length;
    let newSnake;
    const reversedPath = _.reverse(_.clone(pathToFood));
    if (pathToFood.length >= snakeLen){
      newSnake = reversedPath.slice(0, snakeLen)
    } else {
      newSnake = [...reversedPath, ...snakeArr].slice(0, snakeLen);
    }
    const pathToShiftedSnakeTail = tryPathFindingToTail({ parts: newSnake }, numRows, numCols);
    if (pathToShiftedSnakeTail.length > 1){
      return pathToFood;
    }else{
      return tryPathFindingToTail(snake, numRows, numCols);
    }
  } else {
    return pathToFood;
  }
};

export function* pathFindingSaga() {
  while (true) {
    yield take([Action.MOVE]);
    const state = yield select();
    if (state.aiConfig.enableAI) {
      const snake = state.game.snake;
      const food = state.game.food;
      const { numRows, numCols } = state.game.game;
      if (food.length > 1){
        // console.warn("TOO MUCH FOOD!!!")
      }else if (food.length === 0){
        // this case doesn't seem to happen because of the current order of events
        // leaving here in case this chages in the future...
        yield survivalMode(snake, numRows, numCols)
      }
      const head = snake.parts[0];
      if (PositionUtil.isSamePosition(head, food[0])){
        yield survivalMode(snake, numRows, numCols)
      } else {
        // here hoping at least most of the time pathfind will return before the board state changes
        // because of a tick/move or something similar
        const path = pathfind(snake, food[0], numRows, numCols);
        if (path === null || !path.length) {
          yield put(pathNotFound());
          yield survivalMode(snake, numRows, numCols)
        } else {
          yield put(finishPathFind(path));
          yield moveFromPath(path, snake.parts, state.game.snake.direction, numRows, numCols);
        }
      }
    } else if (state.aiConfig.greedyShortestPathToTail) {
      const snake = state.game.snake;
      const food = state.game.food;
      const { numRows, numCols } = state.game.game;
      const pathToFood = pathfindGreedy(snake, food[0], numRows, numCols);
      if (pathToFood === null || !pathToFood.length) {
        yield put(pathNotFound());
        yield survivalMode(snake, numRows, numCols)
      } else {
        yield put(finishPathFind(pathToFood));
        yield moveFromPath(pathToFood, snake.parts, state.game.snake.direction, numRows, numCols);
      }
    }
  }
}