import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import flow from 'lodash/flow';
import * as PropTypes from 'prop-types';

import Chip from '@material-ui/core/Chip/Chip';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper/Paper';

import withWindowSize from '../../components/Home/GridBackground/withWindowSize';
import Scoreboard from './Scoreboard';

import './SnakeGame.css';
import ConfigDialog from './ConfigPanel';
import { play, setSize, changeDirection } from './actions/gameAction';
import { DEFAULT_BOARD_SIZE, DEFAULT_BOX_SIZE } from './util/Grid';
import techTheme from '../../common/techTheme';

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
      DEFAULT_BOX_SIZE*((Math.max(95 -i, 50) )/100), DEFAULT_BOX_SIZE*((Math.max(95 -i, 50) )/100));
  }


  ctx.fillStyle = techTheme.react.style.background;
  for(const i in path){
    ctx.globalAlpha =  (path.length - i) / path.length / 2;
    const p = path[i];
    ctx.fillRect(p.x*DEFAULT_BOX_SIZE, p.y*DEFAULT_BOX_SIZE, DEFAULT_BOX_SIZE, DEFAULT_BOX_SIZE);
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

class SnakeGame extends Component {
  constructor(props) {
    super(props);
    const { innerHeight = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE, innerWidth = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE } = this.props;

    const numCols = Math.floor(innerWidth / DEFAULT_BOX_SIZE);
    const numRows = Math.floor(innerHeight / DEFAULT_BOX_SIZE);
    this.props.setSize({numRows, numCols });

  }
  componentDidMount() {
    this.props.play();
    const ctx = this.snakeCanvas.getContext('2d');
    requestAnimationFrame(() =>updateCanvas(ctx, this.props));
  }
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const ctx = this.snakeCanvas.getContext('2d');
    requestAnimationFrame(() => updateCanvas(ctx, this.props));
    //todo handle/dispatch resize event
  }

  render(){
    const { innerHeight = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE, innerWidth = DEFAULT_BOX_SIZE * DEFAULT_BOARD_SIZE } = this.props;
    const style = { height: `${innerHeight}px`, width: `${innerWidth}px` };
    return (
      <div
        className="SnakeGame"
        // onKeyDown={this.inputDirection}
        role="presentation"
        tabIndex={-1}
        style={style}
      >
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <canvas ref={(r) => this.snakeCanvas = r} width={innerWidth} height={innerHeight} />
          </Grid>

          <Grid item xs>
            <Chip label="Score" avatar={<Avatar>{this.props.game.score}</Avatar>} color="primary" />
            <Chip label="Frame Count" avatar={<Avatar>{this.props.game.frameCount}</Avatar>} color="primary" />
            <Paper>
              <ConfigDialog/>
            </Paper>
          </Grid>
        </Grid>
        <Scoreboard scores={this.props.highScores} />
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
  highScores: PropTypes.arrayOf(Object),
  food: PropTypes.arrayOf(Object),
  path: PropTypes.arrayOf(Object),
  grid: PropTypes.arrayOf(Object),
  //dispatches
  setSize: PropTypes.func,
  play: PropTypes.func,
  changeDirection: PropTypes.func,
};

SnakeGame.defaultPropTypes = {
  innerHeight: 0,
  innerWidth: 0,
};

const mapDispatchToProps = dispatch =>  bindActionCreators({
  play, setSize, changeDirection
}, dispatch);

const mapStateToProps = state => ({
  ...state.game,
  ...state.pathFinding
});

const decorators = flow([connect(mapStateToProps, mapDispatchToProps), withWindowSize]);

export default decorators(SnakeGame);
