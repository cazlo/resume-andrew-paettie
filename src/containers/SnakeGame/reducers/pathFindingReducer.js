import Action from '../actions/Action'
import { combineReducers } from 'redux';
import { createReducer } from 'redux-starter-kit';

export const path = createReducer([], {
  [Action.PATH_NOT_FOUND]: () => [],
  [Action.GAME_OVER]: () => [],
  [Action.TOGGLE_ENABLE_A_STAR]: () => [],
  [Action.TOGGLE_GREEDY_SP_TAIL]: () => [],
  [Action.FINISH_PATH_FIND]: (state, action) => action.payload,
});
export const grid = createReducer([], {
  [Action.START_PATH_FIND]: (state, action) => action.payload,
});
export default combineReducers({
  path,
  grid
});