import { performanceTest } from './testHelper';
import Action from '../../actions/Action';

performanceTest({
  gamesToSimulate: 5,
  avgThreshold: 0.38,
  size: 8,
  algorithm: Action.ALGORITHMS.astar,
  name: 'A star 38%',
});

performanceTest({
  gamesToSimulate: 5,
  avgThreshold: 0.25,
  size: 10,
  algorithm: Action.ALGORITHMS.astar,
  name: 'A star 25%',
});
