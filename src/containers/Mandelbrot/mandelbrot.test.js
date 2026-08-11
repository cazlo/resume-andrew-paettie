import { COARSE_STRIDE, alignDimension, escapeSmooth, renderBand, splitBands } from './mandelbrot';
import { buildLut, PALETTES } from './palette';

describe('escapeSmooth', () => {
  it('reports interior points as never escaping', () => {
    expect(escapeSmooth(0, 0, 200)).toBe(-1); // main cardioid
    expect(escapeSmooth(-1, 0, 200)).toBe(-1); // period-2 bulb
    expect(escapeSmooth(-0.125, 0.744, 500)).toBe(-1); // period-3 bulb, caught by the cycle check
    expect(escapeSmooth(-1.755, 0, 500)).toBe(-1); // period-3 island out on the antenna
  });

  it('returns a fractional escape count outside the set', () => {
    const mu = escapeSmooth(2, 2, 200);
    expect(mu).toBeGreaterThan(0);
    expect(mu).toBeLessThan(4);
    expect(Number.isInteger(mu)).toBe(false);
  });

  it('escapes later the closer the point sits to the boundary', () => {
    const far = escapeSmooth(1.5, 0, 500);
    const near = escapeSmooth(0.3, 0, 500);
    expect(near).toBeGreaterThan(far);
  });

  it('gives up at the iteration ceiling', () => {
    // Just outside the boundary: escapes eventually, but not within 20 steps.
    expect(escapeSmooth(-0.7436, 0.1318, 20)).toBe(-1);
    expect(escapeSmooth(-0.7436, 0.1318, 4000)).toBeGreaterThan(20);
  });
});

describe('splitBands', () => {
  it('splits into stride-aligned bands that tile the frame', () => {
    const bands = splitBands(64, 4);
    expect(bands).toHaveLength(4);
    expect(bands[0].y0).toBe(0);
    expect(bands[bands.length - 1].y1).toBe(64);
    bands.forEach((band, i) => {
      expect(band.y0 % COARSE_STRIDE).toBe(0);
      expect(band.y1 % COARSE_STRIDE).toBe(0);
      if (i > 0) expect(band.y0).toBe(bands[i - 1].y1);
    });
  });

  it('never makes more bands than there are coarse rows', () => {
    expect(splitBands(24, 10)).toHaveLength(3);
    expect(splitBands(8, 4)).toHaveLength(1);
  });
});

describe('alignDimension', () => {
  it('rounds down to the coarse stride without collapsing to zero', () => {
    expect(alignDimension(100)).toBe(96);
    expect(alignDimension(64)).toBe(64);
    expect(alignDimension(3)).toBe(COARSE_STRIDE);
  });
});

describe('renderBand', () => {
  const job = (view, y0, y1) => ({
    width: 16,
    height: 16,
    y0,
    y1,
    view,
    aspect: 1,
    maxIter: 128,
    lut: buildLut(PALETTES[0], 64),
    lutSize: 64,
    density: 1.15,
    phase: 0,
    interior: [7, 8, 9],
  });

  it('fills opaque pixels and one coarse sample per stride', () => {
    const out = renderBand(job({ cx: -0.6, cy: 0, halfHeight: 1.3 }, 0, 8));
    expect(out.rgba).toHaveLength(16 * 8 * 4);
    expect(out.coarseW).toBe(2);
    expect(out.coarseRows).toBe(1);
    expect(out.coarse).toHaveLength(2);
    for (let i = 3; i < out.rgba.length; i += 4) expect(out.rgba[i]).toBe(255);
  });

  it('paints the interior colour where nothing escapes', () => {
    const out = renderBand(job({ cx: -0.2, cy: 0, halfHeight: 0.05 }, 0, 8));
    expect(Array.from(out.rgba.slice(0, 4))).toEqual([7, 8, 9, 255]);
    out.coarse.forEach(value => expect(value).toBe(-1));
  });

  it('renders each band into the same plane as the whole frame', () => {
    const view = { cx: -0.6, cy: 0, halfHeight: 1.3 };
    const whole = renderBand(job(view, 0, 16));
    const lower = renderBand(job(view, 8, 16));
    const offset = 16 * 8 * 4;
    expect(Array.from(lower.rgba)).toEqual(Array.from(whole.rgba.slice(offset)));
  });
});
