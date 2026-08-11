import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ALGORITHM_NOTES = [
  {
    name: 'Shortest Path to Food (A*)',
    note: 'Beelines to the food and ignores what the board will look like when it gets there, so it boxes itself in and collides fairly often.',
  },
  {
    name: 'Shortest Path to Food Else Longest Path to Tail (greedy)',
    note:
      'Usually finishes in near-minimal steps compared to cycle-following, but can fall into loops and historically ' +
      'would sometimes never converge. It now detects stall and late-game risk and bails into a Hamiltonian-cycle ' +
      "recovery, so the runs shown here converge — but there's no general proof that greedy always does.",
  },
  {
    name: 'Hamiltonian Cycle',
    note: 'Always converges, but visits nearly every cell between bites, so it maximizes step count.',
  },
  {
    name: 'Hamiltonian Cycle with Safe Shortcuts',
    note:
      'Always converges, and deterministic forward shortcuts cut the step count well below strict cycle-following, ' +
      'though still above greedy on average.',
  },
];

const AlgorithmTradeoffs = () => (
  <Box component="section" sx={{ my: 4 }}>
    <Typography sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }} variant="h5">
      Algorithm tradeoffs
    </Typography>
    <Typography sx={{ color: 'text.secondary', mb: 2 }} variant="body2">
      Pick one in Controls and watch it play out. Here&rsquo;s how the four options actually compare.
    </Typography>

    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      {ALGORITHM_NOTES.map(algorithm => (
        <Paper
          elevation={0}
          key={algorithm.name}
          sx={{
            background: 'linear-gradient(145deg, rgba(20, 34, 28, 0.96), rgba(11, 20, 16, 0.96))',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 0.5 }} variant="subtitle2">
            {algorithm.name}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }} variant="body2">
            {algorithm.note}
          </Typography>
        </Paper>
      ))}
    </Box>
  </Box>
);

export default AlgorithmTradeoffs;
