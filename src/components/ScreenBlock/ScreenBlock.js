import React from 'react';
import PropTypes from 'prop-types';

import './ScreenBlock.css';

const ScreenBlock = ({ children, className, containerClassName, ...othersProps }) => (
  <div className="ScreenBlockContainer">
    <div {...othersProps} className="ScreenBlock">
      {children}
    </div>
  </div>
);

ScreenBlock.defaultProps = {
  className: '',
  containerClassName: '',
};

ScreenBlock.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default ScreenBlock;
