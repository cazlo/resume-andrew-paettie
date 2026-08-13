import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/*
 * A spotlight for timeline rows: of all the rows registered under one
 * provider, exactly one — the row occupying the centre of the viewport — is
 * "spotlit" at a time, and the rest are not. ReactiveTimelineItem uses that
 * bit to show only the card the reader is actually scrolling past, so the
 * animated backdrop behind the experience timeline stays watchable instead of
 * being papered over by every card that has ever scrolled into view.
 *
 * Winner-takes-all rather than per-row in-view checks on purpose: cards are
 * tall enough that two of them routinely straddle any visibility band at the
 * same time, and "basically one card visible" was the brief. A single shared
 * observer scoring every row and picking one winner is the same design as
 * useActiveScene.js, which faces the identical problem choosing the backdrop
 * scene.
 */

// The same centre band useActiveScene shrinks its observer root to. Sharing
// the numbers keeps the spotlit card and the scene behind it swapping on the
// same scroll positions instead of two subtly different ones.
const ROOT_MARGIN = '-25% 0px -25% 0px';

// Enough steps that the winner can change mid-scroll rather than only when a
// row fully enters or leaves. Ratios are relative to the row, not the band,
// so a tall card never reports 1 — which is why the floor below is set low.
const THRESHOLDS = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1];

// Below this share of a row inside the centre band, nothing wins and no card
// shows. Without a floor, a row clipping the edge of the band on the way past
// would flicker its card in for a few frames.
export const MIN_RATIO = 0.2;

/**
 * Pure decision over numbers, split out from the observer that feeds it so it
 * can be tested without a DOM (the same shape as resolveActiveScene).
 *
 * @param {Array<{target: *, ratio: number}>} candidates in document order
 * @param {number} minRatio
 * @returns {*} the winning target, or null for "no spotlight"
 */
export const resolveSpotlight = (candidates, minRatio = MIN_RATIO) => {
  let best = null;

  candidates.forEach(candidate => {
    if (candidate.ratio < minRatio) return;
    // Strictly greater: an exact tie keeps whichever row comes first in the
    // document, so the winner is deterministic at the boundary between two.
    if (!best || candidate.ratio > best.ratio) best = candidate;
  });

  return best ? best.target : null;
};

const SpotlightContext = createContext(null);

/**
 * Owns the one IntersectionObserver shared by every spotlit row beneath it.
 * Wrap the whole timeline; rows opt in through useSpotlight.
 */
export function TimelineSpotlightProvider({ children }) {
  const [activeTarget, setActiveTarget] = useState(null);
  // Registration order is mount order, which for a rendered list is document
  // order — the tie-break resolveSpotlight relies on.
  const stateRef = useRef({ observer: null, targets: [], ratios: new Map() });

  const recompute = useCallback(() => {
    const { targets, ratios } = stateRef.current;
    setActiveTarget(resolveSpotlight(targets.map(target => ({ target, ratio: ratios.get(target) || 0 }))));
  }, []);

  const register = useCallback(
    target => {
      const state = stateRef.current;
      state.targets.push(target);
      if (state.observer) state.observer.observe(target);
      return () => {
        state.targets = state.targets.filter(t => t !== target);
        state.ratios.delete(target);
        if (state.observer) state.observer.unobserve(target);
        recompute();
      };
    },
    [recompute],
  );

  // Children's effects run before this one, so every row mounted with the
  // provider has already registered by the time the observer is created and
  // sweeps the target list.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const state = stateRef.current;
    state.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          state.ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        recompute();
      },
      { rootMargin: ROOT_MARGIN, threshold: THRESHOLDS },
    );
    state.targets.forEach(target => state.observer.observe(target));

    return () => {
      state.observer.disconnect();
      state.observer = null;
    };
  }, [recompute]);

  const value = useMemo(() => ({ activeTarget, register }), [activeTarget, register]);

  return <SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>;
}

TimelineSpotlightProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * A row's view of the spotlight. Attach `ref` to the row's element; `spotlit`
 * is true only while that element is the winner.
 *
 * With `enabled` false the row never registers and reports spotlit, so a
 * timeline that doesn't use the spotlight (or a row rendered outside any
 * provider) behaves as if the mechanism didn't exist.
 *
 * @param {boolean} enabled
 */
export function useSpotlight(enabled) {
  const context = useContext(SpotlightContext);
  const [target, setTarget] = useState(null);

  const register = context ? context.register : null;
  useEffect(() => {
    if (!enabled || !register || !target) return undefined;
    return register(target);
  }, [enabled, register, target]);

  const participating = enabled && context;

  return { ref: setTarget, spotlit: participating ? Boolean(target) && context.activeTarget === target : true };
}
