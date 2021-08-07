import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import Action from '../actions/Action';

export const path = createReducer([], {
  [Action.PATH_NOT_FOUND]: () => [],
  [Action.GAME_OVER]: () => [],
  [Action.TOGGLE_ENABLE_A_STAR]: () => [],
  [Action.TOGGLE_GREEDY]: () => [],
  [Action.FINISH_PATH_FIND]: (state, action) => action.payload,
});
export const grid = createReducer([], {
  [Action.START_PATH_FIND]: (state, action) => action.payload,
});
export default combineReducers({
  path,
  grid,
});
