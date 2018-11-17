import { playGame } from './testHelper';
import { toggleGreedyShortestPathToTail, toggleEnableAstar } from '../actions/aiConfigAction'

describe("running a game", () => {
  it("runs until game over A*", () => playGame({size:5, aiAction: toggleEnableAstar}), 10000);
  it("runs until game over Greedy SP->Tail", () => playGame({size:5, aiAction: toggleGreedyShortestPathToTail}), 10000);
});

