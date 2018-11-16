import { performanceTest } from './testHelper';

// 12 % avg seems to be a bit better than current performance, so should be able to be used to spot
// performance regressions
performanceTest({ gamesToSimulate: 20, avgThreshold: 0.12, size:10 });

