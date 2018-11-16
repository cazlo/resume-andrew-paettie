/* eslint-disable no-console */
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import createSagaMiddleware from 'redux-saga'
import * as Promise from 'bluebird';
import _ from 'lodash';

import Format from '../util/Format'
import rootReducer from '../reducers';
import { runGame } from './gameSagas';
import { play, setSize } from '../actions/gameAction';
import Action from '../actions/Action';

const createStore = (sagaMiddleware) => {
  const middleware = [...getDefaultMiddleware(), sagaMiddleware];
  return configureStore({
    reducer: rootReducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export const perfectScore =(size) => (size*size)-1;

export const playGame = ({ size }) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(sagaMiddleware);
  const saga = sagaMiddleware.run(runGame);
  store.dispatch(setSize({numRows:size, numCols:size}));
  store.dispatch(play());
  return saga.done.then(() => {
    // assertions
    const state = store.getState().game;
    const { game } = state;
    expect(game.state).toEqual(Action.GAME_OVER);
    expect(game.score).toBeGreaterThan(0);
    return({ duration: game.endTime - game.startTime, score: game.score })
  });
};

// here avgThreshold is expected to be the % of perfect score which should be achieved on avg
export const performanceTest = ({ gamesToSimulate, avgThreshold, size=10}) => {
  const threshold = perfectScore(size) * avgThreshold;
  return describe(`Performance criteria (${gamesToSimulate} games: ${threshold.toFixed(2)} avg score)`, () => {
    let results = [];
    let scores = [];
    beforeAll(async () => {
      results = await Promise.map(new Array(gamesToSimulate), () => playGame({size}));
      scores = results.map(s => s.score)
    }, 600000);

    it("average score at or above threshold", async () => {
      const avg = _.sum(scores) / gamesToSimulate;
      expect(avg).toBeGreaterThanOrEqual(threshold);
      console.log(`avg: ${avg}`);
      const avgD = (_.sum(results.map(r => r.duration)) / gamesToSimulate).toFixed(0);
      console.log(`avgDuration: ${Format.formatDuration(avgD)}`)
    });

    it("min is at least 2 (the worst game possible if there is input)", async () => {
      const min = _.min(scores);
      expect(min).toBeGreaterThanOrEqual(2);
      console.log(`min: ${min}`)
    });

    it("max is less than perfect score (sanity check)", async () => {
      const max = _.max(scores);
      expect(max).toBeLessThanOrEqual(perfectScore(size));
      console.log(`max: ${max}`)
    });
  });
};