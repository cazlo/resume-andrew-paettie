import { combineReducers } from 'redux';
import { createAction, createReducer } from '@reduxjs/toolkit';
import Action from '../actions/Action';

const pathNotFoundAction = createAction(Action.PATH_NOT_FOUND);
const gameOverAction = createAction(Action.GAME_OVER);
const wonAction = createAction(Action.WON);
const finishPathFindAction = createAction(Action.FINISH_PATH_FIND);
const startPathFindAction = createAction(Action.START_PATH_FIND);
const setGreedySolverStateAction = createAction(Action.SET_GREEDY_SOLVER_STATE);
const resetAction = createAction(Action.RESET);
const setAlgorithmAction = createAction(Action.SET_ALGORITHM);

export const path = createReducer([], builder => {
  builder
    .addCase(pathNotFoundAction, () => [])
    .addCase(gameOverAction, () => [])
    .addCase(wonAction, () => [])
    .addCase(finishPathFindAction, (state, action) => action.payload);
});
export const grid = createReducer([], builder => {
  builder.addCase(startPathFindAction, (state, action) => action.payload);
});
export const greedySolverState = createReducer(null, builder => {
  builder
    .addCase(setGreedySolverStateAction, (state, action) => action.payload)
    .addCase(resetAction, () => null)
    .addCase(setAlgorithmAction, () => null);
});
export default combineReducers({
  path,
  grid,
  greedySolverState,
});
