import React from 'react';

import SceneLayer from '../SceneLayer';
import './RunnersScene.css';

// Stadium light standards, sky-only decoration kept well clear of the
// vertical middle band the section heading occupies (see the JSX comment
// above the <svg> for the y-budget). Spread across the width rather than
// symmetric so they don't read as a repeating pattern.
const LIGHT_STANDARDS = [
  { x: 110, lampScale: 0.9 },
  { x: 470, lampScale: 1.1 },
  { x: 860, lampScale: 0.85 },
];

/*
 * Five runners: how many lanes deep, how fast each crosses, and how far out of
 * phase it starts. Hand-picked rather than generated — five is a small enough
 * set that a seeded generator would only hide the choices being made, the way
 * LunarScene's craft or dust ellipses are placed by hand.
 *
 * `delay` is a negative animation-delay: it starts the crossing animation
 * partway through its own cycle, so a lane with more than one runner never
 * shows them moving as a rank. `duration` differs by depth — nearer lanes
 * cross faster, in screen pixels per second, which is what "nearer runners
 * are faster" actually looks like even though every runner covers the same
 * viewBox distance.
 *
 * `restX` only matters with the animation switched off (ExperienceBackdrop's
 * reduced-motion rule nulls the whole `animation` shorthand, which drops
 * `transform` back to whatever static value the CSS declares — not the 0%
 * keyframe, which is off-canvas). It is a resting crossing position spread
 * across the frame, so the frozen scene reads as five runners on a track
 * instead of five runners stacked at the left edge.
 *
 * None of the `delay`s is exactly half its `duration`. That is deliberate: a
 * delay of exactly -T/2 means the runner is dead centre (the frame's most
 * conspicuous spot, right under the section heading) at t=0 and again every
 * T seconds after — an easy trap to fall into by picking round "half a lap"
 * offsets for stagger, and it stacked two oversized runners on the centre
 * line at once on first render. These offsets still spread the lanes out,
 * they just don't line up on the one moment that matters.
 */
const RUNNERS = [
  { lane: 'far', duration: '24s', delay: '0s', restX: '180px' },
  { lane: 'mid', duration: '18s', delay: '0s', restX: '420px' },
  { lane: 'mid', duration: '18s', delay: '-6s', restX: '760px' },
  { lane: 'near', duration: '6s', delay: '0s', restX: '260px' },
  { lane: 'near', duration: '6s', delay: '-4s', restX: '640px' },
];

/*
 * One runner, in profile, facing the direction of travel (+x). Built from
 * thick round-capped strokes rather than a single filled outline: a fat
 * stroke reads as a limb at this size even when the pose numbers are rough,
 * where a thin outline would just look like a wobbly wire.
 *
 * Two poses only — reach (legs scissored wide, front foot down) and drive
 * (front knee lifted, back leg extended behind pushing off) — swapped by
 * toggling opacity with a steps() timing function rather than animating the
 * line coordinates. CSS cannot tween an SVG line's endpoints via a transform
 * or opacity, and morphing `d`/`x1`/`y1` would break the transform-and-opacity
 * only rule, so the two poses are two static drawings and the animation is
 * just which one is showing.
 */
const RunnerFigure = () => (
  <>
    {/* Trailing streaks read as speed without needing the legs to sell it. */}
    <g className="RunnersScene-streaks">
      <line x1="-30" y1="-46" x2="-58" y2="-46" />
      <line x1="-26" y1="-30" x2="-50" y2="-30" />
      <line x1="-22" y1="-14" x2="-44" y2="-14" />
    </g>

    <circle className="RunnersScene-head" cx="6" cy="-76" r="10" />
    <line className="RunnersScene-limb RunnersScene-torso" x1="2" y1="-64" x2="-4" y2="-26" />

    {/*
      Each limb is two segments, upper then lower, and the lower one carries
      `RunnersScene-limb--lower` for a thinner stroke. A limb that tapers
      toward the extremity reads as a forearm/shin instead of a uniform rod.
    */}
    <g className="RunnersScene-poseA">
      <line className="RunnersScene-limb" x1="-4" y1="-26" x2="18" y2="-12" />
      <line className="RunnersScene-limb RunnersScene-limb--lower" x1="18" y1="-12" x2="36" y2="-2" />
      <line className="RunnersScene-limb" x1="-4" y1="-26" x2="-20" y2="-8" />
      <line className="RunnersScene-limb RunnersScene-limb--lower" x1="-20" y1="-8" x2="-32" y2="4" />
      <line className="RunnersScene-limb" x1="2" y1="-64" x2="-10" y2="-52" />
      <line className="RunnersScene-limb RunnersScene-limb--lower" x1="-10" y1="-52" x2="0" y2="-40" />
      <line className="RunnersScene-limb" x1="2" y1="-64" x2="18" y2="-54" />
      <line className="RunnersScene-limb RunnersScene-limb--lower" x1="18" y1="-54" x2="28" y2="-60" />
    </g>

    <g className="RunnersScene-poseB">
      <line className="RunnersScene-limb" x1="-4" y1="-26" x2="14" y2="-42" />
      <line className="RunnersScene-limb RunnersScene-limb--lower" x1="14" y1="-42" x2="4" y2="-18" />
      <line className="RunnersScene-limb" x1="-4" y1="-26" x2="-18" y2="-6" />
      <line className="RunnersScene-limb RunnersScene-limb--lower" x1="-18" y1="-6" x2="-30" y2="12" />
      <line className="RunnersScene-limb" x1="2" y1="-64" x2="-12" y2="-58" />
      <line className="RunnersScene-limb RunnersScene-limb--lower" x1="-12" y1="-58" x2="-4" y2="-46" />
      <line className="RunnersScene-limb" x1="2" y1="-64" x2="20" y2="-56" />
      <line className="RunnersScene-limb RunnersScene-limb--lower" x1="20" y1="-56" x2="30" y2="-48" />
    </g>
  </>
);

/**
 * Runners on a track, Nike.
 *
 * The ground plane is a side-on track: lane lines run left-to-right, the same
 * direction the runners travel, stacked into the distance rather than fanning
 * out to a vanishing point. A one-point-perspective track disagreed with
 * profile runners crossing the frame — the track's depth axis ran into the
 * screen while the runners ran across it — so depth here is carried by
 * vertical compression instead: rows get closer together, thinner and dimmer
 * toward the horizon. Row y-coordinates (see RunnersScene.css) bracket the
 * runner depth bands below, so each lane's runners are standing inside the
 * lines drawn for that lane.
 *
 * The track now runs the horizon (y=300) all the way to the bottom of the
 * frame, not just the bottom third: an earlier pass compressed all six rows
 * into y=380-592 and left the top 60% of the frame empty sky, which read as
 * dead space above a strip of track rather than a track receding into a
 * horizon. The same widening-gap depth cue survives, just stretched over the
 * full y=300-598 range instead of squeezed into the last 212px.
 *
 * The frame's y-budget, top to bottom:
 *   0-130    the bright parts of the sky detail (the light standards' lamps
 *            and glow) — clear of the section heading's band entirely.
 *   130-300  open sky plus the horizon glow, which brightens toward y=300.
 *            The light standards' poles cross this band on their way down to
 *            the horizon, but only as gradient-faded strokes (see the
 *            runners-pole gradient) that are dimmer than the horizon glow by
 *            the time they enter it.
 *   260-300  distant grandstand silhouette, low-contrast, hugging the
 *            horizon rather than dwelling in open sky.
 *   300-598  the track itself: filled surface, six lane-boundary lines, two
 *            dashed dividers, three runner depth bands.
 * y=300 sits inside the heading's scrim band (see SceneLayer.css), but the
 * horizon has to be somewhere in that band for the track to fill most of the
 * frame — the brief specifically asks for it there. The only things crossing
 * into that band are already-dim by design: the horizon glow, the grandstand
 * line, and the tail ends of the poles at their faintest.
 *
 * Each runner is two nested groups. The outer `RunnersScene-runner` is the
 * only thing that moves across the frame — a single shared translateX
 * keyframe, at a duration set per lane — so every runner's crossing distance
 * in viewBox units is identical and only the speed differs. The inner group
 * is a plain, unanimated SVG transform placing the runner at its lane's
 * depth (translateY) and size (scale); keeping that off the animated element
 * avoids fighting the CSS animation for control of `transform`.
 *
 * This was the scene most likely to need the silhouette fallback the design
 * doc calls out. The two-pose swap survived the render check (see
 * RunnersScene.css for what "survived" means here), so the articulated
 * stride stayed in rather than dropping to flat silhouettes.
 *
 * 24s period: the far lane crosses once per loop, so the whole scene is back
 * in its start state every 24s, in phase with the site's 6s grid drift. The
 * faster lanes (6s, 18s) are themselves multiples of 6s, so they also
 * realign every loop rather than slowly drifting against it.
 */
const RunnersScene = () => (
  <SceneLayer
    className="RunnersScene"
    wash="linear-gradient(180deg, #050216 0%, #0d0722 40%, #1a0e33 70%, #241041 100%)"
    glow="#d7ff3e"
  >
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        {/* Sky glow low on the horizon, stadium-lights-at-dusk rather than sunset. */}
        <radialGradient id="runners-glow" cx="50%" cy="100%" r="75%">
          <stop offset="0%" stopColor="#d7ff3e" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#d7ff3e" stopOpacity="0" />
        </radialGradient>
        {/*
          Track surface: violet at the horizon, blending into the sky wash
          above it, warming toward a dark clay tone at the bottom of the
          frame. That warm/violet split is what makes the surface read as its
          own material rather than a darker copy of the sky showing through
          the lane lines.
        */}
        <linearGradient id="runners-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1442" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#3a1f3d" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#4a2a34" stopOpacity="1" />
        </linearGradient>
        {/*
          Pole stroke for the light standards: brightest up by the lamp,
          fading as it descends so the run down to the horizon never puts a
          bright vertical line through the heading's scrim band. userSpaceOnUse
          because the poles are <line>s — objectBoundingBox collapses on
          zero-width shapes.
        */}
        <linearGradient id="runners-pole" x1="0" y1="46" x2="0" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b967ff" stopOpacity="0.26" />
          <stop offset="40%" stopColor="#b967ff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#b967ff" stopOpacity="0.07" />
        </linearGradient>
      </defs>
      <rect className="RunnersScene-skyGlow" x="0" y="0" width="1000" height="300" fill="url(#runners-glow)" />

      {/*
        Stadium light standards: the sky's only bright-ish detail. Lamps and
        their glow stay above y=130, clear of the heading's scrim band, but
        each pole runs all the way down to the horizon at y=300 so the
        standards read as planted in the ground rather than hovering — the
        grandstand is drawn after this group, so the pole bases sit behind its
        silhouette like masts behind the stands. The pole stroke is the
        runners-pole gradient (see defs), fading toward the ground, so the
        stretch crossing the scrim band is the faintest part of the line
        rather than a bright seam through the heading.
      */}
      <g className="RunnersScene-stadium">
        {LIGHT_STANDARDS.map(standard => (
          <g key={standard.x} transform={`translate(${standard.x}, 0)`}>
            <line className="RunnersScene-standardPole" x1="0" y1="300" x2="0" y2="46" />
            <g transform={`scale(${standard.lampScale})`}>
              <circle className="RunnersScene-standardGlow" cx="0" cy="42" r="20" />
              <rect className="RunnersScene-standardLamp" x="-16" y="34" width="32" height="10" rx="2" />
            </g>
          </g>
        ))}
      </g>

      {/*
        Distant grandstand, a jagged low silhouette hugging the horizon
        rather than sitting out in open sky — sky interest that stays low-
        contrast by design rather than by accident.
      */}
      <path
        className="RunnersScene-grandstand"
        d="M0 300 L0 282 L60 274 L130 284 L210 270 L300 280 L390 266 L470 278
           L550 264 L630 276 L710 268 L800 280 L880 270 L940 279 L1000 273 L1000 300 Z"
      />

      {/*
        Ground plane: side-on track. Lane boundaries bracket the runner depth
        bands in RunnersScene.css — far lane 306-334 (translateY 317), mid
        lane 393-429 (translateY 410), near lane 525-598 (translateY 553) —
        so a runner's feet land inside the pair of lines drawn for its own
        lane rather than floating over another lane's.
      */}
      <g className="RunnersScene-track">
        <rect className="RunnersScene-field" x="0" y="300" width="1000" height="300" fill="url(#runners-field)" />

        <g className="RunnersScene-lanes">
          <line x1="0" y1="306" x2="1000" y2="306" />
          <line x1="0" y1="334" x2="1000" y2="334" />
          <line x1="0" y1="393" x2="1000" y2="393" />
          <line x1="0" y1="429" x2="1000" y2="429" />
          <line x1="0" y1="525" x2="1000" y2="525" />
          <line x1="0" y1="598" x2="1000" y2="598" />
        </g>

        {/*
          Dashed inner dividers in the gaps between the three occupied lanes
          — more track, not more lanes to follow, so they stay quieter than
          the boundary lines above.
        */}
        <g className="RunnersScene-laneDividers">
          <line x1="0" y1="364" x2="1000" y2="364" />
          <line x1="0" y1="477" x2="1000" y2="477" />
        </g>

        <line className="RunnersScene-horizon" x1="0" y1="300" x2="1000" y2="300" />
      </g>

      {RUNNERS.map((runner, i) => (
        <g
          // eslint-disable-next-line react/no-array-index-key
          key={`${runner.lane}-${i}`}
          className={`RunnersScene-runner RunnersScene-runner--${runner.lane}`}
          style={{
            animationDuration: runner.duration,
            animationDelay: runner.delay,
            '--runner-rest-x': runner.restX,
          }}
        >
          <g className={`RunnersScene-depth RunnersScene-depth--${runner.lane}`}>
            <g className="RunnersScene-stride">
              <RunnerFigure />
            </g>
          </g>
        </g>
      ))}
    </svg>
  </SceneLayer>
);

export default RunnersScene;
