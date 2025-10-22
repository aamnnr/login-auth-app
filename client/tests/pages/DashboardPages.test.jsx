import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from '../../src/pages/DashboardPage';
import { ThemeProvider } from '../../src/context/ThemeContext';

const mockNavigate = vi.fn();
const mockLogout = vi.fn();
const mockUser = { username: 'Test Javis', email: 'test@javis.com' };

// Mock useNavigate dari react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth
vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
  }),
}));

// Mock matchMedia untuk Tailwind dark mode
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Helper render untuk DashboardPage dengan ThemeProvider
const renderDashboard = () => render(
  <ThemeProvider>
    <DashboardPage />
  </ThemeProvider>
);

describe('DashboardPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome message and user info correctly', () => {
    renderDashboard();

    expect(screen.getByText(/Selamat Datang di Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('calls logout() and navigates to /login when logout button is clicked', async () => {
    const user = userEvent.setup();
    renderDashboard();

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
