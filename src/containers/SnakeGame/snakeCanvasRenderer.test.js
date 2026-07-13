import { drawGameFrame, getFoodColor, getSnakeRenderPoints } from './snakeCanvasRenderer';

const point = (x, y) => ({ x, y });

describe('snake canvas renderer', () => {
  it('uses a safe fallback for food records whose theme has no style', () => {
    expect(getFoodColor({ x: 2, y: 3, themeName: 'zsh' })).toBe('#e8772d');
    expect(getFoodColor({ style: { background: '#61dafb' } })).toBe('#61dafb');
  });

  it('keeps the head centered while the body travels in a perpendicular wave', () => {
    const parts = [point(3, 2), point(2, 2), point(1, 2), point(0, 2)];
    const atWaveStart = getSnakeRenderPoints(parts, point(1, 0), 50, 0);
    const later = getSnakeRenderPoints(parts, point(1, 0), 50, 350);

    expect(atWaveStart[0]).toEqual(expect.objectContaining({ x: 175, y: 125 }));
    expect(later[0]).toEqual(expect.objectContaining({ x: 175, y: 125 }));
    expect(later[2].x).toBe(75);
    expect(later[2].y).not.toBe(atWaveStart[2].y);
  });

  it('orients a vertical snake wave across the x axis', () => {
    const parts = [point(2, 1), point(2, 2), point(2, 3)];
    const rendered = getSnakeRenderPoints(parts, point(0, -1), 50, 500);

    expect(rendered[2].y).toBe(175);
    expect(rendered[2].x).not.toBe(125);
  });

  it('handles a duplicated growth segment without invalid coordinates', () => {
    const parts = [point(2, 1), point(1, 1), point(1, 1)];
    const rendered = getSnakeRenderPoints(parts, point(1, 0), 50, 900);

    rendered.forEach(renderedPoint => {
      expect(Number.isFinite(renderedPoint.x)).toBe(true);
      expect(Number.isFinite(renderedPoint.y)).toBe(true);
      expect(Number.isFinite(renderedPoint.radius)).toBe(true);
    });
  });

  it('batches a long snake into a constant number of canvas strokes', () => {
    const gradient = { addColorStop: jest.fn() };
    const ctx = {
      arc: jest.fn(),
      beginPath: jest.fn(),
      bezierCurveTo: jest.fn(),
      clearRect: jest.fn(),
      closePath: jest.fn(),
      createLinearGradient: jest.fn(() => gradient),
      createRadialGradient: jest.fn(() => gradient),
      ellipse: jest.fn(),
      fill: jest.fn(),
      fillRect: jest.fn(),
      lineTo: jest.fn(),
      moveTo: jest.fn(),
      restore: jest.fn(),
      rotate: jest.fn(),
      save: jest.fn(),
      setLineDash: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
    };
    const parts = Array.from({ length: 200 }, (_, index) => point(index, 0));

    drawGameFrame(ctx, {
      innerHeight: 50,
      innerWidth: 10000,
      snake: { direction: point(1, 0), parts },
      food: [],
      path: [],
      showPath: false,
      boxSize: 50,
      snakeColor: '#8fc160',
      pathColor: '#61dafb',
    });

    expect(ctx.stroke).toHaveBeenCalledTimes(12);
  });
});
