import React from 'react';
import { render } from '@testing-library/react';

import ExperienceBackdrop from './ExperienceBackdrop';

/*
 * The IntersectionObserver stub in setupTests.js reports every observed target
 * as fully visible, so whichever [data-scene] elements exist in the document
 * decide the outcome here.
 */
describe('ExperienceBackdrop', () => {
  it('renders no scene when the page has no scene targets', () => {
    const { container } = render(<ExperienceBackdrop />);

    expect(container.querySelector('.ExperienceBackdrop')).toBeInTheDocument();
    expect(container.querySelector('.ExperienceBackdrop-slot')).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass('has-scene');
  });

  it('renders the scene for the tile in view and flags it on the body', () => {
    const { container } = render(
      <div>
        <div data-scene="lunar">Blue Origin</div>
        <ExperienceBackdrop />
      </div>,
    );

    expect(container.querySelector('.LunarScene')).toBeInTheDocument();
    // The class is what pulls the vaporwave sunset and the light cycles back.
    expect(document.body).toHaveClass('has-scene');
  });

  it('ignores a scene id that has no component yet', () => {
    const { container } = render(
      <div>
        <div data-scene="not-built-yet">Somewhere</div>
        <ExperienceBackdrop />
      </div>,
    );

    expect(container.querySelector('.SceneLayer')).not.toBeInTheDocument();
  });

  it('clears the body flag when it unmounts', () => {
    const { unmount } = render(
      <div>
        <div data-scene="lunar">Blue Origin</div>
        <ExperienceBackdrop />
      </div>,
    );
    expect(document.body).toHaveClass('has-scene');

    unmount();
    expect(document.body).not.toHaveClass('has-scene');
  });
});
