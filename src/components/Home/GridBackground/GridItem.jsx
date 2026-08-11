import React from 'react';
import PropTypes from 'prop-types';

// Sizing comes from the parent grid track, not from this element, so that a row
// of tiles always fills the container width exactly. See GridBackground.
const GridItem = ({ style, children, className }) => (
  <div className={`GridItem ${className}`} style={style}>
    {children}
  </div>
);

GridItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

GridItem.defaultProps = {
  className: '',
  style: {},
};

export default GridItem;
