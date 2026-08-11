import heroTech, { MIN_WEIGHT } from './heroTech';

describe('hero technology weights', () => {
  it('resolves every hero technology to a real skill in content.jsx', () => {
    const unresolved = heroTech.filter(t => t.years === undefined).map(t => t.key);
    expect(unresolved).toEqual([]);
  });

  it('never weights a technology below the floor', () => {
    heroTech.forEach(t => {
      expect(t.weight).toBeGreaterThanOrEqual(MIN_WEIGHT);
    });
  });

  it('gives a long-running technology more weight than a recent one', () => {
    const weightOf = key => heroTech.find(t => t.key === key).weight;
    expect(weightOf('AWS')).toBeGreaterThan(weightOf('Rust'));
    expect(weightOf('OS Admin')).toBeGreaterThan(weightOf('AWS'));
  });
});
