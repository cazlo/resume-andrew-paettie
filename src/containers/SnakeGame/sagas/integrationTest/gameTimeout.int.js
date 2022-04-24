import { playGame } from './testHelper';
import Action from '../../actions/Action';

describe('game respects frameCount timeout', () => {
  it('runs until game over A*', () => playGame({ size: 8, algorithm: Action.ALGORITHMS.astar, limit: 100 }), 10000);
  it(
    'runs until game over Greedy SP->Tail',
    () => playGame({ size: 8, algorithm: Action.ALGORITHMS.greedy, limit: 100 }),
    10000,
  );
});
