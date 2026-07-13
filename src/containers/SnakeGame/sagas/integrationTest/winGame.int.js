import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import Action from '../../actions/Action';
import rootReducer from '../../reducers';
import { RIGHT } from '../../util/Direction';
import GameState from '../../util/GameState';
import Position from '../../util/Position';
import { runGame } from '../gameSagas';

const p = Position;

describe('perfect-score completion', () => {
  it('ends the game as won immediately after the final food', async () => {
    const sagaMiddleware = createSagaMiddleware();
    const store = configureStore({
      reducer: rootReducer,
      middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sagaMiddleware),
      preloadedState: {
        pathFinding: {
          path: [],
          grid: [],
        },
        game: {
          game: {
            state: GameState.PLAYING,
            speed: 0,
            score: 2,
            numCols: 2,
            numRows: 2,
            playerName: 'SKYNET',
            startTime: 1000,
            endTime: null,
            frameCount: 0,
            fps: 0,
            perfectScore: 3,
            frameTimeout: 100,
            computedFrameTimeout: 100,
            wallsAreFatal: true,
          },
          snake: {
            direction: RIGHT,
            parts: [p(0, 0), p(0, 1), p(1, 1)],
          },
          food: [p(1, 0)],
          highScores: [],
        },
        aiConfig: {
          algorithm: Action.ALGORITHMS.none,
          showPath: false,
          playerName: 'SKYNET',
        },
      },
    });

    await sagaMiddleware.run(() => runGame({ waitOnPlay: false, doReset: false })).toPromise();

    const { game } = store.getState().game;
    expect(game.state).toBe(GameState.WON);
    expect(game.score).toBe(game.perfectScore);
    expect(store.getState().game.snake.parts).toHaveLength(4);
    expect(store.getState().game.food).toEqual([]);
    expect(game.endTime).not.toBeNull();
    expect(store.getState().game.highScores[0].score).toBe(game.perfectScore);
  });
});
