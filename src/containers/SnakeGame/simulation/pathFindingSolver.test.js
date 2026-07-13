import { DOWN, RIGHT } from '../util/Direction';
import Position from '../util/Position';
import { createSimulationState } from './deterministicGame';
import createGreedyPathFindingSolver from './pathFindingSolver';

const p = Position;

describe('deterministic food/tail solver adapter', () => {
  it('converts the current greedy path into the next direction', () => {
    const state = createSimulationState({
      board: { numRows: 3, numCols: 4, wallsAreFatal: true },
      snake: { direction: RIGHT, parts: [p(1, 1)] },
      food: p(3, 1),
    });

    expect(createGreedyPathFindingSolver()(state)).toEqual({ direction: RIGHT });
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
});
