import React from 'react';
import PropTypes from 'prop-types';

import './SceneLayer.css';

/**
 * The frame every backdrop scene draws into.
 *
 * Three stacked layers, back to front:
 *   wash   the sky. A CSS background value owned by the scene, and the thing
 *          that replaces the vaporwave sunset while the scene is up.
 *   art    the scene's own markup. `currentColor` here is the scene's signature
 *          colour, so line art can be drawn with stroke="currentColor" and lit
 *          with drop-shadow(0 0 Npx currentColor).
 *   scrim  a soft darkening over the middle of the viewport, where the section
 *          text sits. Scenes should not fight this; it is what keeps the
 *          copy readable no matter how busy the art gets.
 *
 * While a scene is up the vaporwave sunset, grid and light cycles all clear
 * out, so a scene owns the whole frame and must draw its own horizon or ground
 * plane. Nothing is left behind it to stand in for one.
 */
const SceneLayer = ({ className, wash, glow, children }) => (
  <div className={`SceneLayer ${className}`} style={{ '--scene-wash': wash, '--scene-glow': glow }} aria-hidden="true">
    <div className="SceneLayer-wash" />
    <div className="SceneLayer-art">{children}</div>
    <div className="SceneLayer-scrim" />
  </div>
);

SceneLayer.propTypes = {
  /** Scene-specific class, for the scene's own stylesheet to hang rules on. */
  className: PropTypes.string.isRequired,
  /** Any CSS background value. Becomes the sky. */
  wash: PropTypes.string.isRequired,
  /** The scene's signature colour, exposed to the art as `currentColor`. */
  glow: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default SceneLayer;
