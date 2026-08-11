import {
  FORMULAS,
  DEFAULT_FORMULA_ID,
  burningShipSample,
  formulaById,
  juliaSample,
  mandelbrotSample,
  newtonSample,
} from './formulas';

describe('mandelbrotSample', () => {
  it('reports interior points as solid', () => {
    expect(mandelbrotSample(0, 0, 200)).toBe(-1); // main cardioid
    expect(mandelbrotSample(-1, 0, 200)).toBe(-1); // period-2 bulb
    expect(mandelbrotSample(-0.125, 0.744, 500)).toBe(-1); // period-3 bulb, via the cycle check
    expect(mandelbrotSample(-1.755, 0, 500)).toBe(-1); // period-3 island on the antenna
  });

  it('returns a fractional escape count outside the set', () => {
    const mu = mandelbrotSample(2, 2, 200);
    expect(mu).toBeGreaterThan(0);
    expect(mu).toBeLessThan(4);
    expect(Number.isInteger(mu)).toBe(false);
  });

  it('escapes later the closer the point sits to the boundary', () => {
    expect(mandelbrotSample(0.3, 0, 500)).toBeGreaterThan(mandelbrotSample(1.5, 0, 500));
  });

  it('gives up at the iteration ceiling', () => {
    expect(mandelbrotSample(-0.7436, 0.1318, 20)).toBe(-1);
    expect(mandelbrotSample(-0.7436, 0.1318, 4000)).toBeGreaterThan(20);
  });

  it('never returns a negative count for a point that escaped', () => {
    // An orbit can overshoot the bailout so far that the smoothing correction
    // exceeds 1. Unclamped that reads as -1, and the renderer would paint a
    // fast-escaping pixel as set interior.
    for (let re = -30; re <= 30; re += 1.5) {
      for (let im = -30; im <= 30; im += 1.5) {
        const mu = mandelbrotSample(re, im, 60);
        expect(mu === -1 || mu >= 0).toBe(true);
      }
    }
  });
});

describe('burningShipSample', () => {
  it('holds the origin, where the orbit never leaves zero', () => {
    expect(burningShipSample(0, 0, 500)).toBe(-1);
  });

  it('differs from the Mandelbrot wherever the fold bites', () => {
    // Same c, opposite verdicts: folding into the positive quadrant every step
    // is the whole difference between the two fractals.
    expect(burningShipSample(-0.5, 0.5, 500)).toBeGreaterThan(0);
    expect(mandelbrotSample(-0.5, 0.5, 500)).toBe(-1);
  });

  it('resolves deep boundary structure at its seeds', () => {
    FORMULAS.find(f => f.id === 'ship').seeds.forEach(seed => {
      const value = burningShipSample(seed.cx, seed.cy, 2000);
      // Seeds sit on the boundary: they take many iterations, escaping or not.
      expect(value === -1 || value > 200).toBe(true);
    });
  });
});

describe('juliaSample', () => {
  it('is the unit disk when c is zero', () => {
    // The only Julia set with a closed form worth asserting on.
    expect(juliaSample(0.5, 0, 500, { re: 0, im: 0 })).toBe(-1);
    expect(juliaSample(0, 0.9, 500, { re: 0, im: 0 })).toBe(-1);
    expect(juliaSample(1.5, 0, 500, { re: 0, im: 0 })).toBeGreaterThan(0);
  });

  it('takes z from the pixel and c from the parameter', () => {
    const c = { re: -0.8, im: 0.156 };
    expect(juliaSample(0, 0, 2000, c)).toBeGreaterThan(100);
    expect(juliaSample(2, 2, 500, c)).toBeGreaterThanOrEqual(0);
    expect(juliaSample(2, 2, 500, c)).toBeLessThan(6);
  });

  it('treats a missing parameter as c = 0 rather than throwing', () => {
    expect(juliaSample(0.5, 0, 200)).toBe(-1);
  });
});

describe('newtonSample', () => {
  const basin = value => Math.floor(value * 3);

  it('sorts points into the three basins of z^3 - 1', () => {
    expect(basin(newtonSample(1.01, 0.01, 200))).toBe(0);
    expect(basin(newtonSample(-0.5, 0.87, 200))).toBe(1);
    expect(basin(newtonSample(-0.5, -0.87, 200))).toBe(2);
  });

  it('shades within a basin by how long convergence took', () => {
    const fast = newtonSample(1.001, 0, 200);
    const slow = newtonSample(1.4, 0.35, 200);
    expect(basin(fast)).toBe(basin(slow));
    expect(slow).toBeGreaterThan(fast);
  });

  it('reports the stationary point at the origin as solid', () => {
    // f'(0) = 0, so the Newton step is undefined there.
    expect(newtonSample(0, 0, 200)).toBe(-1);
  });

  it('stays inside the palette space it claims', () => {
    for (let re = -2; re <= 2; re += 0.19) {
      for (let im = -2; im <= 2; im += 0.19) {
        const value = newtonSample(re, im, 400);
        expect(value === -1 || (value >= 0 && value < 1)).toBe(true);
      }
    }
  });
});

describe('formula registry', () => {
  it('gives every formula what the renderer and engine expect of it', () => {
    FORMULAS.forEach(formula => {
      expect(typeof formula.sample).toBe('function');
      expect(typeof formula.name).toBe('string');
      expect(typeof formula.logSpace).toBe('boolean');
      expect(formula.iterScale).toBeGreaterThan(0);
      expect(formula.defaultView.halfHeight).toBeGreaterThan(0);
      expect(Array.isArray(formula.seeds)).toBe(true);
    });
  });

  it('keeps ids unique and resolvable, with a fallback', () => {
    expect(new Set(FORMULAS.map(f => f.id)).size).toBe(FORMULAS.length);
    FORMULAS.forEach(formula => expect(formulaById(formula.id)).toBe(formula));
    expect(formulaById('nope').id).toBe(DEFAULT_FORMULA_ID);
  });

  it('gives Julia a constant with every seed, since that is what a warp changes', () => {
    const julia = formulaById('julia');
    expect(julia.defaultParam).toBeDefined();
    julia.seeds.forEach(seed => {
      expect(typeof seed.param.re).toBe('number');
      expect(typeof seed.param.im).toBe('number');
      // Disconnected Julia sets are dust; the interesting ones have c on or
      // inside the Mandelbrot boundary.
      expect(mandelbrotSample(seed.param.re, seed.param.im, 3000)).toBe(-1);
    });
  });
});
