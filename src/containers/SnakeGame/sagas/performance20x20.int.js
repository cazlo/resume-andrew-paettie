import { performanceTest } from './testHelper';
import { toggleEnableAstar, toggleGreedyShortestPathToTail } from '../actions/aiConfigAction';

// 12 % avg seems to be a bit better than current performance, so should be able to be used to spot
// performance regressions
performanceTest({ gamesToSimulate: 10, avgThreshold: 0.12, size:20, aiAction: toggleEnableAstar, name: "A star" });
performanceTest({ gamesToSimulate: 10, avgThreshold: 0.12, size:20, aiAction: toggleGreedyShortestPathToTail, name:"Greedy SP->Tail" });

