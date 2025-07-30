import React from 'react';
import PropTypes from 'prop-types';

import './ScreenBlock.css';

const ScreenBlock = ({ children, id, style }) => (
  <div className="ScreenBlockContainer">
    <div id={id} className="ScreenBlock" style={style}>
      {children}
    </div>
  </div>
);

ScreenBlock.defaultProps = {
  style: {},
};

ScreenBlock.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

export default ScreenBlock;
