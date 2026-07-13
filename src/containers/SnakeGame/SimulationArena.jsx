import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { drawGameFrame, prepareCanvas } from './snakeCanvasRenderer';
import { ARENA_RUNNING, createArenaSimulation, stepArenaSimulation } from './simulation/arenaSimulation';
import { GameOutcome } from './simulation/deterministicGame';

const BOARD_SIZE = 6;
const BOX_SIZE = 18;
const CANVAS_SIZE = BOARD_SIZE * BOX_SIZE;
const FLEET_INTERVAL = 140;
const FLEET_SIZES = [10, 20];
const FOOD_COLORS = ['#ff8a4c', '#ffcc66', '#f07fa2', '#61dafb', '#b497ff'];
const UINT32_RANGE = 4294967296;

const outcomeStyles = {
  [ARENA_RUNNING]: { color: '#8fc160', label: 'RUNNING' },
  [GameOutcome.WON]: { color: '#61dafb', label: 'CLEARED' },
  [GameOutcome.COLLISION]: { color: '#ff6b6b', label: 'COLLISION' },
  [GameOutcome.NO_FOOD]: { color: '#ff6b6b', label: 'NO FOOD' },
  [GameOutcome.NO_LEGAL_MOVE]: { color: '#ff9f66', label: 'TRAPPED' },
  [GameOutcome.REPEATED_STATE]: { color: '#b497ff', label: 'LOOPED' },
  [GameOutcome.TIMEOUT]: { color: '#ffcc66', label: 'TIMEOUT' },
};

const seedFor = (generation, index) => {
  const value = Math.imul(generation + 1, 2654435761) + Math.imul(index + 1, 2246822519);
  return ((value % UINT32_RANGE) + UINT32_RANGE) % UINT32_RANGE;
};

const createFleet = (size, generation) =>
  Array.from({ length: size }, (_, index) => createArenaSimulation({ seed: seedFor(generation, index) }));

const formatSeed = seed => seed.toString(16).toUpperCase().padStart(8, '0');

const SimulationCard = memo(({ index, simulation }) => {
  const canvasRef = useRef(null);
  const { outcome, seed, state } = simulation;
  const status = outcomeStyles[outcome] || {
    color: '#ffffff',
    label: outcome.toUpperCase(),
  };

  useEffect(() => {
    const ctx = prepareCanvas(canvasRef.current, CANVAS_SIZE, CANVAS_SIZE);
    const food = state.food
      ? [
          {
            ...state.food,
            style: { background: FOOD_COLORS[seed % FOOD_COLORS.length] },
          },
        ]
      : [];

    drawGameFrame(
      ctx,
      {
        boxSize: BOX_SIZE,
        food,
        innerHeight: CANVAS_SIZE,
        innerWidth: CANVAS_SIZE,
        path: [],
        pathColor: '#61dafb',
        showPath: false,
        snake: state.snake,
        snakeColor: '#8fc160',
      },
      state.frameCount * FLEET_INTERVAL,
    );
  }, [seed, state]);

  return (
    <Paper
      elevation={0}
      sx={{
        background: 'linear-gradient(155deg, rgba(20, 34, 28, 0.98), rgba(9, 17, 14, 0.98))',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 2,
        minWidth: 0,
        overflow: 'hidden',
        p: 1.25,
        transition: 'border-color 180ms ease, transform 180ms ease',
        '&:hover': {
          borderColor: `${status.color}55`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          mb: 0.75,
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 800,
            letterSpacing: '0.1em',
          }}
          variant="caption"
        >
          RUN {String(index + 1).padStart(2, '0')}
        </Typography>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.6 }}>
          <Box
            sx={{
              backgroundColor: status.color,
              borderRadius: '50%',
              boxShadow: outcome === ARENA_RUNNING ? `0 0 7px ${status.color}` : 'none',
              height: 6,
              width: 6,
            }}
          />
          <Typography
            sx={{
              color: status.color,
              fontSize: '0.6rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
            }}
          >
            {status.label}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: '#101716',
          borderRadius: 1.25,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <canvas
          aria-label={`Snake simulation ${index + 1}`}
          ref={canvasRef}
          style={{
            display: 'block',
            height: 'auto',
            margin: '0 auto',
            maxWidth: '100%',
          }}
        />
        {outcome !== ARENA_RUNNING && (
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(7, 13, 10, 0.7)',
              display: 'flex',
              inset: 0,
              justifyContent: 'center',
              position: 'absolute',
            }}
          >
            <Typography
              sx={{
                color: status.color,
                fontSize: '0.65rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
              }}
            >
              {status.label}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 0.25,
          gridTemplateColumns: '1fr auto',
          mt: 0.8,
        }}
      >
        <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.62rem' }}>SEED {formatSeed(seed)}</Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.58)',
            fontSize: '0.62rem',
            fontWeight: 700,
          }}
        >
          {state.score}/{state.perfectScore}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.62rem' }}>
          FRAME {state.frameCount.toLocaleString()}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.62rem' }}>
          {state.snake.parts.length} CELLS
        </Typography>
      </Box>
    </Paper>
  );
});

SimulationCard.displayName = 'SimulationCard';
SimulationCard.propTypes = {
  index: PropTypes.number.isRequired,
  simulation: PropTypes.shape({
    outcome: PropTypes.string.isRequired,
    seed: PropTypes.number.isRequired,
    state: PropTypes.shape({
      food: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }),
      frameCount: PropTypes.number.isRequired,
      perfectScore: PropTypes.number.isRequired,
      score: PropTypes.number.isRequired,
      snake: PropTypes.shape({
        direction: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        }).isRequired,
        parts: PropTypes.arrayOf(
          PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
          }),
        ).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

const SimulationArena = () => {
  const arenaRef = useRef(null);
  const generationRef = useRef(0);
  const [fleetSize, setFleetSize] = useState(FLEET_SIZES[0]);
  const [isVisible, setIsVisible] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [simulations, setSimulations] = useState(() => createFleet(FLEET_SIZES[0], generationRef.current));

  const runningCount = simulations.filter(simulation => simulation.outcome === ARENA_RUNNING).length;
  const wonCount = simulations.filter(simulation => simulation.outcome === GameOutcome.WON).length;
  const leaderScore = useMemo(
    () => simulations.reduce((highest, simulation) => Math.max(highest, simulation.state.score), 0),
    [simulations],
  );
  let fleetStatus = `${runningCount} ACTIVE`;
  let fleetStatusColor = '#8fc160';
  if (!isVisible) {
    fleetStatus = 'SCROLL INTO VIEW TO START';
    fleetStatusColor = 'text.secondary';
  } else if (manuallyPaused) {
    fleetStatus = 'FLEET PAUSED';
    fleetStatusColor = '#ffcc66';
  }

  const resetFleet = useCallback(size => {
    generationRef.current += 1;
    setFleetSize(size);
    setManuallyPaused(false);
    setSimulations(createFleet(size, generationRef.current));
  }, []);

  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return undefined;
    if (!window.IntersectionObserver) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new window.IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin: '120px 0px',
      threshold: 0.05,
    });
    observer.observe(arena);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || manuallyPaused || runningCount === 0) return undefined;

    // One scheduler advances the whole fleet in one React update. Spawning a
    // Redux/Saga loop or animation timer per board made CPU work and renders
    // scale needlessly with the number of agents. Visibility gating keeps all
    // of that work dormant below the fold (and whenever it is scrolled away),
    // while terminal runs keep their object so memoized cards stop rendering.
    const interval = window.setInterval(() => {
      setSimulations(current => current.map(stepArenaSimulation));
    }, FLEET_INTERVAL);

    return () => window.clearInterval(interval);
  }, [isVisible, manuallyPaused, runningCount]);

  return (
    <Box component="section" ref={arenaRef} sx={{ my: 4 }}>
      <Box
        sx={{
          alignItems: { md: 'flex-end' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ maxWidth: 720 }}>
          <Typography
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              letterSpacing: '0.14em',
            }}
            variant="overline"
          >
            MULTIVERSE MODE // SEEDED FLEET
          </Typography>
          <Typography sx={{ fontWeight: 800, letterSpacing: '-0.025em' }} variant="h4">
            Same brain. Different universes.
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }} variant="body2">
            Independent deterministic games race concurrently. Every seed owns its board, food stream, solver state, and
            outcome.
          </Typography>
        </Box>

        <Stack alignItems={{ xs: 'stretch', sm: 'center' }} direction={{ xs: 'column', sm: 'row' }} gap={1}>
          <Stack direction="row" gap={0.75}>
            {FLEET_SIZES.map(size => (
              <Button
                aria-pressed={fleetSize === size}
                key={size}
                onClick={() => resetFleet(size)}
                size="small"
                sx={{ minWidth: 72 }}
                variant={fleetSize === size ? 'contained' : 'outlined'}
              >
                {size} runs
              </Button>
            ))}
          </Stack>
          <Button onClick={() => setManuallyPaused(current => !current)} size="small" variant="outlined">
            {manuallyPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button onClick={() => resetFleet(fleetSize)} size="small" variant="outlined">
            New seeds
          </Button>
        </Stack>
      </Box>

      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'rgba(13, 23, 19, 0.72)',
          border: '1px solid rgba(143, 193, 96, 0.14)',
          borderRadius: 3,
          p: { xs: 1.25, sm: 2 },
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 3 },
            mb: 1.75,
          }}
        >
          <Typography sx={{ color: fleetStatusColor, fontWeight: 800 }} variant="caption">
            {fleetStatus}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }} variant="caption">
            {wonCount} CLEARED
          </Typography>
          <Typography sx={{ color: 'text.secondary' }} variant="caption">
            LEADER {leaderScore}/{simulations[0].state.perfectScore}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', ml: { sm: 'auto' } }} variant="caption">
            6 × 6 // {Math.round(1000 / FLEET_INTERVAL)} STEPS/SEC
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
          }}
        >
          {simulations.map((simulation, index) => (
            <SimulationCard index={index} key={simulation.seed} simulation={simulation} />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default memo(SimulationArena);
