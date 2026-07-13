import { DOWN, LEFT, RIGHT, UP } from '../util/Direction';
import Position from '../util/Position';
import { createFixedFoodProvider } from './foodProviders';
import { GameOutcome, createSimulationState, runDeterministicGame, stepDeterministicGame } from './deterministicGame';

const p = Position;

describe('deterministic snake simulation', () => {
  it('wins at the exact perfect score using move-then-grow semantics', () => {
    const provider = createFixedFoodProvider([p(1, 0)]);
    const state = createSimulationState({
      board: { numRows: 2, numCols: 2, wallsAreFatal: true },
      snake: {
        direction: RIGHT,
        parts: [p(0, 0), p(0, 1), p(1, 1)],
      },
      score: 2,
      providerState: provider.initialState,
    });

    const result = runDeterministicGame({ state, foodProvider: provider, maxFrames: 10 });

    expect(result.outcome).toBe(GameOutcome.WON);
    expect(result.state.score).toBe(3);
    expect(result.state.snake.parts).toEqual([p(1, 0), p(0, 0), p(0, 1), p(0, 1)]);
    expect(result.state.frameCount).toBe(1);
    expect(result.foodTrace).toEqual([p(1, 0)]);
  });

  it('spawns food before the solver chooses the following direction', () => {
    const provider = createFixedFoodProvider([p(2, 1)]);
    const state = createSimulationState({
      board: { numRows: 2, numCols: 3, wallsAreFatal: true },
      snake: { direction: RIGHT, parts: [p(0, 0)] },
      food: p(1, 0),
      providerState: provider.initialState,
    });
    const solver = jest.fn(({ food, snake }) => {
      expect(food).toEqual(p(2, 1));
      expect(snake.parts).toEqual([p(1, 0), p(1, 0)]);
      return { direction: DOWN, solverState: { calls: 1 } };
    });

    const result = stepDeterministicGame(state, { foodProvider: provider, solver });

    expect(result.outcome).toBe(GameOutcome.ATE);
    expect(result.state.snake.direction).toEqual(DOWN);
    expect(result.state.solverState).toEqual({ calls: 1 });
    expect(result.state.foodTrace).toEqual([p(1, 0), p(2, 1)]);
    expect(solver).toHaveBeenCalledTimes(1);
  });

  it('detects a repeated deterministic state before food is eaten', () => {
    const state = createSimulationState({
      board: { numRows: 3, numCols: 3, wallsAreFatal: true },
      snake: { direction: RIGHT, parts: [p(0, 0)] },
      food: p(2, 2),
    });
    const directions = new Map([
      ['1,0', DOWN],
      ['1,1', LEFT],
      ['0,1', UP],
      ['0,0', RIGHT],
    ]);
    const solver = ({ snake }) => ({ direction: directions.get(`${snake.parts[0].x},${snake.parts[0].y}`) });

    const result = runDeterministicGame({ state, solver, maxFrames: 20 });

    expect(result.outcome).toBe(GameOutcome.REPEATED_STATE);
    expect(result.state.frameCount).toBe(4);
    expect(result.repeatedState.firstSeenFrame).toBe(0);
    expect(result.foodTrace).toEqual([p(2, 2)]);
  });

  it('reports collision and no-legal-move outcomes distinctly', () => {
    const collision = runDeterministicGame({
      state: createSimulationState({
        board: { numRows: 2, numCols: 2, wallsAreFatal: true },
        snake: { direction: UP, parts: [p(0, 0)] },
        food: p(1, 1),
      }),
      maxFrames: 5,
    });
    const noMove = stepDeterministicGame(
      createSimulationState({
        board: { numRows: 2, numCols: 3, wallsAreFatal: true },
        snake: { direction: RIGHT, parts: [p(0, 0)] },
        food: p(2, 1),
      }),
      { solver: () => null },
    );

    expect(collision.outcome).toBe(GameOutcome.COLLISION);
    expect(noMove.outcome).toBe(GameOutcome.NO_LEGAL_MOVE);
  });

  it('wraps at board edges and rejects non-unit solver directions', () => {
    const wrapped = stepDeterministicGame(
      createSimulationState({
        board: { numRows: 2, numCols: 3, wallsAreFatal: false },
        snake: { direction: LEFT, parts: [p(0, 0)] },
        food: p(1, 1),
      }),
    );
    const invalidDirection = stepDeterministicGame(
      createSimulationState({
        board: { numRows: 2, numCols: 3, wallsAreFatal: true },
        snake: { direction: RIGHT, parts: [p(0, 0)] },
        food: p(2, 1),
      }),
      { solver: () => ({ direction: p(2, 0) }) },
    );

    expect(wrapped.outcome).toBe(GameOutcome.MOVED);
    expect(wrapped.state.snake.parts[0]).toEqual(p(2, 0));
    expect(invalidDirection.outcome).toBe(GameOutcome.NO_LEGAL_MOVE);
  });

  it('stops at the caller-provided frame bound with a replayable trace', () => {
    const state = createSimulationState({
      board: { numRows: 2, numCols: 3, wallsAreFatal: false },
      snake: { direction: RIGHT, parts: [p(0, 0)] },
      food: p(2, 1),
      solverState: { calls: 0 },
    });
    const solver = currentState => ({
      direction: RIGHT,
      solverState: { calls: currentState.solverState.calls + 1 },
    });

    const result = runDeterministicGame({ state, solver, maxFrames: 3 });

    expect(result.outcome).toBe(GameOutcome.TIMEOUT);
    expect(result.state.frameCount).toBe(3);
    expect(result.events).toHaveLength(3);
    expect(result.foodTrace).toEqual([p(2, 1)]);
  });
});
