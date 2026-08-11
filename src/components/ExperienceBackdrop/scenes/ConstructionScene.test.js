import React from 'react';
import { render } from '@testing-library/react';

import ConstructionScene from './ConstructionScene';

describe('ConstructionScene', () => {
  it('renders the crane, the rising frame and the scaffold', () => {
    const { container } = render(<ConstructionScene />);

    expect(container.querySelector('.SceneLayer.ConstructionScene')).toBeInTheDocument();
    expect(container.querySelector('svg[viewBox="0 0 1000 600"]')).toBeInTheDocument();

    expect(container.querySelector('.ConstructionScene-mast')).toBeInTheDocument();
    expect(container.querySelector('.ConstructionScene-trolley')).toBeInTheDocument();
    expect(container.querySelector('.ConstructionScene-cable')).toBeInTheDocument();
    expect(container.querySelector('.ConstructionScene-hook')).toBeInTheDocument();
    expect(container.querySelector('.ConstructionScene-scaffold')).toBeInTheDocument();
    expect(container.querySelectorAll('.ConstructionScene-hazard rect').length).toBe(2);

    expect(container.querySelectorAll('.ConstructionScene-girder').length).toBe(5);
    ['1', '2', '3', '4', '5'].forEach(n => {
      expect(container.querySelector(`.ConstructionScene-girder${n}`)).toBeInTheDocument();
    });
  });

  it('scatters every site light to a unique twinkle delay, from a fixed seed', () => {
    const { container } = render(<ConstructionScene />);

    const delays = [...container.querySelectorAll('.ConstructionScene-lights circle')].map(
      el => el.style.animationDelay,
    );
    expect(delays.length).toBe(12);
    expect(new Set(delays).size).toBe(delays.length);
  });
});
