import { playGame } from './testHelper';

describe("running a game", () => {
  it("runs until game over", () => playGame({size:5}), 10000);
});

