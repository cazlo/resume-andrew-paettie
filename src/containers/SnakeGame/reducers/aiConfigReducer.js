import Action from "../actions/Action"
import { combineReducers, createReducer } from 'redux-starter-kit';

const defaultSettings = {
  enableAI : true,
  playerName: "SKYNET",
  nodesSurroundingSnakeCostMultiplier: 1,
  nodesInCurrentDirectionOfTravelCostMultiplier: 1,
  normalNodeCostMultiplier: 1000
};

export const enableAI = createReducer(defaultSettings.enableAI, {
  [Action.TOGGLE_ENABLE_AI]: (state, action) => action.checked,
});
export const playerName = createReducer(defaultSettings.playerName, {
  [Action.CHANGE_NAME]: (state, action) => action.playerName,
});
export const nodesSurroundingSnakeCostMultiplier =
  createReducer(defaultSettings.nodesSurroundingSnakeCostMultiplier, {
    [Action.CHANGE_SURROUNDING_MULTIPLIER]: (state, action) => action.multiplier,
  });
export const nodesInCurrentDirectionOfTravelCostMultiplier =
  createReducer(defaultSettings.nodesInCurrentDirectionOfTravelCostMultiplier, {
    [Action.CHANGE_DOT_COST_MULTIPLIER]: (state, action) => action.multiplier,
  });
export const normalNodeCostMultiplier =
  createReducer(defaultSettings.normalNodeCostMultiplier, {
    [Action.CHANGE_NORMAL_COST_MULTIPLIER]: (state, action) => action.multiplier,
  });

export default combineReducers({
  enableAI,
  playerName,
  nodesSurroundingSnakeCostMultiplier,
  nodesInCurrentDirectionOfTravelCostMultiplier,
  normalNodeCostMultiplier
});