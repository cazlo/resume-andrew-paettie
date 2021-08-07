import { combineReducers, createReducer } from '@reduxjs/toolkit';
import Action from '../actions/Action';

const defaultSettings = {
  aStar: false,
  showPath: false,
  greedy: true,
  playerName: 'SKYNET',
};

export const aStar = createReducer(defaultSettings.aStar, {
  [Action.TOGGLE_ENABLE_A_STAR]: (state, action) => action.checked,
  [Action.TOGGLE_GREEDY]: (state, action) => (action.checked ? false : state),
});
export const showPath = createReducer(defaultSettings.showPath, {
  [Action.TOGGLE_SHOW_PATH]: (state, action) => action.checked,
});

export const greedy = createReducer(defaultSettings.greedy, {
  [Action.TOGGLE_GREEDY]: (state, action) => action.checked,
  [Action.TOGGLE_ENABLE_A_STAR]: (state, action) => (action.checked ? false : state),
});
export const playerName = createReducer(defaultSettings.playerName, {
  [Action.CHANGE_NAME]: (state, action) => action.playerName,
});
export default combineReducers({
  aStar,
  showPath,
  greedy,
  playerName,
});
