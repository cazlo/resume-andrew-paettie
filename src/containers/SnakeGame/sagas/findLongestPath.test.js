import { tryPathFindingToTail } from './pathFindingSagas';
import Position from '../util/Position';
const p = Position;// alias because 'Position' it is long

describe('Path find to tail does not take the shortest path',() => {
  [
    {
      name: "4x4 left corner",
      snake: { parts: [p(2,0),p(2,1),p(1,1),p(0,1),p(0,0)] },
    },
    {
      name: "4x4 mid-left corner",
      snake: { parts: [p(2,1),p(2,2),p(1,2),p(0,2),p(0,1),p(0,0), p(1,0)] },
    },
    {
      name: "4x4 tail chasing edge case",
      snake: { parts: [p(2,1),p(2,2),p(1,2),p(0,2),p(0,1),p(0,0), p(1,0)] },
    }
  ].map(({snake, name}, idx) => it(`${name} (${idx})`, () => {
    // does not try and wrap around when that move is blocked by the snake itself
    const path = tryPathFindingToTail(snake, {numRows:4, numCols:4, wallsAreFatal: false});
    expect(path).toBeDefined();
    expect(path.length).toBeGreaterThan(2);
    expect(path[0]).not.toEqual(expect.objectContaining(snake.parts[0]));
  }));

});

describe("Path finding tail chasing edge case", () => {
  /**
   * T = Tail, H = Head
   * | T | T | T | T |
   * | T |   | T | T |
   * | T | T | T |   |
   * | T | H |   |   |
   *
   * */
  it ("moves into corner instead of chasing tail", () => {
    const tail = p(1,2);
    const head = p(1,3);
    const snake = { parts: [head,p(0,3),p(0,2),p(0,1),p(0,0),p(1,0),p(2,0),p(3,0),p(3,1),p(2,1),p(2,2),tail] };
    const path = tryPathFindingToTail(snake, {numRows:4, numCols:4, wallsAreFatal: true}, false, true);
    expect(path).toBeDefined();
    expect(path[0]).not.toEqual(expect.objectContaining(tail));
  });

  /**
   * T = Tail, H = Head, F = Food
   * | T | T | T | T |
   * | T |   | T | T |
   * | T | T | T |   |
   * | T | H | F |   |
   *
   * */
  it ("chases tail instead of food", () => {
    const tail = p(1,2);
    const head = p(1,3);
    const food = p(2,3);
    const snake = { parts: [head,p(0,3),p(0,2),p(0,1),p(0,0),p(1,0),p(2,0),p(3,0),p(3,1),p(2,1),p(2,2),tail] };
    const path = tryPathFindingToTail(snake, {numRows:4, numCols:4, wallsAreFatal: true}, false, true, food);
    expect(path).toBeDefined();
    expect(path[0]).toEqual(expect.objectContaining(tail));
  });
});