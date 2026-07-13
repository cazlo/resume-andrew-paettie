const TAU = Math.PI * 2;

const COLORS = {
  background: '#101716',
  backgroundGlow: '#1c2925',
  grid: 'rgba(211, 255, 224, 0.055)',
  snakeEdge: '#315c3b',
  snakeHighlight: '#d8ffad',
  snakePattern: '#4f813f',
  shadow: 'rgba(0, 0, 0, 0.34)',
  eye: '#f3f9dd',
  pupil: '#101713',
  tongue: '#ef6a78',
};

const DEFAULT_FOOD_COLOR = '#e8772d';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getFoodColor = item => (item && item.style && item.style.background) || DEFAULT_FOOD_COLOR;

const isContinuous = (first, second) => Math.abs(first.x - second.x) + Math.abs(first.y - second.y) <= 1;

const normaliseVector = vector => {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / length, y: vector.y / length };
};

const tangentAt = (parts, index, direction) => {
  if (index === 0) return normaliseVector(direction);

  const before = parts[index - 1];
  const after = parts[index + 1];
  if (after && isContinuous(before, after)) {
    return normaliseVector({ x: before.x - after.x, y: before.y - after.y });
  }
  if (isContinuous(before, parts[index])) {
    return normaliseVector({
      x: before.x - parts[index].x,
      y: before.y - parts[index].y,
    });
  }
  if (after && isContinuous(parts[index], after)) {
    return normaliseVector({
      x: parts[index].x - after.x,
      y: parts[index].y - after.y,
    });
  }
  return normaliseVector(direction);
};

export const getSnakeRenderPoints = (parts, direction, boxSize, timestamp) => {
  const phase = timestamp * 0.0045;
  const maxWave = boxSize * 0.072;
  const tailTaper = Math.min(0.16, Math.max(0, parts.length - 2) * 0.012);

  return parts.map((part, index) => {
    const tangent = tangentAt(parts, index, direction);
    const waveEnvelope = Math.min(index / 2.2, 1);
    const wave = Math.sin(phase - index * 1.08) * maxWave * waveEnvelope;
    const tailProgress = index / Math.max(parts.length - 1, 1);

    return {
      x: (part.x + 0.5) * boxSize - tangent.y * wave,
      y: (part.y + 0.5) * boxSize + tangent.x * wave,
      tangent,
      radius: boxSize * (index === 0 ? 0.34 : 0.29 - tailTaper * tailProgress ** 1.45),
    };
  });
};

const drawBackground = (ctx, width, height, boxSize) => {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(width * 0.48, height * 0.4, 0, width * 0.48, height * 0.4, width * 0.75);
  gradient.addColorStop(0, COLORS.backgroundGlow);
  gradient.addColorStop(1, COLORS.background);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.beginPath();
  for (let x = boxSize; x < width; x += boxSize) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
  }
  for (let y = boxSize; y < height; y += boxSize) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
  }
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  ctx.stroke();
};

const drawPath = (ctx, path, boxSize, pathColor) => {
  if (!path.length) return;

  const centers = path.map(point => ({
    x: (point.x + 0.5) * boxSize,
    y: (point.y + 0.5) * boxSize,
  }));
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(2, boxSize * 0.055);
  ctx.globalAlpha = 0.28;
  ctx.setLineDash([boxSize * 0.12, boxSize * 0.17]);
  ctx.lineCap = 'round';

  ctx.beginPath();
  for (let index = 1; index < centers.length; index += 1) {
    if (isContinuous(path[index - 1], path[index])) {
      ctx.moveTo(centers[index - 1].x, centers[index - 1].y);
      ctx.lineTo(centers[index].x, centers[index].y);
    }
  }
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = pathColor;
  ctx.beginPath();
  centers.forEach(point => {
    ctx.moveTo(point.x + boxSize * 0.055, point.y);
    ctx.arc(point.x, point.y, boxSize * 0.055, 0, TAU);
  });
  ctx.fill();
  ctx.restore();
};

const drawFood = (ctx, food, boxSize, timestamp) => {
  food.forEach((item, index) => {
    const x = (item.x + 0.5) * boxSize;
    const y = (item.y + 0.5) * boxSize;
    const color = getFoodColor(item);
    const pulse = 1 + Math.sin(timestamp * 0.005 + index * 1.7) * 0.055;
    const radius = boxSize * 0.255 * pulse;

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = boxSize * 0.26;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y + boxSize * 0.035, radius, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;

    const shine = ctx.createRadialGradient(x - radius * 0.36, y - radius * 0.34, radius * 0.05, x, y, radius);
    shine.addColorStop(0, 'rgba(255, 255, 255, 0.82)');
    shine.addColorStop(0.22, 'rgba(255, 255, 255, 0.16)');
    shine.addColorStop(1, 'rgba(0, 0, 0, 0.24)');
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.arc(x, y + boxSize * 0.035, radius, 0, TAU);
    ctx.fill();

    ctx.translate(x + radius * 0.08, y - radius * 0.88);
    ctx.rotate(-0.55);
    ctx.fillStyle = '#8fc160';
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.22, radius * 0.48, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  });
};

const addBodyPath = (ctx, points, parts, startIndex = 1, endIndex = points.length - 1) => {
  let hasSegments = false;
  let continuing = false;

  ctx.beginPath();
  for (let index = startIndex; index <= endIndex; index += 1) {
    if (isContinuous(parts[index], parts[index - 1])) {
      if (!continuing) ctx.moveTo(points[index - 1].x, points[index - 1].y);
      ctx.lineTo(points[index].x, points[index].y);
      hasSegments = true;
      continuing = true;
    } else {
      continuing = false;
    }
  }
  return hasSegments;
};

const strokeBodyRange = (ctx, points, parts, startIndex, endIndex, color, radiusAdjustment = 0) => {
  const middleIndex = Math.floor((startIndex + endIndex) / 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, (points[middleIndex].radius + radiusAdjustment) * 2);
  if (addBodyPath(ctx, points, parts, startIndex, endIndex)) ctx.stroke();
};

const drawSnakeBody = (ctx, points, parts, snakeColor) => {
  if (points.length <= 1) return;

  // Performance invariant: do not return to one stroke/fill per segment. The
  // fixed buckets below keep body paint calls constant as the snake grows. In
  // the 120-frame Chrome benchmark this made 300/600-segment frames about 11x
  // faster while retaining enough radius steps for the visible tail taper.
  const segmentCount = points.length - 1;
  const bucketCount = Math.min(4, Math.ceil(segmentCount / 12));
  const buckets = Array.from({ length: bucketCount }, (_, bucketIndex) => ({
    start: 1 + Math.floor((bucketIndex * segmentCount) / bucketCount),
    end: Math.floor(((bucketIndex + 1) * segmentCount) / bucketCount),
  }));

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = COLORS.shadow;
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;
  strokeBodyRange(ctx, points, parts, 1, points.length - 1, COLORS.snakeEdge, 2.5);

  ctx.shadowColor = 'transparent';
  buckets.forEach(({ start, end }) => {
    strokeBodyRange(ctx, points, parts, start, end, COLORS.snakeEdge, 2.5);
  });
  buckets.forEach(({ start, end }) => {
    strokeBodyRange(ctx, points, parts, start, end, snakeColor);
  });

  ctx.globalAlpha = 0.2;
  strokeBodyRange(ctx, points, parts, 1, points.length - 1, COLORS.snakeHighlight, -points[1].radius * 0.72);
  ctx.restore();
};

const drawEye = (ctx, forward, sideways, radius, blink, pupilOffset) => {
  ctx.fillStyle = COLORS.eye;
  ctx.beginPath();
  ctx.ellipse(forward, sideways, radius, radius * blink, 0, 0, TAU);
  ctx.fill();

  if (blink > 0.3) {
    ctx.fillStyle = COLORS.pupil;
    ctx.beginPath();
    ctx.ellipse(forward + pupilOffset, sideways, radius * 0.34, radius * blink * 0.68, 0, 0, TAU);
    ctx.fill();
  }
};

const drawSnakeHead = (ctx, head, direction, snakeColor, boxSize, timestamp) => {
  const angle = Math.atan2(direction.y, direction.x);
  const { radius } = head;
  const blinkCycle = timestamp % 4300;
  const blink = blinkCycle > 4140 ? Math.max(0.12, Math.abs(blinkCycle - 4220) / 80) : 1;

  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(angle);
  ctx.shadowColor = COLORS.shadow;
  ctx.shadowBlur = 9;
  ctx.shadowOffsetY = 4;

  const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
  gradient.addColorStop(0, COLORS.snakeHighlight);
  gradient.addColorStop(0.36, snakeColor);
  gradient.addColorStop(1, COLORS.snakePattern);
  ctx.fillStyle = gradient;
  ctx.strokeStyle = COLORS.snakeEdge;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-radius * 1.06, 0);
  ctx.bezierCurveTo(-radius * 0.78, -radius * 0.92, radius * 0.7, -radius * 0.88, radius * 1.12, 0);
  ctx.bezierCurveTo(radius * 0.7, radius * 0.88, -radius * 0.78, radius * 0.92, -radius * 1.06, 0);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.stroke();

  const eyeRadius = boxSize * 0.082;
  drawEye(ctx, radius * 0.3, -radius * 0.46, eyeRadius, blink, eyeRadius * 0.16);
  drawEye(ctx, radius * 0.3, radius * 0.46, eyeRadius, blink, eyeRadius * 0.16);

  const tongueCycle = timestamp % 2700;
  if (tongueCycle > 2240 && tongueCycle < 2620) {
    const tongueLength = boxSize * 0.18 * Math.sin(((tongueCycle - 2240) / 380) * Math.PI);
    ctx.strokeStyle = COLORS.tongue;
    ctx.lineWidth = Math.max(1.5, boxSize * 0.035);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(radius * 0.96, 0);
    ctx.lineTo(radius * 0.96 + tongueLength, 0);
    ctx.lineTo(radius * 0.96 + tongueLength + boxSize * 0.055, -boxSize * 0.045);
    ctx.moveTo(radius * 0.96 + tongueLength, 0);
    ctx.lineTo(radius * 0.96 + tongueLength + boxSize * 0.055, boxSize * 0.045);
    ctx.stroke();
  }
  ctx.restore();
};

export const drawGameFrame = (ctx, props, timestamp = 0) => {
  const { innerHeight, innerWidth, snake, food, path, showPath, boxSize, snakeColor, pathColor } = props;
  const direction = snake.direction || { x: 1, y: 0 };
  const points = getSnakeRenderPoints(snake.parts, direction, boxSize, timestamp);

  drawBackground(ctx, innerWidth, innerHeight, boxSize);
  if (showPath) drawPath(ctx, path, boxSize, pathColor);
  drawFood(ctx, food, boxSize, timestamp);
  drawSnakeBody(ctx, points, snake.parts, snakeColor);
  if (points.length) drawSnakeHead(ctx, points[0], direction, snakeColor, boxSize, timestamp);
};

export const prepareCanvas = (canvas, width, height) => {
  const targetCanvas = canvas;
  const pixelRatio = clamp(window.devicePixelRatio || 1, 1, 2);
  const requiredWidth = Math.round(width * pixelRatio);
  const requiredHeight = Math.round(height * pixelRatio);

  if (targetCanvas.width !== requiredWidth) targetCanvas.width = requiredWidth;
  if (targetCanvas.height !== requiredHeight) targetCanvas.height = requiredHeight;
  if (targetCanvas.style.width !== `${width}px`) targetCanvas.style.width = `${width}px`;
  if (targetCanvas.style.height !== `${height}px`) targetCanvas.style.height = `${height}px`;

  const ctx = targetCanvas.getContext('2d');
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return ctx;
};
