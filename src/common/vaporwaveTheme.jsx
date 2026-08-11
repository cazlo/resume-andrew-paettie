import { createTheme } from '@mui/material/styles';

/**
 * Retro vaporwave palette for the site.
 *
 * Kept in one place so the whole surface can be re-tuned (or reverted) from a
 * single file. Component overrides below only lean on these tokens.
 */
export const vaporwave = {
  void: '#120726',
  night: '#1b0e33',
  dusk: '#2a1450',
  cyan: '#01cdfe',
  magenta: '#ff5ec4',
  lavender: '#b967ff',
  mint: '#05ffa1',
  sun: '#ff9f6e',
  text: '#f4ecff',
  textMuted: '#b7a4d8',
};

const glowRing = (color, alpha = 0.35) => `0 0 0 1px ${color}${Math.round(alpha * 255).toString(16)}`;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: vaporwave.cyan,
      light: '#6ee7ff',
      dark: '#0093b8',
      contrastText: '#0b0418',
    },
    secondary: {
      main: vaporwave.magenta,
      light: '#ff96d9',
      dark: '#c62f92',
      contrastText: '#0b0418',
    },
    info: { main: vaporwave.lavender },
    success: { main: vaporwave.mint },
    warning: { main: vaporwave.sun },
    background: {
      default: vaporwave.void,
      paper: vaporwave.night,
    },
    text: {
      primary: vaporwave.text,
      secondary: vaporwave.textMuted,
    },
    divider: 'rgba(185, 103, 255, 0.28)',
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: { letterSpacing: '0.08em' },
    h2: { letterSpacing: '0.06em' },
    button: {
      letterSpacing: '0.14em',
      fontWeight: 600,
    },
    caption: {
      lineHeight: 1.65,
      color: vaporwave.textMuted,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(160deg, rgba(42, 20, 80, 0.92) 0%, rgba(19, 8, 40, 0.94) 100%)',
          border: '1px solid rgba(185, 103, 255, 0.32)',
          backdropFilter: 'blur(6px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `${glowRing(vaporwave.cyan, 0.18)}, 0 18px 40px rgba(6, 2, 18, 0.65)`,
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            insetInline: 0,
            top: 0,
            height: 2,
            background: `linear-gradient(90deg, ${vaporwave.cyan}, ${vaporwave.magenta}, ${vaporwave.lavender})`,
          },
          '&:hover': {
            transform: 'translateY(-3px)',
            borderColor: 'rgba(1, 205, 254, 0.55)',
            boxShadow: `${glowRing(vaporwave.magenta, 0.3)}, 0 22px 52px rgba(255, 94, 196, 0.16)`,
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        title: {
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 700,
          letterSpacing: '0.04em',
          textShadow: `0 0 18px rgba(1, 205, 254, 0.45)`,
        },
        subheader: {
          color: vaporwave.magenta,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(42, 20, 80, 0.7)',
          border: '1px solid rgba(1, 205, 254, 0.35)',
          transition: 'border-color 180ms ease, box-shadow 180ms ease',
          '&:hover': {
            borderColor: vaporwave.magenta,
            boxShadow: `0 0 14px rgba(255, 94, 196, 0.4)`,
          },
        },
        label: {
          letterSpacing: '0.04em',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(1, 205, 254, 0.5)',
          color: vaporwave.cyan,
          textShadow: '0 0 12px rgba(1, 205, 254, 0.55)',
          '&:hover': {
            borderColor: vaporwave.magenta,
            color: vaporwave.magenta,
            backgroundColor: 'rgba(255, 94, 196, 0.08)',
            boxShadow: '0 0 18px rgba(255, 94, 196, 0.35)',
            textShadow: '0 0 12px rgba(255, 94, 196, 0.6)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 0 1px rgba(1, 205, 254, 0.45), 0 0 18px rgba(185, 103, 255, 0.3)',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(180deg, rgba(27, 14, 51, 0.92) 0%, rgba(12, 5, 28, 0.98) 100%)',
          backdropFilter: 'blur(8px)',
          borderTop: `1px solid ${vaporwave.magenta}`,
          boxShadow: '0 -12px 30px rgba(255, 94, 196, 0.18)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: vaporwave.textMuted,
          letterSpacing: '0.08em',
          '&.Mui-selected': {
            color: vaporwave.cyan,
          },
        },
      },
    },
    MuiTimelineConnector: {
      styleOverrides: {
        root: {
          background: `linear-gradient(180deg, ${vaporwave.cyan}, ${vaporwave.lavender}, ${vaporwave.magenta})`,
          width: 2,
        },
      },
    },
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          borderColor: vaporwave.lavender,
          boxShadow: `0 0 16px rgba(185, 103, 255, 0.55)`,
        },
      },
    },
  },
});

export default theme;
