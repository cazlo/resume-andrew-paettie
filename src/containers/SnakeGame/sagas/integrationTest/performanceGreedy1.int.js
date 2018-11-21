import { performanceTest } from './testHelper';
import { toggleGreedy } from '../../actions/aiConfigAction'

performanceTest({ gamesToSimulate: 30, avgThreshold: 0.9, size:8, aiAction: toggleGreedy, name:"Greedy SP->Tail 90% over 30 games" });
