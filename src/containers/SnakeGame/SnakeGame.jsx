import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import flow from 'lodash/flow';
import * as PropTypes from 'prop-types';
import { MdLocalPizza, MdTimer } from 'react-icons/md';

import Chip from '@mui/material/Chip/Chip';
import Avatar from '@mui/material/Avatar/Avatar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Hidden from '@mui/material/Hidden';

import withWindowSize from './util/withWindowSize';
import Scoreboard from './Scoreboard';
import { play, setSize, changeDirection, gameOver } from './actions/gameAction';
import GameGrid from './util/Grid';
import GameState from './util/GameState';
import techTheme from '../../common/techTheme';
import SnakeNav from './SnakeNav';
import { drawGameFrame, prepareCanvas } from './snakeCanvasRenderer';
import GameOutcomeOverlay from './GameOutcomeOverlay';

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
  root: `${PREFIX}-root`,
};

const Root = styled('div')(() => ({
  [`& .${classes.progress}`]: {
    margin: '0.5em',
  },

  [`& .${classes.canvasContainer}`]: {
    position: 'relative',
    textAlign: 'center',

    '& canvas': {
      border: '1px solid rgba(143, 193, 96, 0.2)',
      borderRadius: '12px',
      boxShadow: '0 14px 36px rgba(0, 0, 0, 0.28)',
      display: 'block',
      margin: '0 auto',
      maxWidth: '100%',
    },
  },

  [`&.${classes.root}`]: {
    margin: '3em auto',
    width: '98%',
  },
}));

const normalise = (value, min, max) => ((value - min) * 100) / (max - min);

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
    } = this.props;
    const innerHeight = DEFAULT_BOX_SIZE * numRows;
    const innerWidth = DEFAULT_BOX_SIZE * numCols;
    return (
      <Root
        className={classes.root}
        role="presentation"
        // style={style}
      >
        <SnakeNav />
        <Grid container spacing={8}>
          <Grid item xs={12} className={classes.canvasContainer}>
            {/* eslint-disable-next-line no-return-assign */}
            <canvas ref={r => (this.snakeCanvas = r)} width={innerWidth} height={innerHeight} />
            <GameOutcomeOverlay state={state} score={score} perfectScore={perfectScore} />
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="column">
              <Grid item xs={12}>
                <Grid container direction="row">
                  <Grid item xs={8}>
                    <Chip
                      label={`Score: ${score}`}
                      avatar={
                        <Avatar>
                          <MdLocalPizza />
                        </Avatar>
                      }
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Hidden smDown>
                      <Chip label={`Max Score: ${perfectScore}`} color="primary" />
                    </Hidden>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <LinearProgress
                  variant="determinate"
                  value={normalise(score, 0, perfectScore)}
                  className={classes.progress}
                  color="primary"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="column">
              <Grid item xs={12}>
                <Grid container direction="row">
                  <Grid item xs={6}>
                    <Chip
                      label={`Frame #: ${frameCount}`}
                      avatar={
                        <Avatar>
                          <MdTimer />
                        </Avatar>
                      }
                      color="secondary"
                    />
                  </Grid>
                  <Hidden smDown>
                    <Grid item sm={2}>
                      <Chip label={`FPS: ${fps}`} color="secondary" />
                    </Grid>
                  </Hidden>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <LinearProgress
                  variant="determinate"
                  value={normalise(frameCount, 0, frameTimeout)}
                  className={classes.progress}
                  color="secondary"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Paper>
              <Scoreboard scores={highScores} />
            </Paper>
          </Grid>
        </Grid>
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
