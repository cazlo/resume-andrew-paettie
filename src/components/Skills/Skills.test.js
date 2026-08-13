import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import Skills from './Skills';
import SkillTable from './SkillTable';

const experience = {
  toNumber: () => 1,
  toTimeline: () => '2024 - current',
  lastUsed: () => 2024,
};

const skill = name => ({ name, icon: <span />, experience, frameworks: [] });

const testSkills = {
  technical: {
    languages: ['JavaScript', 'TypeScript', 'Node', 'React', 'Python', 'Rust', 'Go'].map(skill),
    persistence: ['SQL', 'postgres', 'DynamoDB'].map(skill),
    cloud: ['AWS', 'EKS'].map(skill),
    operational: [
      'Terraform',
      'Docker',
      'Kubernetes',
      'Prometheus',
      'OpenTelemetry',
      'GitHub Actions',
      'ArgoCD',
      'Trivy',
      'semgrep',
      'sigstore / cosign',
    ].map(skill),
  },
};

describe('Skills', () => {
  it('renders a compact staff-level summary with the full technical matrix closed', () => {
    render(<Skills skills={testSkills} />);

    expect(screen.getByRole('heading', { name: 'Platform & Reliability' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Languages & Application Engineering',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Security & Delivery' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How I work' })).toBeInTheDocument();
    expect(screen.getByText(/engineering leadership/i)).toBeInTheDocument();
    expect(screen.queryByText('Soft Skills')).not.toBeInTheDocument();
    expect(screen.queryByText('Day-to-Day Experience')).not.toBeInTheDocument();

    const disclosure = screen.getByRole('button', {
      name: /explore the full skills matrix/i,
    });
    expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  });

  it('reveals the full technical matrix through its accessible disclosure', () => {
    render(<Skills skills={testSkills} />);

    const disclosure = screen.getByRole('button', {
      name: /explore the full skills matrix/i,
    });
    fireEvent.click(disclosure);

    expect(disclosure).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Programming Languages')).toBeInTheDocument();
    expect(screen.getAllByText('Day-to-Day Experience')).toHaveLength(4);
    expect(screen.queryByText('Customer Service')).not.toBeInTheDocument();
  });
});

describe('SkillTable', () => {
  it('sorts framework chips without mutating the incoming array', () => {
    const frameworks = [
      {
        name: 'Older',
        icon: <span />,
        experience: {
          toNumber: () => 1,
          toTimeline: () => '2020',
          lastUsed: () => 2020,
        },
      },
      {
        name: 'Newer',
        icon: <span />,
        experience: {
          toNumber: () => 1,
          toTimeline: () => '2024',
          lastUsed: () => 2024,
        },
      },
    ];
    const rows = [
      {
        name: 'Example',
        icon: <span />,
        experience: {
          toNumber: () => 1,
          toTimeline: () => '2020 - 2024',
          lastUsed: () => 2024,
        },
        frameworks,
      },
    ];

    render(<SkillTable rows={rows} />);

    expect(frameworks.map(framework => framework.name)).toEqual(['Older', 'Newer']);
  });
});
