import React from 'react';

import SceneLayer from '../SceneLayer';
import './LunarScene.css';

/*
 * Stars are generated once at module load from a fixed seed rather than with
 * Math.random, so every render and every test sees the same sky. A hand-written
 * list of fifty coordinates would do the same job with more noise in the diff.
 */
const seeded = seed => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const STARS = (() => {
  const next = seeded(20260810);
  return Array.from({ length: 48 }, () => ({
    // Kept above the surface line.
    cx: Math.round(next() * 1000),
    cy: Math.round(next() * 400),
    r: 0.6 + next() * 1.3,
    // Spread the twinkle out so the sky never pulses in unison.
    delay: `${(next() * 6).toFixed(2)}s`,
  }));
})();

/**
 * Lunar descent.
 *
 * The lander is Blue Moon MK2 in profile: domed cap over a flared crew cabin
 * with its funnel inset, an X-braced lattice truss wrapped around the tank
 * bulges, and a drum descent module on four splayed legs.
 *
 * It flies a powered descent from the upper left rather than dropping straight
 * down — partly because that is how a lander actually arrives, and partly
 * because a vertical drop spends the whole run hidden behind a timeline card.
 * Horizontal travel is nulled out before the final descent, so it translates
 * across, then settles.
 *
 * Three nested groups do the flying: `flight` carries it right, `altitude`
 * carries it down, `attitude` pitches it upright out of the braking angle.
 * Composing them is what makes the path a curve rather than a straight line.
 * The 24s period is a whole number of the 6s grid drift in vaporwave.css.
 *
 * Everything animated is a transform or an opacity, so a run costs no layout.
 */
const LunarScene = () => (
  <SceneLayer
    className="LunarScene"
    wash="linear-gradient(180deg, #04030f 0%, #0a0820 45%, #141033 74%, #1d1740 100%)"
    glow="#dfe7ff"
  >
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <linearGradient id="lunar-earth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3fa9ff" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#1c4fa8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0b1c44" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="lunar-plume" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#01cdfe" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#01cdfe" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className="LunarScene-stars">
        {STARS.map(star => (
          <circle
            key={`${star.cx}-${star.cy}`}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            style={{ animationDelay: star.delay }}
          />
        ))}
      </g>

      <g className="LunarScene-earth">
        <circle cx="196" cy="126" r="54" fill="url(#lunar-earth)" />
        <circle cx="196" cy="126" r="54" className="LunarScene-earthRim" />
      </g>

      {/*
        Surface. Deliberately flat between x=566 and x=758, which is where the
        lander sets down — a landing site on a slope reads as a mistake.
      */}
      <g className="LunarScene-surface">
        <path
          className="LunarScene-regolith"
          d="M0 486 Q 170 452 330 476 Q 470 496 566 458 L 758 458 Q 880 450 1000 472 L1000 600 L0 600 Z"
        />
        <path
          className="LunarScene-horizon"
          d="M0 486 Q 170 452 330 476 Q 470 496 566 458 L 758 458 Q 880 450 1000 472"
        />
        <ellipse className="LunarScene-crater" cx="214" cy="524" rx="86" ry="18" />
        <ellipse className="LunarScene-crater" cx="858" cy="538" rx="112" ry="22" />
        <ellipse className="LunarScene-crater" cx="404" cy="562" rx="64" ry="14" />
      </g>

      {/* Dust kicked up at touchdown, centred on the footpads. */}
      <g className="LunarScene-dust">
        <ellipse cx="660" cy="459" rx="104" ry="15" />
        <ellipse cx="660" cy="459" rx="62" ry="9" />
      </g>

      <g className="LunarScene-flight">
        <g className="LunarScene-altitude">
          <g className="LunarScene-attitude">
            {/* Static scale, pivoting on the touchdown point so shrinking the
                craft never lifts it off the surface. */}
            <g className="LunarScene-scale">
              {/* Plume: the gate cuts it at contact, the jet inside shudders. */}
              <g className="LunarScene-plumeGate">
                <path
                  className="LunarScene-plumeJet"
                  d="M647 452 L673 452 L690 542 L660 564 L630 542 Z"
                  fill="url(#lunar-plume)"
                />
              </g>

              <g className="LunarScene-craft">
                {/* Domed cap and the ring band under it */}
                <path className="LunarScene-body" d="M634 296 Q660 270 686 296 Z" />
                <path className="LunarScene-band" d="M631 296 L689 296" />
                {/* Antennas */}
                <path className="LunarScene-strut" d="M632 294 L620 278 M688 294 L700 278" />
                <circle className="LunarScene-port" cx="618" cy="276" r="3.4" />
                <circle className="LunarScene-port" cx="702" cy="276" r="3.4" />
                {/* Crew cabin: flares outward going down */}
                <path className="LunarScene-body" d="M634 296 L686 296 L702 344 L618 344 Z" />
                {/* The funnel inset down the front of the cabin */}
                <path className="LunarScene-inset" d="M639 300 L654 340 L666 340 L681 300" />
                {/* Lattice truss over the tank bulges. Two full bays: this is
                    the most recognisable part of the vehicle, so it gets the
                    room to read as an open structure rather than a seam. */}
                <ellipse className="LunarScene-tank" cx="660" cy="356" rx="33" ry="12" />
                <ellipse className="LunarScene-tank" cx="660" cy="381" rx="33" ry="12" />
                <path
                  className="LunarScene-truss"
                  d="M624 344 L624 394 M696 344 L696 394 M624 344 L696 344 M624 369 L696 369
                     M624 394 L696 394 M624 344 L696 369 M696 344 L624 369 M624 369 L696 394
                     M696 369 L624 394"
                />
                {/* Descent drum, flaring slightly at the base */}
                <path className="LunarScene-body" d="M618 394 L702 394 L706 440 L614 440 Z" />
                <path className="LunarScene-skirt" d="M614 440 L706 440 L700 449 L620 449 Z" />
                {/* Hatch and lit windows */}
                <circle className="LunarScene-hatch" cx="634" cy="416" r="8.5" />
                <path className="LunarScene-port" d="M652 406 L652 417 M665 406 L665 417" />
                {/* Engine bell */}
                <path className="LunarScene-body" d="M650 440 L670 440 L675 453 L645 453 Z" />
                {/* Four legs. The outer pair splays to about 1.7x the drum
                    width, which is the stance that makes the vehicle
                    recognisable from a distance. */}
                <path
                  className="LunarScene-strut"
                  d="M620 398 L580 454 M616 436 L580 454 M700 398 L740 454 M704 436 L740 454
                     M632 438 L624 451 M688 438 L696 451"
                />
                <ellipse className="LunarScene-pad" cx="580" cy="455" rx="11" ry="3.6" />
                <ellipse className="LunarScene-pad" cx="740" cy="455" rx="11" ry="3.6" />
                <ellipse className="LunarScene-pad" cx="624" cy="452" rx="7" ry="2.4" />
                <ellipse className="LunarScene-pad" cx="696" cy="452" rx="7" ry="2.4" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </SceneLayer>
);

export default LunarScene;
