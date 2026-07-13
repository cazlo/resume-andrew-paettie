/* eslint-disable no-console */
import { pathfindGreedy } from './pathFindingSagas';
import Position from '../util/Position';

const p = Position;

const serpentinePositions = ({ numRows, numCols }) =>
  [...Array(numRows).keys()].flatMap(y => {
    const row = [...Array(numCols).keys()].map(x => p(x, y));
    return y % 2 === 0 ? row : row.reverse();
  });

const createScenario = ({ name, numRows, numCols, wallsAreFatal, occupiedRatio, iterations }) => {
  const board = { numRows, numCols, wallsAreFatal };
  const positions = serpentinePositions(board);
  const occupiedCount = Math.max(4, Math.floor(positions.length * occupiedRatio));
  return {
    name,
    board,
    iterations,
    snake: { parts: positions.slice(0, occupiedCount).reverse() },
    food: positions[positions.length - 1],
  };
};

const scenarios = [
  createScenario({
    name: '8x8-fatal-50pct',
    numRows: 8,
    numCols: 8,
    wallsAreFatal: true,
    occupiedRatio: 0.5,
    iterations: 40,
  }),
  createScenario({
    name: '10x10-wrapping-70pct',
    numRows: 10,
    numCols: 10,
    wallsAreFatal: false,
    occupiedRatio: 0.7,
    iterations: 25,
  }),
  createScenario({
    name: '30x50-fatal-33pct',
    numRows: 30,
    numCols: 50,
    wallsAreFatal: true,
    occupiedRatio: 0.33,
    iterations: 5,
  }),
];

const round = value => Number(value.toFixed(3));

describe('deterministic snake pathfinding benchmark', () => {
  scenarios.forEach(({ name, board, snake, food, iterations }) =>
    it(
      name,
      () => {
        pathfindGreedy(snake, food, board);
        pathfindGreedy(snake, food, board);

        const metrics = {};
        let expectedPath;
        const decisionStarted = performance.now();
        for (let iteration = 0; iteration < iterations; iteration += 1) {
          const path = pathfindGreedy(snake, food, { ...board, metrics });
          if (!expectedPath) {
            expectedPath = path;
          } else {
            expect(path).toEqual(expectedPath);
          }
        }
        const decisionDurationMs = performance.now() - decisionStarted;

        const result = {
          label: process.env.SNAKE_BENCHMARK_LABEL || 'benchmark',
          scenario: name,
          iterations,
          snakeLength: snake.parts.length,
          pathLength: expectedPath.length,
          pathSignature: expectedPath.map(({ x, y }) => `${x},${y}`).join('|'),
          graphBuildsPerDecision: round(metrics.graphBuildCount / iterations),
          graphBuildMsPerDecision: round(metrics.graphBuildDurationMs / iterations),
          searchMsPerDecision: round(metrics.searchDurationMs / iterations),
          expansionMsPerDecision: round(metrics.expansionDurationMs / iterations),
          totalMsPerDecision: round(decisionDurationMs / iterations),
        };

        expect(metrics.graphBuildCount).toBeGreaterThan(0);
        expect(metrics.searchCount).toBe(metrics.graphBuildCount);
        console.log(`SNAKE_BENCHMARK ${JSON.stringify(result)}`);
      },
      120000,
    ),
  );
});
