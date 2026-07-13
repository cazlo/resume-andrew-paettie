import React from 'react';
import { render, screen } from '@testing-library/react';

import { ConfigPanel } from './ConfigPanel';
import Action from './actions/Action';

const props = {
  algorithm: Action.ALGORITHMS.astar,
  changeName: jest.fn(),
  computedFrameTimeout: 10000,
  frameTimeout: 5000,
  numCols: 18,
  numRows: 12,
  playerName: 'SKYNET',
  setAlgorithm: jest.fn(),
  setFrameLimit: jest.fn(),
  setSize: jest.fn(),
  setSpeed: jest.fn(),
  showPath: true,
  speed: 10,
  toggleShowPath: jest.fn(),
  toggleWallsAreFatal: jest.fn(),
  wallsAreFatal: true,
};

describe('ConfigPanel', () => {
  it('renders visible labels for both game-size controls', () => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    render(<ConfigPanel {...props} />);

    expect(screen.getByText('Height: 12')).toBeVisible();
    expect(screen.getByText('Width: 18')).toBeVisible();
    expect(screen.getByTestId('game-size-width-track')).toHaveStyle({ width: '100%' });
  });
});
