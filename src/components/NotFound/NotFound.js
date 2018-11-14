import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { FaHome } from 'react-icons/fa';

import ScreenBlock from '../ScreenBlock/ScreenBlock';
import SnakeGame from '../../containers/SnakeGame/SnakeGame';
import techTheme from '../../common/techTheme';
import { Provider } from 'react-redux'
import createStore from '../../containers/SnakeGame/store';

const styles = theme => ({
  NotFoundPaper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: '100%',
    textAlign: 'center',
    marginBottom: '15px',
    backgroundColor: '#eeeeee',
  },
  NotFoundButton: {
    ...techTheme.android.style,
    marginBottom: '15px',
  },
});

const NotFound = props => {
  const { classes } = props;

  return (
    <ScreenBlock className="NotFoundBlock">
      <div className="container">
        <Paper className={classes.NotFoundPaper}>
          <div className="heading">
            <h2>404 Not Found</h2>
          </div>
          <Button
            component={Link}
            variant="contained"
            target="_blank"
            to="/"
            className={classes.NotFoundButton}
          >
            <FaHome size="2em" />
          </Button>
        </Paper>
        <Provider store={createStore()}>
          <SnakeGame />
        </Provider>
      </div>
    </ScreenBlock>
  );
};

NotFound.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(NotFound);
