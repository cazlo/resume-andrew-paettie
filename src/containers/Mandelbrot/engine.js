/*
 * The zoom engine: turns a pool of escape-time workers into continuous motion.
 *
 * A full-quality Mandelbrot frame costs far too much to produce sixty times a
 * second, so the display and the renderer are decoupled:
 *
 *   - the *view* advances every animation frame, purely as arithmetic;
 *   - a *frame* (a fully rendered bitmap plus the view it was rendered for) is
 *     produced a few times a second by the worker pool, aimed slightly ahead
 *     of where the view will have drifted by the time it lands;
 *   - each animation frame blits the last few frames, scaled to the current
 *     view, newest last.
 *
 * The result reads as a smooth continuous dive: the newest frame is sharp in
 * the middle, older and wider frames fill the edges until the next one lands,
 * and the render rate only affects how crisp the picture is, never how
 * smoothly it moves.
 *
 * Render resolution is closed-loop: each frame's wall time nudges a quality
 * factor so the pipeline settles near a target frame interval on whatever
 * hardware it finds itself on.
 */

// Vite's ?worker suffix bundles the module and hands back a constructor, which
// keeps the import.meta.url dance out of application code.
// eslint-disable-next-line import/no-unresolved, import/extensions
import MandelbrotWorker from './mandelbrotWorker?worker';
import { alignDimension, renderBand, splitBands, COARSE_STRIDE } from './renderer';
import { buildLut, interiorRgb, paletteById } from './palette';
import chooseTarget from './autopilot';
import { DEFAULT_FORMULA_ID, formulaById, trapById } from './formulas';
import {
  advanceView,
  aspectOf,
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
  PRECISION_FLOOR,
} from './viewMath';

const LUT_SIZE = 1024;
const MAX_FRAMES = 4;
const MAX_PIXELS = 4200000;
const MIN_QUALITY = 0.45;

/*
 * Detail presets: how long a keyframe may take, and how far above (or below)
 * the canvas resolution it may be rendered.
 *
 * Slower keyframes are not the same as a slower animation — the view keeps
 * moving between them either way, and a keyframe aimed a little ahead of the
 * camera arrives sharp. All a longer interval costs is a few percent of
 * stretch at the end of each frame's life, which buys a lot of resolution.
 * Above 1.0 the frame is supersampled and downscaled on blit, which is real
 * antialiasing rather than a smoothing filter.
 */
const DETAIL_LEVELS = {
  fast: { targetMs: 90, maxQuality: 0.85, iterScale: 0.8 },
  sharp: { targetMs: 210, maxQuality: 1.1, iterScale: 1 },
  ultra: { targetMs: 430, maxQuality: 1.6, iterScale: 1.45 },
};
// Consecutive frames with nothing worth steering at before the dive gives up
// on this neighbourhood and warps somewhere else.
const LOST_LIMIT = 3;
const STATS_INTERVAL_MS = 180;
// Main-thread fallback only: how long a single animation frame may spend
// rendering before yielding back to the browser.
const SYNC_SLICE_MS = 10;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const workerCount = () => {
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : 0;
  return clamp((cores || 4) - 1, 1, 12);
};

export default class ZoomEngine {
  constructor(canvas, { onStats } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    // Frames are almost always blitted at a scale other than 1:1, so the
    // resampler is doing real work on every animation frame.
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.onStats = onStats;

    this.options = {
      running: true,
      autopilot: true,
      zoomRate: 0.32,
      paletteId: 'sunset',
      formulaId: DEFAULT_FORMULA_ID,
      trapId: 'none',
      detail: 'sharp',
      density: 1.15,
      phase: 0,
    };

    this.formula = formulaById(this.options.formulaId);
    this.param = this.formula.defaultParam || null;
    this.juliaReturn = null;
    this.view = { ...this.formula.defaultView };
    this.target = null;
    this.seedName = 'Home';
    this.frames = [];
    this.spares = [];
    this.pending = null;
    this.bandQueue = [];
    this.jobId = 0;
    this.lost = 0;
    this.targetKind = 'scanning';
    this.quality = 0.75;
    this.settled = false;
    this.frameMs = this.detail().targetMs;
    this.fps = 60;
    this.flash = 0;
    this.raf = null;
    this.lastTime = 0;
    this.lastStats = 0;

    this.applyPalette();
    this.busy = new Set();
    this.workers = this.createWorkers();
    this.resize();
  }

  /* ---------------------------------------------------------------- setup */

  detail() {
    return DETAIL_LEVELS[this.options.detail] || DETAIL_LEVELS.sharp;
  }

  /** True while the camera is flying itself; false when held or hand-driven. */
  moving() {
    return this.options.running && this.options.autopilot;
  }

  /**
   * The window on the plane actually being drawn.
   *
   * Usually that is the camera. A formula with a `staticView` renders a fixed
   * window instead and reads the camera as an animation clock — phyllotaxis
   * does not travel anywhere, it grows.
   */
  planeView() {
    return this.formula.staticView || this.view;
  }

  /** Kernel parameters for the current frame. */
  frameParam() {
    return this.formula.paramFromView ? this.formula.paramFromView(this.view, this.param) : this.param;
  }

  trapKind() {
    return this.formula.trappable ? trapById(this.options.trapId).kind : 0;
  }

  /**
   * Frame-time target. A formula that animates its content rather than its
   * camera can ask for a shorter one: the blit tween can carry a zoom between
   * keyframes, but it cannot carry a bloom growing outward, so those frames
   * have to land often enough to be the animation themselves.
   */
  targetMs() {
    return this.formula.frameBudgetMs || this.detail().targetMs;
  }

  createWorkers() {
    if (typeof Worker === 'undefined') return [];
    try {
      return Array.from({ length: workerCount() }, () => {
        const worker = new MandelbrotWorker();
        worker.onmessage = event => this.onBand(worker, event.data);
        return worker;
      });
    } catch (err) {
      // Module workers unavailable (older browser, restrictive host): fall back
      // to slicing the same kernel across animation frames on this thread.
      return [];
    }
  }

  applyPalette() {
    const palette = paletteById(this.options.paletteId);
    this.palette = palette;
    this.lut = buildLut(palette, LUT_SIZE);
    this.interior = interiorRgb(palette);
    this.interiorCss = palette.interior;
  }

  resize() {
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round((rect.width || this.canvas.clientWidth || 640) * dpr));
    const height = Math.max(1, Math.round((rect.height || this.canvas.clientHeight || 360) * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      // Resizing the backing store resets every context attribute.
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.settled = false;
    }
  }

  start() {
    if (this.raf !== null) return;
    this.lastTime = 0;
    const loop = now => {
      this.raf = requestAnimationFrame(loop);
      this.tick(now);
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy() {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.workers.forEach(w => w.terminate());
    this.workers = [];
    this.frames = [];
    this.spares = [];
    this.pending = null;
    this.bandQueue = [];
  }

  /* ------------------------------------------------------------ animation */

  tick(now) {
    const dt = this.lastTime ? clamp((now - this.lastTime) / 1000, 0, 0.08) : 0;
    this.lastTime = now;
    if (dt > 0) this.fps += (1 / dt - this.fps) * 0.1;

    if (this.moving()) {
      this.view = advanceView(this.view, this.formula.fixedCenter ? null : this.target, this.options.zoomRate, dt);
      this.settled = false;
      this.wrapZoom();
      if (atPrecisionFloor(this.view)) this.warp();
      if (this.formula.maxCount && this.frameParam().count > this.formula.maxCount) this.warp();
    }
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 1.8);

    this.trimFrames();
    this.draw();
    if (this.workers.length === 0) this.pumpSync();
    this.startFrame();
    this.emitStats(now);
  }

  /**
   * Keep a looping formula's camera inside one period of its self-similarity.
   *
   * A Droste spiral is exactly itself again after zooming by its period, so
   * multiplying the camera — and every cached frame, which stays just as valid
   * — straight back is invisible on screen. Nothing about the picture changes;
   * what changes is that the coordinates never get small enough for doubles to
   * run out, so this dive has no floor and never has to warp.
   */
  wrapZoom() {
    const period = this.formula.zoomPeriod;
    if (!period) return;
    const home = this.formula.defaultView.halfHeight;
    let factor = 1;
    while (this.view.halfHeight * factor < home / period) factor *= period;
    while (this.view.halfHeight * factor > home) factor /= period;
    if (factor === 1) return;
    this.view = { ...this.view, halfHeight: this.view.halfHeight * factor };
    this.frames.forEach(frame => {
      Object.assign(frame, { view: { ...frame.view, halfHeight: frame.view.halfHeight * factor } });
    });
    if (this.pending) {
      const { frame } = this.pending;
      Object.assign(frame, { view: { ...frame.view, halfHeight: frame.view.halfHeight * factor } });
    }
  }

  draw() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = this.interiorCss;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < this.frames.length; i += 1) {
      const frame = this.frames[i];
      const r = frameDestRect(frame, this.planeView(), w, h);
      if (r.dw > 0.5 && r.dh > 0.5) ctx.drawImage(frame.canvas, r.dx, r.dy, r.dw, r.dh);
    }
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255, 94, 196, ${(this.flash * 0.5).toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  /*
   * Drop frames the newer ones have grown to cover, and cap the stack. Frames
   * are ordered oldest (widest) first; as the dive proceeds, a newer frame
   * eventually fills the whole canvas and everything beneath it is wasted
   * blitting.
   */
  trimFrames() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    while (this.frames.length > 1) {
      const rect = frameDestRect(this.frames[1], this.planeView(), w, h);
      if (!coversViewport(rect, w, h)) break;
      this.recycle(this.frames.shift());
    }
    while (this.frames.length > MAX_FRAMES) this.recycle(this.frames.shift());
  }

  /* -------------------------------------------------------------- renders */

  startFrame() {
    // A held view only needs rendering once, at full detail.
    if (this.pending || (!this.moving() && this.settled)) return;
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;
    if (canvasW < COARSE_STRIDE || canvasH < COARSE_STRIDE) return;

    // While the camera flies, resolution is whatever the frame-time budget
    // affords. Standing still, there is no budget to keep, so go to the top of
    // the detail level and stop.
    let scale = this.moving() ? this.quality : this.detail().maxQuality;
    const pixels = canvasW * canvasH * scale * scale;
    if (pixels > MAX_PIXELS) scale *= Math.sqrt(MAX_PIXELS / pixels);
    const width = alignDimension(canvasW * scale);
    const height = alignDimension(canvasH * scale);

    // Aim the render at where the view will be when it lands, so it arrives a
    // touch downscaled — and therefore sharp — instead of already stretched.
    // A static-window formula is not travelling, so there is nothing to lead.
    const lookahead = this.moving() && !this.formula.staticView ? clamp((this.frameMs / 1000) * 1.5, 0, 0.9) : 0;
    const view =
      lookahead > 0
        ? advanceView(this.view, this.formula.fixedCenter ? null : this.target, this.options.zoomRate, lookahead)
        : { ...this.planeView() };

    this.jobId += 1;
    const coarseW = Math.floor(width / COARSE_STRIDE);
    const coarseH = Math.floor(height / COARSE_STRIDE);
    const frame = {
      canvas: this.acquire(width, height),
      width,
      height,
      aspect: aspectOf(width, height),
      view,
      maxIter: maxIterForView(view, {
        ...this.formula.iterProfile,
        scale: this.detail().iterScale * this.formula.iterScale,
      }),
      param: this.frameParam(),
      trap: this.trapKind(),
      coarse: new Float32Array(coarseW * coarseH),
      coarseW,
      coarseH,
    };
    frame.ctx = frame.canvas.getContext('2d', { alpha: false });

    const bandCount = this.workers.length > 0 ? this.workers.length * 3 : 8;
    const bands = splitBands(height, bandCount);
    this.pending = { jobId: this.jobId, frame, remaining: bands.length, started: performance.now() };
    this.bandQueue = bands.map(band => this.bandJob(frame, band));
    this.pump();
  }

  bandJob(frame, band) {
    return {
      jobId: this.jobId,
      width: frame.width,
      height: frame.height,
      y0: band.y0,
      y1: band.y1,
      view: frame.view,
      aspect: frame.aspect,
      maxIter: frame.maxIter,
      formulaId: this.formula.id,
      param: frame.param,
      trap: frame.trap,
      lut: this.lut,
      lutSize: LUT_SIZE,
      density: this.options.density,
      phase: this.options.phase,
      interior: this.interior,
    };
  }

  /**
   * Hand queued bands to whichever workers are idle. Bands are handed out one
   * at a time rather than dealt round-robin up front: interior-heavy bands can
   * cost an order of magnitude more than open sky, and a worker that drew a
   * cheap one should pick up the slack instead of idling.
   */
  pump() {
    for (let i = 0; i < this.workers.length && this.bandQueue.length > 0; i += 1) {
      const worker = this.workers[i];
      if (!this.busy.has(worker)) {
        this.busy.add(worker);
        worker.postMessage(this.bandQueue.shift());
      }
    }
  }

  /** Worker-less fallback: render bands here, a slice at a time. */
  pumpSync() {
    if (!this.pending) return;
    const deadline = performance.now() + SYNC_SLICE_MS;
    while (this.bandQueue.length > 0 && performance.now() < deadline) {
      const job = this.bandQueue.shift();
      const result = renderBand(job);
      this.acceptBand(job.jobId, job.y0, job.y1, result.rgba, result.coarse);
    }
  }

  onBand(worker, message) {
    this.busy.delete(worker);
    this.acceptBand(
      message.jobId,
      message.y0,
      message.y1,
      new Uint8ClampedArray(message.rgba),
      new Float32Array(message.coarse),
    );
    this.pump();
  }

  acceptBand(jobId, y0, y1, rgba, coarse) {
    // A warp, a resize or a palette change retires the in-flight job; late
    // bands from it would paint into a recycled canvas.
    if (!this.pending || this.pending.jobId !== jobId) return;
    const { frame } = this.pending;
    frame.ctx.putImageData(new ImageData(rgba, frame.width, y1 - y0), 0, y0);
    frame.coarse.set(coarse, (y0 / COARSE_STRIDE) * frame.coarseW);
    this.pending.remaining -= 1;
    if (this.pending.remaining === 0) this.finishFrame();
  }

  finishFrame() {
    const { frame, started } = this.pending;
    this.pending = null;

    const elapsed = performance.now() - started;
    const targetMs = this.targetMs();
    const { maxQuality } = this.detail();
    this.frameMs += (elapsed - this.frameMs) * 0.35;
    // Nudge resolution toward the frame-time target. The exponent damps the
    // correction so a single slow frame cannot collapse the image quality.
    this.quality = clamp(this.quality * (targetMs / Math.max(8, elapsed)) ** 0.25, MIN_QUALITY, maxQuality);

    this.frames.push(frame);
    if (!this.moving()) this.settled = true;
    this.steer(frame);
  }

  steer(frame) {
    // A fixed-centre formula has nowhere to steer: its geometry is built
    // around the origin and moving off it would break the symmetry.
    if (!this.options.autopilot || this.formula.fixedCenter) return;
    const target = chooseTarget(frame.coarse, frame.coarseW, frame.coarseH, frame.view, frame.aspect);
    if (target) {
      this.lost = 0;
      this.target = target;
      this.targetKind = target.kind;
    } else {
      this.lost += 1;
      // Nothing but flat interior or empty sky in frame after frame: this
      // branch of the boundary has dead-ended, so take the dive elsewhere.
      if (this.lost >= LOST_LIMIT) this.warp();
    }
  }

  /* -------------------------------------------------------------- control */

  setOptions(partial) {
    const paletteChanged = partial.paletteId && partial.paletteId !== this.options.paletteId;
    const detailChanged = partial.detail && partial.detail !== this.options.detail;
    const formulaChanged = partial.formulaId && partial.formulaId !== this.options.formulaId;
    const previousTrap = this.options.trapId;
    this.options = { ...this.options, ...partial };
    if (formulaChanged) this.setFormula(partial.formulaId);
    if (detailChanged) {
      this.quality = clamp(this.quality, MIN_QUALITY, this.detail().maxQuality);
      this.settled = false;
    }
    if (partial.trapId && partial.trapId !== previousTrap) this.abort();
    if (paletteChanged || partial.density !== undefined || partial.phase !== undefined) {
      this.applyPalette();
      // Existing frames keep their old colours until the pipeline catches up,
      // which reads as a cross-fade rather than a stall.
      this.abort();
    }
  }

  /**
   * Switch fractal. Each one lives in its own patch of the plane, so the view
   * and the steering start over; only the palette and pacing carry across.
   */
  setFormula(formulaId, param) {
    this.options = { ...this.options, formulaId };
    this.formula = formulaById(formulaId);
    this.param = param || this.formula.defaultParam || null;
    this.seedName = 'Home';
    this.view = { ...this.formula.defaultView };
    this.target = null;
    this.lost = 0;
    this.flash = 1;
    this.clearFrames();
    this.abort();
  }

  /**
   * Drop into the Julia set for whatever point the camera is sitting on.
   *
   * This is the one place the two fractals genuinely connect: the Julia set
   * for a c on the Mandelbrot boundary is as intricate as the boundary
   * neighbourhood the camera is looking at, so a good dive hands off to a good
   * Julia. Calling it again comes back to where the dive was left.
   */
  juliaHere() {
    if (this.formula.id === 'julia') {
      const back = this.juliaReturn;
      this.juliaReturn = null;
      this.setFormula(back ? back.formulaId : DEFAULT_FORMULA_ID);
      if (back) {
        this.view = back.view;
        this.seedName = back.seedName;
      }
      return;
    }
    if (!this.formula.juliaSource) return;
    this.juliaReturn = { formulaId: this.formula.id, view: { ...this.view }, seedName: this.seedName };
    this.setFormula('julia', { re: this.view.cx, im: this.view.cy });
  }

  /**
   * Warp: a fresh address for the same fractal. For Julia there is no address
   * to change — the whole plane is one set — so a warp swaps the constant and
   * the fractal itself becomes a different one.
   */
  warp() {
    // A fixed-centre formula has no other address to go to, so a warp is a
    // fresh start: the bloom begins again from its first seeds.
    const fallback = this.formula.fixedCenter
      ? { name: 'Home', ...this.formula.defaultView }
      : driftSeed(this.formula.defaultView);
    const seed = nextSeed(this.formula.seeds, this.seedName) || fallback;
    this.seedName = seed.name;
    this.view = { cx: seed.cx, cy: seed.cy, halfHeight: seed.halfHeight };
    if (seed.param) this.param = seed.param;
    this.target = null;
    this.lost = 0;
    this.flash = 1;
    this.clearFrames();
    this.abort();
  }

  reset() {
    this.seedName = 'Home';
    this.view = { ...this.formula.defaultView };
    this.target = null;
    this.lost = 0;
    this.clearFrames();
    this.abort();
  }

  /** Retire the in-flight render without disturbing what is on screen. */
  abort() {
    this.pending = null;
    this.bandQueue = [];
    this.jobId += 1;
    this.settled = false;
  }

  clearFrames() {
    this.frames.forEach(frame => this.recycle(frame));
    this.frames = [];
  }

  zoomAt(px, py, factor) {
    const { width, height } = this.canvas;
    // Zooming about the cursor moves the centre; a fixed-centre formula zooms
    // about the origin instead.
    this.view = this.formula.fixedCenter
      ? { ...this.view, halfHeight: this.view.halfHeight / factor }
      : zoomAtPixel(this.view, px, py, factor, width, height);
    const ceiling = this.formula.defaultView.halfHeight * 2;
    if (this.view.halfHeight < PRECISION_FLOOR) this.view.halfHeight = PRECISION_FLOOR;
    if (this.view.halfHeight > ceiling) this.view.halfHeight = ceiling;
    this.wrapZoom();
    this.abort();
  }

  panBy(dxPx, dyPx) {
    // Panning a spiral or a bloom off its centre would break the very
    // symmetry that makes it work, so those formulas hold the origin.
    if (this.formula.fixedCenter) return;
    this.view = panByPixels(this.view, dxPx, dyPx, this.canvas.height);
    this.abort();
  }

  /** Point the autopilot at a pixel the visitor picked. */
  focusAt(px, py) {
    if (this.formula.fixedCenter) return;
    const at = pixelToComplex(px, py, this.planeView(), this.canvas.width, this.canvas.height);
    this.target = { cx: at.re, cy: at.im, score: 1, kind: 'manual' };
    this.lost = 0;
  }

  /* ---------------------------------------------------------------- misc */

  acquire(width, height) {
    const canvas = this.spares.pop() || document.createElement('canvas');
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    return canvas;
  }

  recycle(frame) {
    if (frame && this.spares.length < MAX_FRAMES + 1) this.spares.push(frame.canvas);
  }

  emitStats(now) {
    if (!this.onStats || now - this.lastStats < STATS_INTERVAL_MS) return;
    this.lastStats = now;
    const frame = this.frames[this.frames.length - 1];
    let mode = 'MANUAL';
    if (!this.options.running) mode = 'HOLD';
    else if (this.options.autopilot) mode = 'AUTOPILOT';
    const reference = this.formula.defaultView.halfHeight;
    this.onStats({
      mode,
      seed: this.seedName,
      formula: this.formula.name,
      formulaId: this.formula.id,
      param: this.param,
      canJulia: Boolean(this.formula.juliaSource) || this.formula.id === 'julia',
      trappable: Boolean(this.formula.trappable),
      looping: Boolean(this.formula.zoomPeriod),
      note: this.formula.describe ? this.formula.describe(this.frameParam()) : '',
      cx: this.view.cx,
      cy: this.view.cy,
      magnification: magnification(this.view, reference),
      maxIter: frame ? frame.maxIter : maxIterForView(this.view, { scale: this.detail().iterScale }),
      fps: this.fps,
      frameMs: this.frameMs,
      resolution: frame ? `${frame.width}x${frame.height}` : '--',
      sampling: frame ? frame.width / Math.max(1, this.canvas.width) : this.quality,
      workers: this.workers.length,
      depth: clamp(
        1 - Math.log10(this.view.halfHeight / PRECISION_FLOOR) / Math.log10(reference / PRECISION_FLOOR),
        0,
        1,
      ),
      target: this.targetKind || 'scanning',
    });
  }
}
