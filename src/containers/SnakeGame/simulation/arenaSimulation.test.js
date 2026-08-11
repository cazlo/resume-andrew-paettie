import { createArenaSimulation, stepArenaSimulation } from './arenaSimulation';
import { GameOutcome } from './deterministicGame';
import Action from '../actions/Action';

const UINT32_RANGE = 4294967296;

const seedFor = (generation, index) => {
  const value = Math.imul(generation + 1, 2654435761) + Math.imul(index + 1, 2246822519);
  return ((value % UINT32_RANGE) + UINT32_RANGE) % UINT32_RANGE;
};

const advance = (simulation, frames) => {
  let current = simulation;
  for (let frame = 0; frame < frames; frame += 1) current = stepArenaSimulation(current);
  return current;
};

describe('arena simulation', () => {
  it('replays the same state and food stream from the same seed', () => {
    const first = advance(createArenaSimulation({ seed: 42 }), 25);
    const second = advance(createArenaSimulation({ seed: 42 }), 25);

    expect(first.outcome).toBe(second.outcome);
    expect(first.state).toEqual(second.state);
  });

  it('keeps different seeds on independent deterministic food streams', () => {
    const firstSimulation = createArenaSimulation({ seed: 42 });
    const secondSimulation = createArenaSimulation({ seed: 43 });
    const first = advance(firstSimulation, 25);
    const second = advance(secondSimulation, 25);

    expect(firstSimulation.foodProvider).not.toBe(secondSimulation.foodProvider);
    expect(firstSimulation.seen).not.toBe(secondSimulation.seen);
    expect(firstSimulation.solver).not.toBe(secondSimulation.solver);
    expect(first.state.foodTrace).not.toEqual(second.state.foodTrace);
  });

  it('does not advance a completed simulation', () => {
    const simulation = createArenaSimulation({ seed: 9 });
    const completed = { ...simulation, outcome: 'won' };

    expect(stepArenaSimulation(completed)).toBe(completed);
  });

  it('wins the first 20-seed UI cohort with both cycle algorithms', () => {
    const failures = [];
    for (const algorithm of [Action.ALGORITHMS.hamiltonian, Action.ALGORITHMS.hamiltonianShortcut]) {
      for (const wallsAreFatal of [true, false]) {
        for (let index = 0; index < 20; index += 1) {
          const seed = seedFor(0, index);
          let simulation = createArenaSimulation({
            seed,
            board: { numRows: 6, numCols: 6, wallsAreFatal },
            algorithm,
          });
          while (simulation.outcome === 'running') simulation = stepArenaSimulation(simulation);

          if (simulation.outcome !== GameOutcome.WON) {
            failures.push({
              algorithm,
              seed: seed.toString(16).toUpperCase().padStart(8, '0'),
              wallsAreFatal,
              outcome: simulation.outcome,
              score: simulation.state.score,
              frameCount: simulation.state.frameCount,
            });
          }
          expect(simulation.state.perfectScore).toBe(35);
          expect(simulation.state.frameCount).toBeLessThanOrEqual(simulation.maxFrames);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it('recovers every fatal-wall greedy game in the first 20-seed UI cohort', () => {
    const failures = [];
    for (let index = 0; index < 20; index += 1) {
      const seed = seedFor(0, index);
      let simulation = createArenaSimulation({
        seed,
        board: { numRows: 6, numCols: 6, wallsAreFatal: true },
        algorithm: Action.ALGORITHMS.greedy,
      });
      while (simulation.outcome === 'running') simulation = stepArenaSimulation(simulation);
      if (simulation.outcome !== GameOutcome.WON) {
        failures.push({
          seed: seed.toString(16).toUpperCase().padStart(8, '0'),
          outcome: simulation.outcome,
          score: simulation.state.score,
          frameCount: simulation.state.frameCount,
        });
      }
    }
    expect(failures).toEqual([]);
  });
});
