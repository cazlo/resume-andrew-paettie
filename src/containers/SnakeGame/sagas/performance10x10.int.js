import { performanceTest } from './testHelper';
import { toggleEnableAstar, toggleGreedy } from '../actions/aiConfigAction';

// 12 % avg seems to be a bit better than current performance, so should be able to be used to spot
// performance regressions
performanceTest({ gamesToSimulate: 20, avgThreshold: 0.25, size:10, aiAction: toggleEnableAstar, name:"A star" });
performanceTest({ gamesToSimulate: 10, avgThreshold: 0.7, size:10, aiAction: toggleGreedy, name:"Greedy SP->Tail" });

