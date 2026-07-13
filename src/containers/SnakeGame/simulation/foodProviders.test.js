import Position from '../util/Position';
import {
  createFarthestFoodProvider,
  createFixedFoodProvider,
  createSeededFoodProvider,
  enumerateLegalFoodPositions,
} from './foodProviders';

const p = Position;

describe('deterministic food providers', () => {
  const board = { numRows: 2, numCols: 3, wallsAreFatal: true };
  const state = {
    board,
    snake: { parts: [p(1, 0), p(0, 0)] },
  };

  it('enumerates unoccupied cells in stable row-major order', () => {
    expect(enumerateLegalFoodPositions(state)).toEqual([p(2, 0), p(0, 1), p(1, 1), p(2, 1)]);
  });

  it('replays a fixed trace with explicit provider state', () => {
    const provider = createFixedFoodProvider([p(2, 1), p(0, 1)]);
    const first = provider.next({ state, providerState: provider.initialState });
    const second = provider.next({ state, providerState: first.providerState });

    expect(first).toEqual({ food: p(2, 1), providerState: { index: 1 } });
    expect(second).toEqual({ food: p(0, 1), providerState: { index: 2 } });
  });

  it('rejects a fixed trace that places food on the snake', () => {
    const provider = createFixedFoodProvider([p(1, 0)]);

    expect(() => provider.next({ state, providerState: provider.initialState })).toThrow(
      'is not an unoccupied board cell',
    );
  });

  it('produces the same seeded placements from the same seed', () => {
    const firstProvider = createSeededFoodProvider(8675309);
    const secondProvider = createSeededFoodProvider(8675309);

    const first = firstProvider.next({ state, providerState: firstProvider.initialState });
    const second = secondProvider.next({ state, providerState: secondProvider.initialState });

    expect(first).toEqual(second);
    expect(first.food).toEqual(expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }));
  });

  it('places adversarial food at the stable highest-ranked cell', () => {
    const provider = createFarthestFoodProvider({
      rank: position => position.x + position.y,
    });

    expect(provider.next({ state, providerState: provider.initialState }).food).toEqual(p(2, 1));
  });
});
