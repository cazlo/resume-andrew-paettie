import { playGame } from './testHelper';
import { toggleGreedy, toggleEnableAstar } from '../../actions/aiConfigAction';

describe('snake can navigate through a world without wrapping', () => {
  it('runs until game over A*', () => playGame({ size: 8, aiAction: toggleEnableAstar, wallsAreFatal: true }), 10000);
  it(
    'runs until game over Greedy SP->Tail',
    () => playGame({ size: 8, aiAction: toggleGreedy, wallsAreFatal: true }),
    10000,
  );
});
