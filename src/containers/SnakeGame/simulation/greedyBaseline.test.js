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
import createGreedyPathFindingSolver, { createGreedyRecoveryPathFindingSolver } from './pathFindingSolver';

const p = Position;

const fixtures = [
  fatal2x3Seed7NoLegalMove,
  fatal6x6Seed0NoLegalMove,
  fatal6x6SeedAA0F0E9FNoLegalMove,
  fatal6x6SeedB5E6A38DRepeatedState,
];

const runFixture = (fixture, solver) => {
  const provider = createSeededFoodProvider(fixture.seed);
  const state = createSimulationState({
    board: fixture.board,
    snake: { direction: RIGHT, parts: [p(1, 1)] },
    providerState: provider.initialState,
  });

  return runDeterministicGame({
    state,
    solver,
    foodProvider: provider,
    maxFrames: fixture.maxFrames,
  });
};

const assertOutcome = (result, expected) => {
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
};

describe('food/tail deterministic counterexample baseline (plain greedy)', () => {
  fixtures.forEach(fixture => {
    it(fixture.name, () => {
      const result = runFixture(fixture, createGreedyPathFindingSolver());
      const expected = fixture.currentExpected || fixture.expected;

      assertOutcome(result, expected);
    });
  });
});

describe('food/tail deterministic counterexample recovery', () => {
  fixtures.forEach(fixture => {
    it(fixture.name, () => {
      const result = runFixture(fixture, createGreedyRecoveryPathFindingSolver());
      const expected = fixture.recoveryExpected || fixture.currentExpected || fixture.expected;

      assertOutcome(result, expected);
    });
  });
});
