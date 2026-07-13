import { put, select } from 'redux-saga/effects';

import Action from '../actions/Action';
import { eatFood, move } from '../actions/gameAction';
import { RIGHT } from '../util/Direction';
import Position from '../util/Position';
import { snakeSaga } from './gameSagas';

const p = Position;

describe('snake game completion', () => {
  it('wins immediately after eating the final food', () => {
    const board = {
      numRows: 2,
      numCols: 2,
      frameTimeout: 100,
      frameCount: 3,
      wallsAreFatal: true,
      perfectScore: 3,
      score: 2,
    };
    const beforeMove = {
      game: {
        game: board,
        snake: {
          direction: RIGHT,
          parts: [p(0, 0), p(0, 1), p(1, 1)],
        },
        food: [p(1, 0)],
      },
    };
    const afterMove = {
      game: {
        ...beforeMove.game,
        snake: {
          ...beforeMove.game.snake,
          parts: [p(1, 0), p(0, 0), p(0, 1)],
        },
      },
    };

    const saga = snakeSaga();
    expect(saga.next().value).toEqual(select());
    expect(saga.next(beforeMove).value).toEqual(put(move({ direction: RIGHT, ...board })));
    expect(saga.next().value).toEqual(select());
    expect(saga.next(afterMove).value).toEqual(put(eatFood(1, 0)));

    const winEffect = saga.next().value;
    expect(winEffect.payload.action).toMatchObject({ type: Action.WON });
    expect(saga.next().done).toBe(true);
  });
});
