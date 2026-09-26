import React from 'react';
import PropTypes from 'prop-types';

import SceneLayer from '../SceneLayer';
import './VaultScene.css';

/*
 * Door geometry. Centred in the view box and kept inside the x=250..750 band
 * that survives `preserveAspectRatio="slice"` on a narrow viewport. The door
 * hangs on its left edge, so that is where the swing pivots.
 */
const CX = 500;
const CY = 286;
const R = 186;
const FRAME_R = 210;
const FLOOR_Y = 500;
const HINGE_X = CX - R;
// The door's own box: the circle plus the bolts that stand proud of it.
const DOOR_BOX = R + 20;
const DOOR_VIEWBOX = `${CX - DOOR_BOX} ${CY - DOOR_BOX} ${2 * DOOR_BOX} ${2 * DOOR_BOX}`;
// Rim plates behind the face, in view-box units of depth, giving the door its
// thickness when seen edge on.
const EXTRUSION = [6, 12, 18, 24, 30, 36];
const LAMP_X = 664;
const LAMP_Y = 84;

const polar = (deg, radius) => {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + radius * Math.sin(rad), y: CY - radius * Math.cos(rad) };
};

/*
 * Locking bolts, by bearing (0 is straight up, clockwise). None on the hinge
 * side: a real vault door is held there by the hinge, and bolts that retract
 * toward it would read as the door being bolted to its own hinge.
 */
const BOLT_BEARINGS = [0, 30, 60, 90, 120, 150, 180, 210, 330];

// Rivets around the face, just inside the rim.
const RIVETS = Array.from({ length: 24 }, (_, i) => polar(i * 15, R - 8));

// The spin wheel: three spokes through the hub give six handles.
const WHEEL_ARM = 82;
const HANDLES = Array.from({ length: 6 }, (_, i) => polar(i * 60, WHEEL_ARM));

const seeded = seed => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

/*
 * Drive racks behind the door, only ever seen through the opening. Each row is
 * as wide as the circle allows at its farther edge, so no bay pokes outside the
 * frame even before the clip path trims it. Activity lights are generated from
 * a fixed seed so every render and every test sees the same racks.
 */
const RACK_ROWS = [140, 188, 236, 284, 332, 380];
const RACK_ROW_H = 36;
const BAY_PITCH = 26;
const BAY_W = 20;

const BAYS = (() => {
  const next = seeded(20260925);
  return RACK_ROWS.flatMap(top => {
    const reach = Math.max(Math.abs(top - CY), Math.abs(top + RACK_ROW_H - CY));
    const half = Math.sqrt((R - 12) ** 2 - reach ** 2);
    const count = Math.floor((2 * half - 16) / BAY_PITCH);
    const left = CX - (count * BAY_PITCH - (BAY_PITCH - BAY_W)) / 2;
    return Array.from({ length: count }, (_, i) => ({
      x: left + i * BAY_PITCH,
      y: top + 4,
      delay: `${(next() * -3).toFixed(2)}s`,
      duration: `${(0.9 + next() * 1.8).toFixed(2)}s`,
    }));
  });
})();

/*
 * Data headed into the vault while the door is open: mail and documents, which
 * is what this backup product actually protects. Each rides the same 24s
 * schedule as the door, offset a little so they arrive as a stream.
 */
const PACKETS = [
  { kind: 'mail', y: 262 },
  { kind: 'doc', y: 300 },
  { kind: 'mail', y: 282 },
  { kind: 'doc', y: 318 },
  { kind: 'mail', y: 250 },
  { kind: 'doc', y: 294 },
].map((packet, i) => ({ ...packet, delay: `${(i * 0.8).toFixed(1)}s` }));

const Packet = ({ kind }) =>
  kind === 'mail' ? (
    <>
      <rect className="VaultScene-glyph" x="0" y="0" width="24" height="16" rx="1.5" />
      <path className="VaultScene-glyphLine" d="M1 1 L12 9 L23 1" />
    </>
  ) : (
    <>
      <path className="VaultScene-glyph" d="M0 -3 H14 L20 3 V21 H0 Z" />
      <path className="VaultScene-glyphLine" d="M14 -3 V3 H20 M4 8 H16 M4 12 H16 M4 16 H12" />
    </>
  );

Packet.propTypes = {
  kind: PropTypes.oneOf(['mail', 'doc']).isRequired,
};

// Floor perspective, converging on a point behind the door.
const VANISH_Y = 300;
const FLOOR_RAYS = [-700, -350, -100, 100, 300, 500, 700, 900, 1100, 1350, 1700].map(bottomX => ({
  x1: (CX + ((bottomX - CX) * (FLOOR_Y - VANISH_Y)) / (600 - VANISH_Y)).toFixed(1),
  x2: bottomX,
}));

/**
 * Bank vault door.
 *
 * A round vault door set in a wall, on a floor that recedes to a point behind
 * it. Once per 24s it unlocks: the wheel spins, the bolts draw back, and the
 * door swings open on its left hinge to show drive racks inside. Mail and
 * documents stream in from the right while it is open, then it swings shut,
 * bolts, and spins the wheel back to where it started.
 *
 * The door swings outward, toward the viewer, a little past square to the
 * wall. It is a CSS 3D rotation under perspective (see the stage below), and
 * its thickness is a stack of rim plates set back behind the face, which only
 * shows once the door turns side-on.
 *
 * Everything animated is a transform or an opacity. The static values are the
 * locked, closed door, which is what reduced motion freezes on.
 */
const VaultScene = () => (
  <SceneLayer
    className="VaultScene"
    wash="radial-gradient(ellipse 70% 60% at 50% 44%, #1c1538 0%, #100b25 55%, #06040f 100%)"
    glow="#ffc86b"
  >
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <clipPath id="vault-opening">
          <circle cx={CX} cy={CY} r={R - 2} />
        </clipPath>
        <radialGradient id="vault-interior" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0f3a4a" />
          <stop offset="70%" stopColor="#081a26" />
          <stop offset="100%" stopColor="#04080f" />
        </radialGradient>
        <radialGradient id="vault-spill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#01cdfe" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#01cdfe" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall panel seams, faint enough to read as texture. */}
      <path
        className="VaultScene-seam"
        d="M0 120 H1000 M0 400 H1000 M150 0 V500 M250 120 V400 M750 120 V400 M850 0 V500"
      />

      {/* Floor */}
      <rect className="VaultScene-floor" x="0" y={FLOOR_Y} width="1000" height={600 - FLOOR_Y} />
      <g className="VaultScene-floorLines">
        {FLOOR_RAYS.map(ray => (
          <line key={ray.x2} x1={ray.x1} y1={FLOOR_Y} x2={ray.x2} y2="600" />
        ))}
        <path d="M0 522 H1000 M0 552 H1000" />
      </g>
      <path className="VaultScene-horizon" d={`M0 ${FLOOR_Y} H1000`} />
      <ellipse className="VaultScene-spill" cx={CX + 50} cy={FLOOR_Y + 30} rx="240" ry="34" fill="url(#vault-spill)" />

      {/* Frame the door seats into. */}
      <circle className="VaultScene-frame" cx={CX} cy={CY} r={FRAME_R} />
      <circle className="VaultScene-frameInner" cx={CX} cy={CY} r={R + 3} />

      {/* Status lamp beside the frame, red while bolted, mint while open. Off
          the centre line, which is where section headings land. */}
      <g className="VaultScene-lamp">
        <rect className="VaultScene-lampHousing" x={LAMP_X - 16} y={LAMP_Y - 10} width="32" height="20" rx="4" />
        <circle className="VaultScene-lampLocked" cx={LAMP_X} cy={LAMP_Y} r="5" />
        <circle className="VaultScene-lampOpen" cx={LAMP_X} cy={LAMP_Y} r="5" />
      </g>

      {/* Inside the vault, only ever visible through the open door. */}
      <g clipPath="url(#vault-opening)">
        <circle cx={CX} cy={CY} r={R} fill="url(#vault-interior)" />
        <g className="VaultScene-racks">
          {RACK_ROWS.map(top => (
            <line
              key={top}
              className="VaultScene-shelf"
              x1={CX - R}
              y1={top + RACK_ROW_H}
              x2={CX + R}
              y2={top + RACK_ROW_H}
            />
          ))}
          {BAYS.map(bay => (
            <g key={`${bay.x}-${bay.y}`}>
              <rect className="VaultScene-bay" x={bay.x} y={bay.y} width={BAY_W} height={RACK_ROW_H - 8} rx="2" />
              <circle
                className="VaultScene-led"
                cx={bay.x + BAY_W - 5}
                cy={bay.y + RACK_ROW_H - 13}
                r="1.8"
                style={{ animationDelay: bay.delay, animationDuration: bay.duration }}
              />
            </g>
          ))}
        </g>
      </g>

      {/* Hinge knuckles stay put through the swing. */}
      <g className="VaultScene-hinges">
        <rect x={HINGE_X - 20} y={CY - 130} width="24" height="42" rx="5" />
        <rect x={HINGE_X - 20} y={CY + 88} width="24" height="42" rx="5" />
      </g>

      <g className="VaultScene-packets">
        {PACKETS.map(packet => (
          <g key={`${packet.kind}-${packet.y}`} transform={`translate(1040 ${packet.y})`}>
            <g className="VaultScene-packet" style={{ animationDelay: packet.delay }}>
              <path className="VaultScene-trail" d="M30 8 H78" />
              <Packet kind={packet.kind} />
            </g>
          </g>
        ))}
      </g>
    </svg>
    {/*
      The door lives outside the scene SVG, in HTML, because only HTML boxes
      get real 3D transforms: an SVG group can scale but not rotate out of the
      page, and a flat scale reads as the door swinging inward as easily as
      outward. Here it turns about its hinge under perspective, so the free
      edge grows as it comes toward the viewer.
    */}
    <div className="VaultScene-stage">
      <div className="VaultScene-door">
        {EXTRUSION.map(depth => (
          <svg
            key={depth}
            className="VaultScene-plate"
            viewBox={DOOR_VIEWBOX}
            focusable="false"
            style={{ '--depth': depth }}
          >
            <circle className="VaultScene-plateRim" cx={CX} cy={CY} r={R} />
          </svg>
        ))}
        <svg className="VaultScene-doorFace" viewBox={DOOR_VIEWBOX} focusable="false">
          {/* Bolts first, so the face hides whatever length is drawn back. */}
          {BOLT_BEARINGS.map(bearing => (
            <g key={bearing} transform={`rotate(${bearing} ${CX} ${CY})`}>
              <rect className="VaultScene-bolt" x={CX - 7} y={CY - R - 16} width="14" height="34" rx="3" />
            </g>
          ))}

          <circle className="VaultScene-face" cx={CX} cy={CY} r={R} />
          <circle className="VaultScene-ring" cx={CX} cy={CY} r={R - 16} />
          <circle className="VaultScene-ring" cx={CX} cy={CY} r={R * 0.64} />
          <g className="VaultScene-rivets">
            {RIVETS.map(rivet => (
              <circle key={`${rivet.x.toFixed(1)}-${rivet.y.toFixed(1)}`} cx={rivet.x} cy={rivet.y} r="2" />
            ))}
          </g>

          <g className="VaultScene-wheel">
            <circle className="VaultScene-wheelRim" cx={CX} cy={CY} r="60" />
            <path
              className="VaultScene-spoke"
              d={HANDLES.slice(0, 3)
                .map(
                  h =>
                    `M${h.x.toFixed(1)} ${h.y.toFixed(1)} L${(2 * CX - h.x).toFixed(1)} ${(2 * CY - h.y).toFixed(1)}`,
                )
                .join(' ')}
            />
            {HANDLES.map(h => (
              <circle key={`${h.x.toFixed(1)}-${h.y.toFixed(1)}`} className="VaultScene-knob" cx={h.x} cy={h.y} r="7" />
            ))}
            <circle className="VaultScene-hub" cx={CX} cy={CY} r="20" />
            <circle className="VaultScene-hubCore" cx={CX} cy={CY} r="6" />
          </g>
        </svg>
      </div>
    </div>
  </SceneLayer>
);

export default VaultScene;
