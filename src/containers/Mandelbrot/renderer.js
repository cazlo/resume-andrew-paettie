/* eslint-disable no-bitwise */
/*
 * Band renderer. This file is the hot loop: it runs inside a worker (see
 * mandelbrotWorker.js) for every band of every frame, and on the main thread
 * only when workers are unavailable.
 *
 * It is deliberately plain — flat typed arrays, no allocation inside the pixel
 * loop, no object churn. Which fractal is being drawn is resolved once per
 * band, not per pixel; the per-pixel indirection that remains is one call
 * wrapping hundreds of iterations of arithmetic, so it costs nothing
 * measurable.
 */

import { formulaById } from './formulas';
import { lutIndex } from './palette';

// Spacing of the coarse escape samples the autopilot steers by. Frame
// dimensions are rounded to a multiple of this so bands split cleanly and the
// coarse grid needs no interpolation.
export const COARSE_STRIDE = 8;

/**
 * Render one horizontal band of a frame.
 *
 * `y0`/`y1` are row bounds into a `width` x `height` frame; both must be
 * multiples of COARSE_STRIDE, as must the frame dimensions. Returns the band's
 * RGBA pixels plus the coarse samples that fall inside it, both as
 * transferable typed arrays.
 */
export function renderBand(job) {
  const { width, height, y0, y1, view, maxIter, lut, lutSize, density, phase, interior, formulaId, param } = job;
  const formula = formulaById(formulaId);
  const { sample, logSpace } = formula;
  const ramp = formula.density === undefined ? density : formula.density;

  const bandHeight = y1 - y0;
  const rgba = new Uint8ClampedArray(width * bandHeight * 4);
  const coarseW = Math.floor(width / COARSE_STRIDE);
  const coarseRows = Math.floor(bandHeight / COARSE_STRIDE);
  const coarse = new Float32Array(coarseW * coarseRows);

  const perPixel = (2 * view.halfHeight) / height;
  const left = view.cx - view.halfHeight * job.aspect;
  const top = view.cy + view.halfHeight;
  const [ir, ig, ib] = interior;

  let p = 0;
  for (let y = y0; y < y1; y += 1) {
    const ci = top - (y + 0.5) * perPixel;
    const coarseRow = (y - y0) % COARSE_STRIDE === 0 ? ((y - y0) / COARSE_STRIDE) * coarseW : -1;
    for (let x = 0; x < width; x += 1) {
      const cr = left + (x + 0.5) * perPixel;
      const value = sample(cr, ci, maxIter, param);
      if (value < 0) {
        rgba[p] = ir;
        rgba[p + 1] = ig;
        rgba[p + 2] = ib;
      } else {
        const idx = lutIndex(value, lutSize, ramp, phase, logSpace) * 3;
        rgba[p] = lut[idx];
        rgba[p + 1] = lut[idx + 1];
        rgba[p + 2] = lut[idx + 2];
      }
      rgba[p + 3] = 255;
      p += 4;
      if (coarseRow >= 0 && x % COARSE_STRIDE === 0) {
        coarse[coarseRow + x / COARSE_STRIDE] = value;
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
