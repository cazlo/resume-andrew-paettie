import { delay } from 'redux-saga';
import { take, put, call, fork, cancel, select, takeLatest } from 'redux-saga/effects';

import Action from '../actions/Action';
import {
  play,
  eatFood,
  gameOver,
  move,
  reset,
  spawnFood,
  tick,
  addScore,
  setFps,
  moveFinished,
} from '../actions/gameAction';
import PositionUtil from '../util/PositionUtil';
import { pathFindingSaga } from './pathFindingSagas';

const randomPosition = ({ numRows, numCols }) => ({
  x: Math.floor(numCols * Math.random()),
  y: Math.floor(numRows * Math.random()),
});

export function* snakeSaga() {
  const state = yield select();
  const {
    game: {
      snake: { direction },
    },
  } = state;
  const { numRows, numCols, frameTimeout, frameCount, wallsAreFatal } = state.game.game;
  if (frameCount > frameTimeout) {
    yield put(gameOver());
  }
  yield put(move({ direction, numRows, numCols, wallsAreFatal }));
  const {
    game: {
      snake: {
        parts: [head, ...tail],
      },
      food,
    },
  } = yield select();
  // bounds check
  if (head.x < 0 || head.x >= numCols || head.y < 0 || head.y >= numRows) {
    // console.log(`Collision with game bounds`);
    yield put(gameOver());
  }
  // collision with tail
  for (let i = 0; i < tail.length; i += 1) {
    const { x, y } = tail[i];
    if (x === head.x && y === head.y) {
      // console.log(`Collided with tail index ${i} (tail size:${tail.length})`);
      yield put(gameOver());
    }
  }
  // collision with food
  for (let i = 0; i < food.length; i += 1) {
    const { x, y } = food[i];
    if (x === head.x && y === head.y) {
      yield put(eatFood(x, y));
    }
  }
  yield put(moveFinished());
}

export function* foodSaga() {
  const state = yield select();
  const { numRows, numCols, perfectScore } = state.game.game;
  if (state.game.snake.parts.length <= perfectScore) {
    let position = {};
    do {
      position = randomPosition({ numRows, numCols });
    } while (PositionUtil.isColliding(position, state.game.snake.parts));
    yield put(spawnFood(position.x, position.y));
  }
}

export function* gameLoop() {
  while (true) {
    const state = yield select();
    yield call(delay, state.game.game.speed);
    yield put(tick());
  }
}

export function* fpsSaga() {
  while (true) {
    const state = yield select();
    const { frameCount } = state.game.game;
    yield call(delay, 1000);
    const stateAfter = yield select();
    const frameCountAfter = stateAfter.game.game.frameCount;
    const fps = frameCountAfter - frameCount;
    yield put(setFps({ fps }));
  }
}

export function* gameEnder() {
  yield put(gameOver());
}

export function* gameResetter() {
  yield call(delay, 4200);
  yield put(reset());
  yield put(play());
}

export function* runGame({ waitOnPlay = true, doReset = true }) {
  if (waitOnPlay) {
    // this is configurable to facilitate testing
    yield take(Action.PLAY);
  }
  const running = [];
  running.push(yield fork(gameLoop));
  running.push(yield fork(fpsSaga));
  running.push(yield takeLatest([Action.PLAY, Action.EAT_FOOD, Action.RESET], foodSaga));
  running.push(yield takeLatest([Action.SET_SIZE], gameEnder));
  running.push(yield takeLatest([Action.TICK], snakeSaga));
  running.push(yield takeLatest([Action.MOVE_FINISHED], pathFindingSaga));
  if (doReset) {
    yield put(reset());
  }
  yield take(Action.GAME_OVER);
  yield cancel(...running);
  const state = yield select();
  yield put(addScore(state.game.game));
}

function* handlePlayAction() {
  yield runGame({ waitOnPlay: false });
  yield fork(gameResetter);
}

export default function* gameSaga() {
  yield takeLatest(Action.PLAY, handlePlayAction);
}
