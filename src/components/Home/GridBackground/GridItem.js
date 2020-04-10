import React from 'react';
import PropTypes from 'prop-types';

const GridItem = ({ width, height, style, children, className }) => (
  <div className={`GridItem ${className}`} style={{ width, height, ...style }}>
    {children}
  </div>
);

GridItem.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

GridItem.defaultProps = {
  className: '',
};

export default GridItem;
