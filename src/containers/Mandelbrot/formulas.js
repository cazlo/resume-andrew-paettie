/*
 * The iteration kernels, and what the rest of the page needs to know about
 * each one.
 *
 * Every formula here is an escape-time or convergence test over the same
 * complex plane, which is why one renderer, one autopilot and one set of
 * palettes drive all of them. A formula supplies:
 *
 *   sample(x, y, maxIter, param)  the per-pixel kernel. Returns a colour
 *                                 parameter, or -1 for "solid" — never
 *                                 escaped, never converged, undefined.
 *   logSpace                      whether that parameter should be mapped
 *                                 through log() before hitting the palette.
 *   defaultView / seeds           where a dive starts, and where warps go.
 *
 * The kernels are written out longhand rather than composed from a shared
 * inner step: this is the hot loop, and the whole point of separate kernels is
 * that each one's arithmetic stays flat and branch-free.
 */

// Bailout radius squared. 2 is enough to know an orbit escapes, but the smooth
// colouring term only settles once |z| is well past it, and a small bailout
// leaves visible banding.
const BAILOUT2 = 65536;

/**
 * Continuous escape count: the integer iteration plus a fractional part
 * derived from how far past the bailout the orbit landed. Without it the
 * colouring shows hard contour rings instead of smooth bands.
 *
 * The clamp matters. An orbit that overshoots the bailout enormously in a
 * single step can drive the correction past 1 and make the count negative,
 * which the renderer would read as "solid" and paint as set interior.
 */
const smoothCount = (i, mag2) => {
  const mu = i + 1 - Math.log((Math.log(mag2) * 0.5) / Math.LN2) / Math.LN2;
  return mu > 0 ? mu : 0;
};

/*
 * Orbit traps.
 *
 * Escape time asks "how long until the orbit leaves?". A trap asks "how close
 * did the orbit ever come to this shape?" — and colours by that instead. The
 * orbit of a point near the boundary wanders the plane for hundreds of steps,
 * so the answer varies wildly between neighbouring pixels and the same set
 * comes out looking like blown glass, woven metal or flowers depending on the
 * shape you measure against.
 *
 * Traps also give the *interior* something to say. Bounded orbits never
 * escape, so escape time has no answer for them and they render as a flat
 * silhouette; a trap measures them exactly as well as it measures the outside.
 */
export const TRAPS = [
  { id: 'none', name: 'Escape', kind: 0 },
  { id: 'point', name: 'Point', kind: 1 },
  { id: 'cross', name: 'Cross', kind: 2 },
  { id: 'ring', name: 'Ring', kind: 3 },
];

export const trapById = id => TRAPS.find(t => t.id === id) || TRAPS[0];

const trapDistance = (kind, zr, zi) => {
  if (kind === 2) return Math.min(Math.abs(zr), Math.abs(zi));
  if (kind === 3) return Math.abs(Math.sqrt(zr * zr + zi * zi) - 1);
  return Math.sqrt(zr * zr + zi * zi);
};

// Trap distances cluster near zero and span several orders of magnitude, so
// the palette parameter is logarithmic in the distance. 0.22 spreads a typical
// frame across three or four colour cycles.
const trapColour = d => Math.max(0, -Math.log(d + 1e-9) * 0.22);

/*
 * Bounded orbits are reported as negative values so the autopilot can still
 * find the set's edge — it steers by where the bounded region is, whatever the
 * colouring does. When the colouring has something to say about them, the
 * value carries it as -(2 + colour); the offset of 2 keeps a zero colour clear
 * of the plain -1 that escape-time kernels return for "solid, nothing to say".
 */
const bounded = colour => -(2 + colour);

/**
 * z -> z^2 + c, starting from zero.
 *
 * Two shortcuts keep interior regions affordable: the main cardioid and the
 * period-2 bulb are solved algebraically, and deeper in, orbits that fall into
 * a cycle are caught by comparing against a periodically refreshed reference
 * point (Brent-style). Exact equality is the right test there — an epsilon
 * would let near-boundary points masquerade as interior and eat the filaments.
 */
export function mandelbrotSample(cr, ci, maxIter, param, trap = 0) {
  // The algebraic tests answer "is this interior?" without ever computing the
  // orbit, so they have to be skipped when the colouring needs the orbit.
  if (trap === 0) {
    const xm = cr - 0.25;
    const ci2 = ci * ci;
    const q = xm * xm + ci2;
    if (q * (q + xm) <= 0.25 * ci2) return -1;
    const bulb = cr + 1;
    if (bulb * bulb + ci2 <= 0.0625) return -1;
  }

  let zr = 0;
  let zi = 0;
  let zr2 = 0;
  let zi2 = 0;
  let refR = 0;
  let refI = 0;
  let period = 0;
  let periodLimit = 8;
  let closest = Infinity;

  for (let i = 0; i < maxIter; i += 1) {
    zi = 2 * zr * zi + ci;
    zr = zr2 - zi2 + cr;
    zr2 = zr * zr;
    zi2 = zi * zi;
    if (trap !== 0) {
      const d = trapDistance(trap, zr, zi);
      if (d < closest) closest = d;
    }
    const mag2 = zr2 + zi2;
    if (mag2 > BAILOUT2) return trap === 0 ? smoothCount(i, mag2) : trapColour(closest);
    // An orbit that has closed a cycle will never visit anywhere new, so the
    // trap minimum is already final here too.
    if (zr === refR && zi === refI) return trap === 0 ? -1 : bounded(trapColour(closest));
    period += 1;
    if (period >= periodLimit) {
      period = 0;
      periodLimit *= 2;
      refR = zr;
      refI = zi;
    }
  }
  return trap === 0 ? -1 : bounded(trapColour(closest));
}

/**
 * z -> (|Re z| + i|Im z|)^2 + c.
 *
 * Folding both components into the positive quadrant every step destroys the
 * self-similarity the Mandelbrot's shortcuts rely on, so there is no algebraic
 * interior test here — only the cycle check. The payoff is structure that
 * looks built rather than grown: hulls, masts, rigging.
 */
export function burningShipSample(cr, ci, maxIter, param, trap = 0) {
  let zr = 0;
  let zi = 0;
  let refR = 0;
  let refI = 0;
  let period = 0;
  let periodLimit = 8;
  let closest = Infinity;

  for (let i = 0; i < maxIter; i += 1) {
    zr = Math.abs(zr);
    zi = Math.abs(zi);
    const zr2 = zr * zr;
    const zi2 = zi * zi;
    zi = 2 * zr * zi + ci;
    zr = zr2 - zi2 + cr;
    if (trap !== 0) {
      const d = trapDistance(trap, zr, zi);
      if (d < closest) closest = d;
    }
    const mag2 = zr * zr + zi * zi;
    if (mag2 > BAILOUT2) return trap === 0 ? smoothCount(i, mag2) : trapColour(closest);
    if (zr === refR && zi === refI) return trap === 0 ? -1 : bounded(trapColour(closest));
    period += 1;
    if (period >= periodLimit) {
      period = 0;
      periodLimit *= 2;
      refR = zr;
      refI = zi;
    }
  }
  return trap === 0 ? -1 : bounded(trapColour(closest));
}

/**
 * z -> z^2 + c with c held fixed and the pixel supplying z0.
 *
 * Every c gives a different filled Julia set, and the interesting ones are the
 * c values sitting on the Mandelbrot boundary — which is exactly what the
 * page's "julia here" control hands over.
 */
export function juliaSample(zr0, zi0, maxIter, param, trap = 0) {
  const cr = param ? param.re : 0;
  const ci = param ? param.im : 0;
  let zr = zr0;
  let zi = zi0;
  let zr2 = zr * zr;
  let zi2 = zi * zi;
  let refR = 0;
  let refI = 0;
  let period = 0;
  let periodLimit = 8;
  let closest = Infinity;

  for (let i = 0; i < maxIter; i += 1) {
    zi = 2 * zr * zi + ci;
    zr = zr2 - zi2 + cr;
    zr2 = zr * zr;
    zi2 = zi * zi;
    if (trap !== 0) {
      const d = trapDistance(trap, zr, zi);
      if (d < closest) closest = d;
    }
    const mag2 = zr2 + zi2;
    if (mag2 > BAILOUT2) return trap === 0 ? smoothCount(i, mag2) : trapColour(closest);
    if (zr === refR && zi === refI) return trap === 0 ? -1 : bounded(trapColour(closest));
    period += 1;
    if (period >= periodLimit) {
      period = 0;
      periodLimit *= 2;
      refR = zr;
      refI = zi;
    }
  }
  return trap === 0 ? -1 : bounded(trapColour(closest));
}

// Cube roots of unity: the three attractors of Newton's method on z^3 - 1.
const ROOTS = [
  [1, 0],
  [-0.5, 0.8660254037844386],
  [-0.5, -0.8660254037844386],
];
// Squared step length below which the orbit counts as arrived.
const NEWTON_TOL2 = 1e-14;

/**
 * Newton's method on z^3 - 1, coloured by which root the pixel falls into.
 *
 * Unlike escape time this is a convergence test: every point but a measure-
 * zero set lands on a root. What is fractal is the *boundary* between the
 * three basins, where all three meet at every point, and that boundary holds
 * up under any magnification.
 *
 * The returned value is a palette position, not an iteration count: each basin
 * owns a third of the ramp, and how long the point took to arrive shades it
 * within that third.
 */
export function newtonSample(zr0, zi0, maxIter) {
  let zr = zr0;
  let zi = zi0;

  for (let i = 0; i < maxIter; i += 1) {
    const a = zr * zr;
    const b = zi * zi;
    const sqR = a - b; // z^2
    const sqI = 2 * zr * zi;
    const cubeR = sqR * zr - sqI * zi; // z^3
    const cubeI = sqR * zi + sqI * zr;
    // Newton step z - f/f' = (2z^3 + 1) / (3z^2)
    const numR = 2 * cubeR + 1;
    const numI = 2 * cubeI;
    const denR = 3 * sqR;
    const denI = 3 * sqI;
    const den2 = denR * denR + denI * denI;
    if (den2 === 0) return -1; // stationary point: the derivative vanished
    const nextR = (numR * denR + numI * denI) / den2;
    const nextI = (numI * denR - numR * denI) / den2;
    const stepR = nextR - zr;
    const stepI = nextI - zi;
    zr = nextR;
    zi = nextI;

    if (stepR * stepR + stepI * stepI < NEWTON_TOL2) {
      let root = 0;
      let bestDist = Infinity;
      for (let k = 0; k < ROOTS.length; k += 1) {
        const dr = zr - ROOTS[k][0];
        const di = zi - ROOTS[k][1];
        const dist = dr * dr + di * di;
        if (dist < bestDist) {
          bestDist = dist;
          root = k;
        }
      }
      return root / ROOTS.length + Math.min(0.3, i * 0.012);
    }
  }
  return -1;
}

/**
 * The Kali set: p -> |p| / dot(p, p) - c.
 *
 * An inversion in the unit circle, a fold into the positive quadrant, and a
 * translation. No escape test — orbits do not run away, they get shuffled — so
 * every pixel is coloured by how close its orbit ever came to the origin. The
 * fold is what makes the output kaleidoscopic: every step mirrors space onto
 * itself, so the structure is built out of reflected copies at every scale.
 *
 * Iteration counts are tiny here. Ten to forty steps is the whole fractal;
 * hundreds would only grind the structure into noise.
 */
export function kaliSample(x, y, maxIter, param) {
  const cx = param ? param.re : 0.75;
  const cy = param ? param.im : 0.75;
  let zx = x;
  let zy = y;
  let closest = Infinity;

  for (let i = 0; i < maxIter; i += 1) {
    zx = Math.abs(zx);
    zy = Math.abs(zy);
    const m = zx * zx + zy * zy;
    if (m < 1e-12) break; // the inversion has nowhere to send the origin
    // One reciprocal, and the running minimum stays squared: division and
    // square root are the two expensive operations in a loop this short, and
    // both are avoidable.
    const inv = 1 / m;
    zx = zx * inv - cx;
    zy = zy * inv - cy;
    const d2 = zx * zx + zy * zy;
    if (d2 < closest) closest = d2;
  }
  return trapColour(Math.sqrt(closest));
}

/*
 * Droste geometry.
 *
 * DROSTE_PERIOD is the zoom factor that maps the picture exactly onto itself.
 * The engine uses it to wrap the camera: once the view has shrunk by this
 * much, multiplying it straight back changes nothing on screen, so the dive
 * runs forever at constant precision instead of grinding down to the
 * double-precision floor. It is the one fractal here with no floor at all.
 */
export const DROSTE_PERIOD = 7;
const DROSTE_LOG = Math.log(DROSTE_PERIOD);
const TWO_PI = Math.PI * 2;
// Radii of the two circles whose sum embeds the tile's torus into the plane.
const DROSTE_R1 = 0.62;
const DROSTE_R2 = 0.36;

/**
 * A Julia set wrapped onto a logarithmic spiral — Escher's Print Gallery map.
 *
 * Take the pixel's log-polar coordinates, shear them so that one turn around
 * the origin equals one step of the zoom, and reduce modulo the tile. Zooming
 * by DROSTE_PERIOD advances the tile coordinate by exactly one whole tile,
 * which is a no-op: the image is identical, and so the zoom can loop forever.
 *
 * The tile is a torus, and what it needs is a pattern with no seam at either
 * edge. Feeding the torus through w = R1·e^(iA) + R2·e^(iB) into the Julia
 * plane gives exactly that — periodic in both directions by construction — and
 * costs one Julia evaluation per pixel.
 */
export function drosteSample(x, y, maxIter, param, trap = 0) {
  const r2 = x * x + y * y;
  if (r2 < 1e-300) return -1; // the spiral's fixed point has no tile
  const u = 0.5 * Math.log(r2);
  const theta = Math.atan2(y, x);

  const a = u / DROSTE_LOG - theta / TWO_PI;
  const b = theta / TWO_PI;
  const A = (a - Math.floor(a)) * TWO_PI;
  const B = (b - Math.floor(b)) * TWO_PI;

  const wx = DROSTE_R1 * Math.cos(A) + DROSTE_R2 * Math.cos(B);
  const wy = DROSTE_R1 * Math.sin(A) + DROSTE_R2 * Math.sin(B);
  return juliaSample(wx, wy, maxIter, param, trap);
}

// The golden angle: the one divergence angle whose multiples never come close
// to repeating, which is why phyllotaxis uses it and why the arms are always
// Fibonacci numbers.
export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const GOLDEN_COS = Math.cos(GOLDEN_ANGLE);
const GOLDEN_SIN = Math.sin(GOLDEN_ANGLE);

/*
 * The golden angle as a fraction of a full turn, split into a head with only
 * 20 significant bits and the remaining tail.
 *
 * Seed indices reach the hundreds of millions once a bloom has been running,
 * and `index * GOLDEN_ANGLE` at that size has already lost most of its
 * fractional precision — which is precisely the part that matters, since only
 * the angle modulo a turn is wanted. Multiplying by the short head is exact
 * for any index below 2^32, and the tail is small enough that its product
 * stays accurate, so the two together give a clean fractional turn.
 */
const GOLDEN_FRACTION = (3 - Math.sqrt(5)) / 2;
const GOLDEN_HEAD = Math.round(GOLDEN_FRACTION * 1048576) / 1048576;
const GOLDEN_TAIL = GOLDEN_FRACTION - GOLDEN_HEAD;

export function indexAngle(index) {
  const head = (index * GOLDEN_HEAD) % 1;
  const tail = (index * GOLDEN_TAIL) % 1;
  return ((head + tail) % 1) * TWO_PI;
}

export const FIBONACCI = [
  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657,
];

/**
 * How many spiral arms the eye picks out at a given depth into the pattern.
 *
 * Neighbouring seeds are separated by a Fibonacci number of index steps, and
 * measuring which one wins across four decades of n gives F ≈ 2.75·√n every
 * time. That constant is why the visible arm count keeps stepping 34, 55, 89,
 * 144 as the bloom grows: it is tracking √n through a sequence that grows
 * geometrically.
 */
export function armCount(depth) {
  const want = 2.75 * Math.sqrt(Math.max(1, depth));
  let best = FIBONACCI[0];
  for (let i = 0; i < FIBONACCI.length; i += 1) {
    if (Math.abs(Math.log(FIBONACCI[i] / want)) < Math.abs(Math.log(best / want))) best = FIBONACCI[i];
  }
  return best;
}

const PHYLLO_SCALE = 0.029; // radius per √index: sets the on-screen seed spacing
// Seeds are numbered from the rim inward, so a seed's angle is fixed at birth
// and only its radius grows as the bloom adds more. Colouring by index modulo
// the local arm count is what makes the parastichy families visible.
const SEED_RADIUS = 0.34;

/**
 * Vogel's phyllotaxis model: seed j sits at angle j·φ and radius √(count - j).
 *
 * Rendered by inversion rather than by drawing dots: a pixel's radius says
 * which indices could possibly be near it, and only those are checked. The
 * window is proportional to the local radius, so the cost is a few dozen
 * candidates near the middle and never more than a couple of hundred at the
 * rim — cheaper than a mid-depth Mandelbrot pixel, and independent of how many
 * million seeds the bloom has grown to.
 */
export function phyllotaxisSample(x, y, maxIter, param) {
  const count = param ? param.count : 1400;
  const scale = param ? param.scale : PHYLLO_SCALE;
  const r = Math.sqrt(x * x + y * y);
  const depth = (r / scale) * (r / scale); // seeds between here and the rim
  if (depth > count) return -1; // past the outermost seed

  /*
   * How far the index can stray and still land within a seed's radius.
   *
   * r(j) = scale·√(count - j), so dr/dj = -scale²/(2r) and an index step moves
   * the radius by scale²/(2r). A seed further than SEED_RADIUS in radius alone
   * cannot possibly be drawn, which bounds the search at 2·SEED_RADIUS·r/scale
   * indices — a couple of dozen at the rim rather than the couple of hundred a
   * naive nearest-seed search would need, because this kernel only has to
   * answer "is a seed drawn here", not "which is nearest".
   */
  const window = Math.min(64, Math.ceil(2 * SEED_RADIUS * (r / scale)) + 4);
  const start = Math.max(0, Math.round(count - depth) - window);
  const end = Math.min(count, Math.round(count - depth) + window);

  // One trig pair for the first candidate, then step by a rotation. Calling
  // cos/sin per candidate would cost more than the whole search.
  const angle = indexAngle(start);
  let ux = Math.cos(angle);
  let uy = Math.sin(angle);

  /*
   * Candidates are rejected by direction before their position is ever
   * computed. A seed close enough to be drawn has to lie within
   * SEED_RADIUS·scale/r radians of the pixel, and comparing the running unit
   * vector against the pixel's is a dot product — no square root, no radius.
   * Nearly every candidate in the window fails it, which is what makes the
   * search cheap enough to run per pixel.
   */
  const invR = 1 / r;
  const px = x * invR;
  const py = y * invR;
  const cosLimit = Math.cos(Math.min(Math.PI, SEED_RADIUS * scale * invR * 1.2));

  let closest = Infinity;
  let nearestIndex = 0;
  for (let j = start; j <= end; j += 1) {
    if (ux * px + uy * py > cosLimit) {
      const rj = scale * Math.sqrt(count - j);
      const dx = rj * ux - x;
      const dy = rj * uy - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < closest) {
        closest = d2;
        nearestIndex = j;
      }
    }
    const nx = ux * GOLDEN_COS - uy * GOLDEN_SIN;
    uy = ux * GOLDEN_SIN + uy * GOLDEN_COS;
    ux = nx;
  }

  if (closest > (SEED_RADIUS * scale) ** 2) return -1; // between seeds
  const arms = armCount(depth);
  return (nearestIndex % arms) / arms;
}

export const FORMULAS = [
  {
    id: 'mandelbrot',
    trappable: true,
    name: 'Mandelbrot',
    sample: mandelbrotSample,
    logSpace: true,
    iterScale: 1,
    juliaSource: true,
    defaultView: { cx: -0.6, cy: 0, halfHeight: 1.3 },
    /*
     * Classic addresses on the boundary. Every one of them opens onto detail
     * that holds for the next dozen orders of magnitude, which is what a warp
     * needs — dropping the camera somewhere arbitrary usually lands it in flat
     * interior or empty sky.
     */
    seeds: [
      { name: 'Seahorse Valley', cx: -0.743643887037151, cy: 0.13182590420533, halfHeight: 0.9 },
      { name: 'Elephant Valley', cx: 0.2925755, cy: -0.0149977, halfHeight: 0.55 },
      { name: 'Triple Spiral', cx: -0.088, cy: 0.654, halfHeight: 0.5 },
      { name: 'Misiurewicz Point', cx: -0.77568377, cy: 0.13646737, halfHeight: 0.45 },
      { name: 'Scepter Variant', cx: -1.25066, cy: 0.02012, halfHeight: 0.35 },
      { name: 'Quad Spiral', cx: -0.235125, cy: 0.827215, halfHeight: 0.4 },
      { name: 'Feather Shoals', cx: -1.7687796, cy: 0.0017396, halfHeight: 0.02 },
    ],
  },
  {
    id: 'ship',
    trappable: true,
    name: 'Burning Ship',
    sample: burningShipSample,
    logSpace: true,
    iterScale: 1,
    // No "julia here" from the ship: a Julia set of the ship map would need
    // its own kernel, and handing its coordinates to the z^2 + c Julia would
    // just be a wrong answer that happens to render.
    defaultView: { cx: -0.5, cy: -0.5, halfHeight: 1.5 },
    // Found by scanning for deep-escaping cells that still touch the set, so
    // each one sits right on the boundary rather than near it.
    seeds: [
      { name: 'The Armada', cx: -1.7827273, cy: -0.0099091, halfHeight: 0.02 },
      { name: 'Hull Fracture', cx: -1.4654545, cy: -0.0954545, halfHeight: 0.06 },
      { name: 'Lower Fleet', cx: 0.1090909, cy: -1.0677273, halfHeight: 0.08 },
      { name: 'Mast Spires', cx: -1.0718182, cy: -0.4481818, halfHeight: 0.08 },
    ],
  },
  {
    id: 'julia',
    trappable: true,
    name: 'Julia',
    sample: juliaSample,
    logSpace: true,
    iterScale: 1,
    defaultView: { cx: 0, cy: 0, halfHeight: 1.4 },
    defaultParam: { re: -0.123, im: 0.745 },
    /*
     * For Julia a warp changes the constant rather than the address: the view
     * stays put and the whole fractal becomes a different one.
     *
     * Every c here is inside the Mandelbrot set, which is exactly the
     * condition for its Julia set to be connected. Several constants that get
     * passed around as classics (0.285 + 0.01i, -0.8 + 0.156i) sit just
     * *outside* the boundary and give Cantor dust instead — pretty at a
     * glance, but there is no boundary to dive into.
     */
    seeds: [
      { name: 'Douady Rabbit', cx: 0, cy: 0, halfHeight: 1.4, param: { re: -0.123, im: 0.745 } },
      { name: 'Basilica', cx: 0, cy: 0, halfHeight: 1.4, param: { re: -1, im: 0 } },
      { name: 'Dendrite', cx: 0, cy: 0, halfHeight: 1.4, param: { re: 0, im: 1 } },
      { name: 'Siegel Disk', cx: 0, cy: 0, halfHeight: 1.4, param: { re: -0.390541, im: 0.586788 } },
      { name: 'San Marco', cx: 0, cy: 0, halfHeight: 1.4, param: { re: -0.75, im: 0 } },
      { name: 'Airplane', cx: 0, cy: 0, halfHeight: 1.4, param: { re: -1.7549, im: 0 } },
      { name: 'Kokopelli', cx: 0, cy: 0, halfHeight: 1.4, param: { re: -0.11, im: 0.6557 } },
      { name: 'Filigree', cx: 0, cy: 0, halfHeight: 1.4, param: { re: 0.32, im: 0.043 } },
    ],
  },
  {
    id: 'newton',
    name: 'Newton',
    sample: newtonSample,
    // The kernel returns a palette position directly, so no log remap.
    logSpace: false,
    density: 1,
    // Convergence is quadratic; thousands of iterations would buy nothing.
    iterScale: 0.4,
    defaultView: { cx: 0, cy: 0, halfHeight: 1.6 },
    // Every point where the three basins meet is as detailed as every other,
    // so warps just re-enter the plane somewhere else.
    seeds: [],
  },
  {
    id: 'kali',
    name: 'Kali',
    sample: kaliSample,
    logSpace: false,
    density: 0.42,
    iterScale: 1,
    // Ten to forty iterations is the whole fractal; the profile grows the
    // count only slightly with depth.
    iterProfile: { base: 12, perDecade: 1.8, cap: 46 },
    defaultView: { cx: 0, cy: 0, halfHeight: 1.25 },
    defaultParam: { re: 0.75, im: 0.75 },
    /*
     * Like Julia, the constant is the fractal — so a warp changes c rather
     * than the address. These came out of a sweep of the (0.4..1.35) square
     * scored on how much local structure each constant produces; the ones
     * that survived all sit on the diagonal ridge where the fold and the
     * inversion are in balance.
     */
    seeds: [
      { name: 'Prime Fold', cx: 0, cy: 0, halfHeight: 1.25, param: { re: 0.75, im: 0.75 } },
      { name: 'Skew Lattice', cx: 0, cy: 0, halfHeight: 1.25, param: { re: 0.7, im: 0.8 } },
      { name: 'Mirror Run', cx: 0, cy: 0, halfHeight: 1.25, param: { re: 0.85, im: 0.6 } },
      { name: 'Reef', cx: 0, cy: 0, halfHeight: 1.25, param: { re: 0.55, im: 0.9 } },
      { name: 'Cathedral', cx: 0, cy: 0, halfHeight: 1.25, param: { re: 0.65, im: 0.85 } },
    ],
  },
  {
    id: 'droste',
    name: 'Droste',
    sample: drosteSample,
    logSpace: true,
    iterScale: 1,
    // The camera loops instead of descending, so depth never grows and the
    // iteration budget is flat.
    iterProfile: { base: 420, perDecade: 0, cap: 420 },
    defaultView: { cx: 0, cy: 0, halfHeight: 1.2 },
    defaultParam: { re: -0.4, im: 0.6 },
    // The spiral has one fixed point and the whole trick is built around it.
    fixedCenter: true,
    zoomPeriod: DROSTE_PERIOD,
    trappable: true,
    seeds: [
      { name: 'Print Gallery', cx: 0, cy: 0, halfHeight: 1.2, param: { re: -0.4, im: 0.6 } },
      { name: 'Stairwell', cx: 0, cy: 0, halfHeight: 1.2, param: { re: -0.75, im: 0.11 } },
      { name: 'Rabbit Hole', cx: 0, cy: 0, halfHeight: 1.2, param: { re: -0.123, im: 0.745 } },
      { name: 'Basilica Well', cx: 0, cy: 0, halfHeight: 1.2, param: { re: -1, im: 0 } },
    ],
  },
  {
    id: 'phyllotaxis',
    name: 'Phyllotaxis',
    sample: phyllotaxisSample,
    logSpace: false,
    density: 1,
    iterScale: 1,
    // The kernel searches a candidate window rather than iterating a map, so
    // it has no use for an iteration budget.
    iterProfile: { base: 1, perDecade: 0, cap: 1 },
    defaultView: { cx: 0, cy: 0, halfHeight: 1.05 },
    fixedCenter: true,
    /*
     * The bloom grows rather than the camera diving: the window on the plane
     * is fixed, and what the zoom animation drives is how many seeds the
     * pattern has. Seeds fill area, so the count goes as the square.
     */
    staticView: { cx: 0, cy: 0, halfHeight: 1.05 },
    paramFromView: view => {
      const growth = 1.05 / view.halfHeight;
      return { count: Math.floor(1400 * growth * growth), scale: PHYLLO_SCALE };
    },
    /*
     * Indices past a few hundred million stop being exactly representable
     * where it matters, so the bloom resets rather than quietly degrading into
     * a smear. One cycle runs about twenty seconds at the default rate.
     */
    maxCount: 4e8,
    describe: param => (param ? `${param.count.toLocaleString()} seeds` : ''),
    seeds: [],
  },
];

export const DEFAULT_FORMULA_ID = FORMULAS[0].id;

export const formulaById = id => FORMULAS.find(f => f.id === id) || FORMULAS[0];
