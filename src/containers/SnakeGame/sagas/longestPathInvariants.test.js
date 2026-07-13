import { pathfind } from './pathFindingSagas';
import isLegalFirstMove, { areAdjacent } from './pathFindingTestUtils';
import Position from '../util/Position';

const p = Position;
const positionId = ({ x, y }) => `${x},${y}`;

const allPositions = ({ numRows, numCols }) =>
  [...Array(numRows).keys()].flatMap(y => [...Array(numCols).keys()].map(x => p(x, y)));

function* extendSnake(parts, length, board) {
  if (parts.length === length) {
    yield { parts };
    return;
  }
  const occupied = new Set(parts.map(positionId));
  const tail = parts[parts.length - 1];
  for (const neighbor of allPositions(board).filter(position => areAdjacent(tail, position, board))) {
    if (!occupied.has(positionId(neighbor))) {
      yield* extendSnake([...parts, neighbor], length, board);
    }
  }
}

function* snakesOnBoard(length, board) {
  for (const head of allPositions(board)) {
    yield* extendSnake([head], length, board);
  }
}

const expectValidTailPath = (snake, path, board) => {
  const tail = snake.parts[snake.parts.length - 1];
  const bodyIds = new Set(snake.parts.slice(1, -1).map(positionId));

  expect(isLegalFirstMove(snake, path[0], board)).toBe(true);
  expect(path[path.length - 1]).toEqual(expect.objectContaining(tail));
  expect(new Set(path.map(positionId))).toHaveProperty('size', path.length);
  expect(path.some(position => bodyIds.has(positionId(position)))).toBe(false);
  for (let index = 1; index < path.length; index += 1) {
    expect(areAdjacent(path[index - 1], path[index], board)).toBe(true);
  }
};

describe('expanded tail path invariants', () => {
  it('preserves path invariants and respects a four-expansion budget on an open board', () => {
    const board = { numRows: 10, numCols: 10, wallsAreFatal: true };
    const snake = { parts: [p(5, 5), p(5, 6)] };
    const tail = snake.parts[snake.parts.length - 1];
    const shortestPath = pathfind(snake, tail, board, true, true);
    const expandedPath = pathfind(snake, tail, board, true);

    expectValidTailPath(snake, expandedPath, board);
    expect(expandedPath.length - shortestPath.length).toBeLessThanOrEqual(8);
  });

  [
    { numRows: 3, numCols: 4, wallsAreFatal: true },
    { numRows: 3, numCols: 4, wallsAreFatal: false },
  ].forEach(board =>
    it(`preserves path invariants across bounded ${board.wallsAreFatal ? 'fatal' : 'wrapping'} states`, () => {
      let checked = 0;
      for (let length = 4; length <= 7 && checked < 250; length += 1) {
        for (const snake of snakesOnBoard(length, board)) {
          const tail = snake.parts[snake.parts.length - 1];
          const path = pathfind(snake, tail, board, true);
          if (path.length) {
            expectValidTailPath(snake, path, board);
          }
          checked += 1;
          if (checked === 250) {
            break;
          }
        }
      }
      expect(checked).toBe(250);
    }),
  );
});
