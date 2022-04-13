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
import ConfigDialog from './ConfigPanel';
import { play, setSize, changeDirection, gameOver } from './actions/gameAction';
import GameGrid from './util/Grid';
import GameState from './util/GameState';
import techTheme from '../../common/techTheme';

const { DEFAULT_BOX_SIZE, DEFAULT_BOARD_SIZE } = GameGrid;
const { PLAYING } = GameState;

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
    textAlign: 'center',
  },

  [`&.${classes.root}`]: {
    margin: '10px auto',
    width: '98%',
  },
}));

const updateCanvas = (ctx, props) => {
  const { innerHeight, innerWidth, snake, food, path } = props;
  ctx.fillStyle = '#303030';
  ctx.globalAlpha = 0.42;
  // fill background with some alpha so that we get some transition between frames
  // e.g. with alpha 0.2, it takes approx 5 frames for a rectangle to completely dissapear
  // with alpha 1, the animation is not as smooth
  ctx.fillRect(0, 0, innerWidth, innerHeight);

  const [head, ...tail] = snake.parts;

  ctx.fillStyle = techTheme.nodeJs.style.background;
  ctx.globalAlpha = 1;
  ctx.fillRect(head.x * DEFAULT_BOX_SIZE, head.y * DEFAULT_BOX_SIZE, DEFAULT_BOX_SIZE, DEFAULT_BOX_SIZE);
  // todo head direction vector arrow?

  for (let i = 0; i < tail.length; i += 1) {
    ctx.fillStyle =
      /* i === tail.length - 1
      ? "#fcda7c"
      : */ techTheme.nodeJs.style.background;
    ctx.globalAlpha = (snake.parts.length - i) / snake.parts.length / 2 + 0.5;
    const t = tail[i];
    const scalingMultiplier = Math.max(99 - i * 0.42, 42) / 100;
    const centeringFactor = (DEFAULT_BOX_SIZE - DEFAULT_BOX_SIZE * scalingMultiplier) / 2;
    const x = t.x * DEFAULT_BOX_SIZE + centeringFactor;
    const y = t.y * DEFAULT_BOX_SIZE + centeringFactor;
    ctx.fillRect(x, y, DEFAULT_BOX_SIZE * scalingMultiplier, DEFAULT_BOX_SIZE * scalingMultiplier);
  }

  if (props.aiConfig.showPath) {
    ctx.fillStyle = techTheme.react.style.background;
    for (const [indexStr, point] of Object.entries(path)) {
      ctx.globalAlpha = (path.length - indexStr) / path.length / 2;
      ctx.fillRect(point.x * DEFAULT_BOX_SIZE, point.y * DEFAULT_BOX_SIZE, DEFAULT_BOX_SIZE, DEFAULT_BOX_SIZE);
    }
  }

  ctx.globalAlpha = 1;
  for (const f of food) {
    ctx.fillStyle = f.style.background;
    ctx.beginPath();
    ctx.arc(
      f.x * DEFAULT_BOX_SIZE + 0.5 * DEFAULT_BOX_SIZE,
      f.y * DEFAULT_BOX_SIZE + 0.5 * DEFAULT_BOX_SIZE,
      DEFAULT_BOX_SIZE / 2,
      0,
      2 * Math.PI,
    );
    ctx.fill();
  }
};

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
    const ctx = this.snakeCanvas.getContext('2d');
    requestAnimationFrame(() =>
      updateCanvas(ctx, {
        ...this.props,
        innerHeight: innerHeightOverride,
        innerWidth: innerWidthOverride,
      }),
    );
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

      const innerHeightOverride = DEFAULT_BOX_SIZE * numRows;
      const innerWidthOverride = DEFAULT_BOX_SIZE * numCols;
      const ctx = this.snakeCanvas.getContext('2d');
      requestAnimationFrame(() =>
        updateCanvas(ctx, {
          ...this.props,
          innerHeight: innerHeightOverride,
          innerWidth: innerWidthOverride,
        }),
      );
    } else {
      const {
        game: { numRows, numCols },
      } = this.props;
      const innerHeightOverride = DEFAULT_BOX_SIZE * numRows;
      const innerWidthOverride = DEFAULT_BOX_SIZE * numCols;
      const ctx = this.snakeCanvas.getContext('2d');
      requestAnimationFrame(() =>
        updateCanvas(ctx, {
          ...this.props,
          innerHeight: innerHeightOverride,
          innerWidth: innerWidthOverride,
        }),
      );
    }
  }

  render() {
    const {
      game: { score, frameCount, fps, frameTimeout, perfectScore, numRows, numCols },
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
        <Grid container spacing={8}>
          <Grid item xs={12} className={classes.canvasContainer}>
            {/* eslint-disable-next-line no-return-assign */}
            <canvas ref={r => (this.snakeCanvas = r)} width={innerWidth} height={innerHeight} />
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
          <Grid item xs={12}>
            <Paper>
              <ConfigDialog />
            </Paper>
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
  classes: PropTypes.object.isRequired,
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
