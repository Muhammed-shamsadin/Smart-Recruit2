import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotificationDep from '../NotificationDep';

describe('NotificationDep Component', () => {
  it('renders the notification message correctly', () => {
    const message = 'Department added successfully!';
    render(<NotificationDep message={message} type="success" onClose={() => {}} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('calls onClose callback after 3 seconds timeout', () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();

    render(<NotificationDep message="Success" type="success" onClose={handleClose} />);

    expect(handleClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
