import { makeRoute, routeKeyframes, RUN_START_PCT } from './lightCycleRoutes';

// A deterministic stand-in for Math.random that walks a fixed sequence, so a
// single test can cover many generated routes without being flaky.
const sequence = seed => {
  let value = seed;
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648;
    return value / 2147483648;
  };
};

const routes = Array.from({ length: 200 }, (unused, i) => makeRoute(sequence(i + 1)));

describe('makeRoute', () => {
  it('always produces at least one leg', () => {
    routes.forEach(route => {
      expect(route.legs.length).toBeGreaterThan(0);
    });
  });

  it('only turns at right angles', () => {
    routes.forEach(({ points }) => {
      points.slice(1).forEach(([x, y], i) => {
        const [px, py] = points[i];
        expect(x === px || y === py).toBe(true);
      });
    });
  });

  it('never stalls on a zero length leg', () => {
    routes.forEach(({ legs }) => {
      legs.forEach(leg => {
        expect(leg.endPct).toBeGreaterThan(leg.startPct);
      });
    });
  });

  it('fills exactly the run window, so speed is constant through the turns', () => {
    routes.forEach(({ legs }) => {
      expect(legs[0].startPct).toBeCloseTo(RUN_START_PCT);
      expect(legs[legs.length - 1].endPct).toBeCloseTo(100);

      legs.slice(1).forEach((leg, i) => {
        expect(leg.startPct).toBeCloseTo(legs[i].endPct);
      });
    });
  });

  it('sends riders across the grid and away toward the horizon', () => {
    const headings = new Set(routes.flatMap(route => route.legs.map(leg => leg.heading)));

    expect(headings).toContain(0); // left to right
    expect(headings).toContain(180); // right to left
    expect(headings).toContain(-90); // away toward the horizon
  });

  it('does not always draw the same route', () => {
    const shapes = new Set(routes.map(route => JSON.stringify(route.points)));
    expect(shapes.size).toBeGreaterThan(20);
  });
});

describe('routeKeyframes', () => {
  it('emits a path, a heading, and one growth animation per leg', () => {
    const route = makeRoute(sequence(7));
    const css = routeKeyframes('a', route);

    expect(css).toContain('@keyframes vw-path-a');
    expect(css).toContain('@keyframes vw-heading-a');
    route.legs.forEach((leg, i) => {
      expect(css).toContain(`@keyframes vw-seg-a-${i}`);
    });
  });
});
