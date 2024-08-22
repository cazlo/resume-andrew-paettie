import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';

import Home from './Home';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <MemoryRouter location="someLocation" context={{}}>
      <Home />
    </MemoryRouter>
  );
});
