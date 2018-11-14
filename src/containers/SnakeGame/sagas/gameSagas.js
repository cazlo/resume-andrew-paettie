import { delay } from 'redux-saga'
import { take, put, call, fork, cancel, select } from 'redux-saga/effects'

import Action from'../actions/Action';
import { play, changeDirection, eatFood, gameOver, move, reset, spawnFood, tick, addScore} from '../actions/gameAction';
import { UP, DOWN, LEFT, RIGHT} from '../util/Direction';
import PositionUtil from '../util/PositionUtil';
import { pathFindingSaga } from './pathFindingSagas';

const randomPosition = ({numRows, numCols}) => ({
  x: Math.floor(numCols * Math.random()),
  y: Math.floor(numRows * Math.random())
});

const input = (() => {
  // It gotta be possible creating this more efficiently, without
  // adding and removing event listeners all the time...
  const createPromise = () => (new Promise(resolve => {
    const onInput = e => {
      e.preventDefault();

      resolve(e.keyCode);
      promise = createPromise();

      document.removeEventListener('keydown', onInput);
    };
    document.addEventListener('keydown', onInput);
  }));

  let promise = createPromise();

  return () => promise;
})();

export function* inputSaga() {
  while (true) {
    const type = yield input();
    switch (type) {
      case 37:
        yield put(changeDirection(LEFT));
        break;
      case 38:
        yield put(changeDirection(UP));
        break;
      case 39:
        yield put(changeDirection(RIGHT));
        break;
      case 40:
        yield put(changeDirection(DOWN));
        break;
      default:
        break;
    }
  }
}

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
    yield put(move(direction));
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
  yield call(delay, 1000);
  yield put(play());
}

export default function* gameSaga() {
  while (true) {
    yield take(Action.PLAY);
    const running = [];
    running.push(yield fork(gameLoop));
    running.push(yield fork(foodSaga));
    running.push(yield fork(snakeSaga));
    running.push(yield fork(inputSaga));
    running.push(yield fork(pathFindingSaga));
    yield put(reset());
    yield take(Action.GAME_OVER);
    yield cancel(...running);
    const state = yield select();
    yield put(addScore(state.game.game));
    yield put(reset());
    yield fork(gameResetter);
  }
}