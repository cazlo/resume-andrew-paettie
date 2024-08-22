import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { createRoot } from 'react-dom/client';
import WorkAndEducation from './WorkAndEducation';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <MemoryRouter location="someLocation" context={{}}>
      <WorkAndEducation positions={[]} educations={[]} styles={{}} formatDate={() => {}} />
    </MemoryRouter>,
  );
});
