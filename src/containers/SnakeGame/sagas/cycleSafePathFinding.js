const positionId = ({ x, y }) => `${x},${y}`;

const samePosition = (first, second) => first.x === second.x && first.y === second.y;

const buildEvenRowCycle = ({ numRows, numCols }) => {
  const cycle = [];
  for (let x = 0; x < numCols; x += 1) cycle.push({ x, y: 0 });
  for (let y = 1; y < numRows; y += 1) {
    if (y % 2 === 1) {
      for (let x = numCols - 1; x >= 1; x -= 1) cycle.push({ x, y });
    } else {
      for (let x = 1; x < numCols; x += 1) cycle.push({ x, y });
    }
  }
  for (let y = numRows - 1; y >= 1; y -= 1) cycle.push({ x: 0, y });
  return cycle.reverse();
};

export const buildHamiltonianCycle = ({ numRows, numCols }) => {
  if (numRows < 2 || numCols < 2) return null;
  if (numRows % 2 === 0) return buildEvenRowCycle({ numRows, numCols });
  if (numCols % 2 === 0) {
    return buildEvenRowCycle({ numRows: numCols, numCols: numRows }).map(({ x, y }) => ({ x: y, y: x }));
  }
  return null;
};

const forwardDistance = (from, to, size) => (to - from + size) % size;

const neighboringPositions = ({ x, y }, { numRows, numCols, wallsAreFatal }) => {
  const candidates = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];
  const normalized = candidates
    .filter(
      position =>
        !wallsAreFatal || (position.x >= 0 && position.x < numCols && position.y >= 0 && position.y < numRows),
    )
    .map(position => ({
      x: (position.x + numCols) % numCols,
      y: (position.y + numRows) % numRows,
    }));
  return [...new Map(normalized.map(position => [positionId(position), position])).values()];
};

export const isSnakeCycleOrdered = (parts, cycle) => {
  if (parts.length <= 1) return true;
  const indexes = new Map(cycle.map((position, index) => [positionId(position), index]));
  const headIndex = indexes.get(positionId(parts[0]));
  if (headIndex === undefined) return false;
  let previousDistance = cycle.length;
  for (let index = 1; index < parts.length; index += 1) {
    const partIndex = indexes.get(positionId(parts[index]));
    if (partIndex === undefined) return false;
    const distance = forwardDistance(headIndex, partIndex, cycle.length);
    const duplicatedTail = index === parts.length - 1 && samePosition(parts[index], parts[index - 1]);
    if (distance >= previousDistance && !duplicatedTail) return false;
    previousDistance = distance;
  }
  return true;
};

const projectMove = (parts, nextHead, grows) => {
  const movedParts = [nextHead, ...parts.slice(0, -1)];
  return grows ? [...movedParts, movedParts[movedParts.length - 1]] : movedParts;
};

const isLegalMove = (parts, nextHead) => !parts.slice(0, -1).some(position => samePosition(position, nextHead));

const cycleSuccessor = (parts, cycle, indexes) => {
  const headIndex = indexes.get(positionId(parts[0]));
  return cycle[(headIndex + 1) % cycle.length];
};

const canSurviveSuccessorGrowths = (parts, cycle, indexes) => {
  // Food can spawn on the very next free cycle cell. Proving the adversarial
  // case where that happens after every bite preserves enough space for any
  // legal future food sequence, including the stationary duplicate-tail tick.
  let projectedParts = parts;
  while (projectedParts.length < cycle.length) {
    const successor = cycleSuccessor(projectedParts, cycle, indexes);
    if (!isLegalMove(projectedParts, successor)) return false;
    projectedParts = projectMove(projectedParts, successor, true);
  }
  return true;
};

const canSafelyReachFoodAlongCycle = (parts, food, cycle, indexes) => {
  let projectedParts = parts;
  for (let step = 0; step < cycle.length; step += 1) {
    const successor = cycleSuccessor(projectedParts, cycle, indexes);
    if (!isLegalMove(projectedParts, successor)) return false;
    const reachesFood = samePosition(successor, food);
    projectedParts = projectMove(projectedParts, successor, reachesFood);
    if (reachesFood) {
      return canSurviveSuccessorGrowths(projectedParts, cycle, indexes);
    }
  }
  return false;
};

export const findCycleSafeNextPosition = (snake, food, board) => {
  const cycle = buildHamiltonianCycle(board);
  if (!cycle || !snake.parts.length || !isSnakeCycleOrdered(snake.parts, cycle)) return null;

  const indexes = new Map(cycle.map((position, index) => [positionId(position), index]));
  const [head] = snake.parts;
  const headIndex = indexes.get(positionId(head));
  const successor = cycle[(headIndex + 1) % cycle.length];
  const occupiedAfterTailRemoval = snake.parts.slice(0, -1);
  return occupiedAfterTailRemoval.some(part => samePosition(part, successor)) ? null : successor;
};

export const findCycleShortcutNextPosition = (snake, food, board) => {
  const cycle = buildHamiltonianCycle(board);
  if (!cycle || !snake.parts.length || !food || !isSnakeCycleOrdered(snake.parts, cycle)) return null;

  const indexes = new Map(cycle.map((position, index) => [positionId(position), index]));
  const [head] = snake.parts;
  const headIndex = indexes.get(positionId(head));
  const foodIndex = indexes.get(positionId(food));
  const foodDistance = forwardDistance(headIndex, foodIndex, cycle.length);
  const occupiedAfterTailRemoval = new Set(snake.parts.slice(0, -1).map(positionId));

  const candidates = neighboringPositions(head, board)
    .map(position => ({
      position,
      distance: forwardDistance(headIndex, indexes.get(positionId(position)), cycle.length),
    }))
    .filter(({ position, distance }) => {
      // Forward-only moves that do not pass food give a finite progress rank.
      // The projection checks additionally preserve the strict cycle fallback.
      if (distance === 0 || distance > foodDistance || occupiedAfterTailRemoval.has(positionId(position))) {
        return false;
      }
      const reachesFood = samePosition(position, food);
      const projectedParts = projectMove(snake.parts, position, reachesFood);
      if (!isSnakeCycleOrdered(projectedParts, cycle)) return false;
      if (reachesFood) {
        return canSurviveSuccessorGrowths(projectedParts, cycle, indexes);
      }
      return canSafelyReachFoodAlongCycle(projectedParts, food, cycle, indexes);
    })
    .sort((first, second) => second.distance - first.distance);
  return candidates.length ? candidates[0].position : null;
};
