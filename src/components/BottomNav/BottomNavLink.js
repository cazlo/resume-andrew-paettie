import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll/modules';

export const Link = props => {
// eslint-disable-next-line no-unused-vars
  const { showLabel, ...rest } = props;
  // here showLabel is stripped off to avoid a console.error message
  return <Scroll.Link {...rest} />;
};

Link.propTypes = {
  showLabel: PropTypes.bool,
};