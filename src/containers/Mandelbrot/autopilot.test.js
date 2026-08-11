import { chooseTarget, interiorFraction } from './autopilot';

const SIZE = 17; // odd, so there is a true centre cell
const view = { cx: -0.5, cy: 0.25, halfHeight: 0.5 };
const ASPECT = 2;

/** Grid whose left half is interior, with the boundary running down column x. */
const verticalEdge = (edgeColumn = 8) => {
  const grid = new Float32Array(SIZE * SIZE);
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) grid[y * SIZE + x] = x < edgeColumn ? -1 : 10 + x;
  }
  return grid;
};

describe('chooseTarget', () => {
  it('aims at the boundary, in complex coordinates', () => {
    const target = chooseTarget(verticalEdge(), SIZE, SIZE, view, ASPECT);
    expect(target).not.toBeNull();
    expect(target.kind).toBe('edge');
    expect(target.cx).toBeCloseTo(view.cx, 6);
    expect(target.cy).toBeCloseTo(view.cy, 6);
  });

  it('prefers the boundary nearest the centre so the camera glides', () => {
    // Two edges in frame: one dead centre, one out toward the rim.
    const grid = verticalEdge(8);
    for (let y = 0; y < SIZE; y += 1) {
      for (let x = 13; x < SIZE; x += 1) grid[y * SIZE + x] = x < 15 ? 40 + x : -1;
    }
    const target = chooseTarget(grid, SIZE, SIZE, view, ASPECT);
    expect(Math.abs(target.cx - view.cx)).toBeLessThan(view.halfHeight * ASPECT * 0.2);
  });

  it('falls back to turbulence when the set is out of frame', () => {
    const grid = new Float32Array(SIZE * SIZE);
    for (let y = 0; y < SIZE; y += 1) {
      for (let x = 0; x < SIZE; x += 1) grid[y * SIZE + x] = 5 + Math.abs(x - 8) * 6;
    }
    const target = chooseTarget(grid, SIZE, SIZE, view, ASPECT);
    expect(target).not.toBeNull();
    expect(target.kind).toBe('filament');
  });

  it('returns nothing to chase in flat interior', () => {
    expect(chooseTarget(new Float32Array(SIZE * SIZE).fill(-1), SIZE, SIZE, view, ASPECT)).toBeNull();
  });

  it('returns nothing to chase in flat open sky', () => {
    expect(chooseTarget(new Float32Array(SIZE * SIZE).fill(3), SIZE, SIZE, view, ASPECT)).toBeNull();
  });

  it('ignores boundaries pinned to the rim, which leave frame before the camera arrives', () => {
    // Interior in the leftmost column only, flat sky elsewhere: the sole edge
    // sits outside the usable margin and there is no turbulence to fall back on.
    const grid = new Float32Array(SIZE * SIZE).fill(12);
    for (let y = 0; y < SIZE; y += 1) grid[y * SIZE] = -1;
    expect(chooseTarget(grid, SIZE, SIZE, view, ASPECT)).toBeNull();
  });
});

describe('interiorFraction', () => {
  it('measures how much of the frame never escapes', () => {
    expect(interiorFraction(new Float32Array([-1, -1, 4, 9]))).toBe(0.5);
    expect(interiorFraction(new Float32Array(0))).toBe(0);
  });
});
