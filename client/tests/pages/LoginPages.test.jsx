import React from 'react';
// 1. Impor MemoryRouter
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import LoginPage from '../../src/pages/LoginPage.jsx'; 
import api from '../../src/api'; 
import { useAuth } from '../../src/context/AuthContext.jsx'; 
import { useNavigate, Link } from 'react-router-dom';

// --- Mocks ---
vi.mock('../../src/api', () => ({
  default: {
    post: vi.fn(), 
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, 
    useNavigate: () => mockNavigate, 
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

const mockLogin = vi.fn();
vi.mock('../../src/context/AuthContext.jsx', () => ({
  useAuth: () => ({
    login: mockLogin, 
  }),
}));

// --- Tes ---
describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show client-side error if fields are empty', async () => {
    // 2. Bungkus dengan MemoryRouter
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    const form = screen.getByRole('button', { name: /Login/i }).closest('form');
    fireEvent.submit(form);
    expect(await screen.findByText(/wajib diisi/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('should show API error on failed login', async () => {
    // 3. Bungkus dengan MemoryRouter
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    
    const user = userEvent.setup();
    const apiErrorMsg = 'Password yang Anda masukkan salah';
    api.post.mockRejectedValueOnce({ 
      response: { data: { msg: apiErrorMsg } },
    });
    
    await user.type(screen.getByLabelText(/Email atau Username/i), 'user@test.com');
    await user.type(screen.getByLabelText(/Password/i), 'salahpassword');
    await user.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText(apiErrorMsg)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should call login() and navigate on successful login', async () => {
    // 4. Bungkus dengan MemoryRouter
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    
    const user = userEvent.setup();
    const mockUserData = { username: 'testuser', email: 'user@test.com' };
    api.post.mockResolvedValueOnce({
      data: { user: mockUserData },
    });

    await user.type(screen.getByLabelText(/Email atau Username/i), 'user@test.com');
    await user.type(screen.getByLabelText(/Password/i), 'passwordbenar');
    await user.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockUserData);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});