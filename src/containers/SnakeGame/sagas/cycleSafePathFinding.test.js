import Position from '../util/Position';
import { areAdjacent } from './pathFindingTestUtils';
import {
  buildHamiltonianCycle,
  findCycleSafeNextPosition,
  findCycleShortcutNextPosition,
  isSnakeCycleOrdered,
} from './cycleSafePathFinding';

const p = Position;

describe('cycle-safe path finding', () => {
  const board = { numRows: 6, numCols: 6, wallsAreFatal: true };

  it('constructs a deterministic Hamiltonian cycle for the 6x6 arena', () => {
    const cycle = buildHamiltonianCycle(board);

    expect(cycle).toHaveLength(36);
    expect(new Set(cycle.map(({ x, y }) => `${x},${y}`))).toHaveProperty('size', 36);
    for (let index = 0; index < cycle.length; index += 1) {
      expect(areAdjacent(cycle[index], cycle[(index + 1) % cycle.length], board)).toBe(true);
    }
  });

  it.each([
    { numRows: 6, numCols: 7, wallsAreFatal: true },
    { numRows: 7, numCols: 6, wallsAreFatal: true },
    { numRows: 6, numCols: 7, wallsAreFatal: false },
    { numRows: 7, numCols: 6, wallsAreFatal: false },
  ])('constructs a complete cycle for $numRows x $numCols, fatal=$wallsAreFatal', candidateBoard => {
    const cycle = buildHamiltonianCycle(candidateBoard);
    const area = candidateBoard.numRows * candidateBoard.numCols;

    expect(cycle).toHaveLength(area);
    expect(new Set(cycle.map(({ x, y }) => `${x},${y}`))).toHaveProperty('size', area);
    for (let index = 0; index < cycle.length; index += 1) {
      expect(areAdjacent(cycle[index], cycle[(index + 1) % cycle.length], candidateBoard)).toBe(true);
    }
  });

  it('reports an odd-by-odd board as unsupported', () => {
    expect(buildHamiltonianCycle({ numRows: 7, numCols: 7, wallsAreFatal: true })).toBeNull();
  });

  it('continues the canonical first move in cycle order', () => {
    const snake = { parts: [p(2, 1)] };

    expect(findCycleSafeNextPosition(snake, p(5, 1), board)).toEqual(p(3, 1));
  });

  it('follows the cycle successor while preserving body order', () => {
    const cycle = buildHamiltonianCycle(board);
    const snake = { parts: [p(3, 1), p(2, 1), p(1, 1)] };
    const next = findCycleSafeNextPosition(snake, p(3, 2), board);
    const moved = [next, ...snake.parts.slice(0, -1)];

    expect(next).toEqual(p(4, 1));
    expect(isSnakeCycleOrdered(moved, cycle)).toBe(true);
  });

  it('takes a safe adjacent shortcut directly to food', () => {
    const snake = { parts: [p(2, 1)] };

    expect(findCycleSafeNextPosition(snake, p(2, 2), board)).toEqual(p(3, 1));
    expect(findCycleShortcutNextPosition(snake, p(2, 2), board)).toEqual(p(2, 2));
  });

  it('supports deterministic shortcuts in reverse cycle order for greedy recovery', () => {
    const cycle = [...buildHamiltonianCycle(board)].reverse();
    const snake = { parts: [cycle[2], cycle[1], cycle[0]] };

    expect(findCycleShortcutNextPosition(snake, cycle[5], board, { reverse: true })).toEqual(cycle[3]);
  });

  it('defers food when growth would consume the cycle reserve', () => {
    const cycle = buildHamiltonianCycle(board);
    const snake = { parts: [p(2, 1), p(1, 1)] };
    const food = p(2, 2);
    const next = findCycleShortcutNextPosition(snake, food, board);
    const moved = [next, ...snake.parts.slice(0, -1)];

    expect(next).toEqual(p(2, 0));
    expect(isSnakeCycleOrdered(moved, cycle)).toBe(true);
  });

  it('declines arbitrary mid-game bodies that do not satisfy cycle order', () => {
    const cycle = buildHamiltonianCycle(board);
    const snake = { parts: cycle.slice(0, 4) };

    expect(findCycleSafeNextPosition(snake, p(4, 4), board)).toBeNull();
    expect(findCycleShortcutNextPosition(snake, p(4, 4), board)).toBeNull();
  });
});
