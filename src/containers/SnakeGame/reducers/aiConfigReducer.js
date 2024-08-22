import { combineReducers, createAction, createReducer } from '@reduxjs/toolkit';
import Action from '../actions/Action';

const defaultSettings = {
  algorithm: Action.ALGORITHMS.greedy,
  showPath: false,
  playerName: 'SKYNET',
};

const setAlgorithmAction = createAction(Action.SET_ALGORITHM);
const toggleShowPathAction = createAction(Action.TOGGLE_SHOW_PATH);
const changeNameAction = createAction(Action.CHANGE_NAME);

export const algorithm = createReducer(defaultSettings.algorithm, builder => {
  builder.addCase(setAlgorithmAction, (state, action) => action.algorithm);
});
export const showPath = createReducer(defaultSettings.showPath, builder => {
  builder.addCase(toggleShowPathAction, (state, action) => action.checked);
});
export const playerName = createReducer(defaultSettings.playerName, builder => {
  builder.addCase(changeNameAction, (state, action) => action.playerName);
});

export default combineReducers({
  algorithm,
  showPath,
  playerName,
});
