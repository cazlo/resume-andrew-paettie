import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import flow from 'lodash/flow';
import * as PropTypes from 'prop-types';
import { MdGridOn, MdLocalPizza, MdMemory, MdTimer } from 'react-icons/md';

import Paper from '@mui/material/Paper/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import withWindowSize from './util/withWindowSize';
import Scoreboard from './Scoreboard';
import { play, setSize, changeDirection, gameOver } from './actions/gameAction';
import GameGrid from './util/Grid';
import GameState from './util/GameState';
import techTheme from '../../common/techTheme';
import SnakeNav from './SnakeNav';
import { drawGameFrame, prepareCanvas } from './snakeCanvasRenderer';
import GameOutcomeOverlay from './GameOutcomeOverlay';
import AlgorithmTradeoffs from './AlgorithmTradeoffs';

const { DEFAULT_BOX_SIZE, DEFAULT_BOARD_SIZE } = GameGrid;
const { PLAYING } = GameState;

// Rendering is cosmetic and must never become the game-loop speed limit. A
// 1000x500 headless-Chrome benchmark (120 frames) measured the old per-segment
// renderer at 1.454ms/frame for 300 segments and 2.477ms/frame for 600. Batched
// paths reduced those to 0.125ms and 0.218ms. Keep this visual cap independent
// from Redux ticks so high-refresh displays do not spend 144+ renders/second.
const MIN_CANVAS_FRAME_INTERVAL = 16;

const PREFIX = 'SnakeGame';

const classes = {
  progress: `${PREFIX}-progress`,
  canvasContainer: `${PREFIX}-canvasContainer`,
  boardShell: `${PREFIX}-boardShell`,
  hero: `${PREFIX}-hero`,
  telemetry: `${PREFIX}-telemetry`,
  metricCard: `${PREFIX}-metricCard`,
  root: `${PREFIX}-root`,
};

const Root = styled('main')(({ theme }) => ({
  [`& .${classes.progress}`]: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 999,
    height: 4,
    marginTop: theme.spacing(2),
  },

  [`& .${classes.canvasContainer}`]: {
    position: 'relative',
    textAlign: 'center',

    '& canvas': {
      border: '1px solid rgba(143, 193, 96, 0.2)',
      borderRadius: '10px',
      boxShadow: '0 18px 50px rgba(0, 0, 0, 0.32)',
      display: 'block',
      height: 'auto !important',
      margin: '0 auto',
      maxWidth: '100%',
    },
  },

  [`& .${classes.boardShell}`]: {
    backgroundColor: 'rgba(13, 23, 19, 0.78)',
    border: '1px solid rgba(143, 193, 96, 0.16)',
    borderRadius: 3,
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    padding: theme.spacing(1.5),
  },

  [`& .${classes.hero}`]: {
    alignItems: 'flex-end',
    display: 'flex',
    gap: theme.spacing(3),
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },

  [`& .${classes.telemetry}`]: {
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    margin: theme.spacing(2.5, 0),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },

  [`& .${classes.metricCard}`]: {
    background: 'linear-gradient(145deg, rgba(20, 34, 28, 0.96), rgba(11, 20, 16, 0.96))',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: 2,
    minWidth: 0,
    padding: theme.spacing(2),
  },

  [`&.${classes.root}`]: {
    margin: '0 auto',
    maxWidth: 1540,
    padding: theme.spacing(12, 2, 5),
    position: 'relative',
    width: '100%',
    zIndex: 1,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  },
}));

const normalise = (value, min, max) => {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) * 100) / (max - min)));
};

class SnakeGame extends Component {
  componentDidMount() {
    const { innerHeight = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE, innerWidth = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE } =
      this.props;
    const numCols = Math.floor(innerWidth / DEFAULT_BOX_SIZE);
    const numRows = Math.floor(innerHeight / DEFAULT_BOX_SIZE);
    const innerHeightOverride = DEFAULT_BOX_SIZE * numRows;
    const innerWidthOverride = DEFAULT_BOX_SIZE * numCols;
    /* eslint-disable react/destructuring-assignment */
    if (this.props.game.state === PLAYING) {
      this.props.gameOver();
    }
    this.props.setSize({ numRows, numCols });
    this.props.play();
    /* eslint-enable react/destructuring-assignment */
    this.startCanvasAnimation(innerWidthOverride, innerHeightOverride);
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { innerHeight = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE, innerWidth = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE } =
      this.props;
    if (innerHeight !== prevProps.innerHeight && innerWidth !== prevProps.innerWidth) {
      const numCols = Math.floor(innerWidth / DEFAULT_BOX_SIZE);
      const numRows = Math.floor(innerHeight / DEFAULT_BOX_SIZE);
      /* eslint-disable react/destructuring-assignment */

      if (numCols !== this.props.game.numCols && numRows !== this.props.game.numRows) {
        this.props.gameOver();
        this.props.setSize({ numRows, numCols });
      }
      /* eslint-enable react/destructuring-assignment */
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrame);
  }

  startCanvasAnimation(initialWidth, initialHeight) {
    prepareCanvas(this.snakeCanvas, initialWidth, initialHeight);

    const draw = timestamp => {
      // Schedule first so a malformed visual record cannot permanently stop the
      // renderer while the independent Redux game loop continues.
      this.animationFrame = requestAnimationFrame(draw);
      if (timestamp - (this.lastCanvasFrame || 0) < MIN_CANVAS_FRAME_INTERVAL) return;
      this.lastCanvasFrame = timestamp;
      const {
        game: { numRows, numCols },
        snake,
        food,
        path,
        aiConfig,
      } = this.props;
      const innerHeight = DEFAULT_BOX_SIZE * numRows;
      const innerWidth = DEFAULT_BOX_SIZE * numCols;
      const ctx = prepareCanvas(this.snakeCanvas, innerWidth, innerHeight);

      drawGameFrame(
        ctx,
        {
          innerHeight,
          innerWidth,
          snake,
          food,
          path,
          showPath: aiConfig.showPath,
          boxSize: DEFAULT_BOX_SIZE,
          snakeColor: techTheme.nodeJs.style.background,
          pathColor: techTheme.react.style.background,
        },
        timestamp,
      );
    };

    this.animationFrame = requestAnimationFrame(draw);
  }

  render() {
    const {
      game: { state, score, frameCount, fps, frameTimeout, perfectScore, numRows, numCols },
      highScores,
      snake,
    } = this.props;
    const innerHeight = DEFAULT_BOX_SIZE * numRows;
    const innerWidth = DEFAULT_BOX_SIZE * numCols;
    const boardCells = numRows * numCols;
    const occupancy = normalise(snake.parts.length, 0, boardCells);
    const metrics = [
      {
        accent: '#8fc160',
        icon: <MdLocalPizza />,
        label: 'Score',
        meta: `${perfectScore - score} remaining`,
        progress: normalise(score, 0, perfectScore),
        value: score.toLocaleString(),
      },
      {
        accent: '#61dafb',
        icon: <MdGridOn />,
        label: 'Board occupancy',
        meta: `${snake.parts.length} of ${boardCells} cells`,
        progress: occupancy,
        value: `${occupancy.toFixed(1)}%`,
      },
      {
        accent: '#b497ff',
        icon: <MdTimer />,
        label: 'Frame',
        meta: `Limit ${frameTimeout.toLocaleString()}`,
        progress: normalise(frameCount, 0, frameTimeout),
        value: frameCount.toLocaleString(),
      },
      {
        accent: '#ffcc66',
        icon: <MdMemory />,
        label: 'Engine',
        meta: state === PLAYING ? 'Simulation running' : state.replace('_', ' ').toLowerCase(),
        progress: null,
        value: `${fps.toLocaleString()} FPS`,
      },
    ];

    return (
      <Root className={classes.root}>
        <SnakeNav />
        <Box className={classes.hero}>
          <Box sx={{ maxWidth: 760 }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.16em' }} variant="overline">
              404 — page not found
            </Typography>
            <Typography sx={{ fontSize: { xs: '2rem', md: '3rem' }, letterSpacing: '-0.035em', mt: 0.25 }} variant="h3">
              A self-playing snake, instead.
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.95rem', md: '1.05rem' }, mt: 1 }}>
              The page you wanted doesn&rsquo;t exist, so here&rsquo;s a snake that plays itself. Pick a pathfinding
              algorithm from Controls and watch how it trades safety against speed.
            </Typography>
          </Box>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(143, 193, 96, 0.08)',
                border: '1px solid rgba(143, 193, 96, 0.2)',
                borderRadius: 999,
                display: 'flex',
                gap: 1,
                px: 1.5,
                py: 0.75,
              }}
            >
              <Box
                sx={{
                  backgroundColor: state === PLAYING ? 'primary.main' : 'text.secondary',
                  borderRadius: '50%',
                  boxShadow: state === PLAYING ? '0 0 10px rgba(143, 193, 96, 0.8)' : 'none',
                  height: 7,
                  width: 7,
                }}
              />
              <Typography sx={{ fontWeight: 700, letterSpacing: '0.08em' }} variant="caption">
                {state.replace('_', ' ')}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 999,
                px: 1.5,
                py: 0.75,
              }}
            >
              <Typography sx={{ color: 'text.secondary', fontWeight: 700 }} variant="caption">
                {numCols} × {numRows} BOARD
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Paper className={classes.boardShell} elevation={0}>
          <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', px: 0.75, pb: 1.25 }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.12em' }} variant="caption">
              BOARD
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)' }} variant="caption">
              {innerWidth} × {innerHeight}px
            </Typography>
          </Box>
          <Box className={classes.canvasContainer}>
            {/* eslint-disable-next-line no-return-assign */}
            <canvas ref={r => (this.snakeCanvas = r)} width={innerWidth} height={innerHeight} />
            <GameOutcomeOverlay state={state} score={score} perfectScore={perfectScore} />
          </Box>
        </Paper>

        <Box className={classes.telemetry}>
          {metrics.map(metric => (
            <Paper className={classes.metricCard} elevation={0} key={metric.label}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.25 }}>
                <Box
                  sx={{
                    alignItems: 'center',
                    backgroundColor: `${metric.accent}18`,
                    border: `1px solid ${metric.accent}35`,
                    borderRadius: 1.5,
                    color: metric.accent,
                    display: 'flex',
                    fontSize: '1.25rem',
                    height: 38,
                    justifyContent: 'center',
                    width: 38,
                  }}
                >
                  {metric.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.2 }} variant="caption">
                    {metric.label}
                  </Typography>
                  <Typography noWrap sx={{ fontWeight: 800, lineHeight: 1.2 }} variant="h6">
                    {metric.value}
                  </Typography>
                </Box>
              </Box>
              <Typography noWrap sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 1.5 }} variant="caption">
                {metric.meta}
              </Typography>
              {metric.progress !== null && (
                <LinearProgress
                  className={classes.progress}
                  sx={{ '& .MuiLinearProgress-bar': { backgroundColor: metric.accent } }}
                  value={metric.progress}
                  variant="determinate"
                />
              )}
            </Paper>
          ))}
        </Box>

        <AlgorithmTradeoffs />

        <Scoreboard scores={highScores} />
      </Root>
    );
  }
}
SnakeGame.propTypes = {
  // state
  innerHeight: PropTypes.number.isRequired,
  innerWidth: PropTypes.number.isRequired,
  /* eslint-disable react/no-unused-prop-types */
  /* eslint-disable react/forbid-prop-types */
  // todo better proptypes here
  snake: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
  aiConfig: PropTypes.object.isRequired,
  highScores: PropTypes.arrayOf(Object).isRequired,
  food: PropTypes.arrayOf(Object).isRequired,
  path: PropTypes.arrayOf(Object).isRequired,
  // dispatches
  setSize: PropTypes.func.isRequired,
  play: PropTypes.func.isRequired,
  changeDirection: PropTypes.func.isRequired,
  gameOver: PropTypes.func.isRequired,
  /* eslint-enable react/no-unused-prop-types */
  /* eslint-enable react/forbid-prop-types */
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      play,
      setSize,
      changeDirection,
      gameOver,
    },
    dispatch,
  );

const mapStateToProps = state => ({
  ...state.game,
  ...state.pathFinding,
  aiConfig: state.aiConfig,
});

const decorators = flow([connect(mapStateToProps, mapDispatchToProps), withWindowSize]);

export default decorators(SnakeGame);
