import { playGame } from './testHelper';
import { toggleGreedy, toggleEnableAstar } from '../../actions/aiConfigAction'

describe("game respects frameCount timeout", () => {
  it("runs until game over A*", () => playGame({size:8, aiAction: toggleEnableAstar, limit:100}), 10000);
  it("runs until game over Greedy SP->Tail", () => playGame({size:8, aiAction: toggleGreedy, limit:100}), 10000);
});

