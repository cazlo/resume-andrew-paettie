import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { createRoot } from 'react-dom/client';
import Skills from './Skills';
import content from '../../common/content';

it('renders skills with no data without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <MemoryRouter location="someLocation" context={{}}>
      <Skills skills={[]} tools={[]} styles={{}} />
    </MemoryRouter>,
  );
});

it('renders skills with real data without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <MemoryRouter location="someLocation" context={{}}>
      <Skills skills={content.skills} tools={content.tools} styles={{}} />
    </MemoryRouter>,
  );
});
