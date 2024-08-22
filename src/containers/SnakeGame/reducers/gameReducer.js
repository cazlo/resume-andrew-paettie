/* eslint-disable no-case-declarations */
import { combineReducers, createAction, createReducer } from '@reduxjs/toolkit';
import moment from 'moment';
import _ from 'lodash';

import Action from '../actions/Action';
import techTheme from '../../../common/techTheme';
import { RIGHT } from '../util/Direction';
import Format from '../util/Format';
import Grid from '../util/Grid';
import GameState from '../util/GameState';

const { DEFAULT_BOARD_SIZE } = Grid;
const { PLAYING, GAME_OVER } = GameState;

const FOOD_THEMES = _.keys(_.omit(techTheme, ['nodeJs']));

const MAX_SPEED = 0;

const wrap = (point, size) => (point < 0 ? point + size : point % size);

export const computePerfectScore = (w, h) => w * h - 1; // -1 because the head occupies 1 space
const computeFrameTimeout = (w, h) => (w * h * (w * h) - 1) / 4;
// ^^ a large number that is not near worst case but long enough for sane algorithms to finish

const DEFAULT_PERFECT_SCORE = computePerfectScore(DEFAULT_BOARD_SIZE, DEFAULT_BOARD_SIZE);
const DEFAULT_FRAME_TIMEOUT = computeFrameTimeout(DEFAULT_BOARD_SIZE, DEFAULT_BOARD_SIZE);

const defaults = {
  game: {
    state: PLAYING,
    speed: MAX_SPEED, // (ms delay between frames)
    score: 0,
    numRows: DEFAULT_BOARD_SIZE,
    numCols: DEFAULT_BOARD_SIZE,
    playerName: 'SKYNET',
    startTime: null,
    endTime: null,
    frameCount: 0,
    fps: 0,
    wallsAreFatal: true,
    perfectScore: DEFAULT_PERFECT_SCORE,
    frameTimeout: DEFAULT_FRAME_TIMEOUT,
  },
  snake: {
    parts: [
      {
        x: 1,
        y: 1,
      },
    ],
    direction: RIGHT,
  },
  food: [],
  highScores: [
    {
      score: DEFAULT_PERFECT_SCORE,
      name: 'Perfect score',
      time: Format.formatTime(moment(0).utc()),
    },
  ],
};

const moveAction = createAction(Action.MOVE);
const eatFoodAction = createAction(Action.EAT_FOOD);
const resetAction = createAction(Action.RESET);
const changeDirectonAction = createAction(Action.CHANGE_DIRECTION);
const spawnFoodAction = createAction(Action.SPAWN_FOOD);
const gameOverAction = createAction(Action.GAME_OVER);
const addScoreAction = createAction(Action.ADD_SCORE);
const setSizeAction = createAction(Action.SET_SIZE);
const setSpeedAction = createAction(Action.SET_SPEED);
const changeNameAction = createAction(Action.CHANGE_NAME);
const playAction = createAction(Action.PLAY);
const tickAction = createAction(Action.TICK);
const setFpsAction = createAction(Action.SET_FPS);
const setFrameTimeoutAction = createAction(Action.SET_FRAME_TIMEOUT);
const toggleWallsAreFatalAction = createAction(Action.TOGGLE_WALLS_ARE_FATAL);

// ----------------- snake -------------------

export const parts = createReducer(defaults.snake.parts, builder => {
  builder
    .addCase(moveAction, (state, action) => {
      const { direction, numRows, numCols, wallsAreFatal } = action;
      const x = state[0].x + direction.x;
      const y = state[0].y + direction.y;
      const head = {
        ...state[0],
        x: wallsAreFatal ? x : wrap(x, numCols),
        y: wallsAreFatal ? y : wrap(y, numRows),
      };
      const newState = state.slice(0, -1);
      newState.unshift(head);
      return newState;
    })
    .addCase(eatFoodAction, state => [...state, state[state.length - 1]])
    .addCase(resetAction, () => defaults.snake.parts);
});
export const direction = createReducer(defaults.snake.direction, builder => {
  builder.addCase(changeDirectonAction, (state, action) => action.direction).addCase(resetAction, () => RIGHT);
});

// ----------------- food -------------------

export const food = createReducer(defaults.food, builder => {
  builder
    .addCase(spawnFoodAction, (state, action) => {
      const themeName = FOOD_THEMES[_.random(0, FOOD_THEMES.length - 1)];
      const theme = techTheme[themeName];
      return [
        ...state,
        {
          style: theme.style,
          themeName,
          x: action.x,
          y: action.y,
        },
      ];
    })
    .addCase(eatFoodAction, (state, action) => state.filter(({ x, y }) => x !== action.x || y !== action.y))
    .addCase(gameOverAction, () => []);
});

// ----------------- highscores -------------------

export const highScores = createReducer(defaults.highScores, builder => {
  builder
    .addCase(addScoreAction, (state, action) =>
      _.orderBy(
        [
          ...state,
          {
            score: action.score,
            name: action.playerName,
            duration: Format.formatDuration(action.endTime - action.startTime),
            frameCount: action.frameCount,
            time: Format.formatTime(moment()),
          },
        ],
        ['score'],
        ['desc'],
      ),
    )
    .addCase(setSizeAction, (state, { numRows, numCols }) => {
      const score = computePerfectScore(numCols, numRows);
      return [
        {
          score,
          name: 'Perfect score',
          duration: Format.formatDuration(404),
          time: Format.formatTime(moment(0).utc()),
        },
      ];
    });
});

// ----------------- "internal" game state -------------------
// tick speed (ms per tick)
export const speed = createReducer(defaults.game.speed, builder => {
  builder.addCase(setSpeedAction, (state, action) => action.speed);
  // [Action.EAT_FOOD]: (state) => Math.max(Math.floor(0.9 * state), MAX_SPEED),
  // [Action.RESET]: () => INITIAL_SPEED,
});
export const score = createReducer(defaults.game.score, builder => {
  builder.addCase(eatFoodAction, state => state + 1).addCase(resetAction, () => 0);
});
export const numCols = createReducer(defaults.game.numCols, builder => {
  builder.addCase(setSizeAction, (state, action) => action.numCols);
});
export const numRows = createReducer(defaults.game.numRows, builder => {
  builder.addCase(setSizeAction, (state, action) => action.numRows);
});
export const playerName = createReducer(defaults.game.playerName, builder => {
  builder.addCase(changeNameAction, (state, action) => action.playerName);
});
export const startTime = createReducer(defaults.game.startTime, builder => {
  builder.addCase(playAction, (state, action) => action.startTime);
});
export const endTime = createReducer(defaults.game.endTime, builder => {
  builder.addCase(gameOverAction, (state, action) => action.endTime);
});
export const frameCount = createReducer(defaults.game.frameCount, builder => {
  builder.addCase(tickAction, state => state + 1).addCase(resetAction, () => 0);
});
export const fps = createReducer(defaults.game.fps, builder => {
  builder.addCase(setFpsAction, (state, action) => action.fps).addCase(resetAction, () => 0);
});
export const perfectScore = createReducer(defaults.game.perfectScore, builder => {
  builder.addCase(setSizeAction, (state, action) => computePerfectScore(action.numRows, action.numCols));
});
export const frameTimeout = createReducer(defaults.game.frameTimeout, builder => {
  builder
    .addCase(setSizeAction, (state, action) => computeFrameTimeout(action.numRows, action.numCols))
    .addCase(setFrameTimeoutAction, (state, action) => action.limit);
});
export const computedFrameTimeout = createReducer(defaults.game.frameTimeout, builder => {
  builder.addCase(setSizeAction, (state, action) => computeFrameTimeout(action.numRows, action.numCols));
});
export const wallsAreFatal = createReducer(defaults.game.wallsAreFatal, builder => {
  builder.addCase(toggleWallsAreFatalAction, (state, action) => action.checked);
});
export const state = createReducer(defaults.game.state, builder => {
  builder.addCase(playAction, () => PLAYING).addCase(gameOverAction, () => GAME_OVER);
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
    computedFrameTimeout,
    wallsAreFatal,
  }),
  snake: combineReducers({
    direction,
    parts,
  }),
  food,
  highScores,
});
