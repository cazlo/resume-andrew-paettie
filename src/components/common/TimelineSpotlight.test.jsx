import React from 'react';
import { render, screen } from '@testing-library/react';
import PropTypes from 'prop-types';

import { TimelineSpotlightProvider, useSpotlight, resolveSpotlight, MIN_RATIO } from './TimelineSpotlight';

describe('resolveSpotlight', () => {
  it('returns null when nothing is in the band', () => {
    expect(resolveSpotlight([])).toBeNull();
    expect(resolveSpotlight([{ target: 'a', ratio: 0 }])).toBeNull();
  });

  it('ignores rows below the flicker floor', () => {
    expect(resolveSpotlight([{ target: 'a', ratio: MIN_RATIO - 0.01 }])).toBeNull();
  });

  it('picks the row occupying most of the band', () => {
    const candidates = [
      { target: 'a', ratio: 0.3 },
      { target: 'b', ratio: 0.8 },
      { target: 'c', ratio: 0.5 },
    ];
    expect(resolveSpotlight(candidates)).toBe('b');
  });

  it('breaks an exact tie toward the earlier row, deterministically', () => {
    const candidates = [
      { target: 'a', ratio: 0.5 },
      { target: 'b', ratio: 0.5 },
    ];
    expect(resolveSpotlight(candidates)).toBe('a');
  });
});

/*
 * The jsdom IntersectionObserver stub (setupTests.js) reports every observed
 * element as fully visible, so under test the winner is always the first
 * registered row — which is exactly the tie-break the provider promises.
 */
const Row = ({ enabled, label }) => {
  const { ref, spotlit } = useSpotlight(enabled);
  return (
    <div ref={ref} data-testid={label}>
      {spotlit ? 'spotlit' : 'dark'}
    </div>
  );
};

Row.propTypes = {
  enabled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

describe('TimelineSpotlightProvider', () => {
  it('spotlights exactly one of the participating rows', () => {
    render(
      <TimelineSpotlightProvider>
        <Row enabled label="first" />
        <Row enabled label="second" />
        <Row enabled label="third" />
      </TimelineSpotlightProvider>,
    );

    expect(screen.getByTestId('first')).toHaveTextContent('spotlit');
    expect(screen.getByTestId('second')).toHaveTextContent('dark');
    expect(screen.getByTestId('third')).toHaveTextContent('dark');
  });

  it('leaves non-participating rows permanently visible', () => {
    render(
      <TimelineSpotlightProvider>
        <Row enabled label="first" />
        <Row enabled={false} label="opted-out" />
      </TimelineSpotlightProvider>,
    );

    expect(screen.getByTestId('opted-out')).toHaveTextContent('spotlit');
  });

  it('treats a row outside any provider as always visible', () => {
    render(<Row enabled label="orphan" />);

    expect(screen.getByTestId('orphan')).toHaveTextContent('spotlit');
  });
});
