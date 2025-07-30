import React from 'react';

import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { Provider } from 'react-redux';
import SnakeGame from '../../containers/SnakeGame/SnakeGame';
import createStore from '../../containers/SnakeGame/store';

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

const store = createStore();

export default function NotFound() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
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
          }}
        />
        <Provider store={store}>
          <SnakeGame />
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
