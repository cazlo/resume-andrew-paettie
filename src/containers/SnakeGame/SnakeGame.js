import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import flow from 'lodash/flow';
import * as PropTypes from 'prop-types';

import Chip from '@material-ui/core/Chip/Chip';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Grid from '@material-ui/core/Grid';

import withWindowSize from '../../components/Home/GridBackground/withWindowSize';
import GridCell from './GridCell';
import Scoreboard from './Scoreboard';

import './SnakeGame.css';
import ConfigDialog from './ConfigDialog';
import { bindActionCreators } from 'redux';
import { play, setSize, changeDirection } from './actions/gameAction';
import Paper from '@material-ui/core/Paper/Paper';
import { LEFT, RIGHT, DOWN, UP } from './util/Direction';
import { DEFAULT_BOARD_SIZE, DEFAULT_BOX_SIZE } from './util/Grid';

const inputDirection = (keyCode, changeDirectionFn) => {
  switch (keyCode) {
    case 37:
      changeDirectionFn(LEFT);
      break;
    case 38:
      changeDirectionFn(UP);
      break;
    case 39:
      changeDirectionFn(RIGHT);
      break;
    case 40:
      changeDirectionFn(DOWN);
      break;
    default:
      break;
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
    this.gridRef.focus();
  }
  // componentDidUpdate(nextProps) {
  //   if (
  //     this.props.innerHeight !== nextProps.innerHeight ||
  //     this.props.innerWidth !== nextProps.innerWidth
  //   ) {
  //     const { innerHeight, innerWidth } = this.props;
      // const innerHeight = 800, innerWidth = 800;
      // - set numcols/numrows
      // const numCols = Math.floor(innerWidth / BOX_SIZE);
      // const numRows = Math.floor(innerHeight / BOX_SIZE);
      // const boardArea = numCols * numRows;
      // todo handle/dispatch resize event
    // }
  // }



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
            <Paper>
            <div className="grid" style={style}
                 ref={(r) => { this.gridRef = r; }}
                 onKeyDown={(e) => inputDirection(e.keyCode, this.props.changeDirection)}
            >
              {/*{this.renderGameCells()}*/}
              {_.map(this.props.food || [], (f, idx) =>
                <GridCell
                  foodCell={f}
                  size={DEFAULT_BOX_SIZE}
                  key={`food-${idx}-x${f.x}-y${f.y}`}
                  x={f.x}
                  y={f.y}
                />)}
              {_.map(this.props.snake ? this.props.snake.parts : [], (s, idx) =>
                <GridCell
                  snakeCell={s}
                  size={DEFAULT_BOX_SIZE}
                  key={`snake-${idx}-x${s.x}-y${s.y}`}
                  x={s.x}
                  y={s.y}
                />)}
              {_.map(this.props.path ? this.props.path : [], (p, idx) =>
                <GridCell
                  pathCell={p}
                  size={DEFAULT_BOX_SIZE}
                  key={`path-${idx}-x${p.x}-y${p.y}`}
                  x={p.x}
                  y={p.y}
                />)}
            </div>
            </Paper>
          </Grid>

          <Grid item xs>
            <Chip label="Score" avatar={<Avatar>{this.props.game.score}</Avatar>} color="primary" />
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
