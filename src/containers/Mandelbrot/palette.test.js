import { DEFAULT_PALETTE_ID, PALETTES, buildLut, interiorRgb, lutIndex, paletteById } from './palette';

describe('palettes', () => {
  it('are cyclic, so the ramp has no seam when it wraps', () => {
    PALETTES.forEach(palette => {
      expect(palette.stops[0][0]).toBe(0);
      expect(palette.stops[palette.stops.length - 1][0]).toBe(1);
      expect(palette.stops[palette.stops.length - 1][1]).toBe(palette.stops[0][1]);
    });
  });

  it('rise monotonically through their stops', () => {
    PALETTES.forEach(palette => {
      palette.stops.forEach(([pos], i) => {
        if (i > 0) expect(pos).toBeGreaterThan(palette.stops[i - 1][0]);
      });
    });
  });

  it('resolve by id and fall back to the default', () => {
    expect(paletteById('grid').id).toBe('grid');
    expect(paletteById('nope').id).toBe(DEFAULT_PALETTE_ID);
  });
});

describe('buildLut', () => {
  it('bakes one rgb triple per entry, starting at the first stop', () => {
    const lut = buildLut(PALETTES[0], 64);
    expect(lut).toHaveLength(64 * 3);
    expect(Array.from(lut.slice(0, 3))).toEqual(interiorRgb({ interior: PALETTES[0].stops[0][1] }));
  });

  it('interpolates between neighbouring stops', () => {
    const palette = {
      interior: '#000000',
      stops: [
        [0, '#000000'],
        [0.5, '#ffffff'],
        [1, '#000000'],
      ],
    };
    const lut = buildLut(palette, 100);
    const quarter = lut[25 * 3];
    expect(quarter).toBeGreaterThan(100);
    expect(quarter).toBeLessThan(155);
    expect(lut[50 * 3]).toBe(255);
  });

  it('rejects malformed stops rather than rendering silent black', () => {
    expect(() =>
      buildLut({
        interior: '#000000',
        stops: [
          [0, 'magenta'],
          [1, '#000000'],
        ],
      }),
    ).toThrow();
  });
});

describe('lutIndex', () => {
  it('stays inside the table for any escape count', () => {
    [0, 0.001, 1, 42, 3599, 1e6].forEach(mu => {
      const i = lutIndex(mu, 1024, 1.15, 0);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(1024);
    });
  });

  it('cycles rather than saturating as escape counts grow', () => {
    // Logarithmic spacing means each colour cycle covers a wider band of
    // escape counts, which is what keeps banding even at depth.
    const first = lutIndex(4, 1024, 1.15, 0);
    const wrapped = lutIndex(Math.exp((Math.log(5) * 1.15 + 1) / 1.15) - 1, 1024, 1.15, 0);
    expect(Math.abs(wrapped - first)).toBeLessThan(4);
  });

  it('rotates the whole ramp with the phase', () => {
    const shifted = lutIndex(10, 1000, 1.15, 0.25) - lutIndex(10, 1000, 1.15, 0);
    expect(((shifted % 1000) + 1000) % 1000).toBe(250);
  });
});
