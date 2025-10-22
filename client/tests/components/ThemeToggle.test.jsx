import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from '../../src/components/ThemeToggle';
import { useTheme } from '../../src/context/ThemeContext';

// --- Setup Mock ---
const mockToggleTheme = vi.fn();

vi.mock('../../src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light', // Default mock
    toggleTheme: mockToggleTheme,
  }),
}));

describe('ThemeToggle Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the toggle button with Moon icon when theme is light', () => {
    render(<ThemeToggle />);
    const button = screen.getByLabelText(/Toggle dark mode/i);
    expect(button).toBeInTheDocument();
  });

  it('calls toggleTheme function when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByLabelText(/Toggle dark mode/i);

    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });
});
