import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import useActiveScene from './useActiveScene';
import sceneRegistry from './sceneRegistry';

import './ExperienceBackdrop.css';

// Set on <body> while any scene is up. vaporwave.css uses it to pull the sunset
// out from behind the scene and dim the grid, and LightCycles.css uses it to
// take the riders off the plane.
const BODY_CLASS = 'has-scene';

/*
 * One mounted scene. Renders inactive on the first commit and flips to visible
 * in an effect, so the browser has a frame at opacity 0 to transition from —
 * mounting straight into the final state would skip the fade entirely.
 */
const SceneSlot = ({ sceneId, active, onExited }) => {
  const Scene = sceneRegistry[sceneId];
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(true);
  }, []);

  if (!Scene) return null;

  return (
    <div
      className={`ExperienceBackdrop-slot${entered && active ? ' is-visible' : ''}`}
      onTransitionEnd={() => {
        if (!active) onExited(sceneId);
      }}
    >
      <Scene />
    </div>
  );
};

SceneSlot.propTypes = {
  sceneId: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onExited: PropTypes.func.isRequired,
};

/**
 * Fixed backdrop that follows the experience timeline.
 *
 * As a job scrolls into the middle of the viewport its scene cross-fades in
 * behind everything; scrolling into education, or out of the section entirely,
 * fades back to the plain vaporwave backdrop.
 *
 * At most two scenes are ever mounted — the one arriving and the one leaving —
 * so the page never has five animating scenes competing for the compositor.
 *
 * This must be rendered last in Resume, after LightCycles: Resume.css bands
 * alternate sections with `.Resume div:nth-child(odd)`, so anything inserted
 * before the sections shifts the banding.
 */
const ExperienceBackdrop = () => {
  const sceneId = useActiveScene();
  // Mounted scene ids. The active one is appended last so it paints over the
  // one it is replacing while both are mid-fade.
  const [mounted, setMounted] = useState([]);

  useEffect(() => {
    setMounted(prev => {
      const others = prev.filter(id => id !== sceneId);
      return sceneId ? [...others, sceneId] : others;
    });
  }, [sceneId]);

  useEffect(() => {
    document.body.classList.toggle(BODY_CLASS, Boolean(sceneId));
    return () => document.body.classList.remove(BODY_CLASS);
  }, [sceneId]);

  const handleExited = exitedId => setMounted(prev => prev.filter(id => id !== exitedId));

  return (
    <div className="ExperienceBackdrop" aria-hidden="true">
      {mounted.map(id => (
        <SceneSlot key={id} sceneId={id} active={id === sceneId} onExited={handleExited} />
      ))}
    </div>
  );
};

export default ExperienceBackdrop;
