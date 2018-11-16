import { delay } from 'redux-saga'
import { take, put, call, fork, cancel, select } from 'redux-saga/effects'

import Action from'../actions/Action';
import { play, eatFood, gameOver, move, reset, spawnFood, tick, addScore} from '../actions/gameAction';
import PositionUtil from '../util/PositionUtil';
import { pathFindingSaga } from './pathFindingSagas';

const randomPosition = ({numRows, numCols}) => ({
  x: Math.floor(numCols * Math.random()),
  y: Math.floor(numRows * Math.random())
});

export function* snakeSaga() {
  while (true) {
    yield take(Action.TICK);
    const state = yield select();
    const {
      game: {
        snake: {
          direction
        }
      }
    } =  state;
    const {numRows,numCols} = state.game.game;
    yield put(move({direction,numRows,numCols}));
    const {
      game: {
        snake: {
          parts: [head, ...tail]
        },
        food
      }
    } =  yield select();
    // collision with tail
    for (let i = 0; i < tail.length; i++) {
      const { x, y } = tail[i];
      if (x === head.x && y === head.y) {
        yield put(gameOver());
        yield put(play())
      }
    }
    // collision with food
    for (let i = 0; i < food.length; i++) {
      const { x, y } = food[i];
      if (x === head.x && y === head.y) {
        yield put(eatFood(x, y));
      }
    }
  }
}
export function* foodSaga() {
  while (true) {
    yield take([Action.PLAY, Action.EAT_FOOD, Action.RESET]);
    const state = yield select();
    const {numRows,numCols} = state.game.game;
    let position = {};
    do {
      position = randomPosition({numRows,numCols});
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

export function* gameResetter() {
  yield put(reset());
  yield call(delay, 1000);
  yield put(play());
}

export function* runGame() {
  yield take(Action.PLAY);
  const running = [];
  running.push(yield fork(gameLoop));
  running.push(yield fork(foodSaga));
  running.push(yield fork(snakeSaga));
  running.push(yield fork(pathFindingSaga));
  yield put(reset());
  yield take(Action.GAME_OVER);
  yield cancel(...running);
  const state = yield select();
  yield put(addScore(state.game.game));
}

export default function* gameSaga() {
  while (true) {
    yield runGame();
    yield fork(gameResetter);
  }
}