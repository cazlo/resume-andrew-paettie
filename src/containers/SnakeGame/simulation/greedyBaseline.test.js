import { RIGHT } from '../util/Direction';
import Position from '../util/Position';
import { createSimulationState, runDeterministicGame } from './deterministicGame';
import { createFixedFoodProvider } from './foodProviders';
import { fatal2x3Seed7NoLegalMove, fatal6x6Seed0NoLegalMove } from './greedyCounterexamples';
import createGreedyPathFindingSolver from './pathFindingSolver';

const p = Position;

describe('food/tail deterministic baseline counterexamples', () => {
  it(fatal2x3Seed7NoLegalMove.name, () => {
    const fixture = fatal2x3Seed7NoLegalMove;
    const provider = createFixedFoodProvider(fixture.foodTrace);
    const state = createSimulationState({
      board: fixture.board,
      snake: { direction: RIGHT, parts: [p(1, 1)] },
      providerState: provider.initialState,
    });

    const result = runDeterministicGame({
      state,
      solver: createGreedyPathFindingSolver(),
      foodProvider: provider,
      maxFrames: fixture.maxFrames,
    });

    expect(result.foodTrace).toEqual(fixture.foodTrace);
    expect(result.outcome).toBe(fixture.expected.outcome);
    expect(result.state).toMatchObject({
      frameCount: fixture.expected.frameCount,
      score: fixture.expected.score,
      food: fixture.expected.food,
      snake: fixture.expected.snake,
    });
  });

  it(fatal6x6Seed0NoLegalMove.name, () => {
    const fixture = fatal6x6Seed0NoLegalMove;
    const provider = createFixedFoodProvider(fixture.foodTrace);
    const state = createSimulationState({
      board: fixture.board,
      snake: { direction: RIGHT, parts: [p(1, 1)] },
      providerState: provider.initialState,
    });

    const result = runDeterministicGame({
      state,
      solver: createGreedyPathFindingSolver(),
      foodProvider: provider,
      maxFrames: fixture.maxFrames,
    });

    expect(result.foodTrace).toEqual(fixture.foodTrace);
    expect(result.outcome).toBe(fixture.expected.outcome);
    expect(result.state).toMatchObject({
      frameCount: fixture.expected.frameCount,
      score: fixture.expected.score,
      food: fixture.expected.food,
    });
    expect(result.state.snake.direction).toEqual(fixture.expected.direction);
    expect(result.state.snake.parts[0]).toEqual(fixture.expected.head);
    expect(result.state.snake.parts.slice(-2)).toEqual([
      fixture.expected.duplicatedTail,
      fixture.expected.duplicatedTail,
    ]);
  });
});
