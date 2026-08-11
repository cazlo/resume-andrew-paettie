/* eslint-disable no-bitwise */
/*
 * The escape-time kernel. This file is the hot loop: it runs inside a worker
 * (see mandelbrotWorker.js) for every band of every frame, and on the main
 * thread only when workers are unavailable.
 *
 * Everything here is deliberately plain: flat typed arrays, no allocation
 * inside the pixel loop, no object churn. Bitwise ops are enabled because the
 * coarse-sample stride and the LUT index are integer maths in the innermost
 * loop.
 */

import { lutIndex } from './palette';

// Bailout radius squared. 2 is enough to know a point escapes, but the smooth
// colouring term only settles once |z| is well past it, and a small bailout
// leaves visible banding. 2^8 costs a couple of extra iterations per pixel and
// makes the bands continuous.
const BAILOUT2 = 65536;

// Spacing of the coarse escape samples the autopilot steers by. Frame
// dimensions are rounded to a multiple of this so bands split cleanly and the
// coarse grid needs no interpolation.
export const COARSE_STRIDE = 8;

/**
 * Smooth (fractional) escape count for one point, or -1 if it never escapes.
 *
 * Two shortcuts keep interior regions affordable:
 *   - the main cardioid and the period-2 bulb are solved algebraically, which
 *     covers most of the interior area at shallow zoom;
 *   - deeper in, orbits that fall into a cycle are caught by comparing against
 *     a periodically refreshed reference point (Brent-style), which ends
 *     interior pixels in tens of iterations instead of thousands.
 */
export function escapeSmooth(cr, ci, maxIter) {
  const xm = cr - 0.25;
  const ci2 = ci * ci;
  const q = xm * xm + ci2;
  if (q * (q + xm) <= 0.25 * ci2) return -1;
  const bulb = cr + 1;
  if (bulb * bulb + ci2 <= 0.0625) return -1;

  let zr = 0;
  let zi = 0;
  let zr2 = 0;
  let zi2 = 0;
  let refR = 0;
  let refI = 0;
  let period = 0;
  let periodLimit = 8;

  for (let i = 0; i < maxIter; i += 1) {
    zi = 2 * zr * zi + ci;
    zr = zr2 - zi2 + cr;
    zr2 = zr * zr;
    zi2 = zi * zi;
    const mag2 = zr2 + zi2;
    if (mag2 > BAILOUT2) {
      // mu = i + 1 - log2(log2|z|), the standard continuous escape count.
      const logZ = Math.log(mag2) * 0.5;
      return i + 1 - Math.log(logZ / Math.LN2) / Math.LN2;
    }
    if (zr === refR && zi === refI) return -1;
    period += 1;
    if (period >= periodLimit) {
      period = 0;
      periodLimit *= 2;
      refR = zr;
      refI = zi;
    }
  }
  return -1;
}

/**
 * Render one horizontal band of a frame.
 *
 * `y0`/`y1` are row bounds into a `width` x `height` frame; both must be
 * multiples of COARSE_STRIDE, as must the frame dimensions. Returns the band's
 * RGBA pixels plus the coarse escape samples that fall inside it, both as
 * transferable typed arrays.
 */
export function renderBand(job) {
  const { width, height, y0, y1, view, aspect, maxIter, lut, lutSize, density, phase, interior } = job;

  const bandHeight = y1 - y0;
  const rgba = new Uint8ClampedArray(width * bandHeight * 4);
  const coarseW = Math.floor(width / COARSE_STRIDE);
  const coarseRows = Math.floor(bandHeight / COARSE_STRIDE);
  const coarse = new Float32Array(coarseW * coarseRows);

  const perPixel = (2 * view.halfHeight) / height;
  const left = view.cx - view.halfHeight * aspect;
  const top = view.cy + view.halfHeight;
  const [ir, ig, ib] = interior;

  let p = 0;
  for (let y = y0; y < y1; y += 1) {
    const ci = top - (y + 0.5) * perPixel;
    const coarseRow = (y - y0) % COARSE_STRIDE === 0 ? ((y - y0) / COARSE_STRIDE) * coarseW : -1;
    for (let x = 0; x < width; x += 1) {
      const cr = left + (x + 0.5) * perPixel;
      const mu = escapeSmooth(cr, ci, maxIter);
      if (mu < 0) {
        rgba[p] = ir;
        rgba[p + 1] = ig;
        rgba[p + 2] = ib;
      } else {
        const idx = lutIndex(mu, lutSize, density, phase) * 3;
        rgba[p] = lut[idx];
        rgba[p + 1] = lut[idx + 1];
        rgba[p + 2] = lut[idx + 2];
      }
      rgba[p + 3] = 255;
      p += 4;
      if (coarseRow >= 0 && x % COARSE_STRIDE === 0) {
        coarse[coarseRow + x / COARSE_STRIDE] = mu;
      }
    }
  }

  return { rgba, coarse, coarseW, coarseRows };
}

/**
 * Split a frame into `count` bands aligned to COARSE_STRIDE. More bands than
 * workers is intentional: interior-heavy rows cost an order of magnitude more
 * than open sky, so short bands let idle workers pick up the slack.
 */
export function splitBands(height, count) {
  const rows = Math.floor(height / COARSE_STRIDE);
  const n = Math.max(1, Math.min(count, rows));
  const bands = [];
  for (let i = 0; i < n; i += 1) {
    const r0 = Math.floor((rows * i) / n);
    const r1 = Math.floor((rows * (i + 1)) / n);
    if (r1 > r0) bands.push({ y0: r0 * COARSE_STRIDE, y1: r1 * COARSE_STRIDE });
  }
  return bands;
}

/** Round a pixel dimension down to something the band splitter can divide. */
export const alignDimension = value => Math.max(COARSE_STRIDE, Math.floor(value / COARSE_STRIDE) * COARSE_STRIDE);
