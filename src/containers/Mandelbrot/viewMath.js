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

/** Zoom depth relative to the opening shot. */
export const magnification = view => DEFAULT_VIEW.halfHeight / view.halfHeight;

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
 * Hand-picked places to start a dive. Every one of them sits on a stretch of
 * boundary dense enough that the autopilot has somewhere to go for the next
 * dozen orders of magnitude.
 */
export const SEEDS = [
  { name: 'Seahorse Valley', cx: -0.743643887037151, cy: 0.13182590420533, halfHeight: 0.9 },
  { name: 'Elephant Valley', cx: 0.2925755, cy: -0.0149977, halfHeight: 0.55 },
  { name: 'Triple Spiral', cx: -0.088, cy: 0.654, halfHeight: 0.5 },
  { name: 'Misiurewicz Point', cx: -0.77568377, cy: 0.13646737, halfHeight: 0.45 },
  { name: 'Scepter Variant', cx: -1.25066, cy: 0.02012, halfHeight: 0.35 },
  { name: 'Quad Spiral', cx: -0.235125, cy: 0.827215, halfHeight: 0.4 },
  { name: 'Feather Shoals', cx: -1.7687796, cy: 0.0017396, halfHeight: 0.02 },
];

/** Next seed after `currentName`, wrapping. Keeps successive warps distinct. */
export function nextSeed(currentName, roll = Math.random()) {
  const others = SEEDS.filter(s => s.name !== currentName);
  return others[Math.min(others.length - 1, Math.floor(roll * others.length))];
}
