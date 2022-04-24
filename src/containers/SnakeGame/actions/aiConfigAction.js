import Action from './Action';

export const setAlgorithm = algorithm => dispatch => {
  dispatch({
    type: Action.SET_ALGORITHM,
    algorithm,
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
