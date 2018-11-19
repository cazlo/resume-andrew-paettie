import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import SnakeGame from '../../containers/SnakeGame/SnakeGame';
import techTheme from '../../common/techTheme';
import { Provider } from 'react-redux'
import createStore from '../../containers/SnakeGame/store';

const theme = createMuiTheme({
  type: 'dark',
  palette: {
    primary: {
      main: '#689f38',
    },
    secondary: {
      main: '#64dd17',
    }
  },
  typography: {
    useNextVariants: true,
  }
});

const styles = theme => ({
  NotFoundPaper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: '100%',
    textAlign: 'center',
    marginBottom: '15px',
    backgroundColor: '#424242'
  },
  Heading: {
    fontSize: theme.typography.pxToRem(40),
    color: theme.palette.text.primary,
  },
  NotFoundButton: {
    ...techTheme.android.style,
    marginBottom: '15px',
  },
});

const NotFound = props => {
  const { classes } = props;

  return (
    <MuiThemeProvider theme={theme}>
      {/*<ScreenBlock className="NotFoundBlock">*/}
      {/*<div className="container">*/}
        <Paper className={classes.NotFoundPaper}>
          <Typography className={classes.Heading}>404 Not Found</Typography>
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
      {/*</div>*/}
    {/*</ScreenBlock>*/}
    </MuiThemeProvider>
  );
};

NotFound.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(NotFound);
