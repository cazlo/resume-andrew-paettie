import {
  DEFAULT_FORMULA_ID,
  DROSTE_PERIOD,
  FIBONACCI,
  FORMULAS,
  GOLDEN_ANGLE,
  TRAPS,
  armCount,
  burningShipSample,
  drosteSample,
  formulaById,
  indexAngle,
  juliaSample,
  kaliSample,
  mandelbrotSample,
  newtonSample,
  phyllotaxisSample,
  trapById,
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

describe('orbit traps', () => {
  const c = { re: -0.123, im: 0.745 };

  it('colours bounded orbits instead of leaving them a silhouette', () => {
    // Escape time has nothing to say about a point inside the set.
    expect(mandelbrotSample(-0.2, 0, 400)).toBe(-1);
    // A trap does: still flagged bounded, but carrying a colour.
    const trapped = mandelbrotSample(-0.2, 0, 400, null, 1);
    expect(trapped).toBeLessThan(-2);
    expect(-trapped - 2).toBeGreaterThan(0);
  });

  it('keeps the bounded encoding clear of the plain solid marker', () => {
    // -1 means "solid, nothing to say"; a trapped bounded orbit must never
    // land there, or the renderer would flat-fill a coloured pixel.
    for (let re = -2; re <= 0.5; re += 0.07) {
      for (let im = -1.2; im <= 1.2; im += 0.07) {
        TRAPS.forEach(trap => {
          const value = mandelbrotSample(re, im, 200, null, trap.kind);
          expect(value === -1 || value >= 0 || value <= -2).toBe(true);
        });
      }
    }
  });

  it('skips the algebraic interior tests, which never compute an orbit', () => {
    // Dead centre of the main cardioid: the shortcut would return before the
    // trap had seen a single step.
    expect(mandelbrotSample(-0.1, 0, 300, null, 2)).toBeLessThan(-2);
  });

  it('gives each trap shape a different answer for the same point', () => {
    const values = TRAPS.map(trap => juliaSample(0.35, 0.2, 300, c, trap.kind));
    expect(new Set(values).size).toBe(TRAPS.length);
  });

  it('resolves trap ids with a fallback to plain escape time', () => {
    expect(trapById('cross').kind).toBe(2);
    expect(trapById('nope').kind).toBe(0);
  });
});

describe('kaliSample', () => {
  it('colours every pixel, since the orbit never escapes', () => {
    for (let re = -1.2; re <= 1.2; re += 0.11) {
      for (let im = -1.2; im <= 1.2; im += 0.11) {
        expect(kaliSample(re, im, 16, { re: 0.75, im: 0.75 })).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('produces structure that varies across the plane', () => {
    const values = [];
    for (let i = 0; i < 40; i += 1) values.push(kaliSample(-1 + i * 0.05, 0.3, 16, { re: 0.75, im: 0.75 }));
    const mean = values.reduce((a, b) => a + b) / values.length;
    const spread = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
    expect(spread).toBeGreaterThan(0.05);
  });

  it('survives the origin, where the inversion is undefined', () => {
    expect(Number.isFinite(kaliSample(0, 0, 16, { re: 0.75, im: 0.75 }))).toBe(true);
  });
});

describe('drosteSample', () => {
  const param = { re: -0.4, im: 0.6 };
  const at = (x, y) => drosteSample(x, y, 300, param);

  it('is exactly unchanged by a zoom of one period', () => {
    // This is the whole trick: the camera can multiply its scale back by the
    // period forever, because the image at both scales is the same image.
    [
      [0.4, 0.13],
      [-0.62, 0.27],
      [0.05, -0.8],
      [-0.31, -0.44],
    ].forEach(([x, y]) => {
      expect(at(x * DROSTE_PERIOD, y * DROSTE_PERIOD)).toBeCloseTo(at(x, y), 6);
      expect(at(x / DROSTE_PERIOD, y / DROSTE_PERIOD)).toBeCloseTo(at(x, y), 6);
    });
  });

  it('has no seam where the tile wraps', () => {
    // Either side of the branch cut at angle pi, which is where a naive
    // log-polar tiling tears.
    const r = 0.5;
    const above = at(-r * Math.cos(1e-7), r * Math.sin(1e-7) + 0);
    const below = at(-r * Math.cos(1e-7), -r * Math.sin(1e-7));
    expect(Math.abs(above - below)).toBeLessThan(0.5);
  });

  it('has no tile at the fixed point itself', () => {
    expect(at(0, 0)).toBe(-1);
  });
});

describe('phyllotaxis', () => {
  const param = { count: 1400, scale: 0.029 };

  it('measures the golden angle without losing precision at large indices', () => {
    // The naive index * GOLDEN_ANGLE has thrown away the fractional part long
    // before this, which is the only part that matters.
    [0, 1, 2, 987, 1e6, 1e9].forEach(index => {
      const angle = indexAngle(index);
      expect(angle).toBeGreaterThanOrEqual(0);
      expect(angle).toBeLessThan(Math.PI * 2 + 1e-9);
    });
    expect(indexAngle(1)).toBeCloseTo(GOLDEN_ANGLE, 12);
    expect(indexAngle(3)).toBeCloseTo((3 * GOLDEN_ANGLE) % (Math.PI * 2), 9);
  });

  it('counts arms in Fibonacci numbers', () => {
    [20, 150, 1000, 7000, 60000].forEach(depth => expect(FIBONACCI).toContain(armCount(depth)));
    // Deeper into the bloom means more arms, stepping up the sequence.
    expect(armCount(20000)).toBeGreaterThan(armCount(150));
  });

  it('finds a seed near every seed position and background between them', () => {
    // Seed j sits at angle j*phi and radius scale*sqrt(count - j).
    [200, 700, 1300].forEach(j => {
      const r = param.scale * Math.sqrt(param.count - j);
      const angle = indexAngle(j);
      const value = phyllotaxisSample(r * Math.cos(angle), r * Math.sin(angle), 1, param);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });
  });

  it('leaves the space beyond the outermost seed empty', () => {
    const rim = param.scale * Math.sqrt(param.count);
    expect(phyllotaxisSample(rim * 1.4, 0, 1, param)).toBe(-1);
  });

  it('finds the same nearest seed as an exhaustive search', () => {
    // The windowed search is the only reason this is affordable; if the window
    // is too tight it silently picks the wrong seed and the arms go crooked.
    const exhaustive = (x, y) => {
      let best = Infinity;
      for (let j = 0; j <= param.count; j += 1) {
        const rj = param.scale * Math.sqrt(param.count - j);
        const angle = indexAngle(j);
        const d = (rj * Math.cos(angle) - x) ** 2 + (rj * Math.sin(angle) - y) ** 2;
        if (d < best) best = d;
      }
      return Math.sqrt(best) / param.scale;
    };
    for (let i = 0; i < 40; i += 1) {
      const angle = i * 0.618 * Math.PI * 2;
      const r = 0.05 + (i / 40) * 0.95;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      const inside = phyllotaxisSample(x, y, 1, param) >= 0;
      // The kernel reports a seed exactly when the true nearest one is close.
      expect(inside).toBe(exhaustive(x, y) <= 0.34);
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
