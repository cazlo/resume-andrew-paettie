import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

import Skills from './Skills';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter location="someLocation" context={{}}>
      <Skills skills={[]} tools={<span>Tool</span>} styles={{}} />
    </MemoryRouter>,
    div,
  );
});
