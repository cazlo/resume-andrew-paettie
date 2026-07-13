import React from 'react';

import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { Provider } from 'react-redux';
import SnakeGame from '../../containers/SnakeGame/SnakeGame';
import createStore from '../../containers/SnakeGame/store';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8fc160',
      contrastText: '#0b120e',
    },
    secondary: {
      main: '#61dafb',
    },
    background: {
      default: '#07100d',
      paper: '#111b17',
    },
    text: {
      primary: '#eef7e9',
      secondary: '#9eafa6',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h3: {
      fontFamily: "'Open Sans', sans-serif",
      fontWeight: 700,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const store = createStore();
const pageBackground = [
  'radial-gradient(circle at 12% 8%, rgba(143, 193, 96, 0.12), transparent 28%)',
  'radial-gradient(circle at 88% 32%, rgba(97, 218, 251, 0.08), transparent 24%)',
  '#07100d',
].join(', ');
const gridBackground = [
  'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)',
  'linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
].join(', ');

export default function NotFound() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            background: pageBackground,
            minHeight: '100vh',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              backgroundImage: gridBackground,
              backgroundSize: '48px 48px',
              content: '""',
              inset: 0,
              maskImage: 'linear-gradient(to bottom, black, transparent 72%)',
              pointerEvents: 'none',
              position: 'absolute',
            },
          }}
        >
          <Provider store={store}>
            <SnakeGame />
          </Provider>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
