import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { createRoot } from 'react-dom/client';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkAndEducation from './WorkAndEducation';
import { educationDetail } from './detailModel';
import content from '../../common/content';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <MemoryRouter location="someLocation" context={{}}>
      <WorkAndEducation positions={[]} educations={[]} styles={{}} formatDate={() => {}} />
    </MemoryRouter>,
  );
});

describe('resume content', () => {
  it('keeps every tile summary to a single line', () => {
    // The point of the drill-down is that tiles stay scannable, so a summary is
    // a lone string rather than the multi-line fragments they used to carry.
    content.positions.forEach(position => {
      expect(typeof position.summary.props.children).toBe('string');
    });
  });

  it('gives every position something worth drilling into', () => {
    content.positions.forEach(position => {
      expect(position.detail.highlights.length).toBeGreaterThan(0);
    });
  });

  it('gives every position a scannable impact statement', () => {
    content.positions.forEach(position => {
      expect(position.impact).toEqual(expect.any(String));
      expect(position.impact.length).toBeGreaterThan(0);
    });
  });

  it('keeps GPA out of the public education detail', () => {
    const detail = educationDetail(content.educations[0]);

    expect(detail.chipGroups.map(group => group.label)).not.toContain('GPA');
  });
});

describe('timeline drill-down', () => {
  // A fixture rather than a real entry from content.jsx: those carry imported
  // SVG icons, which the jest asset mock turns into undefined components. See
  // AGENTS.md.
  const position = {
    title: 'Staff Engineer',
    company: 'Example Corp',
    startDate: '2020',
    endDate: '2024',
    summary: <span>One scannable line.</span>,
    impact: 'Made a measurable difference.',
    domains: [{ name: 'Space' }],
    tech: [{ name: 'Kubernetes' }],
    detail: {
      overview: <span>The longer version.</span>,
      highlights: ['Did a notable thing.', 'Did another notable thing.'],
      links: [{ url: 'https://example.com', text: 'Read more' }],
    },
  };

  const renderTimeline = () =>
    render(
      <MemoryRouter location="someLocation" context={{}}>
        <WorkAndEducation positions={[position]} educations={[]} />
      </MemoryRouter>,
    );

  it('shows only the summary until a tile is clicked', () => {
    renderTimeline();

    expect(screen.getByText('One scannable line.')).toBeInTheDocument();
    expect(screen.getByText('Made a measurable difference.')).toBeInTheDocument();
    expect(screen.queryByText('Did a notable thing.')).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens a dialog with the detail behind the tile', async () => {
    renderTimeline();

    userEvent.click(screen.getByRole('button', { name: /show details/i }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Staff Engineer')).toBeInTheDocument();
    expect(within(dialog).getByText('2020 – 2024')).toBeInTheDocument();
    expect(within(dialog).getByText('The longer version.')).toBeInTheDocument();
    position.detail.highlights.forEach(highlight => {
      expect(within(dialog).getByText(highlight)).toBeInTheDocument();
    });
    expect(within(dialog).getByRole('link', { name: 'Read more' })).toHaveAttribute('href', 'https://example.com');
  });

  it('closes the dialog again', async () => {
    renderTimeline();
    userEvent.click(screen.getByRole('button', { name: /show details/i }));
    const dialog = await screen.findByRole('dialog');

    userEvent.click(within(dialog).getByRole('button', { name: /close/i }));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
