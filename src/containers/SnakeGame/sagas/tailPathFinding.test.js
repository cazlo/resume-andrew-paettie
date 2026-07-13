import { pathfind, pathfindGreedy, tryPathFindingToTail } from './pathFindingSagas';
import Position from '../util/Position';

const p = Position;

describe('stationary tail path finding', () => {
  const fatalBoard = { numRows: 4, numCols: 4, wallsAreFatal: true };

  it('rejects an adjacent duplicated tail that is the only apparent exit', () => {
    const tail = p(1, 2);
    const snake = {
      parts: [p(1, 1), p(2, 1), p(2, 0), p(1, 0), p(0, 0), p(0, 1), p(0, 2), tail, tail],
    };

    expect(tryPathFindingToTail(snake, fatalBoard)).toEqual([]);
  });

  it('takes a longer route to a duplicated tail when one is available', () => {
    const tail = p(1, 2);
    const snake = {
      parts: [p(1, 1), p(1, 0), p(0, 0), p(0, 1), p(0, 2), tail, tail],
    };

    const path = pathfind(snake, tail, fatalBoard, true, true);

    expect(path.length).toBeGreaterThan(1);
    expect(path[0]).not.toEqual(expect.objectContaining(tail));
    expect(path[path.length - 1]).toEqual(expect.objectContaining(tail));
  });

  it('preserves a direct move into a unique tail that will vacate', () => {
    const tail = p(1, 2);
    const snake = {
      parts: [p(1, 1), p(1, 0), p(0, 0), p(0, 1), p(0, 2), tail],
    };

    expect(pathfind(snake, tail, fatalBoard, true, true)).toEqual([expect.objectContaining(tail)]);
  });

  it('rejects a direct wrapped move into a duplicated tail', () => {
    const tail = p(3, 1);
    const snake = {
      parts: [p(0, 1), p(0, 2), p(1, 2), p(1, 1), p(1, 0), p(0, 0), p(3, 0), tail, tail],
    };
    const wrappingBoard = { numRows: 3, numCols: 4, wallsAreFatal: false };

    expect(pathfind(snake, tail, wrappingBoard, true, true)).toEqual([]);
  });

  it('does not let the greedy solver choose a duplicated tail as its next move', () => {
    const tail = p(1, 2);
    const snake = {
      parts: [p(1, 1), p(2, 1), p(2, 0), p(1, 0), p(0, 0), p(0, 1), p(0, 2), tail, tail],
    };

    const path = pathfindGreedy(snake, p(3, 3), fatalBoard);

    expect(path[0]).not.toEqual(expect.objectContaining(tail));
  });
});
