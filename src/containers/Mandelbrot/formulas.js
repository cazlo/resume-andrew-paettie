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

/**
 * z -> z^2 + c, starting from zero.
 *
 * Two shortcuts keep interior regions affordable: the main cardioid and the
 * period-2 bulb are solved algebraically, and deeper in, orbits that fall into
 * a cycle are caught by comparing against a periodically refreshed reference
 * point (Brent-style). Exact equality is the right test there — an epsilon
 * would let near-boundary points masquerade as interior and eat the filaments.
 */
export function mandelbrotSample(cr, ci, maxIter) {
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
    if (mag2 > BAILOUT2) return smoothCount(i, mag2);
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
 * z -> (|Re z| + i|Im z|)^2 + c.
 *
 * Folding both components into the positive quadrant every step destroys the
 * self-similarity the Mandelbrot's shortcuts rely on, so there is no algebraic
 * interior test here — only the cycle check. The payoff is structure that
 * looks built rather than grown: hulls, masts, rigging.
 */
export function burningShipSample(cr, ci, maxIter) {
  let zr = 0;
  let zi = 0;
  let refR = 0;
  let refI = 0;
  let period = 0;
  let periodLimit = 8;

  for (let i = 0; i < maxIter; i += 1) {
    zr = Math.abs(zr);
    zi = Math.abs(zi);
    const zr2 = zr * zr;
    const zi2 = zi * zi;
    zi = 2 * zr * zi + ci;
    zr = zr2 - zi2 + cr;
    const mag2 = zr * zr + zi * zi;
    if (mag2 > BAILOUT2) return smoothCount(i, mag2);
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
 * z -> z^2 + c with c held fixed and the pixel supplying z0.
 *
 * Every c gives a different filled Julia set, and the interesting ones are the
 * c values sitting on the Mandelbrot boundary — which is exactly what the
 * page's "julia here" control hands over.
 */
export function juliaSample(zr0, zi0, maxIter, param) {
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

  for (let i = 0; i < maxIter; i += 1) {
    zi = 2 * zr * zi + ci;
    zr = zr2 - zi2 + cr;
    zr2 = zr * zr;
    zi2 = zi * zi;
    const mag2 = zr2 + zi2;
    if (mag2 > BAILOUT2) return smoothCount(i, mag2);
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

export const FORMULAS = [
  {
    id: 'mandelbrot',
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
];

export const DEFAULT_FORMULA_ID = FORMULAS[0].id;

export const formulaById = id => FORMULAS.find(f => f.id === id) || FORMULAS[0];
