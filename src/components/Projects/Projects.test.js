import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Projects from './Projects';
import { FEATURED_PROJECT_TITLES, partitionProjects } from './projectCuration';

const project = (title, index) => ({
  title,
  subtitle: `${title} subtitle`,
  date: `date-${index}`,
  techTheme: {},
  links: [],
  technologies: [],
  content: `${title} content`,
});

const renderProjects = projects =>
  render(
    <MemoryRouter>
      <Projects projects={projects} />
    </MemoryRouter>,
  );

describe('project curation', () => {
  const featuredInput = [
    project('React Snake', 0),
    project('Archive first', 1),
    project('Fractal Zoomer', 2),
    project('Artifact Keeper', 3),
    project('Outside-In Testing Strategy', 4),
    project('Andrew Paettie.com', 5),
    project('Homelab GitOps Cluster', 6),
    project('Rocket Avionics Observability', 7),
    project('framework-fan', 8),
    project('Go and sigstore Upstream Contributions', 9),
  ];

  it('uses the intentional featured order even when input is shuffled', () => {
    const { featuredProjects } = partitionProjects(featuredInput);

    expect(featuredProjects.map(({ title }) => title)).toEqual(FEATURED_PROJECT_TITLES);
  });

  it('skips unavailable featured titles while leaving other projects in the archive', () => {
    const { featuredProjects, archiveProjects } = partitionProjects([
      project('Archive only', 10),
      project('React Snake', 11),
    ]);

    expect(featuredProjects.map(({ title }) => title)).toEqual(['React Snake']);
    expect(archiveProjects.map(({ title }) => title)).toEqual(['Archive only']);
  });

  it('keeps every project exactly once without mutating the input', () => {
    const originalOrder = featuredInput.slice();
    const { featuredProjects, archiveProjects } = partitionProjects(featuredInput);
    const curatedProjects = [...featuredProjects, ...archiveProjects];

    expect(featuredInput).toEqual(originalOrder);
    expect(curatedProjects).toHaveLength(featuredInput.length);
    expect(new Set(curatedProjects).size).toBe(featuredInput.length);
    expect(archiveProjects.map(({ title }) => title)).toEqual(['Archive first', 'Andrew Paettie.com']);
  });

  it('keeps the complete archive collapsed until its accessible disclosure is opened', () => {
    renderProjects(featuredInput);

    const archiveToggle = screen.getByRole('button', { name: /project archaeology/i });
    expect(archiveToggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Andrew Paettie.com')).toBeNull();

    archiveToggle.focus();
    expect(archiveToggle).toHaveFocus();
    userEvent.click(archiveToggle);

    expect(archiveToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Andrew Paettie.com')).toBeInTheDocument();
    expect(screen.getByText('Archive first')).toBeInTheDocument();
  });

  it('renders each project in either the featured timeline or the archive, never both', () => {
    renderProjects(featuredInput);
    userEvent.click(screen.getByRole('button', { name: /project archaeology/i }));

    const timelines = [
      within(screen.getByLabelText('Featured projects timeline')),
      within(screen.getByLabelText('Project archaeology timeline')),
    ];

    featuredInput.forEach(({ title }) => {
      const occurrences = timelines.filter(timeline => timeline.queryByText(title)).length;
      expect(occurrences).toBe(1);
    });
  });
});
