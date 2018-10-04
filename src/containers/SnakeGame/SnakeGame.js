import React, { Component } from 'react';
import _ from 'lodash';
import flow from 'lodash/flow';
import * as PropTypes from 'prop-types';

import GridCell from './GridCell';
import Direction from './util/Direction';
import Position from './util/Position';
import techTheme from '../../common/techTheme';
import withWindowSize from '../../components/Home/GridBackground/withWindowSize';

import './SnakeGame.css';

const FOOD_TIMEOUT = 7000;
const MOVE_SNAKE_TIMEOUT = 130;
const BOX_SIZE = 40;

const INITIAL_STATE = {
  snake: [{ ...techTheme.java, ...Position(5, 5) }],
  food: { ...techTheme.nodeJs, ...Position(4, 2) },
  direction: Direction.RIGHT,
};

const FOOD_THEMES = _.keys(_.omit(techTheme, ['others', 'java']));

class SnakeGame extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.isWithinPlayArea = this.isWithinPlayArea.bind(this);
    this.moveFood = this.moveFood.bind(this);
    this.checkIfAteFood = this.checkIfAteFood.bind(this);
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.moveSnake = this.moveSnake.bind(this);
    this.ateItself = this.ateItself.bind(this);
    this.inputDirection = this.inputDirection.bind(this);
    this.removeTimers = this.removeTimers.bind(this);
  }
  componentDidMount() {
    this.startGame();
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

    let newSection;
    const possibleNewPositions = [
      Position(lastSection.x - 1, lastSection.y),
      Position(lastSection.x, lastSection.y - 1),
      Position(lastSection.x + 1, lastSection.y),
      Position(lastSection.x, lastSection.y + 1),
    ];
    for (const position of possibleNewPositions) {
      if (this.isWithinPlayArea(position) && !this.isColliding(position, snake)) {
        newSection = { ...food, ...position };
        // absorb the food's style
      }
    }

    this.setState({
      snake: snake.concat(newSection),
    });
    this.moveFood();
    return true;
  }

  endGame() {
    this.setState(INITIAL_STATE);
    this.startGame();
  }

  isColliding(position, snake) {
    for (const snakeLocation of snake) {
      if (this.isSamePosition(snakeLocation, position)) {
        return true;
      }
    }
    return false;
  }

  isSamePosition(position1, position2) {
    return position1.x === position2.x && position1.y === position2.y;
  }

  // is the cell's position inside the grid?
  isWithinPlayArea(cell) {
    return cell.x > -1 && cell.y > -1 && cell.x < this.numCols && cell.y < this.numRows;
  }

  // todo this implementation is terrible
  inputDirection({ keyCode }) {
    // if it's the same direction or simply reversing, ignore
    let changeDirection = true;
    [[38, 40], [37, 39]].forEach(dir => {
      if (dir.indexOf(this.state.direction) > -1 && dir.indexOf(keyCode) > -1) {
        changeDirection = false;
      }
    });

    if (changeDirection) this.setState({ direction: keyCode });
  }

  // randomly place snake food
  moveFood() {
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout);
    const x = parseInt(Math.random() * this.numCols, 10);
    const y = parseInt(Math.random() * this.numRows, 10);
    // todo check for collision with snake and reset if so
    const theme = techTheme[FOOD_THEMES[_.random(0, FOOD_THEMES.length)]];
    this.setState({
      food: {
        ...this.state.food,
        ...theme,
        ...Position(x, y),
      },
    });
    this.moveFoodTimeout = setTimeout(this.moveFood, FOOD_TIMEOUT);
  }

  moveSnake() {
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
    if (!this.isWithinPlayArea(newSnake[0]) || this.ateItself(newSnake)) {
      this.endGame();
    }
  }

  ateItself(snake) {
    const head = snake[0];
    for (const bodyPiece of snake.slice(1)) {
      if (this.isSamePosition(head, bodyPiece)) {
        return true;
      }
    }
    return false;
  }

  startGame() {
    this.removeTimers();
    this.moveSnakeInterval = setInterval(this.moveSnake, MOVE_SNAKE_TIMEOUT);
    this.moveFood();

    // this.setState({
    //   snake: [[5, 5]],
    //   food: [10, 10],
    // });
    // need to focus so keydown listener will work!
    // this.el.focus();
  }

  removeTimers() {
    if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout);
  }

  render({ innerHeight, innerWidth } = this.props) {
    // each cell should be approximately 15px wide, so calculate how many we need
    this.numCols = Math.floor(innerWidth / BOX_SIZE);
    this.numRows = Math.floor(innerHeight / BOX_SIZE);

    // const cellSize = Math.floor(size / numCells);
    // const cellIndexes = Array.from(Array(numCells).keys());
    const cells = _.map(_.range(this.numRows), y =>
      _.map(_.range(this.numCols), x => {
        const foodCell =
          this.state.food.x === x && this.state.food.y === y ? this.state.food : false;
        const snakeCells = this.state.snake.filter(s => s.x === x && s.y === y);
        const snakeCell = snakeCells.length && snakeCells[0] ? snakeCells[0] : false;

        return (
          <GridCell foodCell={foodCell} snakeCell={snakeCell} size={BOX_SIZE} key={`${x} ${y}`} />
        );
      }),
    );

    return (
      <div
        className="SnakeGame"
        onKeyDown={this.inputDirection}
        role="presentation"
        style={{
          width: `${innerWidth}px`,
          height: `${innerHeight}px`,
        }}
        // ref={el => (this.el = el)}
        tabIndex={-1}
      >
        <div
          className="grid"
          style={{
            width: `${innerWidth}px`,
            height: `${innerHeight}px`,
          }}
        >
          {cells}
        </div>
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
