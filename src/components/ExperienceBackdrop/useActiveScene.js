import { useEffect, useState } from 'react';
import { resolveActiveScene } from './activeScene';

// Shrink the observer root to the middle half of the viewport, so the active
// scene is the job you are actually reading rather than one three cards down
// that happens to be poking into the bottom of the screen.
const ROOT_MARGIN = '-25% 0px -25% 0px';

// Enough steps that the ratio updates smoothly through a scroll. Ratios are
// relative to the tile, not the band, so a tall tile never reports 1 — which is
// why MIN_RATIO in activeScene.js is set low.
const THRESHOLDS = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1];

/**
 * Tracks which `[data-scene]` element currently owns the viewport.
 *
 * Deliberately a separate observer from the one inside ReactiveTimelineItem:
 * that one is triggerOnce, because it drives a one-way fade-in for the tile.
 * This one has to keep reporting for the whole life of the page.
 *
 * @returns {string|null} active scene id, or null for the default backdrop
 */
const useActiveScene = () => {
  const [sceneId, setSceneId] = useState(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    // Document order, which is what resolveActiveScene tie-breaks on.
    const targets = Array.from(document.querySelectorAll('[data-scene]'));
    if (!targets.length) return undefined;

    const ratios = new WeakMap();

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        setSceneId(
          resolveActiveScene(
            targets.map(target => ({
              sceneId: target.getAttribute('data-scene'),
              ratio: ratios.get(target) || 0,
            })),
          ),
        );
      },
      { rootMargin: ROOT_MARGIN, threshold: THRESHOLDS },
    );

    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return sceneId;
};

export default useActiveScene;
