import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import flow from 'lodash/flow';
import * as PropTypes from 'prop-types';
import { MdLocalPizza, MdTimer } from "react-icons/md";

import Chip from '@material-ui/core/Chip/Chip';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';

import withWindowSize from './util/withWindowSize';
import Scoreboard from './Scoreboard';
import ConfigDialog from './ConfigPanel';
import { play, setSize, changeDirection, gameOver } from './actions/gameAction';
import { DEFAULT_BOARD_SIZE, DEFAULT_BOX_SIZE } from './util/Grid';
import { PLAYING } from './util/GameState';
import techTheme from '../../common/techTheme';

const styles = () => ({
  progress: {
    margin: '0.5em',
  },
  canvasContainer: {
    textAlign: "center"
  },
  root: {
    margin: "10px auto",
    width: "98%"
  }
});

const updateCanvas = (ctx, props) => {
  const { innerHeight,
    innerWidth,
    snake,
    food,
    path } = props;
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 1;// 0.2;
  // fill background with some alpha so that we get some transition between frames
  // e.g. with alpha 0.2, it takes approx 5 frames for a rectangle to completely dissapear
  // with alpha 1, the animation is not as smooth
  ctx.fillRect(0, 0, innerWidth, innerHeight);

  const [head, ...tail] = snake.parts;

  ctx.fillStyle = techTheme.spring.style.background;
  ctx.globalAlpha = 1;
  ctx.fillRect(head.x * DEFAULT_BOX_SIZE * 0.99, head.y * DEFAULT_BOX_SIZE * 0.99, DEFAULT_BOX_SIZE, DEFAULT_BOX_SIZE);
  // todo head direction vector arrow?

  for(let i = 0; i < tail.length; i+=1){
    ctx.fillStyle = i === tail.length - 1
      ? "#fcda7c"
      : techTheme.nodeJs.style.background;
    ctx.globalAlpha =  (snake.parts.length - i) / snake.parts.length / 2 + .5;
    const t = tail[i];
    ctx.fillRect(t.x * DEFAULT_BOX_SIZE, t.y * DEFAULT_BOX_SIZE,
      DEFAULT_BOX_SIZE*((Math.max(98-(i*0.5), 30 ) )/100), DEFAULT_BOX_SIZE*((Math.max(98-(i*0.5), 30) )/100));
  }

  if (props.aiConfig.showPath) {
    ctx.fillStyle = techTheme.react.style.background;
    for (const i in path) {
      ctx.globalAlpha = (path.length - i) / path.length / 2;
      const p = path[i];
      ctx.fillRect(p.x * DEFAULT_BOX_SIZE, p.y * DEFAULT_BOX_SIZE, DEFAULT_BOX_SIZE, DEFAULT_BOX_SIZE);
    }
  }

  ctx.globalAlpha = 1;
  for (const f of food){
    ctx.fillStyle = f.style.background;
    ctx.beginPath();
    ctx.arc((f.x * DEFAULT_BOX_SIZE) + 0.5 * DEFAULT_BOX_SIZE,
      (f.y * DEFAULT_BOX_SIZE) + 0.5 * DEFAULT_BOX_SIZE,
      DEFAULT_BOX_SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

};

const normalise = (value, min, max) => (value - min) * 100 / (max - min);

class SnakeGame extends Component {

  componentDidMount() {
    const { innerHeight = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE, innerWidth = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE } = this.props;
    const numCols = Math.floor(innerWidth / DEFAULT_BOX_SIZE);
    const numRows = Math.floor(innerHeight / DEFAULT_BOX_SIZE);
    const innerHeightOverride = DEFAULT_BOX_SIZE * numRows;
    const innerWidthOverride = DEFAULT_BOX_SIZE * numCols;
    if (this.props.game.state === PLAYING) {
      this.props.gameOver();
    }
    this.props.setSize({numRows, numCols });
    this.props.play();
    const ctx = this.snakeCanvas.getContext('2d');
    requestAnimationFrame(() =>updateCanvas(ctx, {...this.props, innerHeight:innerHeightOverride, innerWidth:innerWidthOverride}));
  }
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { innerHeight = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE, innerWidth = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE } = this.props;
    if (innerHeight !== prevProps.innerHeight && innerWidth !== prevProps.innerWidth) {
      const numCols = Math.floor(innerWidth / DEFAULT_BOX_SIZE);
      const numRows = Math.floor(innerHeight / DEFAULT_BOX_SIZE);
      this.props.gameOver();
      this.props.setSize({ numRows, numCols });
      this.props.play();
      const innerHeightOverride = DEFAULT_BOX_SIZE * numRows;
      const innerWidthOverride = DEFAULT_BOX_SIZE * numCols;
      const ctx = this.snakeCanvas.getContext('2d');
      requestAnimationFrame(() => updateCanvas(ctx, {...this.props, innerHeight:innerHeightOverride, innerWidth:innerWidthOverride}));
    }else{
      const { numRows, numCols } = this.props.game;
      const innerHeightOverride = DEFAULT_BOX_SIZE * numRows;
      const innerWidthOverride = DEFAULT_BOX_SIZE * numCols;
      const ctx = this.snakeCanvas.getContext('2d');
      requestAnimationFrame(() => updateCanvas(ctx, {...this.props, innerHeight:innerHeightOverride, innerWidth:innerWidthOverride}));
    }

  }

  render(){
    const { classes } = this.props;
    const { score, frameCount, fps, frameTimeout, perfectScore, numRows, numCols } = this.props.game;
    const innerHeight = DEFAULT_BOX_SIZE * numRows;
    const innerWidth = DEFAULT_BOX_SIZE * numCols;
    return (
      <div
        className={classes.root}
        role="presentation"
        // style={style}
      >
        <Grid container spacing={8}>
          <Grid item xs={12} className={classes.canvasContainer}>
            <canvas ref={(r) => this.snakeCanvas = r} width={innerWidth} height={innerHeight} />
          </Grid>
          <Grid item xs={6}>
            <Grid container direction={'column'}>
              <Grid item xs={12}>
                <Grid container direction={'row'}>
                  <Grid item xs={8}>
                    <Chip label={`Score: ${score}`} avatar={<Avatar><MdLocalPizza/></Avatar>} color="primary" />
                  </Grid>
                  <Grid item xs={2}>
                    <Hidden xsDown>
                    <Chip label={`Max Score: ${perfectScore}`} color="primary" />
                    </Hidden>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <LinearProgress variant="determinate" value={normalise(score, 0, perfectScore)} className={classes.progress} color="primary"/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction={'column'}>
              <Grid item xs={12}>
                <Grid container direction={'row'}>
                  <Grid item xs={6} >
                    <Chip label={`Frame #: ${frameCount}`} avatar={<Avatar><MdTimer/></Avatar>} color="secondary" />
                  </Grid>
                  <Hidden xsDown>
                    <Grid item sm={2}>
                      <Chip label={`FPS: ${fps}`} color="secondary" />
                    </Grid>
                  </Hidden>
                  <Hidden smDown>
                    <Grid item md={4}>
                        <Chip label={`Max Frames: ${frameTimeout.toFixed(0)}`} color="secondary" />
                    </Grid>
                  </Hidden>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <LinearProgress variant="determinate" value={normalise(frameCount, 0, frameTimeout)} className={classes.progress} color="secondary"/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <ConfigDialog/>
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper>
            <Scoreboard scores={this.props.highScores} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
SnakeGame.propTypes = {
  //state
  innerHeight: PropTypes.number,
  innerWidth: PropTypes.number,
  snake: PropTypes.object,
  game: PropTypes.object,
  aiConfig: PropTypes.object,
  highScores: PropTypes.arrayOf(Object),
  food: PropTypes.arrayOf(Object),
  path: PropTypes.arrayOf(Object),
  classes: PropTypes.object,
  //dispatches
  setSize: PropTypes.func,
  play: PropTypes.func,
  changeDirection: PropTypes.func,
  gameOver: PropTypes.func,
};

const mapDispatchToProps = dispatch =>  bindActionCreators({
  play, setSize, changeDirection, gameOver
}, dispatch);

const mapStateToProps = state => ({
  ...state.game,
  ...state.pathFinding,
  aiConfig: state.aiConfig
});

const decorators = flow([connect(mapStateToProps, mapDispatchToProps), withStyles(styles), withWindowSize]);

export default decorators(SnakeGame);
