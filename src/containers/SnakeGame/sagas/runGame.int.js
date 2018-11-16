import { playGame } from './testHelper';

describe("running a game", () => {
  it("runs until game over", playGame, 30000);
});

