import { combineReducers } from 'redux';
import snakeReducer from './snakeReducer';
import pathFindingReducer from './pathFindingReducer';
import highScoreReducer from './highScoreReducer';
import gameReducer from './gameReducer';
import foodReducer from './foodReducer';
import aiConfigReducer from './aiConfigReducer';
export default combineReducers({
  snake: snakeReducer,
  pathFinding: pathFindingReducer,
  highScore: highScoreReducer,
  game: gameReducer,
  food: foodReducer,
  aiConfig: aiConfigReducer
});