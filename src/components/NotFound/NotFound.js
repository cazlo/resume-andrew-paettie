import React from 'react';

import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';

import { Provider } from 'react-redux';
import SnakeGame from '../../containers/SnakeGame/SnakeGame';
import techTheme from '../../common/techTheme';
import createStore from '../../containers/SnakeGame/store';

const styles = makeStyles(theme => ({
  NotFoundPaper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
}));

const theme = createTheme({
  type: 'dark',
  palette: {
    primary: {
      main: '#689f38',
    },
    secondary: {
      main: '#64dd17',
    },
  },
});

export default function NotFound() {
  const classes = styles();
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Paper className={classes.NotFoundPaper} />
        <Provider store={createStore()}>
          <SnakeGame />
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
