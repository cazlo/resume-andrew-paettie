import { combineReducers } from 'redux';
import { createAction, createReducer } from '@reduxjs/toolkit';
import Action from '../actions/Action';

const pathNotFoundAction = createAction(Action.PATH_NOT_FOUND);
const gameOverAction = createAction(Action.GAME_OVER);
const finishPathFindAction = createAction(Action.FINISH_PATH_FIND);
const startPathFindAction = createAction(Action.START_PATH_FIND);

export const path = createReducer([], builder => {
  builder
    .addCase(pathNotFoundAction, () => [])
    .addCase(gameOverAction, () => [])
    .addCase(finishPathFindAction, (state, action) => action.payload);
});
export const grid = createReducer([], builder => {
  builder.addCase(startPathFindAction, (state, action) => action.payload);
});
export default combineReducers({
  path,
  grid,
});
