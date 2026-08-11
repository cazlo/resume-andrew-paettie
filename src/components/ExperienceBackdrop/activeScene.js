/*
 * Picking the scene that is "the one you are looking at".
 *
 * Split out from the observer that feeds it so the decision is a pure function
 * over numbers and can be tested without a DOM.
 */

// Below this share of a tile being inside the centre band, nothing wins and the
// default vaporwave backdrop stays up. Without a floor, a tile clipping the
// edge of the band on the way past would flicker a scene in for a few frames.
export const MIN_RATIO = 0.2;

/**
 * @param {Array<{sceneId: string|null, ratio: number}>} candidates in DOM order
 * @param {number} minRatio
 * @returns {string|null} the winning scene id, or null for "no scene"
 */
export const resolveActiveScene = (candidates, minRatio = MIN_RATIO) => {
  let best = null;

  candidates.forEach(candidate => {
    if (!candidate.sceneId) return;
    if (candidate.ratio < minRatio) return;
    // Strictly greater, so an exact tie keeps whichever came first in the
    // document. Two jobs sharing a scene sit next to each other, so a tie
    // between them resolves to the same scene either way; this only matters for
    // determinism at the boundary between two different scenes.
    if (!best || candidate.ratio > best.ratio) best = candidate;
  });

  return best ? best.sceneId : null;
};

export default resolveActiveScene;
