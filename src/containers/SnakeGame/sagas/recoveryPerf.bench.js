/* eslint-disable no-console */
import Action from '../actions/Action';
import { createArenaSimulation, stepArenaSimulation } from '../simulation/arenaSimulation';
import { GameOutcome } from '../simulation/deterministicGame';

const UINT32_RANGE = 4294967296;
const seedFor = (generation, index) => {
  const value = Math.imul(generation + 1, 2654435761) + Math.imul(index + 1, 2246822519);
  return ((value % UINT32_RANGE) + UINT32_RANGE) % UINT32_RANGE;
};

describe('greedy recovery per-frame cost', () => {
  it('measures worst-case frame time across the 20-seed 6x6 fatal cohort', () => {
    const frameTimes = [];
    for (let index = 0; index < 20; index += 1) {
      let simulation = createArenaSimulation({
        seed: seedFor(0, index),
        board: { numRows: 6, numCols: 6, wallsAreFatal: true },
        algorithm: Action.ALGORITHMS.greedyRecovery,
      });
      while (simulation.outcome === 'running') {
        const start = performance.now();
        simulation = stepArenaSimulation(simulation);
        frameTimes.push(performance.now() - start);
      }
      expect(simulation.outcome).toBe(GameOutcome.WON);
    }
    frameTimes.sort((a, b) => b - a);
    const total = frameTimes.reduce((sum, t) => sum + t, 0);
    console.log(
      'RECOVERY_BENCH',
      JSON.stringify({
        frames: frameTimes.length,
        totalMs: total.toFixed(1),
        meanMs: (total / frameTimes.length).toFixed(3),
        p50Ms: frameTimes[Math.floor(frameTimes.length / 2)].toFixed(3),
        p99Ms: frameTimes[Math.floor(frameTimes.length * 0.01)].toFixed(3),
        top5: frameTimes.slice(0, 5).map(t => t.toFixed(1)),
      }),
    );
  });
});
