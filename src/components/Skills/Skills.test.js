import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

import Skills from './Skills';
import content from '../../common/content';

it('renders skills with no data without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter location="someLocation" context={{}}>
      <Skills skills={[]} tools={[]} styles={{}} />
    </MemoryRouter>,
    div,
  );
});

it('renders skills with real data without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter location="someLocation" context={{}}>
      <Skills skills={content.skills} tools={content.tools} styles={{}} />
    </MemoryRouter>,
    div,
  );
});
