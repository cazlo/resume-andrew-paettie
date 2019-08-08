import Action from './Action';

export const toggleEnableAstar = event => dispatch => {
  dispatch({
    type: Action.TOGGLE_ENABLE_A_STAR,
    checked: event.target.checked,
  });
};

export const toggleGreedy = event => dispatch => {
  dispatch({
    type: Action.TOGGLE_GREEDY,
    checked: event.target.checked,
  });
};

export const toggleShowPath = event => dispatch => {
  dispatch({
    type: Action.TOGGLE_SHOW_PATH,
    checked: event.target.checked,
  });
};

export const changeName = event => dispatch => {
  const playerName = event.target.value;
  dispatch({
    type: Action.CHANGE_NAME,
    playerName,
  });
};
