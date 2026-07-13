import { createArenaSimulation, stepArenaSimulation } from './arenaSimulation';

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
});
