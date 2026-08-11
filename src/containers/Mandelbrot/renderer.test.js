import { COARSE_STRIDE, alignDimension, renderBand, splitBands } from './renderer';
import { buildLut, PALETTES } from './palette';

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
  const job = (view, y0, y1, extra = {}) => ({
    width: 16,
    height: 16,
    y0,
    y1,
    view,
    aspect: 1,
    maxIter: 128,
    formulaId: 'mandelbrot',
    lut: buildLut(PALETTES[0], 64),
    lutSize: 64,
    density: 1.15,
    phase: 0,
    interior: [7, 8, 9],
    ...extra,
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

  it('draws a different fractal for a different formula id', () => {
    const view = { cx: -0.5, cy: -0.5, halfHeight: 1.2 };
    const mandelbrot = renderBand(job(view, 0, 16));
    const ship = renderBand(job(view, 0, 16, { formulaId: 'ship' }));
    expect(Array.from(ship.coarse)).not.toEqual(Array.from(mandelbrot.coarse));
  });

  it('passes the Julia constant through to the kernel', () => {
    const view = { cx: 0, cy: 0, halfHeight: 1.4 };
    const rabbit = renderBand(job(view, 0, 16, { formulaId: 'julia', param: { re: -0.123, im: 0.745 } }));
    const disk = renderBand(job(view, 0, 16, { formulaId: 'julia', param: { re: 0, im: 0 } }));
    expect(Array.from(rabbit.coarse)).not.toEqual(Array.from(disk.coarse));
  });

  it('lets a formula override the palette density it is coloured with', () => {
    // Newton hands back a palette position rather than an escape count, so it
    // must not be run through the log remap the escape-time formulas use.
    const out = renderBand(job({ cx: 0, cy: 0, halfHeight: 1.6 }, 0, 16, { formulaId: 'newton' }));
    out.coarse.forEach(value => expect(value === -1 || (value >= 0 && value < 1)).toBe(true));
  });
});
