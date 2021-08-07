import _ from 'lodash';
import GridState from './GridState';

const isSamePosition = (position1, position2) => position1.x === position2.x && position1.y === position2.y;

const isColliding = (position, snake) =>
  snake.reduce((acc, snakeLocation) => {
    if (acc) {
      return acc;
    }
    return isSamePosition(snakeLocation, position);
  }, false);

const createSurroundingNodes = (x, y, grid) => {
  const newGrid = _.map(grid, _.clone);
  if (newGrid[y + 1] && Number.isInteger(newGrid[y + 1][x])) {
    newGrid[y + 1][x] = newGrid[y + 1][x] === GridState.WALKABLE ? GridState.WALKABLE_PENALTY : newGrid[y + 1][x];
  }
  if (newGrid[y + 1] && Number.isInteger(newGrid[y + 1][x + 1])) {
    newGrid[y + 1][x + 1] =
      newGrid[y + 1][x + 1] === GridState.WALKABLE ? GridState.WALKABLE_PENALTY : newGrid[y + 1][x + 1];
  }
  if (newGrid[y] && Number.isInteger(newGrid[y][x + 1])) {
    newGrid[y][x + 1] = newGrid[y][x + 1] === GridState.WALKABLE ? GridState.WALKABLE_PENALTY : newGrid[y][x + 1];
  }
  if (newGrid[y - 1] && Number.isInteger(newGrid[y - 1][x + 1])) {
    newGrid[y - 1][x + 1] =
      newGrid[y - 1][x + 1] === GridState.WALKABLE ? GridState.WALKABLE_PENALTY : newGrid[y - 1][x + 1];
  }
  if (newGrid[y - 1] && Number.isInteger(newGrid[y - 1][x - 1])) {
    newGrid[y - 1][x - 1] =
      newGrid[y - 1][x - 1] === GridState.WALKABLE ? GridState.WALKABLE_PENALTY : newGrid[y - 1][x - 1];
  }
  if (newGrid[y] && Number.isInteger(newGrid[y][x - 1])) {
    newGrid[y][x - 1] = newGrid[y][x - 1] === GridState.WALKABLE ? GridState.WALKABLE_PENALTY : newGrid[y][x - 1];
  }
  return newGrid;
};

const ateItself = snake => {
  const head = snake[0];
  return snake.slice(1).reduce((acc, bodyPiece) => {
    if (acc) {
      return acc;
    }
    return isSamePosition(head, bodyPiece);
  }, false);
};

// is the cell's position inside the grid?
const isWithinPlayArea = (cell, numCols, numRows) => cell.x > -1 && cell.y > -1 && cell.x < numCols && cell.y < numRows;

const oppositeDirection = (d1, d2) => d1.x + d2.x === 0 && d1.y + d2.y === 0;

export default {
  isColliding,
  isSamePosition,
  createSurroundingNodes,
  ateItself,
  isWithinPlayArea,
  oppositeDirection,
};
