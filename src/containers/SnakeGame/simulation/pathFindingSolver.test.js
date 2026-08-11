import { DOWN, RIGHT, UP } from '../util/Direction';
import Position from '../util/Position';
import { createSimulationState } from './deterministicGame';
import createGreedyPathFindingSolver, {
  createGreedyRecoveryPathFindingSolver,
  createHamiltonianPathFindingSolver,
  createHamiltonianShortcutPathFindingSolver,
} from './pathFindingSolver';

const p = Position;

describe('deterministic food/tail solver adapter', () => {
  it('converts the current greedy path into the next direction', () => {
    const state = createSimulationState({
      board: { numRows: 3, numCols: 4, wallsAreFatal: true },
      snake: { direction: RIGHT, parts: [p(1, 1)] },
      food: p(3, 1),
    });

    expect(createGreedyPathFindingSolver()(state)).toEqual({ direction: RIGHT });
    expect(createHamiltonianPathFindingSolver()(state)).toEqual({ direction: DOWN });
    expect(createHamiltonianShortcutPathFindingSolver()(state)).toEqual({ direction: UP });
  });

  it('uses the configured stable neighbor order for survival fallback', () => {
    const state = createSimulationState({
      board: { numRows: 3, numCols: 3, wallsAreFatal: true },
      snake: { direction: RIGHT, parts: [p(1, 1)] },
    });
    const solver = createGreedyPathFindingSolver({
      orderSurvivalNeighbors: neighbors => [...neighbors].reverse(),
    });

    expect(solver(state)).toEqual({ direction: DOWN });
  });

  it('recovery solver returns a direction plus solver state', () => {
    const state = createSimulationState({
      board: { numRows: 3, numCols: 4, wallsAreFatal: true },
      snake: { direction: RIGHT, parts: [p(1, 1)] },
      food: p(3, 1),
    });

    expect(createGreedyRecoveryPathFindingSolver()(state)).toMatchObject({
      direction: RIGHT,
      solverState: expect.objectContaining({ mode: expect.any(String) }),
    });
  });

  it('recovery solver uses the configured stable neighbor order for survival fallback', () => {
    const state = createSimulationState({
      board: { numRows: 3, numCols: 3, wallsAreFatal: true },
      snake: { direction: RIGHT, parts: [p(1, 1)] },
    });
    const solver = createGreedyRecoveryPathFindingSolver({
      orderSurvivalNeighbors: neighbors => [...neighbors].reverse(),
    });

    expect(solver(state)).toMatchObject({ direction: DOWN, solverState: expect.any(Object) });
  });
});
