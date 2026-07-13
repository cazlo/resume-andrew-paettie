import {
  createSimulationState,
  deterministicStateSignature,
  GameOutcome,
  stepDeterministicGame,
} from './deterministicGame';
import { createSeededFoodProvider } from './foodProviders';
import createGreedyPathFindingSolver from './pathFindingSolver';
import { RIGHT } from '../util/Direction';

export const ARENA_RUNNING = 'running';

const activeOutcomes = new Set([GameOutcome.ATE, GameOutcome.MOVED]);

const spawnInitialFood = (state, provider) => {
  const placement = provider.next({
    state,
    providerState: provider.initialState,
  });
  return {
    ...state,
    food: placement.food,
    foodTrace: placement.food ? [placement.food] : [],
    providerState: placement.providerState,
  };
};

export const createArenaSimulation = ({
  seed = 0,
  board = { numCols: 6, numRows: 6, wallsAreFatal: true },
  maxFrames = 1500,
} = {}) => {
  const foodProvider = createSeededFoodProvider(seed);
  const initialState = createSimulationState({
    board,
    providerState: foodProvider.initialState,
    snake: {
      direction: RIGHT,
      parts: [{ x: 1, y: 1 }],
    },
  });
  const state = spawnInitialFood(initialState, foodProvider);

  return {
    foodProvider,
    maxFrames,
    outcome: ARENA_RUNNING,
    seed,
    seen: new Set([deterministicStateSignature(state)]),
    solver: createGreedyPathFindingSolver(),
    state,
  };
};

export const stepArenaSimulation = simulation => {
  if (simulation.outcome !== ARENA_RUNNING) return simulation;

  const result = stepDeterministicGame(simulation.state, {
    foodProvider: simulation.foodProvider,
    solver: simulation.solver,
  });
  if (!activeOutcomes.has(result.outcome)) {
    return { ...simulation, outcome: result.outcome, state: result.state };
  }
  if (result.state.frameCount >= simulation.maxFrames) {
    return { ...simulation, outcome: GameOutcome.TIMEOUT, state: result.state };
  }

  const signature = deterministicStateSignature(result.state);
  if (simulation.seen.has(signature)) {
    return {
      ...simulation,
      outcome: GameOutcome.REPEATED_STATE,
      state: result.state,
    };
  }
  // `seen` is private engine bookkeeping, not render state. Mutating this Set
  // avoids copying an ever-growing history for every agent on every fleet
  // tick; the returned simulation/state objects remain new for React updates.
  simulation.seen.add(signature);
  return { ...simulation, state: result.state };
};
