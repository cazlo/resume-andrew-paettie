import { performanceTest } from './testHelper';
import { toggleGreedy } from '../../actions/aiConfigAction'

performanceTest({ gamesToSimulate: 10, avgThreshold: 0.7, size:10, aiAction: toggleGreedy, name:"Greedy SP->Tail 70% over 10 games" });
