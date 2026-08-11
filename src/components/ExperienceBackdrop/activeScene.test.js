import { resolveActiveScene, MIN_RATIO } from './activeScene';

describe('resolveActiveScene', () => {
  it('picks the scene with the most of its tile inside the band', () => {
    expect(
      resolveActiveScene([
        { sceneId: 'radar', ratio: 0.3 },
        { sceneId: 'lunar', ratio: 0.9 },
        { sceneId: 'runners', ratio: 0.25 },
      ]),
    ).toBe('lunar');
  });

  it('returns null when nothing clears the floor, so the default backdrop stays', () => {
    expect(
      resolveActiveScene([
        { sceneId: 'radar', ratio: MIN_RATIO - 0.01 },
        { sceneId: 'lunar', ratio: 0 },
      ]),
    ).toBeNull();
  });

  it('returns null for an empty timeline', () => {
    expect(resolveActiveScene([])).toBeNull();
  });

  it('ignores entries with no scene rather than letting them win', () => {
    expect(
      resolveActiveScene([
        { sceneId: null, ratio: 1 },
        { sceneId: 'construction', ratio: 0.4 },
      ]),
    ).toBe('construction');
  });

  it('breaks an exact tie towards the earlier entry, so the result is stable', () => {
    expect(
      resolveActiveScene([
        { sceneId: 'road', ratio: 0.5 },
        { sceneId: 'construction', ratio: 0.5 },
      ]),
    ).toBe('road');
  });

  it('honours a caller supplied floor', () => {
    const candidates = [{ sceneId: 'lunar', ratio: 0.3 }];
    expect(resolveActiveScene(candidates, 0.2)).toBe('lunar');
    expect(resolveActiveScene(candidates, 0.5)).toBeNull();
  });
});
