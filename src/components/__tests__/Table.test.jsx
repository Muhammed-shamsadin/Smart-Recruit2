import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Table from '../Table';

describe('Table Component', () => {
  it('renders fallback text when no data is provided', () => {
    render(<Table data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders job details and triggers action callbacks correctly', () => {
    const mockData = [
      {
        id: 1,
        title: 'Frontend Engineer',
        description: 'Develop UI features',
        location: 'Remote',
        department: 'Engineering',
        responsibilities: 'React development',
        requirements: '3+ years experience',
        preferredSkills: 'React, Vite, Tailwind',
        type: 'Full-time',
        status: 'Accepted',
      },
    ];

    const handleAccept = vi.fn();
    const handleReject = vi.fn();

    render(
      <Table
        data={mockData}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />
    );

    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Accepted')).toBeInTheDocument();

    const acceptBtn = screen.getByRole('button', { name: /accept/i });
    fireEvent.click(acceptBtn);
    expect(handleAccept).toHaveBeenCalledWith(1);

    const rejectBtn = screen.getByRole('button', { name: /reject/i });
    fireEvent.click(rejectBtn);
    expect(handleReject).toHaveBeenCalledWith(1);
  });
});
