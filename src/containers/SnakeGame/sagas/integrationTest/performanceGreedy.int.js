import { performanceTest } from './testHelper';
import Action from '../../actions/Action';

performanceTest({
  gamesToSimulate: 10,
  avgThreshold: 0.7,
  size: 8,
  algorithm: Action.ALGORITHMS.greedy,
  name: 'Greedy SP->Tail 70% over 10 games',
});
