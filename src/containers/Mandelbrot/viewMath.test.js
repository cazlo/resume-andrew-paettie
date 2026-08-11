import {
  DEFAULT_VIEW,
  PRECISION_FLOOR,
  advanceView,
  approach,
  atPrecisionFloor,
  coversViewport,
  driftSeed,
  frameDestRect,
  magnification,
  maxIterForView,
  nextSeed,
  panByPixels,
  pixelToComplex,
  zoomAtPixel,
  zoomStep,
} from './viewMath';
import { FORMULAS } from './formulas';

const WIDTH = 800;
const HEIGHT = 400;
const view = { cx: -0.5, cy: 0.25, halfHeight: 0.5 };

describe('pixelToComplex', () => {
  it('puts the view centre at the canvas centre', () => {
    const at = pixelToComplex(WIDTH / 2, HEIGHT / 2, view, WIDTH, HEIGHT);
    expect(at.re).toBeCloseTo(view.cx, 12);
    expect(at.im).toBeCloseTo(view.cy, 12);
  });

  it('flips the vertical axis, because screen y grows downward', () => {
    const top = pixelToComplex(0, 0, view, WIDTH, HEIGHT);
    const bottom = pixelToComplex(0, HEIGHT, view, WIDTH, HEIGHT);
    expect(top.im).toBeCloseTo(view.cy + view.halfHeight, 12);
    expect(bottom.im).toBeCloseTo(view.cy - view.halfHeight, 12);
  });
});

describe('frameDestRect', () => {
  it('blits a frame rendered for the current view one-to-one', () => {
    const frame = { view, aspect: WIDTH / HEIGHT };
    const rect = frameDestRect(frame, view, WIDTH, HEIGHT);
    expect(rect.dx).toBeCloseTo(0, 9);
    expect(rect.dy).toBeCloseTo(0, 9);
    expect(rect.dw).toBeCloseTo(WIDTH, 9);
    expect(rect.dh).toBeCloseTo(HEIGHT, 9);
  });

  it('scales an older, wider frame up as the view zooms past it', () => {
    const frame = { view, aspect: WIDTH / HEIGHT };
    const zoomed = { ...view, halfHeight: view.halfHeight / 4 };
    const rect = frameDestRect(frame, zoomed, WIDTH, HEIGHT);
    expect(rect.dw).toBeCloseTo(WIDTH * 4, 6);
    expect(rect.dx).toBeCloseTo(-WIDTH * 1.5, 6);
  });
});

describe('coversViewport', () => {
  it('is true only when the blit reaches every edge', () => {
    expect(coversViewport({ dx: 0, dy: 0, dw: WIDTH, dh: HEIGHT }, WIDTH, HEIGHT)).toBe(true);
    expect(coversViewport({ dx: 10, dy: 0, dw: WIDTH, dh: HEIGHT }, WIDTH, HEIGHT)).toBe(false);
    expect(coversViewport({ dx: -5, dy: -5, dw: WIDTH, dh: HEIGHT }, WIDTH, HEIGHT)).toBe(false);
  });
});

describe('zoomAtPixel', () => {
  it('pins the complex point under the cursor', () => {
    const before = pixelToComplex(120, 310, view, WIDTH, HEIGHT);
    const zoomed = zoomAtPixel(view, 120, 310, 3, WIDTH, HEIGHT);
    const after = pixelToComplex(120, 310, zoomed, WIDTH, HEIGHT);
    expect(after.re).toBeCloseTo(before.re, 12);
    expect(after.im).toBeCloseTo(before.im, 12);
    expect(zoomed.halfHeight).toBeCloseTo(view.halfHeight / 3, 12);
  });
});

describe('panByPixels', () => {
  it('drags the plane with the pointer', () => {
    const perPixel = (2 * view.halfHeight) / HEIGHT;
    const panned = panByPixels(view, 10, -20, HEIGHT);
    expect(panned.cx).toBeCloseTo(view.cx - 10 * perPixel, 12);
    expect(panned.cy).toBeCloseTo(view.cy - 20 * perPixel, 12);
    expect(panned.halfHeight).toBe(view.halfHeight);
  });
});

describe('pacing', () => {
  it('zooms by a fixed factor per second regardless of frame timing', () => {
    const oneStep = zoomStep(1, 0.5, 1);
    let split = 1;
    for (let i = 0; i < 10; i += 1) split = zoomStep(split, 0.5, 0.1);
    expect(split).toBeCloseTo(oneStep, 12);
  });

  it('closes the gap toward a target without overshooting', () => {
    let value = 0;
    for (let i = 0; i < 200; i += 1) value = approach(value, 10, 2, 0.016);
    expect(value).toBeGreaterThan(9.9);
    expect(value).toBeLessThan(10);
  });

  it('converges the centre faster than the zoom shrinks the frame', () => {
    // Otherwise the target drifts off screen mid-dive: its offset is measured
    // in complex units that are themselves shrinking.
    const target = { cx: view.cx + 0.2, cy: view.cy };
    const offsetIn = Math.abs(view.cx - target.cx) / view.halfHeight;
    const next = advanceView(view, target, 0.32, 0.5);
    const offsetOut = Math.abs(next.cx - target.cx) / next.halfHeight;
    expect(offsetOut).toBeLessThan(offsetIn);
    expect(next.halfHeight).toBeLessThan(view.halfHeight);
  });

  it('leaves the centre alone when there is no target', () => {
    const next = advanceView(view, null, 0.32, 0.5);
    expect(next.cx).toBe(view.cx);
    expect(next.cy).toBe(view.cy);
  });
});

describe('depth budgeting', () => {
  it('reports magnification against the opening shot', () => {
    expect(magnification(DEFAULT_VIEW)).toBeCloseTo(1, 12);
    expect(magnification({ ...DEFAULT_VIEW, halfHeight: DEFAULT_VIEW.halfHeight / 100 })).toBeCloseTo(100, 9);
  });

  it('raises the iteration ceiling with depth and then caps it', () => {
    const shallow = maxIterForView(DEFAULT_VIEW);
    const deep = maxIterForView({ ...DEFAULT_VIEW, halfHeight: DEFAULT_VIEW.halfHeight / 1e6 });
    expect(deep).toBeGreaterThan(shallow);
    expect(maxIterForView({ ...DEFAULT_VIEW, halfHeight: PRECISION_FLOOR })).toBeLessThanOrEqual(4000);
  });

  it('trades iterations for frame time at the caller s request', () => {
    const deep = { ...DEFAULT_VIEW, halfHeight: DEFAULT_VIEW.halfHeight / 1e4 };
    expect(maxIterForView(deep, { scale: 1.45 })).toBeGreaterThan(maxIterForView(deep));
    expect(maxIterForView(deep, { scale: 0.8 })).toBeLessThan(maxIterForView(deep));
    // The cap binds after scaling, so no setting can run the budget away.
    expect(maxIterForView({ ...DEFAULT_VIEW, halfHeight: PRECISION_FLOOR }, { scale: 4 })).toBe(4000);
  });

  it('flags the double-precision floor', () => {
    expect(atPrecisionFloor(DEFAULT_VIEW)).toBe(false);
    expect(atPrecisionFloor({ ...DEFAULT_VIEW, halfHeight: PRECISION_FLOOR / 2 })).toBe(true);
  });
});

describe('nextSeed', () => {
  const { seeds } = FORMULAS.find(f => f.id === 'mandelbrot');

  it('never hands back the seed already in use', () => {
    seeds.forEach(seed => {
      [0, 0.5, 0.999].forEach(roll => expect(nextSeed(seeds, seed.name, roll).name).not.toBe(seed.name));
    });
  });

  it('stays in range at the ends of the roll', () => {
    expect(nextSeed(seeds, 'Home', 0)).toBe(seeds[0]);
    expect(nextSeed(seeds, 'Home', 1)).toBe(seeds[seeds.length - 1]);
  });

  it('has nothing to offer a formula with no curated addresses', () => {
    expect(nextSeed([], 'Home', 0.5)).toBeNull();
    expect(nextSeed(FORMULAS.find(f => f.id === 'newton').seeds, 'Home')).toBeNull();
  });
});

describe('driftSeed', () => {
  it('lands inside the formula default view', () => {
    const home = { cx: 0, cy: 0, halfHeight: 1.6 };
    [
      [0, 0],
      [1, 1],
      [0.5, 0.5],
      [0.2, 0.9],
    ].forEach(([rx, ry]) => {
      const seed = driftSeed(home, rx, ry);
      expect(Math.abs(seed.cx - home.cx)).toBeLessThanOrEqual(home.halfHeight);
      expect(Math.abs(seed.cy - home.cy)).toBeLessThanOrEqual(home.halfHeight);
      expect(seed.halfHeight).toBeLessThan(home.halfHeight);
    });
  });

  it('lands somewhere different each roll, or every warp would replay the dive', () => {
    expect(driftSeed({ cx: 0, cy: 0, halfHeight: 1 }, 0.1, 0.1)).not.toEqual(
      driftSeed({ cx: 0, cy: 0, halfHeight: 1 }, 0.9, 0.9),
    );
  });
});
