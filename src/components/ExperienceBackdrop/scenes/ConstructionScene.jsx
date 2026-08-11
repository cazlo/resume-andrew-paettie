import React from 'react';

import SceneLayer from '../SceneLayer';
import './ConstructionScene.css';

/*
 * Site lights are generated once at module load from a fixed seed rather than
 * with Math.random, so every render and every test sees the same scatter. See
 * LunarScene's STARS for the same trick.
 */
const seeded = seed => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const SITE_LIGHTS = (() => {
  const next = seeded(20140901);
  return Array.from({ length: 12 }, () => ({
    cx: Math.round(next() * 1000),
    // Kept above the ground line, and mostly out of the crane/building block
    // in the middle third so the lights read as background scatter.
    cy: Math.round(120 + next() * 340),
    r: 1 + next() * 1.6,
    delay: `${(next() * 5).toFixed(2)}s`,
  }));
})();

/**
 * A tower crane building something, for CapitalSoft — construction industry
 * software, and the site owner's first job.
 *
 * The crane sits stage right (mast at x=680) with its jib reaching left over
 * a steel frame rising at x=300-460. Keeping both clusters off dead centre,
 * with only the jib's thin beam crossing the middle, is what leaves the
 * section heading a clear patch to sit over per SceneLayer's scrim.
 *
 * The frame gains one floor at a time over the run — girders translate up
 * from below and settle, roughly timed to when the trolley is parked over
 * the building with the hook lowered to that floor's height. The whole
 * frame fades out before the loop resets, so it always reappears unbuilt
 * only while nothing is visible; see ConstructionScene.css for the timeline.
 *
 * Everything animated is a transform or an opacity, so a run costs no layout.
 * 24s period, four full cycles of the 6s grid drift in vaporwave.css.
 */
const ConstructionScene = () => (
  <SceneLayer
    className="ConstructionScene"
    wash="linear-gradient(180deg, #0a0518 0%, #170c2e 32%, #241142 58%, #2a1450 78%, #3a1d33 100%)"
    glow="#ffb300"
  >
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <pattern
          id="construction-hazard"
          width="14"
          height="14"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="14" height="14" fill="#1b0e33" />
          <rect width="7" height="14" fill="#ffb300" />
        </pattern>
        <radialGradient id="construction-siteglow" cx="50%" cy="100%" r="65%">
          <stop offset="0%" stopColor="#ffb300" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffb300" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft floodlight wash low across the site. Deliberately faint: it is
          atmosphere, not a focal point, so it can sit near centre without
          fighting the heading. */}
      <ellipse
        className="ConstructionScene-siteglow"
        cx="500"
        cy="482"
        rx="620"
        ry="110"
        fill="url(#construction-siteglow)"
      />

      {/* Distant skyline, well below the middle band and low opacity. */}
      <g className="ConstructionScene-skyline">
        <rect x="24" y="440" width="26" height="40" />
        <rect x="70" y="452" width="18" height="28" />
        <rect x="855" y="428" width="30" height="52" />
        <rect x="905" y="446" width="20" height="34" />
        <rect x="950" y="458" width="16" height="22" />
      </g>

      <g className="ConstructionScene-lights">
        {SITE_LIGHTS.map(light => (
          <circle
            key={`${light.cx}-${light.cy}`}
            cx={light.cx}
            cy={light.cy}
            r={light.r}
            style={{ animationDelay: light.delay }}
          />
        ))}
      </g>

      {/* Ground. Flat enough for a work site rather than a landing pad. */}
      <g className="ConstructionScene-ground">
        <path className="ConstructionScene-dirt" d="M0 486 Q250 476 500 480 Q750 484 1000 478 L1000 600 L0 600 Z" />
        <path className="ConstructionScene-horizon" d="M0 486 Q250 476 500 480 Q750 484 1000 478" />
      </g>

      {/* Staged materials, dressing the ground plane. */}
      <g className="ConstructionScene-crates">
        <rect x="248" y="455" width="30" height="25" />
        <rect x="522" y="460" width="24" height="20" />
        <path d="M522 470 L546 470" />
      </g>

      {/* Hazard-striped base plate under the crane, and a low barrier tape
          at the foot of the rising frame. */}
      <g className="ConstructionScene-hazard">
        <rect x="655" y="478" width="50" height="10" />
        <rect x="336" y="474" width="88" height="7" />
      </g>

      {/* Scaffold access alongside the frame. Permanent site equipment, so
          unlike the frame it never resets — it is simply always there. */}
      <g className="ConstructionScene-scaffold">
        <path
          d="M470 480 L470 200 M510 480 L510 200
             M470 480 L510 480 M470 410 L510 410 M470 340 L510 340 M470 270 L510 270 M470 200 L510 200
             M470 480 L510 410 L470 340 L510 270 L470 200"
        />
      </g>

      {/*
        The frame under construction: five floors, each its own path so each
        can rise into place on its own schedule. Drawn at their final,
        fully-built coordinates — the animation subtracts from that, so a
        frozen first frame (or reduced motion, handled globally upstream)
        shows a finished building rather than an empty lot.
      */}
      <g className="ConstructionScene-structure">
        <path
          className="ConstructionScene-girder ConstructionScene-girder1"
          d="M300 480 L460 480 M300 480 L300 424 M460 480 L460 424 M300 424 L460 424 M300 480 L460 424"
        />
        <path
          className="ConstructionScene-girder ConstructionScene-girder2"
          d="M300 424 L300 368 M460 424 L460 368 M300 368 L460 368 M460 424 L300 368"
        />
        <path
          className="ConstructionScene-girder ConstructionScene-girder3"
          d="M300 368 L300 312 M460 368 L460 312 M300 312 L460 312 M300 368 L460 312"
        />
        <path
          className="ConstructionScene-girder ConstructionScene-girder4"
          d="M300 312 L300 256 M460 312 L460 256 M300 256 L460 256 M460 312 L300 256"
        />
        <path
          className="ConstructionScene-girder ConstructionScene-girder5"
          d="M300 256 L300 200 M460 256 L460 200 M300 200 L460 200 M300 256 L460 200"
        />
      </g>

      {/* The crane. Lattice mast and booms drawn as zigzags between paired
          rails rather than individual X-braces — fewer points, same read. */}
      <g className="ConstructionScene-crane">
        {/* Counter-jib and counterweight, the short arm behind the mast. */}
        <path className="ConstructionScene-boom" d="M680 150 L770 150 M680 170 L770 170 M680 170 L725 150 L770 170" />
        <rect className="ConstructionScene-counterweight" x="742" y="170" width="30" height="22" />

        {/* Main jib, reaching left over the frame. */}
        <path
          className="ConstructionScene-boom"
          d="M680 150 L300 150 M680 170 L300 170
             M680 170 L630 150 L580 170 L530 150 L480 170 L430 150 L380 170 L330 150 L300 170"
        />

        {/* Mast. */}
        <path
          className="ConstructionScene-mast"
          d="M665 480 L665 160 M695 480 L695 160
             M665 480 L695 440 L665 400 L695 360 L665 320 L695 280 L665 240 L695 200 L665 160"
        />

        {/* Operator cab, tucked under the jib pivot. */}
        <path className="ConstructionScene-cab" d="M655 150 L680 150 L680 172 L650 172 Z" />

        {/* Warning beacon at the mast head. */}
        <circle className="ConstructionScene-beacon" cx="680" cy="146" r="3.5" />

        {/* Trolley, running out along the jib, with the hoist hanging under
            it. Drawn at rest clear of the mast — close enough to read as
            parked, far enough that the cable hangs in open air rather than
            disappearing into the lattice behind it. ConstructionScene.css
            carries it out over the frame and back on the build schedule. */}
        <g className="ConstructionScene-trolley">
          <rect className="ConstructionScene-trolleyBody" x="600" y="154" width="20" height="10" />

          <g className="ConstructionScene-hoist">
            {/* Full-length cable, reaching the ground floor — the natural,
                un-animated state, so a frozen frame still reads correctly. */}
            <line className="ConstructionScene-cable" x1="610" y1="164" x2="610" y2="424" />
            {/* Hook, drawn at the cable's natural full-length end so the two
                line up with no animation running. */}
            <path className="ConstructionScene-hook" d="M610 424 q7 4 0 9 q-7 4 0 9" />
          </g>
        </g>
      </g>
    </svg>
  </SceneLayer>
);

export default ConstructionScene;
