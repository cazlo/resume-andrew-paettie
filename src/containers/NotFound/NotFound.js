import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import ScreenBlock from '../../components/ScreenBlock/ScreenBlock';
import SnakeGame from '../SnakeGame/SnakeGame';
import techTheme from '../../common/techTheme';

import './NotFound.css';

class NotFound extends Component {
  componentDidMount() {}
  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    return (
      <ScreenBlock className="NotFoundBlock">
        <div className="container">
          <SnakeGame />

          <Paper className="NotFoundPaper">
            <div className="heading">
              <h2>404 Not Found</h2>
            </div>
            <Button
              variant="contained"
              target="_blank"
              href="/"
              style={{ ...techTheme.android.style, marginBottom: '15px' }}
            >
              Resume
            </Button>
          </Paper>
        </div>
      </ScreenBlock>
    );
  }
}

export default NotFound;
