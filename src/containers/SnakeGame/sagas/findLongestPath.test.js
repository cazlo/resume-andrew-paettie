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
    }
  ].map(({snake, name}, idx) => it(`${name} (${idx})`, () => {
    // does not try and wrap around when that move is blocked by the snake itself
    const path = tryPathFindingToTail(snake, 4, 4);
    expect(path).toBeDefined();
    expect(path.length).toBeGreaterThan(2);
    expect(path[0]).not.toEqual(expect.objectContaining(snake.parts[0]));
  }));

});