/* eslint-disable no-case-declarations */
import { combineReducers } from 'redux';
import { createReducer } from 'redux-starter-kit'
import moment from 'moment';

import Action from "../actions/Action";
import techTheme from '../../../common/techTheme';
import { RIGHT } from '../util/Direction';
import Format from "../util/Format";
import _ from 'lodash';

const BOARD_SIZE = 20;
const HEAD_THEME = techTheme.nodeJs;
const FOOD_THEMES = _.keys(_.omit(techTheme, ['others', 'nodeJs']));

const MAX_SPEED = process.env.NODE_ENV === 'production' ? 5 : 0;
const SPEED_MULTIPLIER= process.env.NODE_ENV === 'production' ? 50 : 1;
const INITIAL_SPEED = MAX_SPEED * SPEED_MULTIPLIER;

const wrap = x => (x < 0 ? x + BOARD_SIZE : x % BOARD_SIZE);

// reducer for game state
export const state = (state = 'PLAYING', action) => {
  switch (action.type) {
    case Action.PLAY:
      return 'PLAYING';
    case Action.GAME_OVER:
      return 'GAME_OVER';
    default:
      return state;
  }
};
// reducer for tick speed (ms per tick)
export const speed = (state = INITIAL_SPEED, action) => {
  switch (action.type) {
    case Action.EAT_FOOD:
      return Math.max(Math.floor(0.9 * state), MAX_SPEED);
    case Action.RESET:
      return INITIAL_SPEED;
    default:
      return state;
  }
};
// reducer for game score
export const score = (state = 0, action) => {
  switch (action.type) {
    case Action.EAT_FOOD:
      return state + 1;
    case Action.RESET:
      return 0;
    default:
      return state;
  }
};
// reducer for game column width
export const numCols = (state = BOARD_SIZE, action) => {
  switch (action.type) {
    case Action.SET_SIZE:
      return action.numCols;
    default:
      return state;
  }
};
// reducer for game column width
export const numRows = (state = BOARD_SIZE, action) => {
  switch (action.type) {
    case Action.SET_SIZE:
      return action.numRows;
    default:
      return state;
  }
};

export const playerName = (state = "SKYNET", action) => {
  switch (action.type) {
    case Action.CHANGE_NAME:
      return action.playerName;
    default:
      return state;
  }
};
export const startTime = (state = null, action) => {
  switch (action.type){
    case Action.PLAY:
      return action.startTime;
    default:
      return state;
  }
};
export const endTime = (state = null, action) => {
  switch (action.type){
    case Action.GAME_OVER:
      return action.endTime;
    default:
      return state;
  }
};

// combined reducer for overall game state
export const game = combineReducers({
  state,
  speed,
  score,
  numCols,
  numRows,
  playerName,
  startTime,
  endTime
});
// reducer for snake direction
export const direction = (state = RIGHT, action) => {
  switch (action.type) {
    case Action.CHANGE_DIRECTION:
      return action.direction;
    case Action.RESET:
      return RIGHT;
    default:
      return state;
  }
};
// reducer for snake parts
export const parts = (state = [{ x: 1, y: 1, ...HEAD_THEME }], action) => {
  switch (action.type) {
    case Action.MOVE:
      const { direction } = action;
      const head = {
        ...state[0],
        x: wrap(state[0].x + direction.x),
        y: wrap(state[0].y + direction.y)
      };
      state = state.slice(0, -1);
      state.unshift(head);
      return state;
    case Action.EAT_FOOD:
      return [
        ...state,
        state[state.length - 1]
      ];
    case Action.RESET:
      return [{ x: 1, y: 1, ...HEAD_THEME }];
    default:
      return state;
  }
};
// combined reducer for the snake
export const snake = combineReducers({
  direction,
  parts
});
// reducer for the food
export const food = (state = [], action) => {
  switch (action.type) {
    case Action.SPAWN_FOOD:
      const themeName = FOOD_THEMES[_.random(0, FOOD_THEMES.length - 1)];
      const theme = techTheme[themeName];
      return [
        ...state,
        {
          ...theme,
          themeName,
          x: action.x,
          y: action.y
        }
      ];
    case Action.EAT_FOOD:
      return state.filter(({ x, y }) => (x !== action.x || y !== action.y));
    case Action.GAME_OVER:
      return [];
    default:
      return state;
  }
};

export const highScores = createReducer([], {
  [Action.ADD_SCORE]: (state, action) => (_.orderBy([...state,{
    score: action.score,
    name: action.playerName,
    duration: Format.formatDuration(action.endTime - action.startTime),
    time: Format.formatTime(moment()),
  }], ['score'], ['desc'])),
  [Action.SET_SIZE]: (state, action) => {
    const { numCols, numRows} = action;
    const boardArea = numCols * numRows;
    return [{
      score: boardArea - 1, // -1 because the head occupies 1 space
      name: 'Perfect score',
      duration: Format.formatDuration(404),
      time: Format.formatTime(moment(0).utc()),
    }]
  }
});
// root reducer
export default combineReducers({
  game,
  snake,
  food,
  highScores
});
/**
 * will be available in store as
 * game: {
 *   game: {
 *    state: "PLAY",
 *    speed: 500, (ms delay between frames)
 *    score: 0,
 *    numRows: 20,
 *    numCols: 20,
 *    playerName: "SKYNET"
 *   },
 *   snake: {
 *     parts: [
 *       x: 1,
 *       y: 1,
 *       style: {(CSS)},
 *       icon: {(SVG)}
 *     ],
 *     direction: (
 *      x: -1,
 *      y: 0
 *     )
 *   },
 *   food: [
 *     {
 *       x: 4,
 *       y: 2,
 *       style: {(CSS)},
 *       icon: {(SVG)}
 *     }
 *   ],
 *   highScores: [
 *     {
 *       score: 42
 *       name: 'Perfect score',
 *       time: Format.formatTime(moment(0).utc()),
 *     }
 *   ]
 * }
 * */