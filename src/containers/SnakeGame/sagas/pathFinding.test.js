import { pathfind, moveFromPath } from './pathFindingSagas';
import Position from '../util/Position';
import Direction from '../util/Direction';
import Action from '../actions/Action';
const p = Position;// alias because 'Position' it is long

describe('Path finding wrap behavior',() => {
  it('does not choose wrap path when it is obstructed', () => {
    // does not try and wrap around when that move is blocked by the snake itself
    const snake = {parts:[p(2,0), p(1,0), p(0,0)]};
    const food = p(0,1);
    const path = pathfind(snake, food, 3, 2);
    expect(path).toBeDefined();
    expect(path.length).toBe(2);
    expect(path[0]).toEqual(expect.objectContaining(p(2,1)));
    expect(path[1]).toEqual(expect.objectContaining(food));
  });

  it('chooses wrapped path when available and optimal path', () => {
    // chooses the path which wraps around the world when it is the optimal path
    const snake = {parts:[p(3,0), p(2,0)]};
    const food = p(0,1);
    const path = pathfind(snake, food, 4, 2);
    expect(path).toBeDefined();
    expect(path.length).toBe(2);
    const possibleNextMoves = [p(3,1), p(0,0)]; // either of these would be equally optimal
    expect(possibleNextMoves).toContainEqual(expect.objectContaining(path[0]));
    expect(path[1]).toEqual(expect.objectContaining(food));
  });

  it('chooses non-wrapped path when optimal over wrapped path', () => {
    // this should also make sure the distance metrics are not getting screwed by the wrapping
    // because it didn't work until that got fixed...
    const snake = {parts:[p(3,0), p(2,0)]};
    const food = p(2,1);
    const path = pathfind(snake, food, 4, 2);
    expect(path).toBeDefined();
    expect(path.length).toBe(2);
    expect(path[0]).toEqual(expect.objectContaining(p(3,1)));
    expect(path[1]).toEqual(expect.objectContaining(food));
  });
});

describe('Direction changing behavior', () => {
  it ('moves toward the other side of the world', () => {
    const path = [p(0,0), p(19,0)];
    const snake = [p(1,0)];
    const snakeDirection = Direction.LEFT;
    const moveCommand = moveFromPath(path, snake, snakeDirection, 20, 20).next();
    expect(moveCommand).toBeDefined();
    const action = moveCommand.value.PUT.action;
    expect(action).toBeDefined();
    expect(action.type).toEqual(Action.CHANGE_DIRECTION);
    expect(action.direction).toEqual(Direction.LEFT);

  });
  it ('moves all the way to the other side of the world', () => {
    const path = [p(19,0)];
    const snake = [p(0,0)];
    const snakeDirection = Direction.LEFT;
    const moveCommand = moveFromPath(path, snake, snakeDirection, 20, 20).next();
    expect(moveCommand).toBeDefined();
    const action = moveCommand.value.PUT.action;
    expect(action).toBeDefined();
    expect(action.type).toEqual(Action.CHANGE_DIRECTION);
    expect(action.direction).toEqual(Direction.LEFT);
  });
});