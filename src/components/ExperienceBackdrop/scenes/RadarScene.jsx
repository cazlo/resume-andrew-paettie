import React from 'react';

import SceneLayer from '../SceneLayer';
import './RadarScene.css';

/*
 * Scope geometry. Centred in the view box, radius kept inside the x=250..750
 * band that survives `preserveAspectRatio="slice"` on a narrow viewport, with
 * enough headroom for the bezel ring outside the radius to survive too.
 */
const CX = 500;
const CY = 300;
const R = 220;

// How long one clockwise sweep of the arm takes. 12s is two grid-drift periods
// (see vaporwave.css's 6s vw-grid-drift), so the scope stays in phase with the
// rest of the page's motion.
const SWEEP_PERIOD = 12;

/*
 * Bearing/range -> view-box point. Bearing 0 is straight up (true north on a
 * scope face) and increases clockwise, matching a positive CSS rotate() in
 * screen coordinates — the same convention the sweep arm rotates through, so
 * a blip's bearing always lines up with the arm angle that lights it.
 */
const polar = (bearingDeg, radius) => {
  const rad = (bearingDeg * Math.PI) / 180;
  return {
    x: CX + radius * Math.sin(rad),
    y: CY - radius * Math.cos(rad),
  };
};

// Range rings, faint climbing to a bright rim at r=1.
const RING_FRACTIONS = [0.22, 0.44, 0.66, 0.88, 1];

// Crosshair bearing lines: four diameters through the centre give the classic
// eight-point compass rose without drawing sixteen radii.
const CROSSHAIR_ANGLES = [0, 45, 90, 135];
const CROSSHAIRS = CROSSHAIR_ANGLES.map(angle => {
  const from = polar(angle, R);
  const to = polar(angle + 180, R);
  return {
    angle,
    x1: from.x.toFixed(1),
    y1: from.y.toFixed(1),
    x2: to.x.toFixed(1),
    y2: to.y.toFixed(1),
    cardinal: angle % 90 === 0,
  };
});

const tickClass = tick => {
  if (tick.cardinal) return 'RadarScene-tickCardinal';
  return tick.major ? 'RadarScene-tickMajor' : 'RadarScene-tickMinor';
};

// Degree ticks around the rim, every 10 degrees, longer and brighter every
// 30 and brighter still on the four cardinals.
const TICKS = Array.from({ length: 36 }, (_, i) => i * 10).map(deg => {
  const cardinal = deg % 90 === 0;
  const major = deg % 30 === 0;
  const inner = major ? R - 16 : R - 8;
  let outer = R + 2;
  if (cardinal) outer = R + 12;
  else if (major) outer = R + 7;
  const from = polar(deg, inner);
  const to = polar(deg, outer);
  return {
    deg,
    cardinal,
    major,
    x1: from.x.toFixed(1),
    y1: from.y.toFixed(1),
    x2: to.x.toFixed(1),
    y2: to.y.toFixed(1),
  };
});

/*
 * The afterglow wedge. A rotating stack of thin pie slices trailing the arm,
 * each one static, each one dimmer than the last — the illusion of decaying
 * phosphor comes entirely from the group rotating them together, not from
 * animating any one slice's opacity.
 */
const WEDGE_SPAN = 54;
const WEDGE_SLICES = 9;
const wedgePath = (a0, a1) => {
  const from = polar(a0, R);
  const to = polar(a1, R);
  return `M ${CX} ${CY} L ${from.x.toFixed(1)} ${from.y.toFixed(1)} A ${R} ${R} 0 0 1 ${to.x.toFixed(1)} ${to.y.toFixed(
    1,
  )} Z`;
};
const WEDGES = Array.from({ length: WEDGE_SLICES }, (_, i) => {
  const step = WEDGE_SPAN / WEDGE_SLICES;
  const t = i / (WEDGE_SLICES - 1);
  return {
    d: wedgePath(-(i + 1) * step, -i * step),
    // Brightest touching the arm at t=0, all but gone by the tail end.
    opacity: 0.5 * Math.exp(-3.2 * t),
  };
});

/*
 * Blips are generated once at module load from a fixed seed rather than with
 * Math.random, so every render and every test sees the same scope. Bearing
 * drives both the on-screen position and the flash delay, computed from the
 * same value, so the two cannot drift apart.
 */
const seeded = seed => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const BLIPS = (() => {
  const next = seeded(19580101); // arbitrary fixed seed
  return Array.from({ length: 16 }, () => {
    const bearing = Math.round(next() * 3600) / 10;
    // Keep clear of the dark well at the centre and the bright rim.
    const rangeFrac = 0.28 + next() * 0.65;
    const size = 3 + next() * 2.6;
    const point = polar(bearing, rangeFrac * R);
    return {
      bearing,
      x: point.x.toFixed(1),
      y: point.y.toFixed(1),
      size: size.toFixed(1),
      delay: ((bearing / 360) * SWEEP_PERIOD).toFixed(3),
    };
  });
})();

/**
 * Radar PPI scope.
 *
 * A stereotypical air-defence display: concentric range rings, a compass
 * crosshair, degree ticks around the rim, and a sweep arm that turns clockwise
 * once every 12s trailing a wedge of decaying afterglow. Contacts flash as the
 * arm crosses their bearing and fade until it comes back around.
 *
 * The face is darkest at the centre and brightens toward the rim, which both
 * reads as a real scope (the phosphor is thinnest right under the pivot) and
 * keeps the section heading, which sits over this exact spot, legible — the
 * SceneLayer scrim does the same job again on top of it.
 *
 * Everything animated is a transform or an opacity: the arm and its wedge
 * rotate as one group, blips animate opacity/scale on their own clock offset
 * by bearing, nothing else moves.
 */
const RadarScene = () => (
  <SceneLayer
    className="RadarScene"
    wash="radial-gradient(ellipse 65% 60% at 50% 46%, #0a2419 0%, #071018 55%, #04020c 100%)"
    glow="#35ff86"
  >
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <radialGradient id="radar-face" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#020805" />
          <stop offset="55%" stopColor="#031607" />
          <stop offset="100%" stopColor="#04250f" />
        </radialGradient>
        {/* CRT scanlines: a static, tiled pattern rather than anything animated. */}
        <pattern id="radar-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1.4" fill="#020103" />
        </pattern>
      </defs>

      {/* Scope face, darkest at the pivot. */}
      <circle cx={CX} cy={CY} r={R} fill="url(#radar-face)" />

      <g className="RadarScene-rings">
        {RING_FRACTIONS.map(f => (
          <circle key={f} cx={CX} cy={CY} r={f * R} className={f === 1 ? 'RadarScene-rim' : 'RadarScene-ring'} />
        ))}
      </g>

      <g className="RadarScene-crosshairs">
        {CROSSHAIRS.map(line => (
          <line
            key={line.angle}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className={line.cardinal ? 'RadarScene-crosshairCardinal' : 'RadarScene-crosshairDiagonal'}
          />
        ))}
      </g>

      <g className="RadarScene-ticks">
        {TICKS.map(tick => (
          <line key={tick.deg} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} className={tickClass(tick)} />
        ))}
      </g>

      {/* Faint physical housing outside the phosphor face. */}
      <circle cx={CX} cy={CY} r={R + 24} className="RadarScene-bezel" />

      <g className="RadarScene-blips">
        {BLIPS.map(blip => (
          <circle
            key={`${blip.bearing}-${blip.x}-${blip.y}`}
            cx={blip.x}
            cy={blip.y}
            r={blip.size}
            className="RadarScene-blip"
            style={{ animationDelay: `${blip.delay}s` }}
          />
        ))}
      </g>

      {/* Arm and its afterglow wedge rotate together as one rigid shape. */}
      <g className="RadarScene-sweep">
        <g className="RadarScene-wedge">
          {WEDGES.map(slice => (
            <path key={slice.d} d={slice.d} opacity={slice.opacity} />
          ))}
        </g>
        <line x1={CX} y1={CY} x2={CX} y2={CY - R} className="RadarScene-arm" />
      </g>

      <circle cx={CX} cy={CY} r={3.5} className="RadarScene-hub" />

      <rect x="0" y="0" width="1000" height="600" fill="url(#radar-scanlines)" className="RadarScene-scanlines" />
    </svg>
  </SceneLayer>
);

export default RadarScene;
