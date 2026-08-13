import React from 'react';
import { render } from '@testing-library/react';

import Resume from './Resume';

/* eslint-disable react/prop-types */

jest.mock('react-scroll', () => {
  const Element = ({ children, name }) =>
    React.createElement('div', { 'data-anchor': name || 'Resume-home' }, children);

  return {
    __esModule: true,
    default: {
      Element,
      scroller: { scrollTo: jest.fn() },
    },
  };
});

jest.mock('../../common/content', () => ({
  __esModule: true,
  default: {
    educations: [],
    positions: [],
    projects: [],
    skills: {},
    tools: {},
  },
}));

jest.mock('../../components/Home/Home', () => () => React.createElement('section', { 'data-testid': 'home' }));
jest.mock(
  '../../components/WorkAndEducation/WorkAndEducation',
  () => () => React.createElement('section', { 'data-testid': 'experience' }),
);
jest.mock(
  '../../components/Projects/Projects',
  () => () => React.createElement('section', { 'data-testid': 'projects' }),
);
jest.mock('../../components/Skills/Skills', () => () => React.createElement('section', { 'data-testid': 'skills' }));
jest.mock('../../components/AboutMe/AboutMe', () => () => React.createElement('section', { 'data-testid': 'about' }));
jest.mock(
  '../../components/Copyright/Copyright',
  () => () => React.createElement('section', { 'data-testid': 'footer' }),
);
jest.mock(
  '../../components/BottomNav/BottomNav',
  () => () => React.createElement('section', { 'data-testid': 'bottom-nav' }),
);
jest.mock(
  '../../components/common/LightCycles',
  () => () => React.createElement('section', { 'data-testid': 'light-cycles' }),
);
jest.mock(
  '../../components/ExperienceBackdrop/ExperienceBackdrop',
  () => () =>
    React.createElement('section', {
      'data-testid': 'experience-backdrop',
    }),
);

it('renders the narrative in order and keeps fixed decorative layers last', () => {
  const { container } = render(<Resume />);
  const resume = container.querySelector('.Resume');

  expect(
    Array.from(resume.children)
      .slice(0, 5)
      .map(child => child.dataset.anchor),
  ).toEqual(['Resume-home', 'ResumeExperience', 'ResumeProjects', 'ResumeSkills', 'ResumeAboutMe']);
  expect(
    Array.from(resume.children)
      .slice(-2)
      .map(child => child.dataset.testid),
  ).toEqual(['light-cycles', 'experience-backdrop']);
});
