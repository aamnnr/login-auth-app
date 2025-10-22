// src/pages/DashboardPage.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from '../../src/pages/DashboardPage';
import { useAuth } from '../../src/context/AuthContext'; // Mock
import { useNavigate } from 'react-router-dom'; // Mock
import { ThemeProvider } from '../../src/context/ThemeContext';
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock 'useAuth'
const mockLogout = vi.fn();
const mockUser = { username: 'Test Javis', email: 'test@javis.com' };

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,    // Sediakan mock user
    logout: mockLogout, // Sediakan mock fungsi logout
  }),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// --- Helper untuk merender dengan semua provider ---
// DashboardPage menggunakan useAuth dan ThemeContext (via ThemeToggle)
// Jadi kita harus menyediakannya saat render
const renderDashboard = () => {
  return render(
    <ThemeProvider>
      <DashboardPage />
    </ThemeProvider>
  );
};

// --- Tulis Tes ---
describe('DashboardPage Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render welcome message and user info correctly', () => {
    renderDashboard();

    // Cek apakah sapaan selamat datang ada
    expect(screen.getByText(/Selamat Datang di Dashboard/i)).toBeInTheDocument();
    
    // Cek apakah nama user dari mock 'useAuth' tampil
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('should call logout() and navigate to /login when logout button is clicked', async () => {
    const user = userEvent.setup();
    renderDashboard();

    // Cari tombol Logout
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    
    // Klik tombolnya
    await user.click(logoutButton);

    // Pastikan fungsi 'logout' dari context dipanggil
    expect(mockLogout).toHaveBeenCalledOnce();
    
    // Pastikan 'navigate' dipanggil untuk pindah ke /login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});