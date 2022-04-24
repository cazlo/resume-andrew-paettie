import { playGame } from './testHelper';
import Action from '../../actions/Action';

describe('running a game', () => {
  it('runs until game over A*', () => playGame({ size: 5, algorithm: Action.ALGORITHMS.astar }), 10000);
  it('runs until game over Greedy SP->Tail', () => playGame({ size: 8, algorithm: Action.ALGORITHMS.greedy }), 120000);
});
