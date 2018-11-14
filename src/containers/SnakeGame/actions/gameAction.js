import Action from "./Action";
import moment from 'moment';

export const play = () => ({
  type: Action.PLAY,
  startTime: moment().valueOf()
});

export const reset = () => ({
  type: Action.RESET
});

export const tick = () => ({
  type: Action.TICK
});

export const gameOver = () => ({
  type: Action.GAME_OVER,
  endTime: moment().valueOf()
});

export const move = direction => ({
  type: Action.MOVE,
  direction
});

export const changeDirection = direction => ({
  type: Action.CHANGE_DIRECTION,
  direction
});

export const spawnFood = (x, y) => ({
  type: Action.SPAWN_FOOD,
  x,
  y
});
export const eatFood = (x, y) => ({
  type: Action.EAT_FOOD,
  x,
  y
});
export const setSize = ({numRows, numCols}) => ({
  type: Action.SET_SIZE,
  numRows, numCols
});
export const addScore = ({score, playerName, startTime, endTime}) => ({
  type: Action.ADD_SCORE,
  score, playerName, startTime, endTime
});
export const changeName = ({playerName}) => ({
  type: Action.CHANGE_NAME,
  playerName
});