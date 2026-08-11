/*
 * Route generation for the light cycles.
 *
 * A route is a list of points in the plane's local space, joined by axis
 * aligned legs. x runs across the plane with screen centre at 100; y runs from
 * the horizon at 0 to the camera at about 45. See LightCycles.css for how that
 * plane is built and why the numbers below are the on-screen band.
 *
 * Routes used to be a single hand-written path in CSS, which meant every run
 * was identical and always crossed left to right. Generating them means each
 * run differs and the timing arithmetic that keeps speed constant through the
 * turns is derived rather than maintained by hand.
 */

// The grid rules every 5vw across and 5vh deep, so every leg is a whole number
// of grid squares and every turn lands on a line.
const GRID = 5;

// A run occupies the last eighth of the period, which is one grid drift cycle.
// Everything before that is the rider parked off screen. See LightCycles.css.
export const RUN_START_PCT = 87.5;
const RUN_LENGTH_PCT = 100 - RUN_START_PCT;

// A turn is instant: the heading gets two stops this far apart rather than
// easing between them.
const SNAP_PCT = 0.01;

// x far enough past the visible band that a rider enters and leaves off screen.
const X_OFF_LEFT = 45;
const X_OFF_RIGHT = 155;

// The band of rows that lands on screen. Nearer than Y_NEAR the plane is behind
// the viewer; past Y_FAR a rider is lost in the horizon glow.
const Y_FAR = 6;
const Y_NEAR = 32;

// Perspective magnifies near rows, so less of the plane's width is visible down
// there. A rider entering from the bottom has to start near the centre.
const X_NEAR_MIN = 85;
const X_NEAR_MAX = 115;

const snap = value => Math.round(value / GRID) * GRID;
const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
const snapBetween = (rand, lo, hi) => clamp(snap(lo + rand() * (hi - lo)), snap(lo), snap(hi));
const coinFlip = rand => (rand() < 0.5 ? -1 : 1);

/* Enters from one side, crosses the grid, jogs nearer or further on the way. */
const crossingRoute = rand => {
  const direction = coinFlip(rand);
  let x = direction > 0 ? X_OFF_LEFT : X_OFF_RIGHT;
  let y = snapBetween(rand, Y_FAR + 4, Y_NEAR - 6);

  const points = [[x, y]];
  const jogs = 1 + Math.floor(rand() * 3);

  for (let i = 0; i < jogs; i += 1) {
    x += direction * snapBetween(rand, 20, 40);
    points.push([x, y]);
    y = clamp(y + coinFlip(rand) * snapBetween(rand, 5, 15), Y_FAR, Y_NEAR);
    points.push([x, y]);
  }

  points.push([direction > 0 ? X_OFF_RIGHT : X_OFF_LEFT, y]);
  return points;
};

/* Enters from the bottom of the screen and rides away toward the horizon. */
const recedingRoute = rand => {
  let x = snapBetween(rand, X_NEAR_MIN, X_NEAR_MAX);
  let y = Y_NEAR + 10;

  const points = [[x, y]];
  const jogs = 1 + Math.floor(rand() * 3);

  for (let i = 0; i < jogs; i += 1) {
    y = clamp(y - snapBetween(rand, 5, 12), Y_FAR + 4, Y_NEAR + 10);
    points.push([x, y]);
    x += coinFlip(rand) * snapBetween(rand, 5, 20);
    points.push([x, y]);
  }

  points.push([x, 0]);
  return points;
};

/* Zero length legs come out of the clamps above and would divide by zero. */
const withoutStalls = points =>
  points.filter(([x, y], i) => i === 0 || x !== points[i - 1][0] || y !== points[i - 1][1]);

const headingFor = ([x1, y1], [x2, y2]) => {
  if (x2 !== x1) return x2 > x1 ? 0 : 180;
  // y grows toward the camera, so a leg with falling y is heading away.
  return y2 > y1 ? 90 : -90;
};

/**
 * Build one route. `rand` is injected so tests can drive it deterministically.
 *
 * Returns the legs, each with the geometry its trail segment needs and the
 * slice of the timeline it occupies. Legs are timed by length so the rider
 * holds one speed through every turn.
 */
export function makeRoute(rand) {
  const points = withoutStalls(rand() < 0.6 ? crossingRoute(rand) : recedingRoute(rand));
  const spans = points.slice(1).map(([x, y], i) => {
    const [px, py] = points[i];
    return { from: [px, py], to: [x, y], length: Math.abs(x - px) + Math.abs(y - py) };
  });

  const total = spans.reduce((sum, span) => sum + span.length, 0);
  let travelled = 0;

  const legs = spans.map(span => {
    const startPct = RUN_START_PCT + (RUN_LENGTH_PCT * travelled) / total;
    travelled += span.length;
    const endPct = RUN_START_PCT + (RUN_LENGTH_PCT * travelled) / total;

    const [x1, y1] = span.from;
    const [x2, y2] = span.to;
    const across = x2 !== x1;
    const heading = headingFor(span.from, span.to);

    return {
      startPct,
      endPct,
      heading,
      // A segment is pinned at the start of its leg and grows along it, so it
      // sits at the leg's first point, is rotated to the heading, and is as wide
      // as the leg is long in whichever axis the leg runs.
      segment: {
        left: `${x1}vw`,
        top: `${y1}vh`,
        width: across ? `${Math.abs(x2 - x1)}vw` : `${Math.abs(y2 - y1)}vh`,
        rotation: heading,
      },
    };
  });

  return { points, legs };
}

const round = value => Number(value.toFixed(3));
const at = ([x, y]) => `translate3d(${x}vw, ${y}vh, 0)`;

/** The keyframes for one route: where the rider is, and which way it faces. */
export function routeKeyframes(id, route) {
  const { points, legs } = route;

  const path = [
    `  0%, ${RUN_START_PCT}% { transform: ${at(points[0])}; }`,
    ...legs.map((leg, i) => `  ${round(leg.endPct)}% { transform: ${at(points[i + 1])}; }`),
  ].join('\n');

  const heading = legs
    .map((leg, i) => {
      const from = i === 0 ? '0%' : `${round(leg.startPct + SNAP_PCT)}%`;
      return `  ${from}, ${round(leg.endPct)}% { transform: rotate(${leg.heading}deg); }`;
    })
    .join('\n');

  const segments = legs
    .map(
      (leg, i) => `@keyframes vw-seg-${id}-${i} {
  0%, ${round(leg.startPct)}% { transform: rotate(var(--seg-rot, 0deg)) scaleX(0); }
  ${round(leg.endPct)}%, 100% { transform: rotate(var(--seg-rot, 0deg)) scaleX(1); }
}`,
    )
    .join('\n');

  return `@keyframes vw-path-${id} {\n${path}\n}\n@keyframes vw-heading-${id} {\n${heading}\n}\n${segments}`;
}
