import { performanceTest } from './testHelper';
import { toggleGreedy, toggleEnableAstar } from '../actions/aiConfigAction'

// 12 % avg seems to be a bit better than current performance, so should be able to be used to spot
// performance regressions
performanceTest({ gamesToSimulate: 30, avgThreshold: 0.38, size:8, aiAction: toggleEnableAstar, name:"A star" });
performanceTest({ gamesToSimulate: 20, avgThreshold: 0.7, size:8, aiAction: toggleGreedy, name:"Greedy SP->Tail" });

