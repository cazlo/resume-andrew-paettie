import { buildCycleIndexes, buildHamiltonianCycle, isSnakeCycleOrdered } from './cycleSafePathFinding';

const samePosition = (first, second) => first.x === second.x && first.y === second.y;
// Positions are normalized into [0, numCols) x [0, numRows) by neighboringPositions,
// so a row-major integer is a distinct, cheaper-to-build key than the "x,y" string join.
const partKey = ({ x, y }, numCols) => y * numCols + x;
const snakeId = (parts, numCols) => {
  let id = '';
  for (let index = 0; index < parts.length; index += 1) {
    if (index > 0) id += ',';
    id += partKey(parts[index], numCols);
  }
  return id;
};

const reconstructPath = (queue, index) => {
  const path = [];
  for (let current = queue[index]; current.parentIndex >= 0; current = queue[current.parentIndex]) {
    path.push(current.nextHead);
  }
  return path.reverse();
};

// Equivalent to filtering/wrapping candidates through a positionId Map, but avoids
// building string keys and a Map for what is at most 4 entries (this runs once per
// dequeued BFS node, so it is on the hottest path in the recovery search). Candidates
// are written into the caller-owned `scratch` position pool (mutated in place) rather
// than freshly allocated, since most candidates are rejected or turn out to be
// already-seen states; only genuinely accepted moves need a permanent object (see
// the snapshot in findPathToHamiltonianCycle below).
const neighboringPositions = ({ x, y }, { numRows, numCols, wallsAreFatal }, scratch) => {
  const result = [];
  const rawX = [x - 1, x + 1, x, x];
  const rawY = [y, y, y - 1, y + 1];
  for (let index = 0; index < 4; index += 1) {
    const rawPositionX = rawX[index];
    const rawPositionY = rawY[index];
    const inBounds =
      !wallsAreFatal || (rawPositionX >= 0 && rawPositionX < numCols && rawPositionY >= 0 && rawPositionY < numRows);
    if (inBounds) {
      const wrappedX = (rawPositionX + numCols) % numCols;
      const wrappedY = (rawPositionY + numRows) % numRows;
      let duplicate = false;
      for (let existingIndex = 0; existingIndex < result.length; existingIndex += 1) {
        if (result[existingIndex].x === wrappedX && result[existingIndex].y === wrappedY) {
          duplicate = true;
          break;
        }
      }
      if (!duplicate) {
        const position = scratch[result.length];
        position.x = wrappedX;
        position.y = wrappedY;
        result.push(position);
      }
    }
  }
  return result;
};

const findPathToHamiltonianCycle = (snake, food, board, { maxNodes = 50000 } = {}) => {
  const cycle = buildHamiltonianCycle(board);
  if (!cycle || !snake.parts.length) return null;
  const reverseCycle = [...cycle].reverse();
  // Precomputed once per search instead of rebuilt on every isSnakeCycleOrdered
  // call, which dominates cost across a 50k-node BFS.
  const cycles = [
    { cycle, indexes: buildCycleIndexes(cycle), cycleDirection: 'forward' },
    { cycle: reverseCycle, indexes: buildCycleIndexes(reverseCycle), cycleDirection: 'reverse' },
  ];
  const { numRows, numCols } = board;
  const queue = [{ nextHead: null, parentIndex: -1, parts: snake.parts }];
  const seen = new Set([snakeId(snake.parts, numCols)]);
  const positionPool = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  // partKey ranges over [0, numRows*numCols), so occupancy can be tracked with a flat
  // array stamped with the current node's generation instead of a per-node Set: no
  // hashing, no clear() pass, just a direct index read/write.
  const occupiedGeneration = new Int32Array(numRows * numCols).fill(-1);
  let generation = -1;

  for (let index = 0; index < queue.length && index < maxNodes; index += 1) {
    const { parts } = queue[index];
    let orderedCycle = null;
    for (let cycleIndex = 0; cycleIndex < cycles.length; cycleIndex += 1) {
      const candidate = cycles[cycleIndex];
      if (isSnakeCycleOrdered(parts, candidate.cycle, candidate.indexes)) {
        orderedCycle = candidate;
        break;
      }
    }
    if (orderedCycle) {
      return {
        cycleDirection: orderedCycle.cycleDirection,
        nodesVisited: index + 1,
        path: reconstructPath(queue, index),
      };
    }

    const tailIndex = parts.length - 1;
    // bodyWithoutTail (i.e. parts minus the last element) is identical for every
    // candidate neighbor of this node, so both the collision check and the shared tail
    // of the visited-set key are built once per node rather than once per neighbor.
    generation += 1;
    let idSuffix = '';
    for (let partIndex = 0; partIndex < tailIndex; partIndex += 1) {
      const key = partKey(parts[partIndex], numCols);
      occupiedGeneration[key] = generation;
      idSuffix += `,${key}`;
    }

    const neighbors = neighboringPositions(parts[0], board, positionPool);
    for (let neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex += 1) {
      const next = neighbors[neighborIndex];
      const crossesFood = food && samePosition(next, food);
      const nextKey = partKey(next, numCols);
      const collides = occupiedGeneration[nextKey] === generation;
      if (!crossesFood && !collides) {
        // Only pay for materializing the movedParts array (and a permanent copy of `next`,
        // which otherwise aliases a reused scratch object) once this state is genuinely new.
        const id = nextKey + idSuffix;
        if (!seen.has(id)) {
          seen.add(id);
          const acceptedHead = { x: next.x, y: next.y };
          const movedParts = new Array(tailIndex + 1);
          movedParts[0] = acceptedHead;
          for (let partIndex = 0; partIndex < tailIndex; partIndex += 1) {
            movedParts[partIndex + 1] = parts[partIndex];
          }
          queue.push({ nextHead: acceptedHead, parentIndex: index, parts: movedParts });
        }
      }
    }
  }
  return null;
};

export default findPathToHamiltonianCycle;
