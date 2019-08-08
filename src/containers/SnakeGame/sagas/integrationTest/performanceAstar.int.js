import { performanceTest } from './testHelper';
import { toggleEnableAstar } from '../../actions/aiConfigAction';

performanceTest({
  gamesToSimulate: 5,
  avgThreshold: 0.38,
  size: 8,
  aiAction: toggleEnableAstar,
  name: 'A star 38%',
});

performanceTest({
  gamesToSimulate: 5,
  avgThreshold: 0.25,
  size: 10,
  aiAction: toggleEnableAstar,
  name: 'A star 25%',
});
