import Action from "./Action";

export const toggleConfigDialog = () => dispatch => {
  dispatch({
    type: Action.TOGGLE_CONFIG_DIALOG
  });
  dispatch({
    type: Action.TOGGLE_PAUSED
  });
};

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
    name: playerName
  })
};

export const saveConfigDialog = () => dispatch => {
  dispatch({
    type: Action.TOGGLE_CONFIG_DIALOG
  });
  // todo need to dispatch a restart game event if the ai config has changed in a specific way ?
  dispatch({
    type: Action.SAVE_CONFIG_DIALOG
  })
};