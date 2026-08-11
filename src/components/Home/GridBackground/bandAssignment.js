import _ from 'lodash';

/*
 * Decide which technology sits on each diagonal band of the hero grid.
 *
 * Every tile whose `bandStep * row + column` matches shows the same technology,
 * which is what makes the tiling read as diagonal bands rather than vertical
 * stripes. Bands are not worth the same number of tiles though: one through the
 * middle of the grid covers several tiles while one clipping a corner covers a
 * single tile. Handing bands out in list order therefore makes on-screen
 * frequency a property of the geometry, which is how a decade of AWS ends up
 * appearing twice while something incidental appears seven times.
 *
 * Walking the bands widest-first and giving each to whichever technology is
 * furthest below its target share fixes that: frequency tracks the weights. It
 * also degrades sensibly when a narrow viewport has fewer bands than
 * technologies, because the ones left without a band are the least-used.
 *
 * Returns an array of tile indices, one per band.
 */
export default function assignBands(tiles, { rows, columns, bandStep }) {
  const bandCount = bandStep * (rows - 1) + columns;

  const tilesPerBand = new Array(bandCount).fill(0);
  _.range(rows).forEach(row =>
    _.range(columns).forEach(column => {
      tilesPerBand[bandStep * row + column] += 1;
    }),
  );

  const totalWeight = tiles.reduce((sum, tile) => sum + tile.weight, 0);
  const target = tiles.map(tile => (rows * columns * tile.weight) / totalWeight);
  const given = tiles.map(() => 0);

  const widestFirst = _.orderBy(
    tilesPerBand.map((count, band) => ({ count, band })),
    ['count', 'band'],
    ['desc', 'asc'],
  );

  const assignment = new Array(bandCount);
  widestFirst.forEach(({ count, band }) => {
    // Neighbouring bands are neighbouring columns on screen, so letting them
    // share a technology reads as a clump of the same logo rather than as a
    // pattern. The heaviest technology wins the widest bands and those sit next
    // to each other, so without this it clumps every time.
    const neighbours = [assignment[band - 1], assignment[band + 1]];

    let pick = -1;
    let largestDeficit = -Infinity;
    tiles.forEach((tile, i) => {
      if (neighbours.includes(i)) return;
      const deficit = target[i] - given[i];
      if (deficit > largestDeficit) {
        largestDeficit = deficit;
        pick = i;
      }
    });

    // Only possible with fewer than three technologies, where there is no
    // arrangement without a repeat.
    if (pick < 0) pick = 0;

    assignment[band] = pick;
    given[pick] += count;
  });

  return assignment;
}

/* Tiles on screen per technology, for a given grid size. Used by the tests. */
export function tileCounts(tiles, geometry) {
  const assignment = assignBands(tiles, geometry);
  const counts = new Map(tiles.map(tile => [tile.key, 0]));

  _.range(geometry.rows).forEach(row =>
    _.range(geometry.columns).forEach(column => {
      const tile = tiles[assignment[geometry.bandStep * row + column]];
      counts.set(tile.key, counts.get(tile.key) + 1);
    }),
  );

  return counts;
}
