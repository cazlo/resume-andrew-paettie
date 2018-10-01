import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

import ResumeProjectsBlock from './Projects';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter location="someLocation" context={{}}>
      <ResumeProjectsBlock projects={[]} style={{}} formatDate={() => {}} />
    </MemoryRouter>,
    div,
  );
});
