import { eatFood, move } from '../actions/gameAction';
import { RIGHT } from '../util/Direction';
import Position from '../util/Position';
import { parts } from './gameReducer';

const p = Position;
const board = { numRows: 4, numCols: 4, wallsAreFatal: true };

describe('snake growth', () => {
  const snake = [p(2, 1), p(1, 1), p(0, 1)];

  it('keeps the tail coordinate occupied for the move after eating', () => {
    const grownSnake = parts(snake, eatFood(3, 1));

    expect(grownSnake).toEqual([...snake, p(0, 1)]);

    const movedSnake = parts(grownSnake, move({ direction: RIGHT, ...board }));

    expect(movedSnake).toEqual([p(3, 1), p(2, 1), p(1, 1), p(0, 1)]);
  });

  it('vacates a unique tail coordinate during a normal move', () => {
    const movedSnake = parts(snake, move({ direction: RIGHT, ...board }));

    expect(movedSnake).toEqual([p(3, 1), p(2, 1), p(1, 1)]);
    expect(movedSnake).not.toContainEqual(p(0, 1));
  });
});
