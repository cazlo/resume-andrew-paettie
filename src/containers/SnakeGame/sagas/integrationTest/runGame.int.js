import { playGame } from './testHelper';
import { toggleGreedy, toggleEnableAstar } from '../../actions/aiConfigAction';

describe('running a game', () => {
  it('runs until game over A*', () => playGame({ size: 5, aiAction: toggleEnableAstar }), 10000);
  it('runs until game over Greedy SP->Tail', () => playGame({ size: 8, aiAction: toggleGreedy }), 60000);
});
