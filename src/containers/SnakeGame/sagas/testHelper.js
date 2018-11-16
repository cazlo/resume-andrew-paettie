import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import createSagaMiddleware from 'redux-saga'

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

export const SIZE = 20;
export const PERFECT_SCORE = (SIZE*SIZE)-1;

export const playGame = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(sagaMiddleware);
  const saga = sagaMiddleware.run(runGame);
  store.dispatch(play());
  store.dispatch(setSize({numRows:SIZE, numCols:SIZE}));
  return saga.done.then(() => {
    // assertions
    const state = store.getState().game;
    const { game } = state;
    expect(game.state).toEqual(Action.GAME_OVER);
    expect(game.score).toBeGreaterThan(0);
    return({ duration: game.endTime - game.startTime, score: game.score })
  });
};