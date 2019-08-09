import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography/Typography';

import { Provider } from 'react-redux';
import SnakeGame from '../../containers/SnakeGame/SnakeGame';
import techTheme from '../../common/techTheme';
import createStore from '../../containers/SnakeGame/store';

const styles = theme => ({
  NotFoundPaper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: '100%',
    textAlign: 'center',
    marginBottom: '15px',
    backgroundColor: '#424242',
  },
  Heading: {
    fontSize: theme.typography.pxToRem(42),
    color: theme.palette.text.primary,
  },
  SubHeading: {
    fontSize: theme.typography.pxToRem(21),
    color: theme.palette.text.primary,
  },
  NotFoundButton: {
    ...techTheme.android.style,
    marginBottom: '15px',
  },
});

const theme = createMuiTheme({
  type: 'dark',
  palette: {
    primary: {
      main: '#689f38',
    },
    secondary: {
      main: '#64dd17',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

const NotFound = props => {
  const { classes } = props;

  return (
    <MuiThemeProvider theme={theme}>
      {/* <ScreenBlock className="NotFoundBlock"> */}
      {/* <div className="container"> */}
      <Paper className={classes.NotFoundPaper}>
        <Button
          component={Link}
          variant="contained"
          target="_blank"
          to="/"
          className={classes.NotFoundButton}
        >
          <FaHome size="2em" />
        </Button>
        <Typography className={classes.Heading}>Path Not Found</Typography>
        <Typography className={classes.SubHeading}>Commence path finding...</Typography>
      </Paper>
      <Provider store={createStore()}>
        <SnakeGame />
      </Provider>
      {/* </div> */}
      {/* </ScreenBlock> */}
    </MuiThemeProvider>
  );
};

NotFound.propTypes = {
  classes: PropTypes.shape({}),
};

NotFound.defaultProps = {
  classes: {},
};

export default withStyles(styles)(NotFound);
