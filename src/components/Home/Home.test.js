import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Scroll from 'react-scroll';

import Home from './Home';

jest.mock('react-scroll', () => ({
  __esModule: true,
  default: {
    scroller: {
      scrollTo: jest.fn(),
    },
  },
}));

jest.mock('./GridBackground/GridBackground', () => () => <div data-testid="hero-grid" />);

beforeEach(() => {
  Scroll.scroller.scrollTo.mockClear();
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

it('presents the platform engineering focus and direct section shortcuts', () => {
  render(<Home />);

  expect(screen.getByRole('heading', { level: 1, name: 'Drew Paettie' })).toBeInTheDocument();
  expect(
    screen.getByRole('heading', {
      level: 2,
      name: 'Staff platform engineer building secure, reliable distributed systems',
    }),
  ).toBeInTheDocument();
  expect(screen.getByText('Kubernetes · AWS · SRE · Security · Aerospace')).toBeInTheDocument();
  expect(screen.getByText('Based in Washington')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'View experience' }));
  expect(Scroll.scroller.scrollTo).toHaveBeenCalledWith('ResumeExperience', {
    duration: 500,
    offset: -18,
    smooth: true,
  });

  fireEvent.click(screen.getByRole('button', { name: 'Featured projects' }));
  expect(Scroll.scroller.scrollTo).toHaveBeenLastCalledWith('ResumeProjects', {
    duration: 500,
    offset: -18,
    smooth: true,
  });
});

it('disables smooth scrolling when reduced motion is preferred', () => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
  render(<Home />);

  fireEvent.click(screen.getByRole('button', { name: 'View experience' }));

  expect(Scroll.scroller.scrollTo).toHaveBeenCalledWith('ResumeExperience', {
    duration: 0,
    offset: -18,
    smooth: false,
  });
});
