import navigationButtons from './navigationButtons';

it('keeps the navigation in the portfolio narrative order with stable scroll targets', () => {
  expect(navigationButtons.map(({ label, name }) => ({ label, name }))).toEqual([
    { label: 'Home', name: 'Resume-home' },
    { label: 'Experience', name: 'ResumeExperience' },
    { label: 'Projects', name: 'ResumeProjects' },
    { label: 'Skills', name: 'ResumeSkills' },
    { label: 'About Me', name: 'ResumeAboutMe' },
  ]);
  expect(navigationButtons.slice(1).every(({ offset }) => offset < 0)).toBe(true);
});
