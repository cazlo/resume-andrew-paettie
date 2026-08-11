import React from 'react';
import { render } from '@testing-library/react';

import RoadScene from './RoadScene';

describe('RoadScene', () => {
  it('renders the road, its markers, the hero car and oncoming traffic', () => {
    const { container } = render(<RoadScene />);

    expect(container.querySelector('.SceneLayer.RoadScene')).toBeInTheDocument();
    expect(container.querySelector('svg[viewBox="0 0 1000 600"]')).toBeInTheDocument();
    expect(container.querySelector('.RoadScene-surface')).toBeInTheDocument();
    expect(container.querySelector('.RoadScene-ground')).toBeInTheDocument();
    expect(container.querySelector('.RoadScene-sun')).toBeInTheDocument();
    expect(container.querySelectorAll('.RoadScene-edge').length).toBe(2);

    expect(container.querySelectorAll('.RoadScene-dash').length).toBe(10);
    expect(container.querySelectorAll('.RoadScene-markerLeft').length).toBe(5);
    expect(container.querySelectorAll('.RoadScene-markerRight').length).toBe(5);

    // Hero car: right lane, close to camera, tail lights its brightest feature.
    expect(container.querySelector('.RoadScene-heroDrift')).toBeInTheDocument();
    expect(container.querySelector('.RoadScene-heroBob')).toBeInTheDocument();
    expect(container.querySelectorAll('.RoadScene-heroTailLight').length).toBe(2);

    // Oncoming traffic: left lane, periodic rather than a stream.
    expect(container.querySelectorAll('.RoadScene-oncoming').length).toBe(3);
    expect(container.querySelectorAll('.RoadScene-headlight').length).toBe(6);
  });

  it('staggers every travelling dash, marker and oncoming car to a unique delay, so recycling reads continuous', () => {
    const { container } = render(<RoadScene />);

    const dashDelays = [...container.querySelectorAll('.RoadScene-dash')].map(el => el.style.animationDelay);
    expect(new Set(dashDelays).size).toBe(dashDelays.length);

    const leftDelays = [...container.querySelectorAll('.RoadScene-markerLeft')].map(el => el.style.animationDelay);
    expect(new Set(leftDelays).size).toBe(leftDelays.length);

    const rightDelays = [...container.querySelectorAll('.RoadScene-markerRight')].map(el => el.style.animationDelay);
    expect(new Set(rightDelays).size).toBe(rightDelays.length);

    const oncomingDelays = [...container.querySelectorAll('.RoadScene-oncoming')].map(el => el.style.animationDelay);
    expect(new Set(oncomingDelays).size).toBe(oncomingDelays.length);
  });
});
