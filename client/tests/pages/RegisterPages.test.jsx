import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterPage from '../../src/pages/RegisterPage';
import api from '../../src/api';
import { useNavigate, Link } from 'react-router-dom';

// --- Mocks ---
vi.mock('../../src/api', () => ({
  default: { post: vi.fn() },
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

// Mock window.alert
window.alert = vi.fn();

// --- Tests ---
describe('RegisterPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows error if passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/Username/i), 'testuser');
    await user.type(screen.getByLabelText(/Email/i), 'test@email.com');
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Konfirmasi Password/i), 'passwordBEDA');
    await user.click(screen.getByRole('button', { name: /Daftar/i }));

    expect(await screen.findByText(/tidak cocok/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('shows client-side error if fields are empty', async () => {
    render(<RegisterPage />);

    const form = screen.getByRole('button', { name: /Daftar/i }).closest('form');
    fireEvent.submit(form);

    expect(await screen.findByText(/wajib diisi/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('shows API error on failed registration', async () => {
    const user = userEvent.setup();
    const apiErrorMsg = 'Email sudah terdaftar';
    api.post.mockRejectedValueOnce({ response: { data: { msg: apiErrorMsg } } });

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/Username/i), 'testuser');
    await user.type(screen.getByLabelText(/Email/i), 'test@email.com');
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Konfirmasi Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Daftar/i }));

    expect(await screen.findByText(apiErrorMsg)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('calls alert and navigates to /login on successful registration', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValueOnce({ status: 201, data: { msg: 'User berhasil terdaftar' } });

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/Username/i), 'userbaru');
    await user.type(screen.getByLabelText(/Email/i), 'userbaru@email.com');
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Konfirmasi Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Daftar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        username: 'userbaru',
        email: 'userbaru@email.com',
        password: 'password123',
      });
    });

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Registrasi berhasil!'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
