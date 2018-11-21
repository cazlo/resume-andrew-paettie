/* eslint-disable no-console */
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import createSagaMiddleware from 'redux-saga'
import * as Promise from 'bluebird';
import _ from 'lodash';

import Format from '../../util/Format'
import rootReducer from '../../reducers/index';
import { runGame } from '../gameSagas';
import { play, setSize, setFrameLimit, toggleWallsAreFatal } from '../../actions/gameAction';
import Action from '../../actions/Action';
import { computePerfectScore } from '../../reducers/gameReducer';

const createStore = (sagaMiddleware) => {
  const middleware = [...getDefaultMiddleware(), sagaMiddleware];
  return configureStore({
    reducer: rootReducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
  });
};


export const playGame = ({ size, aiAction, limit, wallsAreFatal = false }) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(sagaMiddleware);
  const saga = sagaMiddleware.run(() => runGame({}));
  store.dispatch(setSize({numRows:size, numCols:size}));
  store.dispatch(aiAction({target:{checked:true}}));
  if (limit) {
    store.dispatch(setFrameLimit({limit}))
  }
  store.dispatch(toggleWallsAreFatal({target:{checked:wallsAreFatal}}))
  store.dispatch(play());
  return saga.done.then(() => {
    // assertions
    const state = store.getState().game;
    const { game } = state;
    expect(game.state).toEqual(Action.GAME_OVER);
    expect(game.score).toBeGreaterThan(0);
    if (limit) {
      expect(game.frameCount).toBeLessThanOrEqual(limit + 1);//allow it to go 1 tick beyond
    }
    return({ duration: game.endTime - game.startTime, score: game.score })
  });
};

// here avgThreshold is expected to be the % of perfect score which should be achieved on avg
export const performanceTest = ({ gamesToSimulate, avgThreshold, size=10, aiAction, name}) => {
  const threshold = computePerfectScore(size,size) * avgThreshold;
  return describe(name, () => {
    let results = [];
    let scores = [];
    beforeAll(async () => {
      results = await Promise.map(new Array(gamesToSimulate), () => playGame({size, aiAction}), {concurrency:5});
      scores = results.map(s => s.score)
    }, 60000);

    it("average score at or above threshold", async () => {
      const avg = _.sum(scores) / gamesToSimulate;
      expect(avg).toBeGreaterThanOrEqual(threshold);
      console.log(`${name} ${size}X${size} avg: ${avg}`);
      const avgD = (_.sum(results.map(r => r.duration)) / gamesToSimulate).toFixed(0);
      console.log(`${name} ${size}X${size} avgDuration: ${Format.formatDuration(avgD)}`)
    });

    it("min is at least 2 (the worst game possible if there is input)", async () => {
      const min = _.min(scores);
      expect(min).toBeGreaterThanOrEqual(2);
      console.log(`${name} ${size}X${size} min: ${min}`)
    });

    it("max is less than perfect score (sanity check)", async () => {
      const max = _.max(scores);
      expect(max).toBeLessThanOrEqual(computePerfectScore(size,size));
      console.log(`${name} ${size}X${size} max: ${max}`)
    });
  });
};