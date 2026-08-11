import React from 'react';
import { render } from '@testing-library/react';

import RadarScene from './RadarScene';

describe('RadarScene', () => {
  it('renders the scope, sweep and a full set of blips', () => {
    const { container } = render(<RadarScene />);

    expect(container.querySelector('.SceneLayer.RadarScene')).toBeInTheDocument();
    expect(container.querySelector('svg[viewBox="0 0 1000 600"]')).toBeInTheDocument();
    expect(container.querySelector('.RadarScene-sweep')).toBeInTheDocument();
    expect(container.querySelector('.RadarScene-arm')).toBeInTheDocument();

    const blips = container.querySelectorAll('.RadarScene-blip');
    expect(blips.length).toBe(16);

    // Every blip's flash has to be offset from the others, or they would all
    // light at once and the sweep correlation trick would be invisible.
    const delays = new Set([...blips].map(blip => blip.style.animationDelay));
    expect(delays.size).toBe(blips.length);
  });

  it('keeps every blip delay within one sweep period', () => {
    const { container } = render(<RadarScene />);

    const blips = [...container.querySelectorAll('.RadarScene-blip')];
    blips.forEach(blip => {
      const delay = parseFloat(blip.style.animationDelay);
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThan(12);
    });
  });
});
