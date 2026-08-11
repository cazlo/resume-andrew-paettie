import React from 'react';
import { render } from '@testing-library/react';

import LunarScene from './LunarScene';

describe('LunarScene', () => {
  it('renders the craft, its flight groups and the surface', () => {
    const { container } = render(<LunarScene />);

    expect(container.querySelector('.SceneLayer.LunarScene')).toBeInTheDocument();
    expect(container.querySelector('svg[viewBox="0 0 1000 600"]')).toBeInTheDocument();
    expect(container.querySelector('.LunarScene-craft')).toBeInTheDocument();
    expect(container.querySelector('.LunarScene-horizon')).toBeInTheDocument();

    // The descent is composed from three nested transform groups; collapsing
    // them into one would turn the flight path back into a straight line.
    expect(container.querySelector('.LunarScene-flight')).toBeInTheDocument();
    expect(container.querySelector('.LunarScene-altitude')).toBeInTheDocument();
    expect(container.querySelector('.LunarScene-attitude')).toBeInTheDocument();
  });

  it('draws a deterministic star field, so renders and tests do not drift', () => {
    const first = render(<LunarScene />).container.querySelectorAll('.LunarScene-stars circle');
    const second = render(<LunarScene />).container.querySelectorAll('.LunarScene-stars circle');

    expect(first.length).toBe(48);
    expect([...second].map(s => s.getAttribute('cx'))).toEqual([...first].map(s => s.getAttribute('cx')));
  });
});
