/* eslint-disable no-case-declarations */
import { combineReducers, createReducer } from 'redux-starter-kit';
import moment from 'moment';
import _ from 'lodash';

import Action from '../actions/Action';
import techTheme from '../../../common/techTheme';
import { RIGHT } from '../util/Direction';
import Format from '../util/Format';
import { DEFAULT_BOARD_SIZE } from '../util/Grid';

const HEAD_THEME = techTheme.nodeJs;
const FOOD_THEMES = _.keys(_.omit(techTheme, ['nodeJs']));

const MAX_SPEED = process.env.NODE_ENV === 'production' ? 5 : 0;
const SPEED_MULTIPLIER = process.env.NODE_ENV === 'production' ? 42 : 0;
const INITIAL_SPEED = MAX_SPEED * SPEED_MULTIPLIER;

const wrap = (point, size) => (point < 0 ? point + size : point % size);

const computePerfectScore = (w,h) => (w*h)-1; // -1 because the head occupies 1 space
const computeFrameTimeout = (w,h) => ((w*h)*(w*h)-1)/6;
// ^^ a large number that is not near worst case but long enough for sane algorithms to finish

const DEFAULT_PERFECT_SCORE = computePerfectScore(DEFAULT_BOARD_SIZE, DEFAULT_BOARD_SIZE);
const DEFAULT_FRAME_TIMEOUT = computeFrameTimeout(DEFAULT_BOARD_SIZE, DEFAULT_BOARD_SIZE);

const defaults = {
  game: {
    state: 'PLAYING',
    speed: INITIAL_SPEED, //(ms delay between frames)
    score: 0,
    numRows: DEFAULT_BOARD_SIZE,
    numCols: DEFAULT_BOARD_SIZE,
    playerName: 'SKYNET',
    startTime: null,
    endTime: null,
    frameCount: 0,
    fps: 0,
    wallsAreFatal: false, // todo
    perfectScore: DEFAULT_PERFECT_SCORE,
    frameTimeout: DEFAULT_FRAME_TIMEOUT,
  },
  snake: {
    parts: [
      {
        x: 1,
        y: 1,
        ...HEAD_THEME,
      },
    ],
    direction: RIGHT,
  },
  food: [],
  highScores: [
    {
      score: 42,
      name: 'Perfect score',
      time: Format.formatTime(moment(0).utc()),
    },
  ],
};

// ----------------- "internal" game state -------------------
export const state = createReducer(defaults.game.state, {
  [Action.PLAY]: () => 'PLAYING',
  [Action.GAME_OVER]: () => 'GAME_OVER',
});
// tick speed (ms per tick)
export const speed = createReducer(defaults.game.speed, {
  [Action.EAT_FOOD]: (state) => Math.max(Math.floor(0.9 * state), MAX_SPEED),
  [Action.RESET]: () => INITIAL_SPEED,
});
export const score = createReducer(defaults.game.score, {
  [Action.EAT_FOOD]: (state) => state + 1,
  [Action.RESET]: () => 0,
});
export const numCols = createReducer(defaults.game.numCols, {
  [Action.SET_SIZE]: (state, action) => action.numCols,
});
export const numRows = createReducer(defaults.game.numRows, {
  [Action.SET_SIZE]: (state, action) => action.numRows,
});
export const playerName = createReducer(defaults.game.playerName, {
  [Action.CHANGE_NAME]: (state, action) => action.playerName,
});
export const startTime = createReducer(defaults.game.startTime, {
  [Action.PLAY]: (state, action) => action.startTime,
});
export const endTime = createReducer(defaults.game.endTime, {
  [Action.GAME_OVER]: (state, action) => action.endTime,
});
export const frameCount = createReducer(defaults.game.frameCount, {
  [Action.TICK]: (state) => state + 1,
  [Action.RESET]: () => 0,
});
export const fps = createReducer(defaults.game.fps, {
  [Action.SET_FPS]: (state, action) => action.fps,
  [Action.RESET]: () => 0,
});
export const perfectScore = createReducer(defaults.game.perfectScore, {
  [Action.SET_SIZE]: (state, action) => computePerfectScore(action.numRows, action.numCols),
});
export const frameTimeout = createReducer(defaults.game.frameTimeout, {
  [Action.SET_SIZE]: (state, action) => computeFrameTimeout(action.numRows, action.numCols),
});

// ----------------- snake -------------------

export const direction = createReducer(defaults.snake.direction, {
  [Action.CHANGE_DIRECTION]: (state, action) => action.direction,
  [Action.RESET]: () => RIGHT,
});
export const parts = createReducer(defaults.snake.parts, {
  [Action.MOVE]: (state, action) => {
    const { direction, numRows, numCols } = action;
    const head = {
      ...state[0],
      x: wrap(state[0].x + direction.x, numCols),
      y: wrap(state[0].y + direction.y, numRows),
    };
    state = state.slice(0, -1);
    state.unshift(head);
    return state;
  },
  [Action.EAT_FOOD]: (state) => [...state, state[state.length - 1]],
  [Action.RESET]: () => defaults.snake.parts,
});

// ----------------- food -------------------

export const food = createReducer(defaults.food, {
  [Action.SPAWN_FOOD]: (state, action) => {
    const themeName = FOOD_THEMES[_.random(0, FOOD_THEMES.length - 1)];
    const theme = techTheme[themeName];
    return [
      ...state,
      {
        ...theme,
        themeName,
        x: action.x,
        y: action.y,
      },
    ];
  },
  [Action.EAT_FOOD]: (state, action) => state.filter(({ x, y }) => (x !== action.x || y !== action.y)),
  [Action.GAME_OVER]: () => [],
});

// ----------------- highscores -------------------

export const highScores = createReducer(defaults.highScores, {
  [Action.ADD_SCORE]: (state, action) => (_.orderBy([...state, {
    score: action.score,
    name: action.playerName,
    duration: Format.formatDuration(action.endTime - action.startTime),
    frameCount: action.frameCount,
    time: Format.formatTime(moment()),
  }], ['score'], ['desc'])),
  [Action.SET_SIZE]: (state, {numRows, numCols}) => {
    const score = computePerfectScore(numCols, numRows);
    return [{
      score,
      name: 'Perfect score',
      duration: Format.formatDuration(404),
      time: Format.formatTime(moment(0).utc()),
    }];
  },
});

export default combineReducers({
  game: combineReducers({
    state,
    speed,
    score,
    numCols,
    numRows,
    playerName,
    startTime,
    endTime,
    frameCount,
    fps,
    perfectScore,
    frameTimeout,
  }),
  snake: combineReducers({
    direction,
    parts,
  }),
  food,
  highScores,
});