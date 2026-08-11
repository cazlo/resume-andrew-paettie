/*
 * Autopilot: pick where the dive should head next.
 *
 * Every completed frame leaves behind a coarse grid of smooth escape counts
 * (negative where the orbit never escaped). That grid is enough to find the
 * set's boundary, which is the only part worth zooming into — the interior is
 * a flat blob and open sky outside the set flattens out within a few
 * magnifications.
 *
 * The scoring is deliberately biased toward the middle of the frame. A target
 * near the centre needs only a small course correction, so the camera glides;
 * chasing the most spectacular cell in the corner every frame would swing the
 * view around and look drunk.
 */

// Ignore the outer margin of the grid: a target out there would be gone from
// view before the camera could reach it.
const EDGE_LIMIT = 0.8;

// Falloff of the centre bias, in normalized half-screens.
const SIGMA = 0.36;

/**
 * @param coarse   Float32Array of smooth escape counts, -1 for interior
 * @param coarseW  grid width
 * @param coarseH  grid height
 * @param view     the view the grid was sampled from
 * @param aspect   frame width / height
 * @returns { cx, cy, score, kind } or null when nothing worth chasing is in frame
 */
export default function chooseTarget(coarse, coarseW, coarseH, view, aspect) {
  let best = null;

  for (let y = 1; y < coarseH - 1; y += 1) {
    const ny = (y / (coarseH - 1)) * 2 - 1;
    if (Math.abs(ny) <= EDGE_LIMIT) {
      for (let x = 1; x < coarseW - 1; x += 1) {
        const nx = (x / (coarseW - 1)) * 2 - 1;
        if (Math.abs(nx) <= EDGE_LIMIT) {
          let interior = 0;
          let lo = Infinity;
          let hi = -Infinity;
          for (let j = -1; j <= 1; j += 1) {
            for (let i = -1; i <= 1; i += 1) {
              const v = coarse[(y + j) * coarseW + (x + i)];
              if (v < 0) interior += 1;
              else {
                if (v < lo) lo = v;
                if (v > hi) hi = v;
              }
            }
          }

          // Solid interior scores nothing: it never changes, so diving into it
          // just zooms a flat colour.
          let score = 0;
          let kind = null;
          if (interior > 0 && interior < 9) {
            // A real edge. Cells that split their neighbourhood evenly sit on
            // the boundary rather than clipping a corner of it, and stay
            // interesting for longer as the frame closes in.
            score = 1 - Math.abs(interior / 9 - 0.5);
            kind = 'edge';
          } else if (interior === 0) {
            // No interior nearby, so steer by turbulence instead: a steep
            // local gradient in escape count means filaments, which is where
            // the boundary went even if this frame cannot resolve it.
            score = 0.45 * Math.min(1, (hi - lo) / 24);
            kind = 'filament';
          }

          score *= Math.exp(-(nx * nx + ny * ny) / (2 * SIGMA * SIGMA));
          if (kind && (!best || score > best.score)) {
            best = {
              score,
              kind,
              cx: view.cx + nx * view.halfHeight * aspect,
              cy: view.cy - ny * view.halfHeight,
            };
          }
        }
      }
    }
  }

  return best && best.score > 0 ? best : null;
}
