import React from 'react';

import SceneLayer from '../SceneLayer';
import './RoadScene.css';

/*
 * All ground geometry — the road edges, the roadside markers, the centre
 * dashes — is built off one quadratic Bezier spine, the path the road's
 * centre line follows as it banks toward camera:
 *
 *   spine   VP (560, 210) -> (680, 405) -> (500, 600)
 *
 * The road edges are the spine offset sideways by a half-width that grows
 * with depth, halfWidth(t) = 4 + 446 * t^1.3, t in [0, 1] from the vanishing
 * point to the camera. Deriving both edges from one spine (rather than
 * fitting each edge its own independent curve) is what keeps the road a
 * constant width along the bank instead of flaring open on one side — an
 * earlier pass fit the two edges separately and the road visibly widened
 * unevenly through the curve.
 *
 * The animation keyframes below were sampled off the same spine and
 * half-width formula at t = (time/100)^2.3 — a convex remap so equal steps
 * of animation time cover a shrinking arc near the horizon and a widening
 * one near the camera. That is what perspective actually does to a constant
 * real-world speed: distant markers crawl, close ones flash past. No JS runs
 * at render time to produce this; the numbers are baked into the CSS
 * keyframes once, by hand, off this comment's formulas.
 */

// One entry per repeated element on a curve: how far into the 24s loop it
// starts. Even spacing plus infinite iteration is what makes the dashes look
// like a continuous stream rather than several things restarting together.
// Ten rather than a rounder six: each dash only reads as a dash once it has
// scaled up over the back half of its run (that is the whole point of the
// perspective curve), so a still frame only ever catches a fraction of the
// count looking big enough to notice. Six left as few as two visible at once.
const DASH_COUNT = 10;
const DASHES = Array.from({ length: DASH_COUNT }, (_, i) => ({
  delay: `${(-i * (24 / DASH_COUNT)).toFixed(2)}s`,
}));

const MARKER_COUNT = 5;
const MARKER_DELAYS = Array.from({ length: MARKER_COUNT }, (_, i) => `${(-i * (24 / MARKER_COUNT)).toFixed(2)}s`);

// Oncoming traffic runs its own, shorter loop (see RoadScene.css for why: it
// is a closing speed, not the road's own 24s). Three copies is "at most two
// or three in flight" from spacing them a third of the loop apart — enough
// for the cadence to read as periodic waves rather than a stream, with real
// gaps between them rather than dashes' near-continuous coverage.
const ONCOMING_COUNT = 3;
const ONCOMING_DELAYS = Array.from({ length: ONCOMING_COUNT }, (_, i) => `${(-i * (18 / ONCOMING_COUNT)).toFixed(2)}s`);

// Gaps cut through the sun, thin near the top and widening toward the
// bottom — the classic synthwave scanline sun. Static geometry, so it is
// just laid out here rather than generated.
const SUN_BANDS = [
  { y: 128, h: 4 },
  { y: 144, h: 5 },
  { y: 161, h: 6 },
  { y: 180, h: 7 },
  { y: 201, h: 9 },
  { y: 224, h: 11 },
  { y: 249, h: 14 },
  { y: 277, h: 18 },
];

/**
 * Outrun highway, receding to a vanishing point set high and slightly right
 * of centre so the sun and the road's own vanishing point stay clear of the
 * heading band the scrim protects.
 *
 * A banked curve rather than a straight shot: the road, its edge lines and
 * its roadside markers are all the same Bezier bent the same way, just at
 * different lateral offsets from the centre line, so the whole ground plane
 * reads as one continuous surface rounding a bend rather than parallel
 * decorations.
 *
 * Two vehicles carry the traffic, one in each lane either side of the centre
 * dashes — right-hand traffic, so we hold the right lane and everything
 * coming the other way keeps to the left, same as the real road rule this
 * scene is styled after:
 *
 *   hero car (right lane)     the vehicle we are following. Its lane position
 *                              is spine(0.75) + halfWidth(0.75) * 0.35 (see
 *                              the file-level spine/halfWidth formulas), i.e.
 *                              derived from the same curve as the road rather
 *                              than a fixed screen position, so it would
 *                              still sit on the tarmac if the bank were tuned
 *                              differently later. Its vertical placement is
 *                              hand-nudged 20px above that same t's y, clear
 *                              of the tail lights' bottom edge on a wide,
 *                              short viewport — see RoadScene.css, the SVG's
 *                              "slice" crop takes the top and bottom first on
 *                              anything wider than about 21:9. It never
 *                              travels — only bobs and sways — because it is
 *                              doing the same speed as the camera. Tail
 *                              lights are its brightest feature, in the
 *                              scene's signature --vw-sun-adjacent #ff8a5c
 *                              (see SceneLayer's currentColor contract).
 *   oncoming cars (left lane) small at the vanishing point, growing as they
 *                              close the distance, periodic rather than a
 *                              stream (see RoadScene.css for the timeline).
 *                              Their lane position is spine(t) minus
 *                              halfWidth(t) * 0.42 at every step, the same
 *                              two formulas the road edges are built from, so
 *                              they track the bend and never drift onto the
 *                              shoulder. Headlights, not tail lights, are
 *                              their brightest feature — white/cyan against
 *                              the hero car's warm tail lights is what makes
 *                              the two directions of travel read at a glance.
 *
 * The wash peaks at the horizon (~35% down, where the sun sits) and goes
 * dark again both above and below it, rather than brightening all the way
 * to the bottom edge. An earlier pass had it brightening toward the bottom
 * of the frame, which put the single brightest pixel in the scene behind
 * the road rather than at the horizon, and made the dark road read as a
 * silhouetted mass backlit by glare instead of a surface receding away from
 * camera. The ground plane drawn in the SVG (see below) covers the wash
 * everywhere below the horizon anyway; darkening it there too is belt and
 * braces for the sliver a narrow "slice" crop can expose at the sides.
 *
 * One 24s run, in phase with the site's 6s grid drift.
 */
const WASH =
  'linear-gradient(180deg, #090414 0%, #1b0e33 24%, #6e1f5c 33%, ' +
  '#ff8a5c 38%, #6e1f5c 46%, #2a1450 60%, #120726 80%, #090414 100%)';

const RoadScene = () => (
  <SceneLayer className="RoadScene" wash={WASH} glow="#ff8a5c">
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        {/*
          Scanline cut through the sun: white shows the disc, black bands
          reveal the sky wash behind it. maskUnits/x/y/width/height are
          explicit and viewBox-sized because a <mask> otherwise defaults to
          clipping its own content to roughly the masked element's bounding
          box (padded 10%), which crops the scanlines to a visible square
          instead of just cutting bands out of the circle.
        */}
        <mask id="road-sun-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="600">
          <rect x="0" y="0" width="1000" height="600" fill="#fff" />
          {SUN_BANDS.map(band => (
            <rect key={band.y} x="0" y={band.y} width="1000" height={band.h} fill="#000" />
          ))}
        </mask>
        {/*
          The sun's centre sits on the horizon, so an unclipped circle hangs
          its bottom half below it — bright, and right in the vertical band
          the heading scrim protects. Clipping to the horizon keeps only the
          arc above it: the classic half-sun-on-the-horizon read, and it
          keeps the frame's brightest shape out of that band entirely.
        */}
        <clipPath id="road-sun-clip" clipPathUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1000" height="211" />
        </clipPath>
        {/*
          Road surface, kept a shade lighter and more saturated than
          road-ground below at every depth, so the road reads as its own
          distinct surface rather than blending into the terrain either
          side of it — the neon edge lines are the crisp boundary, this
          gradient is what makes the fill itself agree with them.
        */}
        <linearGradient id="road-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d2062" stopOpacity="0.92" />
          <stop offset="35%" stopColor="#28133f" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#130a1f" stopOpacity="1" />
        </linearGradient>
        {/* Terrain either side of the road: darker than the road at every
            depth, and never as bright as the horizon glow above it. */}
        <linearGradient id="road-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b0e33" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#0d0620" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#050208" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/*
        Big low sun on the vanishing point, clipped to the arc above the
        horizon. Two circles rather than one: `drop-shadow` blurs the alpha
        channel it is given, so glowing the scanline-masked disc directly
        smeared its cut bands into soft dark streaks reaching well past the
        sun itself. The glow is a plain, unmasked, blurred circle behind a
        crisp masked disc that carries no blur of its own.
      */}
      <g clipPath="url(#road-sun-clip)">
        <circle className="RoadScene-sunGlow" cx="560" cy="210" r="95" />
        <circle className="RoadScene-sun" cx="560" cy="210" r="95" mask="url(#road-sun-mask)" />
      </g>

      {/* Flat horizon, visible only past the road's edges and through the ridge's low points. */}
      <path className="RoadScene-horizonLine" d="M0 210 L1000 210" />

      {/*
        Mountain ridge silhouette, jagged enough to let the sun show through
        its valleys. Its fill alone read as barely more than the night sky
        behind it away from the sun's glow, so it also carries a thin
        currentColor rim along its own outline — a lit edge is what makes a
        silhouette read as a shape rather than a flat void.
      */}
      <path
        className="RoadScene-ridge"
        d="M0 208 L70 178 L140 198 L220 162 L300 192 L390 150 L470 188 L560 140
           L650 182 L740 154 L830 196 L910 166 L1000 202 L1000 216 L0 216 Z"
      />

      {/*
        Ground plane: the flat terrain the road cuts through, full width so
        there is no bare wash left exposed either side of the road — see the
        file-level SceneLayer wash comment for what that looked like.
      */}
      <path className="RoadScene-ground" fill="url(#road-ground)" d="M0 210 L1000 210 L1000 600 L0 600 Z" />

      {/*
        Road surface, its two edges and its centre guide. The edges are
        sampled off the spine (see the file-level comment) at t = 0, 0.1,
        0.2 ... 1, offset by the half-width formula, so the road holds a
        constant width all the way round the bank.
      */}
      <path
        className="RoadScene-surface"
        fill="url(#road-surface)"
        d="M556 210 L554.7 249 L537 288 L507.8 327 L468.5 366 L419.9 405 L362.4 444
           L296.5 483 L222.3 522 L140.1 561 L50 600 L950 600 L925.9 561 L897.7 522
           L865.5 483 L829.6 444 L790.1 405 L747.5 366 L702.2 327 L655 288 L607.3 249 L564 210 Z"
      />
      <path className="RoadScene-guide" d="M560 210 Q680 405 500 600" />
      <path
        className="RoadScene-edge"
        d="M556 210 L554.7 249 L537 288 L507.8 327 L468.5 366 L419.9 405 L362.4 444
           L296.5 483 L222.3 522 L140.1 561 L50 600"
      />
      <path
        className="RoadScene-edge"
        d="M564 210 L607.3 249 L655 288 L702.2 327 L747.5 366 L790.1 405 L829.6 444
           L865.5 483 L897.7 522 L925.9 561 L950 600"
      />

      {/* Roadside markers, travelling the left and right edges toward the camera. */}
      <g className="RoadScene-markers">
        {MARKER_DELAYS.map(delay => (
          <rect
            key={`l-${delay}`}
            className="RoadScene-markerLeft"
            x="554.5"
            y="206"
            width="3"
            height="10"
            style={{ animationDelay: delay }}
          />
        ))}
        {MARKER_DELAYS.map(delay => (
          <rect
            key={`r-${delay}`}
            className="RoadScene-markerRight"
            x="562.5"
            y="206"
            width="3"
            height="10"
            style={{ animationDelay: delay }}
          />
        ))}
      </g>

      {/* Centre-line dashes, travelling the centre curve toward the camera. */}
      <g className="RoadScene-dashes">
        {DASHES.map(dash => (
          <rect
            key={dash.delay}
            className="RoadScene-dash"
            x="557"
            y="203"
            width="6"
            height="14"
            rx="2"
            style={{ animationDelay: dash.delay }}
          />
        ))}
      </g>

      {/*
        Oncoming traffic: the left lane, emerging small at the vanishing
        point and growing as it closes the distance. Each copy is one <g>
        carrying the whole car, transformed as one unit off the
        road-oncoming-travel keyframes (see RoadScene.css) — translate and
        scale only, the same technique the dashes and markers use.
      */}
      <g className="RoadScene-oncomingLane">
        {ONCOMING_DELAYS.map(delay => (
          <g key={delay} className="RoadScene-oncoming" style={{ animationDelay: delay }}>
            <rect className="RoadScene-oncomingBody" x="549" y="213" width="26" height="10" rx="3" />
            <rect className="RoadScene-oncomingCabin" x="555" y="207" width="14" height="8" rx="2.5" />
            {/*
              Each headlight is two shapes, not one — the same crisp-disc-behind-
              a-blurred-glow split the sun uses (see the sun's own comment for
              why: a single drop-shadow'd shape reads as a dim, uniformly-tinted
              smudge rather than a hot core with real color separation). The
              cyan glow is its own solid-filled, blurred ellipse so it carries
              actual cyan pixels instead of leaning on a drop-shadow layered
              under the white core, which a near-white fill just drowns out.
            */}
            <ellipse className="RoadScene-headlightGlow" cx="551" cy="220" rx="4.6" ry="3.6" />
            <ellipse className="RoadScene-headlightGlow" cx="573" cy="220" rx="4.6" ry="3.6" />
            <ellipse className="RoadScene-headlight" cx="551" cy="220" rx="2.6" ry="1.9" />
            <ellipse className="RoadScene-headlight" cx="573" cy="220" rx="2.6" ry="1.9" />
          </g>
        ))}
      </g>

      {/*
        Hero car: the right lane, close to camera, the largest thing in the
        scene by design. It bobs and sways with the road but never travels —
        it is holding the camera's own speed — so unlike the oncoming cars it
        is plain static geometry, just carried by two small sway transforms.
      */}
      <g className="RoadScene-heroDrift">
        <g className="RoadScene-heroBob">
          <ellipse className="RoadScene-heroShadow" cx="680" cy="506" rx="66" ry="9" />
          <rect className="RoadScene-heroBody" x="618" y="458" width="124" height="46" rx="11" />
          <rect className="RoadScene-heroCabin" x="640" y="430" width="80" height="34" rx="10" />
          <rect className="RoadScene-heroBrakeBar" x="634" y="472" width="92" height="6" rx="3" />
          <ellipse className="RoadScene-heroTailLight" cx="636" cy="480" rx="12" ry="8" />
          <ellipse className="RoadScene-heroTailLight" cx="724" cy="480" rx="12" ry="8" />
        </g>
      </g>
    </svg>
  </SceneLayer>
);

export default RoadScene;
