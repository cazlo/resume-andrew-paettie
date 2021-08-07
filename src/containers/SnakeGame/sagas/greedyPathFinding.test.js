import { pathfindGreedy } from './pathFindingSagas';
import Position from '../util/Position';

const p = Position; // alias because 'Position' it is long

describe('Path finding trap avoidance', () => {
  [
    {
      name: '5x4 approaching trap',
      snake: {
        parts: [p(1, 1), p(2, 1), p(3, 1), p(4, 1), p(4, 2), p(4, 3), p(3, 3), p(2, 3), p(1, 3), p(0, 3)],
      },
      food: p(2, 2),
    },
    {
      name: '5x4 right in front of food trap',
      snake: {
        parts: [p(1, 2), p(1, 1), p(2, 1), p(3, 1), p(4, 1), p(4, 2), p(4, 3), p(3, 3), p(2, 3), p(1, 3), p(0, 3)],
      },
      food: p(2, 2),
    },
    {
      name: '5x4 obvious trap',
      snake: {
        parts: [p(1, 1), p(2, 1), p(3, 1), p(4, 1), p(4, 2), p(4, 3), p(3, 3), p(2, 3), p(1, 3), p(0, 3)],
      },
      food: p(3, 2),
    },
    // todo trap to food and no path to tail
  ].map(({ snake, food, name }, idx) =>
    it(`${name} (${idx})`, () => {
      // does not try and wrap around when that move is blocked by the snake itself
      const path = pathfindGreedy(snake, food, {
        numRows: 4,
        numCols: 5,
        wallsAreFatal: false,
      });
      expect(path).toBeDefined();
      expect(path.length).toBeGreaterThanOrEqual(1);
      expect(path[path.length - 1]).not.toEqual(expect.objectContaining(food));
    }),
  );
});
