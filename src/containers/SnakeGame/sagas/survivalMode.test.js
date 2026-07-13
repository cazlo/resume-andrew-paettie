import { survivalMode } from './pathFindingSagas';
import isLegalFirstMove from './pathFindingTestUtils';
import Position from '../util/Position';
import { DOWN, LEFT } from '../util/Direction';

const p = Position;

const directionFrom = effect => effect && effect.payload.action.direction;

describe('legal first move oracle', () => {
  const fatalBoard = { numRows: 4, numCols: 4, wallsAreFatal: true };
  const tail = p(1, 2);
  const uniqueTailSnake = {
    parts: [p(1, 1), p(2, 1), p(2, 0), p(1, 0), p(0, 0), p(0, 1), p(0, 2), tail],
  };

  it('accepts an adjacent unique tail that MOVE will remove', () => {
    expect(isLegalFirstMove(uniqueTailSnake, tail, fatalBoard)).toBe(true);
  });

  it('rejects an adjacent duplicated tail that remains after MOVE', () => {
    const duplicatedTailSnake = { parts: [...uniqueTailSnake.parts, tail] };

    expect(isLegalFirstMove(duplicatedTailSnake, tail, fatalBoard)).toBe(false);
  });

  it('accepts a legal move across a wrapped boundary', () => {
    const wrappingBoard = { numRows: 3, numCols: 4, wallsAreFatal: false };

    expect(isLegalFirstMove({ parts: [p(0, 1), p(3, 1)] }, p(3, 1), wrappingBoard)).toBe(true);
  });

  it('rejects a non-adjacent open position', () => {
    expect(isLegalFirstMove(uniqueTailSnake, p(3, 3), fatalBoard)).toBe(false);
  });
});

describe('survival mode tail movement', () => {
  it('moves into a unique tail when it is the only legal exit', () => {
    const tail = p(1, 2);
    const snake = {
      parts: [p(1, 1), p(2, 1), p(2, 0), p(1, 0), p(0, 0), p(0, 1), p(0, 2), tail],
    };
    const board = { numRows: 4, numCols: 4, wallsAreFatal: true };

    expect(isLegalFirstMove(snake, tail, board)).toBe(true);
    expect(directionFrom(survivalMode(snake, board))).toEqual(DOWN);
  });

  it('rejects a duplicated tail when it is the only apparent exit', () => {
    const tail = p(1, 2);
    const snake = {
      parts: [p(1, 1), p(2, 1), p(2, 0), p(1, 0), p(0, 0), p(0, 1), p(0, 2), tail, tail],
    };
    const board = { numRows: 4, numCols: 4, wallsAreFatal: true };

    expect(isLegalFirstMove(snake, tail, board)).toBe(false);
    expect(survivalMode(snake, board)).toBeNull();
  });

  it('moves into a unique tail across a wrapped boundary', () => {
    const tail = p(3, 1);
    const snake = {
      parts: [p(0, 1), p(0, 2), p(1, 2), p(1, 1), p(1, 0), p(0, 0), p(3, 0), tail],
    };
    const board = { numRows: 3, numCols: 4, wallsAreFatal: false };

    expect(isLegalFirstMove(snake, tail, board)).toBe(true);
    expect(directionFrom(survivalMode(snake, board))).toEqual(LEFT);
  });

  it('rejects a duplicated tail across a wrapped boundary', () => {
    const tail = p(3, 1);
    const snake = {
      parts: [p(0, 1), p(0, 2), p(1, 2), p(1, 1), p(1, 0), p(0, 0), p(3, 0), tail, tail],
    };
    const board = { numRows: 3, numCols: 4, wallsAreFatal: false };

    expect(isLegalFirstMove(snake, tail, board)).toBe(false);
    expect(survivalMode(snake, board)).toBeNull();
  });

  it('preserves an ordinary open neighbor as a legal fallback', () => {
    const snake = {
      parts: [p(2, 2), p(1, 2), p(1, 1), p(2, 1), p(3, 1), p(3, 2), p(3, 3)],
    };
    const board = { numRows: 5, numCols: 5, wallsAreFatal: true };
    const openNeighbor = p(2, 3);

    expect(isLegalFirstMove(snake, openNeighbor, board)).toBe(true);
    expect(directionFrom(survivalMode(snake, board))).toEqual(DOWN);
  });
});
