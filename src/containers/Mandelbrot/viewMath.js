/*
 * Geometry and pacing for the Mandelbrot zoomer.
 *
 * A *view* is `{ cx, cy, halfHeight }`: the complex-plane centre plus half the
 * vertical span it covers. Width falls out of the canvas aspect ratio, so a
 * view survives a window resize unchanged.
 *
 * Screen space is y-down, the complex plane is y-up, so every vertical mapping
 * flips sign.
 */

// Whole-set framing: the opening shot, and the reference for magnification.
export const DEFAULT_VIEW = { cx: -0.6, cy: 0, halfHeight: 1.3 };

/*
 * Double precision runs out long before the set does. Pixel spacing is
 * 2 * halfHeight / heightPx; once that approaches the ~2.2e-16 relative
 * spacing of a double near |c| ~ 1, neighbouring pixels start evaluating the
 * *same* complex number and the image turns to mush. We stop a little above
 * that and warp somewhere new rather than show the mush.
 */
export const PRECISION_FLOOR = 6e-15;

export const aspectOf = (width, height) => (height > 0 ? width / height : 1);

/** Complex half-width of a view on a canvas of the given aspect ratio. */
export const halfWidthOf = (view, aspect) => view.halfHeight * aspect;

/** Where a canvas pixel lands in the complex plane. */
export function pixelToComplex(px, py, view, width, height) {
  const perPixel = (2 * view.halfHeight) / height;
  return {
    re: view.cx + (px - width / 2) * perPixel,
    im: view.cy - (py - height / 2) * perPixel,
  };
}

/**
 * Destination rect for blitting an already-rendered frame into the current
 * view. Frames are rendered ahead of the animation and then scaled to wherever
 * the zoom has drifted, which is what makes the motion continuous while full
 * renders land only a few times a second.
 */
export function frameDestRect(frame, view, width, height) {
  const perPixel = (2 * view.halfHeight) / height;
  const k = 1 / perPixel;
  const fHalfW = frame.view.halfHeight * frame.aspect;
  return {
    dx: width / 2 + (frame.view.cx - fHalfW - view.cx) * k,
    dy: height / 2 - (frame.view.cy + frame.view.halfHeight - view.cy) * k,
    dw: 2 * fHalfW * k,
    dh: 2 * frame.view.halfHeight * k,
  };
}

/** True when a blit rect covers the whole canvas, so anything under it is dead. */
export function coversViewport(rect, width, height, slack = 0.5) {
  return (
    rect.dx <= slack && rect.dy <= slack && rect.dx + rect.dw >= width - slack && rect.dy + rect.dh >= height - slack
  );
}

/** Zoom depth relative to an opening shot — by default the Mandelbrot's. */
export const magnification = (view, reference = DEFAULT_VIEW.halfHeight) => reference / view.halfHeight;

/**
 * Iteration budget for a depth. Boundary detail needs more iterations the
 * closer you get; too few and the filaments bleed into a flat blob, too many
 * and the frame rate collapses. Roughly 150 extra iterations per decade of
 * zoom tracks the detail without running away, and `scale` lets the detail
 * setting trade frame time for resolved structure.
 */
export function maxIterForView(view, { base = 220, perDecade = 150, cap = 4000, scale = 1 } = {}) {
  const decades = Math.max(0, Math.log10(magnification(view)));
  return Math.min(cap, Math.round((base + perDecade * decades) * scale));
}

/** Continuous exponential zoom: `rate` is e-folds per second. */
export const zoomStep = (halfHeight, rate, dt) => halfHeight * Math.exp(-rate * dt);

/**
 * Frame-rate independent easing toward a value. `rate` is the reciprocal of
 * the time constant, so the gap shrinks by 1/e every 1/rate seconds no matter
 * how the frames actually fall.
 */
export const approach = (current, target, rate, dt) => current + (target - current) * (1 - Math.exp(-rate * dt));

/**
 * Advance a view one animation step: zoom in, and slide the centre toward the
 * autopilot's target. The centre has to converge faster than the zoom or the
 * target's on-screen offset — which is measured in shrinking complex units —
 * would grow instead of shrink, and the dive would drift off the boundary.
 */
export function advanceView(view, target, zoomRate, dt) {
  const next = { ...view, halfHeight: zoomStep(view.halfHeight, zoomRate, dt) };
  if (target) {
    const followRate = Math.max(0.8, zoomRate * 3);
    next.cx = approach(view.cx, target.cx, followRate, dt);
    next.cy = approach(view.cy, target.cy, followRate, dt);
  }
  return next;
}

/** Zoom about a canvas pixel, keeping the complex point under it pinned. */
export function zoomAtPixel(view, px, py, factor, width, height) {
  const at = pixelToComplex(px, py, view, width, height);
  const halfHeight = view.halfHeight / factor;
  const shrink = 1 - 1 / factor;
  return {
    cx: view.cx + (at.re - view.cx) * shrink,
    cy: view.cy + (at.im - view.cy) * shrink,
    halfHeight,
  };
}

/** Drag-pan by a pixel delta. */
export function panByPixels(view, dxPx, dyPx, height) {
  const perPixel = (2 * view.halfHeight) / height;
  return { ...view, cx: view.cx - dxPx * perPixel, cy: view.cy + dyPx * perPixel };
}

export const atPrecisionFloor = view => view.halfHeight <= PRECISION_FLOOR;

/**
 * Pick a seed from a formula's list, never the one already in use, or null if
 * the formula has no curated addresses.
 */
export function nextSeed(seeds, currentName, roll = Math.random()) {
  const others = seeds.filter(s => s.name !== currentName);
  if (others.length === 0) return null;
  return others[Math.min(others.length - 1, Math.floor(roll * others.length))];
}

/**
 * Fallback entry point for formulas whose boundary is interesting everywhere,
 * so there is nothing to curate. Randomising the drop point is what keeps
 * successive warps from replaying the same dive: the autopilot is
 * deterministic, so an identical start would produce an identical descent.
 */
export function driftSeed(defaultView, rollX = Math.random(), rollY = Math.random()) {
  const reach = defaultView.halfHeight * 0.7;
  return {
    name: 'Open Water',
    cx: defaultView.cx + (rollX * 2 - 1) * reach,
    cy: defaultView.cy + (rollY * 2 - 1) * reach,
    halfHeight: defaultView.halfHeight * 0.6,
  };
}
