import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

import Projects from './Projects';
import content from '../../common/content';

// eslint-disable-next-line func-names
const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn(),
  };
};

window.IntersectionObserver = mock;

it('renders nothing without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter location="someLocation" context={{}}>
      <Projects projects={[]} style={{}} />
    </MemoryRouter>,
    div,
  );
});

it('renders content without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter location="someLocation" context={{}}>
      <Projects projects={content.projects} style={{}} />
    </MemoryRouter>,
    div,
  );
});
