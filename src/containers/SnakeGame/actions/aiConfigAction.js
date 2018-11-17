import Action from "./Action";

export const toggleEnableAstar = (event) => dispatch => {
  dispatch({
    type: Action.TOGGLE_ENABLE_A_STAR,
    checked: event.target.checked
  })
};

export const toggleGreedyShortestPathToTail = (event) => dispatch => {
  dispatch({
    type: Action.TOGGLE_GREEDY_SP_TAIL,
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