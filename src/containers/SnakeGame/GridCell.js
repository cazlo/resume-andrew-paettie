import React from 'react';
import PropTypes from 'prop-types';

import './GridCell.css';

const GridCell = props => {
  const classes = `grid-cell `;
  let style = {
    height: `${props.size}px`,
    width: `${props.size}px`,
  };
  if (props.foodCell) {
    style = { ...style, ...props.foodCell.style };
  }
  if (props.snakeCell) {
    style = { ...style, ...props.snakeCell.style };
  }
  return (
    <div className={classes} style={style}>
      {props.foodCell && props.foodCell.icon ? props.foodCell.icon : ''}
      {props.snakeCell && props.snakeCell.icon ? props.snakeCell.icon : ''}
    </div>
  );
};

GridCell.propTypes = {
  foodCell: PropTypes.any,
  snakeCell: PropTypes.any,
  size: PropTypes.number,
};

GridCell.defaultPropTypes = {
  foodCell: false,
  snakeCell: false,
  size: 15,
};

export default GridCell;
