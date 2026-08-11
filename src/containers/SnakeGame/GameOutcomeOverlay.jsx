import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import GameState from './util/GameState';

const outcomeContent = {
  [GameState.WON]: {
    eyebrow: 'PERFECT GAME',
    title: 'Board cleared',
    accent: '#8fc160',
  },
  [GameState.GAME_OVER]: {
    eyebrow: 'GAME OVER',
    title: 'Game over',
    accent: '#ef6a78',
  },
};

const GameOutcomeOverlay = ({ state, score, perfectScore }) => {
  const content = outcomeContent[state];
  if (!content) return null;

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        inset: 0,
        justifyContent: 'center',
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 2,
      }}
    >
      <Paper
        aria-live="polite"
        role="status"
        elevation={12}
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(13, 22, 19, 0.9)',
          border: `2px solid ${content.accent}`,
          borderRadius: 3,
          boxShadow: `0 0 34px ${content.accent}55`,
          color: '#fff',
          minWidth: { xs: 220, sm: 300 },
          px: { xs: 3, sm: 5 },
          py: 3,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ color: content.accent, fontWeight: 800, letterSpacing: '0.18em' }} variant="overline">
          {content.eyebrow}
        </Typography>
        <Typography component="div" sx={{ fontWeight: 800, lineHeight: 1.1, mb: 1 }} variant="h4">
          {content.title}
        </Typography>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.78)' }} variant="body1">
          Score: {score} / {perfectScore}
        </Typography>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.56)', mt: 1 }} variant="caption">
          Starting a new run…
        </Typography>
      </Paper>
    </Box>
  );
};

GameOutcomeOverlay.propTypes = {
  state: PropTypes.oneOf(Object.values(GameState)).isRequired,
  score: PropTypes.number.isRequired,
  perfectScore: PropTypes.number.isRequired,
};

export default GameOutcomeOverlay;
