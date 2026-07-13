import { pathfind, pathfindGreedy } from './pathFindingSagas';
import Position from '../util/Position';

const p = Position;

describe('pathfinding performance metrics', () => {
  it('records graph construction and search without changing a path', () => {
    const snake = { parts: [p(1, 1), p(1, 2), p(0, 2), p(0, 1)] };
    const food = p(3, 3);
    const board = { numRows: 4, numCols: 4, wallsAreFatal: true };
    const expectedPath = pathfind(snake, food, board);
    const metrics = {};

    const measuredPath = pathfind(snake, food, { ...board, metrics });

    expect(measuredPath).toEqual(expectedPath);
    expect(metrics).toEqual(
      expect.objectContaining({
        graphBuildCount: 1,
        searchCount: 1,
        pathExpansionCount: 0,
      }),
    );
    expect(metrics.graphBuildDurationMs).toBeGreaterThanOrEqual(0);
    expect(metrics.searchDurationMs).toBeGreaterThanOrEqual(0);
    expect(metrics.expansionDurationMs).toBeGreaterThanOrEqual(0);
  });

  it('aggregates every graph built during one greedy decision', () => {
    const snake = { parts: [p(1, 1), p(1, 2), p(0, 2), p(0, 1)] };
    const food = p(3, 3);
    const metrics = {};

    const path = pathfindGreedy(snake, food, {
      numRows: 4,
      numCols: 4,
      wallsAreFatal: true,
      metrics,
    });

    expect(path.length).toBeGreaterThan(0);
    expect(metrics.graphBuildCount).toBeGreaterThan(1);
    expect(metrics.searchCount).toBe(metrics.graphBuildCount);
    expect(metrics.graphBuildDurationMs).toBeGreaterThanOrEqual(0);
    expect(metrics.searchDurationMs).toBeGreaterThanOrEqual(0);
    expect(metrics.expansionDurationMs).toBeGreaterThanOrEqual(0);
  });
});
