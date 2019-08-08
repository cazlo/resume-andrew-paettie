import React from 'react';
import PropTypes from 'prop-types';

const GridItem = ({ width, height, style, ...rest }) => (
  <div className="GridItem" style={{ width, height, ...style }} {...rest} />
);

GridItem.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};

GridItem.defaultPropTypes = {
  height: 0,
  width: 0,
  style: {},
  delay: 1000,
  duration: 1000,
};

export default GridItem;
