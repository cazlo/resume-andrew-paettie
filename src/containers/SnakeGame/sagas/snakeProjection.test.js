import { projectSnakeAlongPath } from './pathFindingSagas';
import { eatFood, move } from '../actions/gameAction';
import { RIGHT } from '../util/Direction';
import Position from '../util/Position';
import { parts } from '../reducers/gameReducer';

const p = Position;

describe('future snake projection', () => {
  const snake = [p(0, 0), p(0, 1), p(0, 2), p(0, 3)];

  it('projects a path shorter than the snake', () => {
    const path = [p(1, 0), p(2, 0)];

    expect(projectSnakeAlongPath(snake, path)).toEqual([p(2, 0), p(1, 0), p(0, 0), p(0, 1)]);
  });

  it('projects a path equal to the snake length', () => {
    const path = [p(1, 0), p(2, 0), p(3, 0), p(3, 1)];

    expect(projectSnakeAlongPath(snake, path)).toEqual([p(3, 1), p(3, 0), p(2, 0), p(1, 0)]);
  });

  it('projects a path longer than the snake', () => {
    const path = [p(1, 0), p(2, 0), p(3, 0), p(3, 1), p(2, 1)];

    expect(projectSnakeAlongPath(snake, path)).toEqual([p(2, 1), p(3, 1), p(3, 0), p(2, 0)]);
  });

  it('matches reducer move semantics for one step', () => {
    const board = { numRows: 4, numCols: 4, wallsAreFatal: true };
    const movedByReducer = parts(snake, move({ direction: RIGHT, ...board }));

    expect(projectSnakeAlongPath(snake, [p(1, 0)])).toEqual(movedByReducer);
  });

  it('matches reducer move-then-eat growth semantics', () => {
    const board = { numRows: 4, numCols: 4, wallsAreFatal: true };
    const movedByReducer = parts(snake, move({ direction: RIGHT, ...board }));
    const grownByReducer = parts(movedByReducer, eatFood(1, 0));

    const projected = projectSnakeAlongPath(snake, [p(1, 0)], { growsAtEnd: true });

    expect(projected).toEqual(grownByReducer);
    expect(projected).toHaveLength(snake.length + 1);
    expect(projected[projected.length - 1]).toEqual(projected[projected.length - 2]);
  });
});
