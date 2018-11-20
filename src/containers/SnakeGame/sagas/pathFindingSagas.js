import _ from 'lodash';
import {  put, select, take } from 'redux-saga/effects';
import createGraph from "ngraph.graph";
import * as pathFinder from "ngraph.path";
import Action from '../actions/Action';
import { changeDirection } from '../actions/gameAction';
import { finishPathFind, pathNotFound } from '../actions/pathFindingAction';
import Direction from '../util/Direction';
import PositionUtil from '../util/PositionUtil';

const getNeighboringNodeDirections = ({x,y, numRows, numCols, wallsAreFatal}) => {
  const left = (wallsAreFatal && x-1 < 0) ? null : {x: x-1 < 0 ? numCols-1 : x-1, y, direction: Direction.LEFT};
  const right = (wallsAreFatal && x+1 > numCols-1) ? null : {x: x+1 > numCols-1 ? 0 : x+1, y, direction: Direction.RIGHT};
  const up = (wallsAreFatal && y-1 < 0) ? null : {y: y-1 < 0 ? numRows-1 : y-1,x, direction: Direction.UP};
  const down = (wallsAreFatal && y+1 > numRows-1) ? null : {y: y+1 > numRows-1 ? 0 : y+1,x, direction: Direction.DOWN};
  const validDirections = [];
  if (left) validDirections.push(left);
  if (right) validDirections.push(right);
  if (up) validDirections.push(up);
  if (down) validDirections.push(down);
  return validDirections
};

// todo the return values here are not actually used, only yield. this is weird
export function* moveFromPath (path, snake, {numRows, numCols, wallsAreFatal}) {
  if (!path || (path && path.length === 0)) {
    return;
  }
  const head = snake[0];
  const firstMove =  path[0];
  const neighbors = getNeighboringNodeDirections({x:head.x, y:head.y, numRows, numCols, wallsAreFatal});
  for (const n of neighbors){
    if (firstMove.x === n.x && firstMove.y === n.y){
      yield put(changeDirection(n.direction));
    }
  }

}

const positionId = ({x,y}) => (`x${x}y${y}`);

const findLongestPathReduce = (path, p1, idx) => {
  const {didExpand, pathSoFar, totalExpansions, numRows, numCols, wallsAreFatal } = path;
  if (didExpand){ return path; }// only allow one path modification per run
  if (pathSoFar[idx+1]){
    const p2 = pathSoFar[idx+1];
    // see if we can expand both of these nodes in the any direction
    //  criteria:
    //    they are connected (the difference between their coords is one of the unit vectors)
    //    they are not occupied with snake (will mean suboptimal path but easier stuff later)
    //    the node attempting to be expanded to is not already in the path
    const p1Neighbors = getNeighboringNodes({...p1.data.position, numRows, numCols, wallsAreFatal});
    const p2Neighbors = getNeighboringNodes({...p2.data.position, numRows, numCols, wallsAreFatal});

    // try and move up
    for (const d of ["up","down","left","right"]) {
      if (p1Neighbors[d] && graph.getLink(p1.id, p1Neighbors[d]) &&  p2Neighbors[d] && graph.getLink(p2.id, p2Neighbors[d])) {
        const p1N = graph.getNode(p1Neighbors[d]);
        const p2N = graph.getNode(p2Neighbors[d]);
        if (graph.getLink(p1N.id, p2N.id) || graph.getLink(p2N.id, p1N.id)) {
          const inPathSoFar = pathSoFar.filter(p => p.id === p1N.id || p.id === p2N.id);
          if (!inPathSoFar.length) {
            pathSoFar.splice(idx+1, 0, p1N, p2N);
            return {
              ...path,
              didExpand: true,
              totalExpansions: totalExpansions + 1,
              pathSoFar,
            }
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

const getNeighboringNodes = ({x,y, numRows, numCols, wallsAreFatal}) => {
  const left = (wallsAreFatal && x-1 < 0) ? null : {x: x-1 < 0 ? numCols-1 : x-1, y};
  const right = (wallsAreFatal && x+1 > numCols-1) ? null : {x: x+1 > numCols-1 ? 0 : x+1, y};
  const up = (wallsAreFatal && y-1 < 0) ? null : {y: y-1 < 0 ? numRows-1 : y-1,x};
  const down = (wallsAreFatal && y+1 > numRows-1) ? null : {y: y+1 > numRows-1 ? 0 : y+1,x};

  return {
    left:  left ? positionId(left): left,
    right: right ? positionId(right): right,
    up:    up ? positionId(up): up,
    down:  down ? positionId(down): down,
  }
};

const graph = createGraph();
// todo add weighting to the stuff somehow (custom heuristic for use in heuristic fn?)
const searcher = pathFinder.nba(graph, {
  // distance: (from, to) => distance(from, to, numRows, numCols),
  // heuristic: (from, to) => heuristic(from, to, numRows, numCols),
});

export const pathfind = (snake, food, {numRows, numCols, wallsAreFatal}, allowTail = false, returnEarly = false) => {
  if (!snake.parts[0]) {
    return [];
  }
  const [head, ...tailParts] = snake.parts;
  const tail = snake.parts[snake.parts.length-1];

  graph.clear();
  // create a node for each x,y position in the play area
  for (let x = 0; x < numCols; x+=1){
    for (let y = 0; y < numRows; y+=1){
      const position = {x,y};
      const posId = positionId(position);
      const matchingSnake = _.filter(tailParts, t => t.x === x && t.y === y);//todo may want to dictionary this for O(1)
      const isHead = head.x === x && head.y === y;
      const isSnake = matchingSnake.length > 0 || isHead;
      const isTail = tail.x === x && tail.y === y;
      graph.addNode(posId, { position, isSnake, isHead, isTail });
    }
  }
  // link up the nodes
  graph.forEachNode((node) => {
    const { position, isSnake, isHead } = node.data;
    const nodeId = positionId(position);
    const { left, right, up, down } = getNeighboringNodes({...position, numRows, numCols, wallsAreFatal});
    const linksToAdd = [];
    if (isHead){
      // here need to add links to everything except for nodes which are themselves snakes
      for (const neighbor of [left, right, up, down]){
        if (neighbor && !graph.getNode(neighbor).data.isSnake){
          linksToAdd.push(neighbor);
        }
      }
    } else if (isSnake) {
      // tail sections need no links
    } else {
      for (const neighbor of [left, right, up, down]){
        if (neighbor) {
          const neighborNode = graph.getNode(neighbor).data;
          if (!neighborNode.isSnake || neighborNode.isHead) {
            linksToAdd.push(neighbor);
          }
        }
      }
    }
    for (const link of linksToAdd){
      graph.addLink(nodeId, link);
    }
  });
  if (tailParts.length > 0 && allowTail) {
    const tailPart = tailParts[tailParts.length - 1];
    const tailId = positionId(tailPart);
    const { left, right, up, down } = getNeighboringNodes({...tailPart, numRows, numCols, wallsAreFatal});
    for (const neighbor of [left, right, up, down]){
      if (neighbor) {
        const neighborNode = graph.getNode(neighbor).data;
        if (neighborNode && (!neighborNode.isSnake || neighborNode.isHead)) {
          graph.addLink(tailId, neighbor);
        }
      }
    }
  }

  const path = searcher.find(positionId(food), positionId(head));
  if (path.length >= 2 && allowTail && !returnEarly){
    let modifiedPath = {didExpand:false, pathSoFar:path, totalExpansions:0, numRows, numCols };
    do {
      modifiedPath = _.reduce(path, findLongestPathReduce, {...modifiedPath, didExpand:false, wallsAreFatal});
    }while(modifiedPath.didExpand && modifiedPath.totalExpansions < 4);
    // since we really only care about the first move, most of the "longest path"
    // will not matter for this context, so break early to avoid unnecessary computations

    const pathPositions = _.map(modifiedPath.pathSoFar, p => p.data.position);
    if (pathPositions.length && pathPositions[0].x===head.x && pathPositions[0].y===head.y){
      return pathPositions.slice(1);
    }
    return pathPositions;
  }

  const pathPositions = _.map(path, p => p.data.position);
  if (pathPositions.length && pathPositions[0].x===head.x && pathPositions[0].y===head.y){
    return pathPositions.slice(1);
  }
  return pathPositions;
};

// if it has no food to pathfind to, just try not to collide with itself
export function* survivalMode(snake, {numRows, numCols, wallsAreFatal}) {
  const head = snake.parts[0];
  const neighbors = getNeighboringNodeDirections({x:head.x, y:head.y, numRows, numCols, wallsAreFatal});
  for (const n of neighbors){
    const snakeMatches = snake.parts.filter(s => s.x === n.x && s.y === n.y);
    if (!snakeMatches.length){
      yield put(changeDirection(n.direction));
    }
  }
}

export const tryPathFindingToTail = (snake, {numRows, numCols, wallsAreFatal}, returnEarly = false) => {
  const pathToTail = pathfind(snake, snake.parts[snake.parts.length-1],{numRows, numCols, wallsAreFatal}, true, returnEarly);
  if (!pathToTail || pathToTail.length <= 0) {
    // const head = snake.parts[0];
    // const neighbors = getNeighboringNodeDirections({x:head.x, y:head.y, numRows, numCols});
    // for (const n of neighbors){
    //   // todo weigh this choice somehow, e.g. prefer moving away from food
    //   const snakeMatches = snake.parts.filter(s => s.x === n.x && s.y === n.y);
    //   if (!snakeMatches.length){
    //     return [n];
    //   }
    // }
    return [];
  } else {
    return pathToTail;
  }
};

export const pathfindGreedy = (snake, food, {numRows, numCols, wallsAreFatal}) => {
  if (!food){return[];}
  if (snake.parts[0].x === food.x && snake.parts[0].y === food.y
      && snake.parts.length >= 4){
    return tryPathFindingToTail(snake, {numRows, numCols, wallsAreFatal});
  }
  const pathToFood = pathfind(snake, food, {numRows, numCols, wallsAreFatal});
  if (pathToFood === null || !pathToFood.length) {
    return tryPathFindingToTail(snake, {numRows, numCols, wallsAreFatal});
  } else if (snake.parts.length >= 4) {
    if (snake.parts.length >= (numRows*numCols*0.9) && pathToFood.length === 1){
      // console.log("NOM> NOM> NOM>");
      // get more risky as the body fills up more to avoid infinite looping
      return pathToFood;
    }
    const snakeArr = _.clone(snake.parts);
    const snakeLen = snakeArr.length;
    let newSnake;
    const reversedPath = _.reverse(_.clone(pathToFood));
    if (pathToFood.length >= snakeLen){
      newSnake = reversedPath.slice(0, snakeLen)
    } else {
      newSnake = [...reversedPath, ...snakeArr].slice(0, snakeLen);
    }
    // as an optimization we don't need to do the longest path search here; SP is good enough
    const pathToShiftedSnakeTail = tryPathFindingToTail({ parts: newSnake }, {numRows, numCols, wallsAreFatal}, true);
    if (pathToShiftedSnakeTail.length > 1){
      return pathToFood;
    }else{
      return tryPathFindingToTail(snake, {numRows, numCols, wallsAreFatal});
    }
  } else {
    return pathToFood;
  }
};

export function* pathFindingSaga() {
  while (true) {
    yield take([Action.MOVE]);
    const state = yield select();
    if (state.aiConfig.aStar) {
      const snake = state.game.snake;
      const food = state.game.food;
      const { numRows, numCols, wallsAreFatal } = state.game.game;
      if (food.length > 1){
        // console.warn("TOO MUCH FOOD!!!")
      }else if (food.length === 0){
        // this case doesn't seem to happen because of the current order of events
        // leaving here in case this chages in the future...
        yield survivalMode(snake, {numRows, numCols, wallsAreFatal})
      }
      const head = snake.parts[0];
      if (PositionUtil.isSamePosition(head, food[0])){
        yield survivalMode(snake, {numRows, numCols, wallsAreFatal})
      } else {
        // here hoping at least most of the time pathfind will return before the board state changes
        // because of a tick/move or something similar
        const path = pathfind(snake, food[0], {numRows, numCols, wallsAreFatal});
        if (path === null || !path.length) {
          yield put(pathNotFound());
          yield survivalMode(snake, {numRows, numCols, wallsAreFatal})
        } else {
          yield put(finishPathFind(path));
          yield moveFromPath(path, snake.parts, {numRows, numCols, wallsAreFatal});
        }
      }
    } else if (state.aiConfig.greedy) {
      const snake = state.game.snake;
      const food = state.game.food;
      const { numRows, numCols, wallsAreFatal } = state.game.game;
      const pathToFood = pathfindGreedy(snake, food[0], {numRows, numCols, wallsAreFatal});
      if (pathToFood === null || !pathToFood.length) {
        yield put(pathNotFound());
        yield survivalMode(snake, {numRows, numCols, wallsAreFatal})
      } else {
        yield put(finishPathFind(pathToFood));
        yield moveFromPath(pathToFood, snake.parts, { numRows, numCols, wallsAreFatal});
      }
    }
  }
}