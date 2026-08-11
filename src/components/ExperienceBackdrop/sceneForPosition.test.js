import sceneForPosition from './sceneForPosition';

describe('sceneForPosition', () => {
  it.each([
    ['Undisclosed — Defense and Space', 'radar'],
    ['Blue Origin', 'lunar'],
    ['Nike', 'runners'],
    ['Cox Automotive (Data Solutions)', 'road'],
    ['Cox Automotive (Dealer.com)', 'road'],
    ['CapitalSoft', 'construction'],
  ])('maps %s to the %s scene', (company, scene) => {
    expect(sceneForPosition({ company })).toBe(scene);
  });

  it('gives the two Blue Origin stints the same scene so it stays up across both', () => {
    expect(sceneForPosition({ company: 'Blue Origin', startDate: '2021' })).toBe(
      sceneForPosition({ company: 'Blue Origin', startDate: '2023' }),
    );
  });

  it('matches on a substring, so the resume copy can be reworded', () => {
    expect(sceneForPosition({ company: 'Nike, Inc. — Global Payments' })).toBe('runners');
  });

  it('has no scene for an unrecognised company, leaving the default backdrop up', () => {
    expect(sceneForPosition({ company: 'Some Other Place' })).toBeNull();
  });

  it('has no scene for entries without a company, which is how education opts out', () => {
    expect(sceneForPosition({ schoolName: 'University of Texas @Dallas' })).toBeNull();
    expect(sceneForPosition(undefined)).toBeNull();
  });
});
