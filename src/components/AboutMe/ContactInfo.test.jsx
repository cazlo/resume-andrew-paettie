import React from 'react';
import { render, screen } from '@testing-library/react';
import ContactInfo from './ContactInfo';

jest.mock('devicon/icons/linkedin/linkedin-original.svg', () => ({ ReactComponent: 'svg' }));
jest.mock('../../common/techTheme', () => ({ github: { whiteIcon: null } }));

it('shows direct contact profiles without publishing stale resume downloads', () => {
  render(<ContactInfo />);

  expect(screen.getByText('Email')).toBeInTheDocument();
  expect(screen.getByText('GitHub')).toBeInTheDocument();
  expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  expect(screen.queryByText(/resume pdf/i)).toBeNull();
  expect(screen.queryByText(/resume docx/i)).toBeNull();
});
