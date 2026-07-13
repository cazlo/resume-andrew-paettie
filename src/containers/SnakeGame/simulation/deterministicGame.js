import { computePerfectScore, growSnake, moveSnake } from '../model/gameModel';
import PositionUtil from '../util/PositionUtil';

export const GameOutcome = Object.freeze({
  ATE: 'ate',
  COLLISION: 'collision',
  MOVED: 'moved',
  NO_FOOD: 'noFood',
  NO_LEGAL_MOVE: 'noLegalMove',
  REPEATED_STATE: 'repeatedState',
  TIMEOUT: 'timeout',
  WON: 'won',
});

const terminalOutcomes = new Set([
  GameOutcome.COLLISION,
  GameOutcome.NO_FOOD,
  GameOutcome.NO_LEGAL_MOVE,
  GameOutcome.REPEATED_STATE,
  GameOutcome.TIMEOUT,
  GameOutcome.WON,
]);

const clonePosition = position => (position ? { x: position.x, y: position.y } : null);

const isUnitDirection = direction =>
  direction &&
  Number.isInteger(direction.x) &&
  Number.isInteger(direction.y) &&
  Math.abs(direction.x) + Math.abs(direction.y) === 1;

export const createSimulationState = ({
  board,
  snake,
  food = null,
  score = 0,
  frameCount = 0,
  solverState,
  providerState,
}) => ({
  board: { ...board },
  snake: {
    direction: clonePosition(snake.direction),
    parts: snake.parts.map(clonePosition),
  },
  food: clonePosition(food),
  score,
  perfectScore: computePerfectScore(board.numRows, board.numCols),
  frameCount,
  solverState,
  providerState,
  foodTrace: food ? [clonePosition(food)] : [],
});

const collides = state => {
  const [head, ...tail] = state.snake.parts;
  const { numRows, numCols, wallsAreFatal } = state.board;
  const outsideBoard = head.x < 0 || head.x >= numCols || head.y < 0 || head.y >= numRows;
  return (wallsAreFatal && outsideBoard) || PositionUtil.isColliding(head, tail);
};

const withOutcome = (outcome, state, details = {}) => ({
  outcome,
  state,
  event: {
    frame: state.frameCount,
    outcome,
    ...details,
  },
});

const spawnFood = (state, foodProvider) => {
  if (!foodProvider) {
    return withOutcome(GameOutcome.NO_FOOD, state);
  }
  const placement = foodProvider.next({ state, providerState: state.providerState });
  if (!placement.food) {
    return withOutcome(GameOutcome.NO_FOOD, { ...state, providerState: placement.providerState });
  }
  const { numRows, numCols } = state.board;
  const isWithinBoard =
    placement.food.x >= 0 && placement.food.x < numCols && placement.food.y >= 0 && placement.food.y < numRows;
  if (!isWithinBoard || PositionUtil.isColliding(placement.food, state.snake.parts)) {
    throw new Error(`Food provider returned illegal position (${placement.food.x},${placement.food.y})`);
  }
  return {
    state: {
      ...state,
      food: clonePosition(placement.food),
      providerState: placement.providerState,
      foodTrace: [...state.foodTrace, clonePosition(placement.food)],
    },
  };
};

export const stepDeterministicGame = (state, { solver, foodProvider } = {}) => {
  const foodBeforeMove = state.food;
  const movedParts = moveSnake(state.snake.parts, {
    ...state.board,
    direction: state.snake.direction,
  });
  let nextState = {
    ...state,
    frameCount: state.frameCount + 1,
    snake: {
      ...state.snake,
      parts: movedParts,
    },
  };

  if (collides(nextState)) {
    return withOutcome(GameOutcome.COLLISION, nextState);
  }

  const ate = foodBeforeMove && PositionUtil.isSamePosition(movedParts[0], foodBeforeMove);
  if (ate) {
    nextState = {
      ...nextState,
      food: null,
      score: nextState.score + 1,
      snake: {
        ...nextState.snake,
        parts: growSnake(nextState.snake.parts),
      },
    };
    if (nextState.score === nextState.perfectScore) {
      return withOutcome(GameOutcome.WON, nextState, { ate: clonePosition(foodBeforeMove) });
    }
    const spawned = spawnFood(nextState, foodProvider);
    if (spawned.outcome) {
      return spawned;
    }
    nextState = spawned.state;
  }

  if (solver) {
    const decision = solver(nextState);
    if (!decision || !isUnitDirection(decision.direction)) {
      return withOutcome(GameOutcome.NO_LEGAL_MOVE, nextState);
    }
    nextState = {
      ...nextState,
      solverState: decision.solverState,
      snake: {
        ...nextState.snake,
        direction: clonePosition(decision.direction),
      },
    };
  }

  return withOutcome(ate ? GameOutcome.ATE : GameOutcome.MOVED, nextState, {
    ate: ate ? clonePosition(foodBeforeMove) : null,
  });
};

const stableValue = value => {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => ({ ...result, [key]: stableValue(value[key]) }), {});
  }
  return value;
};

export const deterministicStateSignature = state =>
  JSON.stringify(
    stableValue({
      direction: state.snake.direction,
      food: state.food,
      parts: state.snake.parts,
      score: state.score,
      solverState: state.solverState,
    }),
  );

export const runDeterministicGame = ({ state, solver, foodProvider, maxFrames }) => {
  let currentState = state;
  const events = [];
  if (!currentState.food) {
    const spawned = spawnFood(currentState, foodProvider);
    if (spawned.outcome) {
      return { ...spawned, events, foodTrace: currentState.foodTrace };
    }
    currentState = spawned.state;
  }

  const seen = new Map([[deterministicStateSignature(currentState), currentState.frameCount]]);
  while (currentState.frameCount < maxFrames) {
    const result = stepDeterministicGame(currentState, { solver, foodProvider });
    currentState = result.state;
    events.push(result.event);
    if (terminalOutcomes.has(result.outcome)) {
      return { ...result, events, foodTrace: currentState.foodTrace };
    }

    const signature = deterministicStateSignature(currentState);
    if (seen.has(signature)) {
      return {
        ...withOutcome(GameOutcome.REPEATED_STATE, currentState),
        events,
        foodTrace: currentState.foodTrace,
        repeatedState: {
          signature,
          firstSeenFrame: seen.get(signature),
        },
      };
    }
    seen.set(signature, currentState.frameCount);
  }

  return {
    ...withOutcome(GameOutcome.TIMEOUT, currentState),
    events,
    foodTrace: currentState.foodTrace,
  };
};
