import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

import WorkAndEducationBlock from './WorkAndEducationBlock';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter location="someLocation" context={{}}>
      <WorkAndEducationBlock positions={[]} educations={[]} styles={{}} formatDate={() => {}} />
    </MemoryRouter>,
    div,
  );
});
