import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import flow from 'lodash/flow';
import withWindowSize from './withWindowSize';
import GridItem from './GridItem';

// Seconds of phase offset per step along the diagonal. Each tile holds one
// color at a time and eases into the next; offsetting neighbours by a fraction
// of the cycle is what makes the color read as a wave crossing the grid.
// See the vw-tile-cycle animation in Home.css.
const TILE_WAVE_STEP_SECONDS = 0.55;

// The hero is always six tiles tall; the column count is whatever makes those
// tiles come out closest to square at the current viewport size.
const ROWS = 6;

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
    const { children } = this.props;
    let interval = 0;

    return _.map(_.range(columns * ROWS), i => {
      // Shift which technology starts each row, so the icons read as diagonal
      // bands across the grid instead of vertical stripes.
      if (i - columns >= 0 && i % columns === 0) {
        interval += columns - 2;
      }

      // Negative delay starts each tile part way into the cycle, so the wave is
      // already travelling on first paint rather than every tile starting on
      // the same color and drifting apart.
      const wavePhase = -((i % columns) + Math.floor(i / columns)) * TILE_WAVE_STEP_SECONDS;

      const source = children[(i - interval) % children.length];
      const child = React.createElement(source.type, {
        ...source.props,
        style: {
          ...source.props.style,
          width: '100%',
          height: '100%',
        },
      });

      return (
        <GridItem key={`home-grid-${i}`} style={{ '--tile-wave-delay': `${wavePhase}s` }}>
          {child}
        </GridItem>
      );
    });
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
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

GridBackground.defaultPropTypes = {
  innerHeight: 0,
  innerWidth: 0,
};

const decorators = flow([withWindowSize]);

export default decorators(GridBackground);
