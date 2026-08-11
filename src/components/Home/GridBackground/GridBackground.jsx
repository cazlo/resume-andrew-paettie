import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import flow from 'lodash/flow';
import withWindowSize from './withWindowSize';
import GridItem from './GridItem';
import assignBands from './bandAssignment';

// Seconds of phase offset per step along the diagonal. Each tile holds one
// color at a time and eases into the next; offsetting neighbours by a fraction
// of the cycle is what makes the color read as a wave crossing the grid.
// See the vw-tile-cycle animation in Home.css.
//
// This is deliberately smaller than it would be for a coarse grid: the step is
// per tile, so a denser grid spans the same distance in more, smaller hops. The
// wave therefore covers roughly the same stretch of the cycle as before while
// reading as a smooth gradient rather than a visible staircase.
const TILE_WAVE_STEP_SECONDS = 0.35;

// Tile rows in the hero. The column count is whatever makes those tiles come
// out closest to square at the current viewport size, so this one number sets
// the density of the whole grid.
const ROWS = 9;

// How far the technology pattern shifts when it moves down one row. This is
// what turns the tiling into diagonal bands rather than vertical stripes, and
// it also sets how many distinct bands exist: a larger step means more bands,
// so more of the technology list gets on screen at once.
const ROW_BAND_STEP = 3;

class GridBackground extends React.PureComponent {
  /*
   * Tiles are laid out with `repeat(n, 1fr)` rather than a computed pixel
   * width. An earlier version handed every tile an explicit px width of
   * innerWidth / columns; at fractional viewport widths (any browser zoom that
   * is not 100%) those widths summed to a hair more than the container, so
   * flex-wrap pushed the last column onto its own row and left the backdrop
   * showing as a black bar down the right edge. Grid fractions are resolved by
   * the layout engine against the real container width, so the row fills
   * exactly at every zoom level.
   */
  calcColumns = () => {
    const { innerWidth, innerHeight } = this.props;

    if (!innerWidth || !innerHeight) return 1;

    const squareTile = innerHeight / ROWS;
    return Math.max(1, Math.round(innerWidth / squareTile));
  };

  generateDOM(columns) {
    const { tiles } = this.props;
    const assignment = assignBands(tiles, { rows: ROWS, columns, bandStep: ROW_BAND_STEP });

    return _.flatten(
      _.range(ROWS).map(row =>
        _.range(columns).map(column => {
          const tile = tiles[assignment[ROW_BAND_STEP * row + column]];

          // Negative delay starts each tile part way into the cycle, so the wave
          // is already travelling on first paint rather than every tile starting
          // on the same color and drifting apart.
          const wavePhase = -(row + column) * TILE_WAVE_STEP_SECONDS;

          return (
            <GridItem key={`home-grid-${row}-${column}`} style={{ '--tile-wave-delay': `${wavePhase}s` }}>
              {React.cloneElement(tile.node, { style: { ...tile.node.props.style, width: '100%', height: '100%' } })}
            </GridItem>
          );
        }),
      ),
    );
  }

  render() {
    if (navigator.userAgent === 'ReactSnap') {
      return <div />;
    }

    const columns = this.calcColumns();

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          width: '100%',
          height: '100%',
        }}
      >
        {this.generateDOM(columns)}
      </div>
    );
  }
}

GridBackground.propTypes = {
  innerHeight: PropTypes.number.isRequired,
  innerWidth: PropTypes.number.isRequired,
  tiles: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
      node: PropTypes.element.isRequired,
    }),
  ).isRequired,
};

GridBackground.defaultPropTypes = {
  innerHeight: 0,
  innerWidth: 0,
};

export { ROWS, ROW_BAND_STEP };

const decorators = flow([withWindowSize]);

export default decorators(GridBackground);
