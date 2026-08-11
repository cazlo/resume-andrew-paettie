import React from 'react';
import { render } from '@testing-library/react';

import RunnersScene from './RunnersScene';

describe('RunnersScene', () => {
  it('renders into the SceneLayer contract with its wash and glow', () => {
    const { container } = render(<RunnersScene />);

    const layer = container.querySelector('.SceneLayer.RunnersScene');
    expect(layer).toBeInTheDocument();
    expect(layer.style.getPropertyValue('--scene-wash')).toContain('linear-gradient');
    expect(layer.style.getPropertyValue('--scene-glow')).toBe('#d7ff3e');
  });

  it('draws a single full-frame svg', () => {
    const { container } = render(<RunnersScene />);

    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(1);
    expect(svgs[0]).toHaveAttribute('viewBox', '0 0 1000 600');
  });

  it('renders every runner, staggered across the three lane depths', () => {
    const { container } = render(<RunnersScene />);

    expect(container.querySelectorAll('.RunnersScene-runner--far')).toHaveLength(1);
    expect(container.querySelectorAll('.RunnersScene-runner--mid')).toHaveLength(2);
    expect(container.querySelectorAll('.RunnersScene-runner--near')).toHaveLength(2);
  });

  it('gives every runner both stride poses to swap between', () => {
    const { container } = render(<RunnersScene />);

    const runners = container.querySelectorAll('.RunnersScene-runner');
    runners.forEach(runner => {
      expect(runner.querySelector('.RunnersScene-poseA')).toBeInTheDocument();
      expect(runner.querySelector('.RunnersScene-poseB')).toBeInTheDocument();
    });
  });

  it('draws the perspective track as its own ground plane', () => {
    const { container } = render(<RunnersScene />);

    expect(container.querySelector('.RunnersScene-track')).toBeInTheDocument();
    expect(container.querySelector('.RunnersScene-lanes')).toBeInTheDocument();
    expect(container.querySelector('.RunnersScene-horizon')).toBeInTheDocument();
  });
});
