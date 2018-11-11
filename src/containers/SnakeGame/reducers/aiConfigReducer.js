import Action from "../actions/Action"

const aiSettings = {
  enableAI : true,
  playerName: "SKYNET",
  nodesSurroundingSnakeCostMultiplier: 1,
  nodesInCurrentDirectionOfTravelCostMultiplier: 1,
  normalNodeCostMultiplier: 5000
};

const initialState = {
  dialogOpen: false,
  ...aiSettings,
  userInput: {
    ...aiSettings
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.TOGGLE_CONFIG_DIALOG:
      return {
        ...state,
        dialogOpen: !state.dialogOpen,
      };
    case Action.SAVE_CONFIG_DIALOG:
      return {
        ...state,
        ...state.userInput, // overwrite current overridable things with the user input
      };
    case Action.TOGGLE_ENABLE_AI:
      return {
        ...state,
       userInput: {
         ...state.userInput,
         enableAI: action.checked
       }
      };
    case Action.CHANGE_NAME:
      return {
        ...state,
        userInput: {
          ...state.userInput,
          playerName: action.name
        }
      };
    default:
      return state
  }
}