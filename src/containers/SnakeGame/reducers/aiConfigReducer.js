import Action from "../actions/Action"
import { combineReducers, createReducer } from 'redux-starter-kit';

const defaultSettings = {
  enableAI : false,
  greedyShortestPathToTail: true,
  playerName: "SKYNET",
};

export const enableAI = createReducer(defaultSettings.enableAI, {
  [Action.TOGGLE_ENABLE_A_STAR]: (state, action) => action.checked,
  [Action.TOGGLE_GREEDY_SP_TAIL]: (state, action) => action.checked ? false : state,
});
export const greedyShortestPathToTail = createReducer(defaultSettings.greedyShortestPathToTail, {
  [Action.TOGGLE_GREEDY_SP_TAIL]: (state, action) => action.checked,
  [Action.TOGGLE_ENABLE_A_STAR]: (state, action) => action.checked ? false : state,
});
export const playerName = createReducer(defaultSettings.playerName, {
  [Action.CHANGE_NAME]: (state, action) => action.playerName,
});

export default combineReducers({
  enableAI,
  greedyShortestPathToTail,
  playerName,
});