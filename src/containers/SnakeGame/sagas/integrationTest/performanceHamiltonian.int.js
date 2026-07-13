import { performanceTest } from './testHelper';
import Action from '../../actions/Action';

performanceTest({
  gamesToSimulate: 10,
  avgThreshold: 1,
  size: 8,
  algorithm: Action.ALGORITHMS.hamiltonian,
  name: 'Hamiltonian Cycle perfect over 10 games',
  requirePerfectScores: true,
});
