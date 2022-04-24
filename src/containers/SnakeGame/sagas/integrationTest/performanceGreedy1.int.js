import { performanceTest } from './testHelper';
import Action from '../../actions/Action';

performanceTest({
  gamesToSimulate: 30,
  avgThreshold: 0.9,
  size: 8,
  algorithm: Action.ALGORITHMS.greedy,
  name: 'Greedy SP->Tail 90% over 30 games',
});
