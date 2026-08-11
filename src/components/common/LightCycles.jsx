import React from 'react';
import PropTypes from 'prop-types';
import './LightCycles.css';

// One trail segment per leg of the path. Each is fixed in place on the grid and
// grows only while the rider is on that leg, so the finished trail traces the
// route actually ridden instead of swinging around with the bike.
const LEGS = [1, 2, 3, 4, 5];

const Cycle = () => (
  <svg className="LightCycles-bike" viewBox="0 0 120 40" aria-hidden="true" focusable="false">
    <path className="LightCycles-bikeShell" d="M2 20L32 5L94 12L118 20L94 28L32 35Z" />
    <path className="LightCycles-bikeCore" d="M26 20L46 13L92 17L104 20L92 23L46 27Z" />
  </svg>
);

const Rider = ({ lane }) => (
  <div className={`LightCycles-lane LightCycles-lane--${lane}`}>
    <div className="LightCycles-trail">
      {LEGS.map(leg => (
        <span key={leg} className={`LightCycles-seg LightCycles-seg--${leg}`} />
      ))}
    </div>
    <div className="LightCycles-rider">
      <div className="LightCycles-heading">
        <Cycle />
      </div>
    </div>
  </div>
);

Rider.propTypes = {
  lane: PropTypes.oneOf(['a', 'b']).isRequired,
};

/**
 * Light cycles running the perspective grid.
 *
 * The riders live inside a plane that carries the same perspective transform
 * and the same drift animation as the grid horizon in vaporwave.css, so they
 * sit on the grid rather than floating over it. Inside that plane they move in
 * grid units — 5vw across, 5vh into the distance — turning only at right
 * angles, and the heading snaps between legs so the turns read as instant.
 *
 * Each rider is parked off the plane for the bulk of its period and makes one
 * run; the two use different periods so they do not pair up.
 */
const LightCycles = () => (
  <div className="LightCycles" aria-hidden="true">
    <div className="LightCycles-plane">
      <Rider lane="a" />
      <div className="LightCycles-mirror">
        <Rider lane="b" />
      </div>
    </div>
  </div>
);

export default LightCycles;
