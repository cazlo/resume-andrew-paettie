import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';

import rootReducer from '../../reducers';
import { runGame } from '../gameSagas';
import Action from '../../actions/Action';

const createStore = (sagaMiddleware, food, algorithm) =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: {
      // s snapshot of a state which produced a weird edge case for A* only
      pathFinding: {
        path: [],
        grid: [],
      },
      game: {
        game: {
          state: 'PLAYING',
          speed: 0,
          score: 14,
          numCols: 6,
          numRows: 6,
          playerName: 'SKYNET',
          startTime: 1542753322831,
          endTime: 1542753318575,
          frameCount: 73,
          fps: 19,
          perfectScore: 35,
          frameTimeout: 215.83333333333334,
          computedFrameTimeout: 215.83333333333334,
          wallsAreFatal: true,
        },
        snake: {
          direction: {
            x: 0,
            y: 1,
          },
          parts: [
            // {
            //   x: 5,
            //   y: 6,
            // },
            {
              x: 5,
              y: 5,
            },
            {
              x: 5,
              y: 4,
            },
            {
              x: 4,
              y: 4,
            },
            {
              x: 4,
              y: 5,
            },
            {
              x: 3,
              y: 5,
            },
            {
              x: 3,
              y: 4,
            },
            {
              x: 3,
              y: 3,
            },
          ],
        },
        food,
        highScores: [],
      },
      aiConfig: {
        algorithm,
        showPath: false,
        playerName: 'SKYNET',
      },
    },
  });

const playGame = (food, algorithm) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(sagaMiddleware, food, algorithm);
  const saga = sagaMiddleware.run(() => runGame({ waitOnPlay: false, doReset: false }));
  return saga.toPromise().then(() => {
    // assertions
    const state = store.getState().game;
    const { game } = state;
    expect(game.state).toEqual(Action.GAME_OVER);
    expect(game.score).toBeGreaterThan(0);
    return { duration: game.endTime - game.startTime, score: game.score };
  });
};

describe('snake can accept the inevitability of death', () => {
  const aFood = [
    {
      x: 3,
      y: 2,
    },
  ];
  it("A* doesn't try to step outside of the world", () => playGame(aFood, Action.ALGORITHMS.astar), 10000);
  it("Greedy doesn't try to step outside of the world", () => playGame(aFood, Action.ALGORITHMS.greedy), 10000);
});

describe("snake doesn't care when there is no food", () => {
  const aFood = [];
  it('A* DGAF about food', () => playGame(aFood, Action.ALGORITHMS.astar), 10000);
  it('Greedy DGAF about food', () => playGame(aFood, Action.ALGORITHMS.greedy), 10000);
});

export default playGame;
