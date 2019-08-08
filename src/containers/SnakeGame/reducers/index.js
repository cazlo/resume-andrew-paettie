import { combineReducers } from 'redux';
import pathFindingReducer from './pathFindingReducer';
import reducer from './gameReducer';
import aiConfigReducer from './aiConfigReducer';

export default combineReducers({
  pathFinding: pathFindingReducer,
  game: reducer,
  aiConfig: aiConfigReducer,
});
