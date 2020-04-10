import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll/modules';

const Link = props => {
  // eslint-disable-next-line no-unused-vars
  const { showLabel, ...rest } = props;
  // here showLabel is stripped off to avoid a console.error message
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Scroll.Link {...rest} />;
};

Link.propTypes = {
  showLabel: PropTypes.bool,
};

Link.defaultProps = {
  showLabel: true,
};

export default Link;
