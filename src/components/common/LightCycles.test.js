import React from 'react';
import { render } from '@testing-library/react';
import LightCycles from './LightCycles';

it('renders a rider and the keyframes its route needs', () => {
  const { container } = render(<LightCycles />);

  const riders = container.querySelectorAll('.LightCycles-rider');
  const segments = container.querySelectorAll('.LightCycles-seg');
  const css = container.querySelector('style').innerHTML;

  expect(riders.length).toBeGreaterThan(0);
  expect(segments.length).toBeGreaterThan(0);

  // Every animation the markup asks for has to exist in the emitted CSS, or the
  // rider silently sits still.
  riders.forEach(rider => {
    expect(css).toContain(`@keyframes ${rider.style.animationName}`);
  });
  segments.forEach(segment => {
    expect(css).toContain(`@keyframes ${segment.style.animationName}`);
  });
});
