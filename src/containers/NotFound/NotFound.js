import React, { Component } from 'react';

import ScreenBlock from '../../components/ScreenBlock/ScreenBlock';
import SnakeGame from '../SnakeGame/SnakeGame';

class NotFound extends Component {
  componentDidMount() {}
  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    return (
      <ScreenBlock>
        <SnakeGame />
      </ScreenBlock>
    );
  }
}

export default NotFound;
