const samePosition = (first, second) => first.x === second.x && first.y === second.y;

const wrap = (point, size) => (point < 0 ? point + size : point % size);

const isWithinBoard = ({ x, y }, { numRows, numCols }) => x >= 0 && x < numCols && y >= 0 && y < numRows;

const neighboringPositions = ({ x, y }, { numRows, numCols, wallsAreFatal }) => {
  const candidates = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];

  return candidates
    .filter(candidate => !wallsAreFatal || isWithinBoard(candidate, { numRows, numCols }))
    .map(candidate =>
      wallsAreFatal
        ? candidate
        : {
            x: wrap(candidate.x, numCols),
            y: wrap(candidate.y, numRows),
          },
    );
};

export const areAdjacent = (first, second, board) =>
  neighboringPositions(first, board).some(position => samePosition(position, second));

const isLegalFirstMove = (snake, candidate, board) => {
  const [head] = snake.parts;
  if (!head || !candidate) {
    return false;
  }
  if (!isWithinBoard(candidate, board)) {
    return false;
  }

  if (!areAdjacent(head, candidate, board)) {
    return false;
  }

  const bodyAfterTailRemoval = snake.parts.slice(0, -1);
  return !bodyAfterTailRemoval.some(part => samePosition(part, candidate));
};

export default isLegalFirstMove;
