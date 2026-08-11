/*
 * Vaporwave colour ramps for the Mandelbrot renderer.
 *
 * A palette is a list of cyclic stops: the stop at 1 repeats the stop at 0 so
 * the ramp can be indexed modulo its length without a seam. Ramps are baked
 * once into a flat RGB lookup table because the renderer colours a million
 * pixels per frame and cannot afford per-pixel interpolation.
 */

const HEX = /^#([0-9a-f]{6})$/i;

const toRgb = hex => {
  const match = HEX.exec(hex);
  if (!match) throw new Error(`palette stop must be #rrggbb, got ${hex}`);
  const n = parseInt(match[1], 16);
  // eslint-disable-next-line no-bitwise
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const PALETTES = [
  {
    id: 'sunset',
    name: 'Sunset Drive',
    interior: '#0b0320',
    stops: [
      [0, '#150a2c'],
      [0.12, '#3b1367'],
      [0.28, '#b967ff'],
      [0.44, '#ff5ec4'],
      [0.58, '#ff9f6e'],
      [0.7, '#fdf3c8'],
      [0.85, '#01cdfe'],
      [1, '#150a2c'],
    ],
  },
  {
    id: 'grid',
    name: 'Neon Grid',
    interior: '#03101a',
    stops: [
      [0, '#03121f'],
      [0.16, '#0b3d63'],
      [0.34, '#01cdfe'],
      [0.48, '#ccfff6'],
      [0.62, '#05ffa1'],
      [0.8, '#1b6f7d'],
      [1, '#03121f'],
    ],
  },
  {
    id: 'miami',
    name: 'Miami Heat',
    interior: '#160317',
    stops: [
      [0, '#1a0424'],
      [0.14, '#7a1f57'],
      [0.3, '#ff2e93'],
      [0.46, '#ff9f6e'],
      [0.6, '#ffe8b0'],
      [0.78, '#b967ff'],
      [1, '#1a0424'],
    ],
  },
];

export const DEFAULT_PALETTE_ID = PALETTES[0].id;

export const paletteById = id => PALETTES.find(p => p.id === id) || PALETTES[0];

/**
 * Bake a palette into `size` RGB triples. Returns a flat Uint8Array of length
 * size * 3, interpolating linearly between stops in sRGB space.
 */
export function buildLut(palette, size = 1024) {
  const stops = palette.stops.map(([pos, hex]) => ({ pos, rgb: toRgb(hex) }));
  const lut = new Uint8Array(size * 3);
  let seg = 0;
  for (let i = 0; i < size; i += 1) {
    const p = i / size;
    while (seg < stops.length - 2 && p > stops[seg + 1].pos) seg += 1;
    const a = stops[seg];
    const b = stops[seg + 1];
    const span = b.pos - a.pos || 1;
    const t = Math.min(1, Math.max(0, (p - a.pos) / span));
    lut[i * 3] = a.rgb[0] + (b.rgb[0] - a.rgb[0]) * t;
    lut[i * 3 + 1] = a.rgb[1] + (b.rgb[1] - a.rgb[1]) * t;
    lut[i * 3 + 2] = a.rgb[2] + (b.rgb[2] - a.rgb[2]) * t;
  }
  return lut;
}

/**
 * Map a smooth escape count onto a LUT index.
 *
 * Escape counts grow logarithmically as the view descends into the boundary,
 * so the ramp is indexed by log(1 + mu). That keeps band spacing roughly
 * constant at every zoom depth instead of smearing at the surface and
 * strobing down deep. `density` sets how many colour cycles fit in that space
 * and `phase` rotates the whole ramp for the palette-cycling animation.
 */
export function lutIndex(mu, size, density = 1.15, phase = 0) {
  const t = Math.log(1 + Math.max(0, mu)) * density + phase;
  const f = t - Math.floor(t);
  const i = Math.floor(f * size);
  return i < 0 ? 0 : Math.min(size - 1, i);
}

export const interiorRgb = palette => toRgb(palette.interior);
