import React from 'react';
import { render } from '@testing-library/react';

import VaultScene from './VaultScene';

describe('VaultScene', () => {
  it('renders the door, its wheel and bolts, the racks behind it and a floor', () => {
    const { container } = render(<VaultScene />);

    expect(container.querySelector('.SceneLayer.VaultScene')).toBeInTheDocument();
    expect(container.querySelector('svg[viewBox="0 0 1000 600"]')).toBeInTheDocument();
    expect(container.querySelector('.VaultScene-door')).toBeInTheDocument();
    expect(container.querySelector('.VaultScene-horizon')).toBeInTheDocument();

    // The wheel spins inside the swinging door; hoisting it out would leave it
    // hanging in the doorway while the door is open.
    expect(container.querySelector('.VaultScene-door .VaultScene-wheel')).toBeInTheDocument();
    expect(container.querySelectorAll('.VaultScene-door .VaultScene-bolt').length).toBe(9);

    expect(container.querySelectorAll('.VaultScene-packet').length).toBe(6);
  });

  it('lays out a deterministic rack, so renders and tests do not drift', () => {
    const first = render(<VaultScene />).container.querySelectorAll('.VaultScene-led');
    const second = render(<VaultScene />).container.querySelectorAll('.VaultScene-led');

    expect(first.length).toBeGreaterThan(30);
    expect([...second].map(led => led.style.animationDelay)).toEqual([...first].map(led => led.style.animationDelay));
  });
});
