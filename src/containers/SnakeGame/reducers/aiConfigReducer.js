import { combineReducers, createReducer } from '@reduxjs/toolkit';
import Action from '../actions/Action';

const defaultSettings = {
  algorithm: Action.ALGORITHMS.greedy,
  showPath: false,
  playerName: 'SKYNET',
};

export const algorithm = createReducer(defaultSettings.algorithm, {
  [Action.SET_ALGORITHM]: (state, action) => action.algorithm,
});
export const showPath = createReducer(defaultSettings.showPath, {
  [Action.TOGGLE_SHOW_PATH]: (state, action) => action.checked,
});
export const playerName = createReducer(defaultSettings.playerName, {
  [Action.CHANGE_NAME]: (state, action) => action.playerName,
});

export default combineReducers({
  algorithm,
  showPath,
  playerName,
});
