import { RIGHT } from '../util/Direction';
import Position from '../util/Position';
import { createSimulationState, runDeterministicGame } from './deterministicGame';
import { createSeededFoodProvider } from './foodProviders';
import {
  fatal2x3Seed7NoLegalMove,
  fatal6x6Seed0NoLegalMove,
  fatal6x6SeedAA0F0E9FNoLegalMove,
  fatal6x6SeedB5E6A38DRepeatedState,
} from './greedyCounterexamples';
import createGreedyPathFindingSolver from './pathFindingSolver';

const p = Position;

describe('food/tail deterministic counterexample recovery', () => {
  [
    fatal2x3Seed7NoLegalMove,
    fatal6x6Seed0NoLegalMove,
    fatal6x6SeedAA0F0E9FNoLegalMove,
    fatal6x6SeedB5E6A38DRepeatedState,
  ].forEach(fixture => {
    it(fixture.name, () => {
      const provider = createSeededFoodProvider(fixture.seed);
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
      const expected = fixture.recoveryExpected || fixture.currentExpected || fixture.expected;

      expect(result.outcome).toBe(expected.outcome);
      expect(result.state).toMatchObject({
        frameCount: expected.frameCount,
        score: expected.score,
        food: expected.food,
      });
      if (expected.firstSeenFrame !== undefined) {
        expect(result.repeatedState.firstSeenFrame).toBe(expected.firstSeenFrame);
        expect(result.state.frameCount - result.repeatedState.firstSeenFrame).toBe(expected.cycleLength);
      }
    });
  });
});
