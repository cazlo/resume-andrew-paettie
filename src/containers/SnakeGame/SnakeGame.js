import React, { Component } from 'react';
import _ from 'lodash';
import flow from 'lodash/flow';
import * as PropTypes from 'prop-types';
import Easystarjs from 'easystarjs';
import moment from 'moment';

import Button from '@material-ui/core/Button/Button';
import Chip from '@material-ui/core/Chip/Chip';
import Avatar from '@material-ui/core/Avatar/Avatar';

import GridCell from './GridCell';
import Scoreboard from './Scoreboard';
import Direction from './util/Direction';
import Position from './util/Position';
import PositionUtil from './util/PositionUtil';
import Format from './util/Format';
import techTheme from '../../common/techTheme';
import withWindowSize from '../../components/Home/GridBackground/withWindowSize';

import './SnakeGame.css';
import GridState from './util/GridState';
import ConfigDialog from './ConfigDialog';

const NEW_GAME_TIMEOUT = 3000;
const FOOD_TIMEOUT = 7000;
const MOVE_SNAKE_TIMEOUT = 90;
const BOX_SIZE = 40; // pixels
const BOARD_SIZE = 20;

const INITIAL_STATE = {
  snake: [{ ...techTheme.java, ...Position(5, 5) }],
  food: { ...techTheme.nodeJs, ...Position(4, 2) },
  path: [],
  direction: Direction.RIGHT,
  score: 0,
  highScores: [],
  dialogOpen: false,
  playerName: 'SKYNET',
  enableAIChecked: true,
  enableAI: true,
  gameOver: false,
};

const FOOD_THEMES = _.keys(_.omit(techTheme, ['others', 'java']));

// eslint-disable-next-line new-cap
const aStar = new Easystarjs.js();

class SnakeGame extends Component {
  constructor(props) {
    super(props);
    const { innerHeight = BOX_SIZE * BOARD_SIZE, innerWidth = BOX_SIZE * BOARD_SIZE } = this.props;

    const numCols = Math.floor(innerWidth / BOX_SIZE);
    const numRows = Math.floor(innerHeight / BOX_SIZE);
    const boardArea = numCols * numRows;
    this.state = {
      ...INITIAL_STATE,
      innerHeight,
      innerWidth,
      numCols,
      numRows,
      highScores: [
        {
          score: boardArea - 1, // -1 because the head occupies 1 space
          name: 'Perfect score',
          time: Format.formatTime(moment(0).utc()),
          duration: Format.formatDuration(404),
        },
      ],
    };
    this.pathfindInstanceId = null;
    this.moveFood = this.moveFood.bind(this);
    this.checkIfAteFood = this.checkIfAteFood.bind(this);
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.moveSnake = this.moveSnake.bind(this);
    this.inputDirection = this.inputDirection.bind(this);
    this.removeTimers = this.removeTimers.bind(this);
    this.pathfind = this.pathfind.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
    this.closeAndSaveSettings = this.closeAndSaveSettings.bind(this);
    this.checkEnableAiToggled = this.checkEnableAiToggled.bind(this);
    this.clickDialogButton = this.clickDialogButton.bind(this);

    this.playerNameRef = React.createRef();
  }
  componentDidMount() {
    this.startGame();
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.innerHeight !== nextProps.innerHeight ||
      this.props.innerWidth !== nextProps.innerWidth
    ) {
      const { innerHeight, innerWidth } = this.props;
      // const innerHeight = 800, innerWidth = 800;
      // - set numcols/numrows
      const numCols = Math.floor(innerWidth / BOX_SIZE);
      const numRows = Math.floor(innerHeight / BOX_SIZE);
      const boardArea = numCols * numRows;
      // - re-start game
      this.removeTimers();
      this.restartGame();
      // - reset "Perfect Score"
      const state = {
        ...INITIAL_STATE,
        innerHeight,
        innerWidth,
        numCols,
        numRows,
        highScores: [
          {
            score: boardArea - 1, // -1 because the head occupies 1 space
            name: 'Perfect score',
            time: Format.formatTime(moment(0).utc()),
            duration: Format.formatDuration(404),
          },
        ],
      };
      this.setState(state);
    }
  }
  componentWillUnmount() {
    this.removeTimers();
  }

  checkIfAteFood(snake) {
    const { food } = this.state;
    if (food.x !== snake[0].x || food.y !== snake[0].y) {
      return false;
    }
    const lastSection = snake[snake.length - 1];

    const possibleNewPositions = [
      Position(lastSection.x - 1, lastSection.y),
      Position(lastSection.x, lastSection.y - 1),
      Position(lastSection.x + 1, lastSection.y),
      Position(lastSection.x, lastSection.y + 1),
    ];
    const newSection = possibleNewPositions.reduce((acc, position) => {
      if (acc) {
        return acc;
      }
      if (
        PositionUtil.isWithinPlayArea(position, this.state.numCols, this.state.numRows) &&
        !PositionUtil.isColliding(position, snake)
      ) {
        return { ...food, ...position };
        // absorb the food's style
      }
      return acc;
    }, null);
    const catSnake = snake.concat(newSection).slice(1);
    const newSnake = [];
    for (let i = catSnake.length - 1; i >= 0; i -= 1) {
      if (i === 0) {
        const catBlock = catSnake[i];
        newSnake.push({
          ...newSection,
          x: catBlock.x,
          y: catBlock.y,
        });
      } else {
        const catBlock = catSnake[i];
        const prevBlock = catSnake[i - 1] || {};
        newSnake.push({
          ...catBlock,
          ...prevBlock,
          x: catBlock.x,
          y: catBlock.y,
        });
      }
    }
    // newSnake.push(catSnake[0]);
    newSnake.reverse();
    const newAssembledSnake = [snake[0], ...newSnake];
    this.setState({
      snake: newAssembledSnake,
      score: this.state.score + 1,
    });
    this.moveFood();
    return true;
  }

  checkEnableAiToggled(event) {
    this.setState({ enableAIChecked: event.target.checked });
  }

  closeAndSaveSettings() {
    const playerName = this.playerNameRef.current;
    if (playerName && playerName.value) {
      this.setState({
        playerName: playerName.value,
      });
    }
    if (this.state.enableAI !== this.state.enableAIChecked) {
      this.setState({
        enableAI: this.state.enableAIChecked,
      });
      this.endGame();
    }
    this.closeSettings();
  }

  closeSettings() {
    this.setState({ dialogOpen: !this.state.dialogOpen, enableAIChecked: this.state.enableAI });
    if (this.state.gameOver) {
      this.restartGame();
    }
  }

  clickDialogButton() {
    if (this.restartGameTimeout) {
      clearTimeout(this.restartGameTimeout);
    }
    this.setState({ dialogOpen: !this.state.dialogOpen });
  }

  restartGame() {
    this.restartGameTimeout = setTimeout(() => {
      this.setState({
        ...INITIAL_STATE,
        highScores: this.state.highScores,
        enableAI: this.state.enableAI,
        enableAIChecked: this.state.enableAI,
        playerName: this.state.playerName,
      });
      this.startGame();
    }, NEW_GAME_TIMEOUT);
  }

  endGame() {
    const durationMillis = moment().valueOf() - this.state.startTime;
    const score = {
      score: this.state.score,
      name: this.state.playerName,
      time: Format.formatTime(moment()),
      duration: Format.formatDuration(durationMillis),
    };
    const orderedScores = _.orderBy([...this.state.highScores, score], ['score'], ['desc']);
    this.setState({
      highScores: orderedScores,
      gameOver: true,
    });

    if (this.pathfindInstanceId) {
      aStar.cancelPath(this.pathfindInstanceId);
    }
    this.removeTimers();
    this.restartGame();
  }

  inputDirection({ keyCode }) {
    if (this.state.snake.length === 1) {
      // if only head, do not restrict movements at all
      this.setState({ direction: keyCode });
      return true;
    }
    // if it's the same direction or simply reversing, ignore
    let changeDirection = true;
    [[Direction.UP, Direction.DOWN], [Direction.LEFT, Direction.RIGHT]].forEach(dir => {
      if (dir.includes(this.state.direction) && dir.includes(keyCode)) {
        changeDirection = false;
      }
    });

    if (changeDirection) {
      this.setState({ direction: keyCode });
      return true;
    }
    return false;
  }

  // randomly place snake food
  moveFood() {
    if (this.state.dialogOpen) {
      return;
    }
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout);
    let position = {};
    do {
      const x = _.random(1, this.state.numCols - 2);
      const y = _.random(1, this.state.numRows - 2);
      // don't put food along the very edge of the play surface
      position = Position(x, y);
    } while (PositionUtil.isColliding(position, this.state.snake));
    const theme = techTheme[FOOD_THEMES[_.random(0, FOOD_THEMES.length)]];
    this.setState({
      food: {
        ...this.state.food,
        ...theme,
        ...position,
      },
    });
    this.moveFoodTimeout = setTimeout(this.moveFood, FOOD_TIMEOUT);
  }

  moveSnake() {
    if (this.state.dialogOpen) {
      return;
    }
    const newSnake = [];
    // set in the new "head" of the snake
    const snakeHead = this.state.snake[0];
    switch (this.state.direction) {
      case Direction.DOWN:
        newSnake[0] = { ...snakeHead, y: snakeHead.y + 1 };
        break;
      case Direction.UP:
        newSnake[0] = { ...snakeHead, y: snakeHead.y - 1 };
        break;
      case Direction.RIGHT:
        newSnake[0] = { ...snakeHead, x: snakeHead.x + 1 };
        break;
      case Direction.LEFT:
        newSnake[0] = { ...snakeHead, x: snakeHead.x - 1 };
        break;
      default:
        break;
    }
    // now shift each "body" segment to the previous segment's position
    [].push.apply(
      newSnake,
      this.state.snake.slice(1).map((s, i) => {
        // since we're starting from the second item in the list,
        // just use the index, which will refer to the previous item
        // in the original list
        const movedState = this.state.snake[i];
        const previousState = this.state.snake[i + 1];
        if (previousState) {
          return {
            ...movedState,
            style: previousState.style,
            icon: previousState.icon,
          };
        }
        return movedState;
      }),
    );

    this.setState({ snake: newSnake });
    this.checkIfAteFood(newSnake);
    if (
      !PositionUtil.isWithinPlayArea(newSnake[0], this.state.numCols, this.state.numRows) ||
      PositionUtil.ateItself(newSnake)
    ) {
      this.endGame();
    } else if (this.state.enableAI) {
      this.pathfind(newSnake);
    }
  }

  moveFromPath(path, head) {
    if (!path) {
      return false;
    }
    const firstMove = path[1] || path[0]; // idx 0 is usually the current node the snake is on
    let directionToMove = null;
    if (firstMove.x !== head.x) {
      if (firstMove.x < head.x) {
        directionToMove = Direction.LEFT;
      } else {
        directionToMove = Direction.RIGHT;
      }
    } else if (firstMove.y !== head.y) {
      if (firstMove.y < head.y) {
        directionToMove = Direction.UP;
      } else {
        directionToMove = Direction.DOWN;
      }
    }
    if (directionToMove) {
      // console.debug(`Ramdom fallback successful to (${randomX}, ${randomY})`);
      this.inputDirection({ keyCode: directionToMove });
      return true;
    }
    // console.warn('Path is noop somehow');
    return false;
  }

  pathfind(newSnake) {
    if (!newSnake[0]) {
      return;
    }
    const head = newSnake[0];
    if (this.state.path && this.state.path.length && this.state.path.length > 1) {
      // if there is already a path, dispatch that move now, to avoid a potentially costly wait for
      // pathfinding re-calculation to occur
      this.moveFromPath(this.state.path, head);
    }
    const grid = _.map(_.range(this.state.numRows), () =>
      _.map(_.range(this.state.numCols), () => GridState.WALKABLE),
    );
    const newGrid = _.reduce(
      newSnake,
      (accGrid, snake) => {
        const cloned = _.map(accGrid, _.clone);
        cloned[snake.y][snake.x] = GridState.OBSTRUCTED;
        return PositionUtil.createSurroundingNodes(snake.x, snake.y, cloned);
      },
      grid,
    );
    aStar.setGrid(newGrid);
    const allowedStates = [GridState.WALKABLE, GridState.WALKABLE_PENALTY];
    aStar.setAcceptableTiles(allowedStates);
    aStar.setTileCost(GridState.WALKABLE_PENALTY, 5);
    this.pathfindInstanceId = aStar.findPath(
      head.x,
      head.y,
      this.state.food.x,
      this.state.food.y,
      path => {
        if (path === null || !path.length) {
          this.moveFood();
          this.setState({ path: [] });
          // if there is no path available, try and calculate one to a random point as a last
          // ditch effort

          let randomX;
          let randomY;
          do {
            randomX = _.random(1, this.state.numCols - 1);
            randomY = _.random(1, this.state.numRows - 1);
          } while (!allowedStates.includes(grid[randomY][randomX]));
          this.pathfindInstanceId = aStar.findPath(head.x, head.y, randomX, randomY, newPath => {
            if (newPath === null || !newPath.length) {
              // console.debug(`Ramdom fallback failed to (${randomX}, ${randomY})`);
            } else {
              this.setState({ path: newPath.slice(1, newPath.length - 1) });
              this.moveFromPath(path, head);
            }
          });
          aStar.calculate();
        } else {
          this.setState({ path: path.slice(1, path.length - 1) });
          this.moveFromPath(path, head);
        }
      },
    );
    aStar.calculate();
  }

  startGame() {
    this.setState({
      startTime: moment().valueOf(),
    });
    this.removeTimers();
    this.moveSnakeInterval = setInterval(this.moveSnake, MOVE_SNAKE_TIMEOUT);
    this.moveFood();
  }

  removeTimers() {
    if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout);
    if (this.restartGameTimeout) clearTimeout(this.restartGameTimeout);
  }

  renderGameCells() {
    return _.map(_.range(this.state.numRows), y =>
      _.map(_.range(this.state.numCols), x => {
        const foodCell =
          this.state.food.x === x && this.state.food.y === y ? this.state.food : false;
        const snakeCells = this.state.snake.filter(s => s.x === x && s.y === y);
        const snakeCell = snakeCells.length && snakeCells[0] ? snakeCells[0] : false;
        const pathCells = this.state.path.filter(s => s.x === x && s.y === y);
        const pathCell =
          pathCells.length && pathCells[0]
            ? { ...pathCells[0], style: techTheme.slack.style }
            : false;

        return (
          <GridCell
            foodCell={foodCell}
            snakeCell={snakeCell}
            pathCell={pathCell}
            size={BOX_SIZE}
            key={`${x} ${y}`}
          />
        );
      }),
    );
  }

  render() {
    const { innerHeight, innerWidth } = this.state;
    const style = { height: `${innerHeight}px`, width: `${innerWidth}px` };
    return (
      <div
        className="SnakeGame"
        onKeyDown={this.inputDirection}
        role="presentation"
        tabIndex={-1}
        style={style}
      >
        <Chip label="Score" avatar={<Avatar>{this.state.score}</Avatar>} color="primary" />
        <div className="grid" style={style}>
          {this.renderGameCells()}
        </div>
        <Button onClick={this.clickDialogButton}>Configure Snake</Button>
        <ConfigDialog
          dialogOpen={this.state.dialogOpen}
          enableAIChecked={this.state.enableAIChecked}
          playerName={this.state.playerName}
          playerNameRef={this.playerNameRef}
          checkEnableAiToggled={this.checkEnableAiToggled}
          closeSettings={this.closeSettings}
          closeAndSaveSettings={this.closeAndSaveSettings}
        />
        <Scoreboard scores={this.state.highScores} />
      </div>
    );
  }
}
SnakeGame.propTypes = {
  innerHeight: PropTypes.number,
  innerWidth: PropTypes.number,
};

SnakeGame.defaultPropTypes = {
  innerHeight: 0,
  innerWidth: 0,
};

const decorators = flow([withWindowSize]);

export default decorators(SnakeGame);
