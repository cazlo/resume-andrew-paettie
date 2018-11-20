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
export const move = ({direction,numRows,numCols,wallsAreFatal}) => ({
  type: Action.MOVE,
  direction,
  numRows,numCols, wallsAreFatal
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
export const addScore = ({score, playerName, startTime, endTime, frameCount}) => ({
  type: Action.ADD_SCORE,
  score, playerName, startTime, endTime, frameCount
});

// game config stuff
export const setSize = ({numRows, numCols}) => ({
  type: Action.SET_SIZE,
  numRows, numCols
});
export const setFps = ({fps}) => ({
  type: Action.SET_FPS,
  fps
});
export const setSpeed = ({speed}) => ({
  type: Action.SET_SPEED,
  speed
});
export const toggleWallsAreFatal = (event) => ({
  type: Action.TOGGLE_WALLS_ARE_FATAL,
  checked: event.target.checked
});
export const setFrameLimit = ({limit}) => ({
  type: Action.SET_FRAME_TIMEOUT,
  limit
});