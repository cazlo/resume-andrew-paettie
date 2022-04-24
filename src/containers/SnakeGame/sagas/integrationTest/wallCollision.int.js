import { playGame } from './testHelper';
import Action from '../../actions/Action';

describe('snake can navigate through a world without wrapping', () => {
  it(
    'runs until game over A*',
    () => playGame({ size: 8, algorithm: Action.ALGORITHMS.astar, wallsAreFatal: true }),
    15000,
  );
  it(
    'runs until game over Greedy SP->Tail',
    () => playGame({ size: 8, algorithm: Action.ALGORITHMS.greedy, wallsAreFatal: true }),
    15000,
  );
});
