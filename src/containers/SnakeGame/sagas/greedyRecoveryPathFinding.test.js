import Position from '../util/Position';
import { buildHamiltonianCycle, isSnakeCycleOrdered } from './cycleSafePathFinding';
import findPathToHamiltonianCycle from './greedyRecoveryPathFinding';

const p = Position;

describe('greedy body-state recovery search', () => {
  const board = { numRows: 6, numCols: 6, wallsAreFatal: true };

  it('recognizes either deterministic cycle orientation', () => {
    const cycle = buildHamiltonianCycle(board);
    const reverse = [...cycle].reverse();

    expect(findPathToHamiltonianCycle({ parts: [cycle[2], cycle[1], cycle[0]] }, null, board)).toMatchObject({
      cycleDirection: 'forward',
      path: [],
    });
    expect(findPathToHamiltonianCycle({ parts: [reverse[2], reverse[1], reverse[0]] }, null, board)).toMatchObject({
      cycleDirection: 'reverse',
      path: [],
    });
  });

  it('finds a reducer-accurate path to cycle order without crossing food', () => {
    const cycle = buildHamiltonianCycle(board);
    const candidates = [
      [p(1, 1), p(1, 2), p(2, 2), p(2, 1)],
      [p(1, 1), p(2, 1), p(2, 2), p(1, 2)],
      [p(2, 2), p(2, 1), p(1, 1), p(1, 2)],
      [p(2, 2), p(1, 2), p(1, 1), p(2, 1)],
      [p(1, 1), p(1, 2), p(1, 3), p(2, 3), p(2, 2), p(2, 1)],
      [p(1, 1), p(1, 2), p(1, 3), p(2, 3), p(3, 3), p(3, 2), p(2, 2)],
    ];
    const parts = candidates.find(
      candidate => !isSnakeCycleOrdered(candidate, cycle) && !isSnakeCycleOrdered(candidate, [...cycle].reverse()),
    );
    const snake = { parts };
    const food = p(4, 4);
    expect(parts).toBeDefined();
    expect(isSnakeCycleOrdered(snake.parts, cycle)).toBe(false);
    expect(isSnakeCycleOrdered(snake.parts, [...cycle].reverse())).toBe(false);
    const result = findPathToHamiltonianCycle(snake, food, board);
    const projected = result.path.reduce((currentParts, next) => [next, ...currentParts.slice(0, -1)], snake.parts);
    const targetCycle = result.cycleDirection === 'reverse' ? [...cycle].reverse() : cycle;

    expect(result.path.length).toBeGreaterThan(0);
    expect(result.path).not.toContainEqual(food);
    expect(isSnakeCycleOrdered(projected, targetCycle)).toBe(true);
  });
});
