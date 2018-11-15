import Action from "./Action";

export const toggleEnableAI = (event) => dispatch => {
  dispatch({
    type: Action.TOGGLE_ENABLE_AI,
    checked: event.target.checked
  })
};

export const changeName = (event) => dispatch => {
  const playerName = event.target.value;
  dispatch({
    type: Action.CHANGE_NAME,
    playerName
  })
};

export const changeSurroundingCostMultiplier = (multiplier) => dispatch => {
  dispatch({
    type: Action.CHANGE_SURROUNDING_MULTIPLIER,
    multiplier
  })
};

export const changeDotCostMultiplier = (multiplier) => dispatch => {
  dispatch({
    type: Action.CHANGE_DOT_COST_MULTIPLIER,
    multiplier
  })
};

export const changeNormalCostMultiplier = (multiplier) => dispatch => {
  dispatch({
    type: Action.CHANGE_NORMAL_COST_MULTIPLIER,
    multiplier
  })
};