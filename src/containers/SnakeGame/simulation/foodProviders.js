import PositionUtil from '../util/PositionUtil';

export const enumerateLegalFoodPositions = ({ board: { numRows, numCols }, snake }) => {
  const positions = [];
  for (let y = 0; y < numRows; y += 1) {
    for (let x = 0; x < numCols; x += 1) {
      const position = { x, y };
      if (!PositionUtil.isColliding(position, snake.parts)) {
        positions.push(position);
      }
    }
  }
  return positions;
};

const findLegalPosition = (position, state) =>
  enumerateLegalFoodPositions(state).find(candidate => PositionUtil.isSamePosition(candidate, position));

export const createFixedFoodProvider = positions => ({
  initialState: { index: 0 },
  next: ({ state, providerState = { index: 0 } }) => {
    const food = positions[providerState.index];
    if (!food) {
      return { food: null, providerState };
    }
    const legalFood = findLegalPosition(food, state);
    if (!legalFood) {
      throw new Error(`Fixed food trace position (${food.x},${food.y}) is not an unoccupied board cell`);
    }
    return {
      food: { x: legalFood.x, y: legalFood.y },
      providerState: { index: providerState.index + 1 },
    };
  },
});

const UINT32_RANGE = 4294967296;
const normalizeSeed = seed => ((Math.trunc(seed) % UINT32_RANGE) + UINT32_RANGE) % UINT32_RANGE;
const nextSeed = seed => normalizeSeed(Math.imul(1664525, seed) + 1013904223);

export const createSeededFoodProvider = seed => ({
  initialState: { seed: normalizeSeed(seed) },
  next: ({ state, providerState = { seed: normalizeSeed(seed) } }) => {
    const positions = enumerateLegalFoodPositions(state);
    if (!positions.length) {
      return { food: null, providerState };
    }
    const updatedSeed = nextSeed(providerState.seed);
    return {
      food: positions[updatedSeed % positions.length],
      providerState: { seed: updatedSeed },
    };
  },
});

const boardDistance = (position, { state }) => {
  const [head] = state.snake.parts;
  const { numRows, numCols, wallsAreFatal } = state.board;
  const xDistance = Math.abs(position.x - head.x);
  const yDistance = Math.abs(position.y - head.y);
  return wallsAreFatal
    ? xDistance + yDistance
    : Math.min(xDistance, numCols - xDistance) + Math.min(yDistance, numRows - yDistance);
};

export const createFarthestFoodProvider = ({ rank = boardDistance } = {}) => ({
  initialState: { placements: 0 },
  next: ({ state, providerState = { placements: 0 } }) => {
    const positions = enumerateLegalFoodPositions(state);
    if (!positions.length) {
      return { food: null, providerState };
    }
    const food = positions.reduce((farthest, position) =>
      rank(position, { state }) > rank(farthest, { state }) ? position : farthest,
    );
    return {
      food,
      providerState: { placements: providerState.placements + 1 },
    };
  },
});
