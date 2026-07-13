const wrap = (point, size) => (point < 0 ? point + size : point % size);

export const computePerfectScore = (numRows, numCols) => numRows * numCols - 1;

export const moveSnake = (parts, { direction, numRows, numCols, wallsAreFatal }) => {
  const x = parts[0].x + direction.x;
  const y = parts[0].y + direction.y;
  const head = {
    ...parts[0],
    x: wallsAreFatal ? x : wrap(x, numCols),
    y: wallsAreFatal ? y : wrap(y, numRows),
  };

  return [head, ...parts.slice(0, -1)];
};

export const growSnake = parts => [...parts, parts[parts.length - 1]];
