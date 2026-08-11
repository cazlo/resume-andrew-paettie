import React from 'react';
import { render, screen } from '@testing-library/react';

import GameOutcomeOverlay from './GameOutcomeOverlay';
import GameState from './util/GameState';

describe('GameOutcomeOverlay', () => {
  it('shows a victory message for a won game', () => {
    render(<GameOutcomeOverlay state={GameState.WON} score={36} perfectScore={36} />);

    expect(screen.getByRole('status')).toHaveTextContent('PERFECT GAME');
    expect(screen.getByRole('status')).toHaveTextContent('Board cleared');
    expect(screen.getByRole('status')).toHaveTextContent('Score: 36 / 36');
  });

  it('shows a loss message for game over', () => {
    render(<GameOutcomeOverlay state={GameState.GAME_OVER} score={12} perfectScore={36} />);

    expect(screen.getByRole('status')).toHaveTextContent('GAME OVER');
    expect(screen.getByRole('status')).toHaveTextContent('Game over');
  });

  it('stays hidden while the game is playing', () => {
    render(<GameOutcomeOverlay state={GameState.PLAYING} score={0} perfectScore={36} />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
