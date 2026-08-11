/* eslint-disable react/no-danger */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './LightCycles.css';
import { makeRoute, routeKeyframes } from './lightCycleRoutes';

// One full period of a lane: the rider is parked off the plane for most of it
// and makes a single run at the end. Must stay a multiple of the grid's 6s
// drift so a run always begins at drift phase 0. See LightCycles.css.
const PERIOD_SECONDS = 48;

// Riders, and how far each is offset into the period so they do not arrive
// together. Offsets are multiples of the grid drift for the same reason.
const LANES = [
  { id: 'a', offsetSeconds: 0 },
  { id: 'b', offsetSeconds: 24 },
];

const Cycle = () => (
  <svg className="LightCycles-bike" viewBox="0 0 120 40" aria-hidden="true" focusable="false">
    <path className="LightCycles-bikeShell" d="M2 20L32 5L94 12L118 20L94 28L32 35Z" />
    <path className="LightCycles-bikeCore" d="M26 20L46 13L92 17L104 20L92 23L46 27Z" />
  </svg>
);

const Rider = ({ lane, route, delaySeconds }) => {
  const delay = { animationDelay: `${delaySeconds}s` };

  return (
    <div className={`LightCycles-lane LightCycles-lane--${lane}`} style={delay}>
      <div className="LightCycles-trail" style={delay}>
        {route.legs.map((leg, i) => (
          <span
            // Legs have no identity beyond their position in the route, and the
            // whole route is replaced at once.
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="LightCycles-seg"
            style={{
              ...delay,
              left: leg.segment.left,
              top: leg.segment.top,
              width: leg.segment.width,
              '--seg-rot': `${leg.segment.rotation}deg`,
              animationName: `vw-seg-${lane}-${i}`,
            }}
          />
        ))}
      </div>
      <div className="LightCycles-rider" style={{ ...delay, animationName: `vw-path-${lane}` }}>
        <div className="LightCycles-heading" style={{ ...delay, animationName: `vw-heading-${lane}` }}>
          <Cycle />
        </div>
      </div>
    </div>
  );
};

Rider.propTypes = {
  lane: PropTypes.string.isRequired,
  route: PropTypes.shape({ legs: PropTypes.array }).isRequired,
  delaySeconds: PropTypes.number.isRequired,
};

/**
 * Light cycles running the perspective grid.
 *
 * The riders live inside a plane that carries the same perspective transform as
 * the grid horizon in vaporwave.css, so they sit on the grid rather than
 * floating over it. Inside that plane they move in grid units, turning only at
 * right angles, and the heading snaps between legs so the turns read as instant.
 *
 * Routes are generated rather than fixed, so no two runs trace the same path and
 * a rider may cross the grid from either side or come up from the bottom of the
 * screen and ride away toward the horizon. A fresh set is drawn every period,
 * which lands while the trails are dark and the riders are off screen.
 */
const LightCycles = () => {
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setGeneration(n => n + 1), PERIOD_SECONDS * 1000);
    return () => clearInterval(timer);
  }, []);

  const riders = useMemo(
    () =>
      LANES.map(lane => ({
        ...lane,
        route: makeRoute(Math.random),
      })),
    // A new generation is the whole point: it is what re-rolls the routes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generation],
  );

  // Re-rolling remounts the riders, which restarts their CSS animations from
  // zero. That is only safe because the interval above is one whole period, and
  // a period is a whole number of grid drift cycles: the restart therefore lands
  // on grid drift phase 0, which is where a run has to begin for the rider to
  // track the lines. Any interval that is not a multiple of 6s breaks that.
  const css = riders.map(rider => routeKeyframes(rider.id, rider.route)).join('\n');

  return (
    <div className="LightCycles" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="LightCycles-plane">
        {riders.map(rider => (
          <Rider key={rider.id} lane={rider.id} route={rider.route} delaySeconds={-rider.offsetSeconds} />
        ))}
      </div>
    </div>
  );
};

export default LightCycles;
