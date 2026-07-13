import { buildOccupancyCounts } from './pathFindingSagas';
import Position from '../util/Position';

const p = Position;

describe('snake occupancy counts', () => {
  it('counts each occupied coordinate once and preserves duplicated growth tails', () => {
    const tail = p(1, 2);

    const counts = buildOccupancyCounts([p(1, 1), p(2, 1), p(2, 2), tail, tail]);

    expect(counts).toEqual(
      new Map([
        ['x1y1', 1],
        ['x2y1', 1],
        ['x2y2', 1],
        ['x1y2', 2],
      ]),
    );
  });
});
