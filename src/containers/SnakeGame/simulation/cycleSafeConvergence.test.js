import { RIGHT } from '../util/Direction';
import { createSimulationState, GameOutcome, runDeterministicGame } from './deterministicGame';
import { createSeededFoodProvider } from './foodProviders';
import { createHamiltonianPathFindingSolver, createHamiltonianShortcutPathFindingSolver } from './pathFindingSolver';

describe('cycle-safe solver convergence', () => {
  const boards = [
    { numRows: 6, numCols: 6, wallsAreFatal: true },
    { numRows: 6, numCols: 6, wallsAreFatal: false },
    { numRows: 6, numCols: 7, wallsAreFatal: true },
    { numRows: 6, numCols: 7, wallsAreFatal: false },
    { numRows: 7, numCols: 6, wallsAreFatal: true },
    { numRows: 7, numCols: 6, wallsAreFatal: false },
  ];

  it.each(boards)('wins with strict cycle following on $numRows x $numCols, fatal=$wallsAreFatal', board => {
    const provider = createSeededFoodProvider(42);
    const state = createSimulationState({
      board,
      snake: { direction: RIGHT, parts: [{ x: 1, y: 1 }] },
      providerState: provider.initialState,
    });
    const area = board.numRows * board.numCols;

    const result = runDeterministicGame({
      state,
      solver: createHamiltonianPathFindingSolver(),
      foodProvider: provider,
      maxFrames: area * (area - 1),
    });

    expect(result).toMatchObject({
      outcome: GameOutcome.WON,
      state: {
        score: area - 1,
        perfectScore: area - 1,
        food: null,
      },
    });
    expect(result.state.snake.parts).toHaveLength(area);
  });

  it.each(boards)('wins with safe shortcuts on $numRows x $numCols, fatal=$wallsAreFatal', board => {
    const provider = createSeededFoodProvider(42);
    const state = createSimulationState({
      board,
      snake: { direction: RIGHT, parts: [{ x: 1, y: 1 }] },
      providerState: provider.initialState,
    });
    const area = board.numRows * board.numCols;

    const result = runDeterministicGame({
      state,
      solver: createHamiltonianShortcutPathFindingSolver(),
      foodProvider: provider,
      maxFrames: area * (area - 1),
    });

    expect(result).toMatchObject({
      outcome: GameOutcome.WON,
      state: {
        score: area - 1,
        perfectScore: area - 1,
        food: null,
      },
    });
    expect(result.state.snake.parts).toHaveLength(area);
  });

  it('uses fewer frames than strict cycle following for a fixed 6x6 food trace', () => {
    const board = boards[0];
    const area = board.numRows * board.numCols;
    const run = solver => {
      const provider = createSeededFoodProvider(42);
      return runDeterministicGame({
        state: createSimulationState({
          board,
          snake: { direction: RIGHT, parts: [{ x: 1, y: 1 }] },
          providerState: provider.initialState,
        }),
        solver,
        foodProvider: provider,
        maxFrames: area * (area - 1),
      });
    };

    const strict = run(createHamiltonianPathFindingSolver());
    const shortcut = run(createHamiltonianShortcutPathFindingSolver());

    expect(shortcut.outcome).toBe(GameOutcome.WON);
    expect(shortcut.state.frameCount).toBeLessThan(strict.state.frameCount);
  });
});
