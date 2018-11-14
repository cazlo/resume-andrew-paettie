import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers';
import gameSaga from './sagas/gameSagas';
const sagaMiddleware = createSagaMiddleware();

export default function createStore() {
  const middleware = [...getDefaultMiddleware(), sagaMiddleware];
  const store = configureStore({
    reducer: rootReducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
  });
  sagaMiddleware.run(gameSaga);
  return store;
}