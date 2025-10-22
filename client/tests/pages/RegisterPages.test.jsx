import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterPage from '../../src/pages/RegisterPage';
import api from '../../src/api'; // Mock
import { useNavigate, Link } from 'react-router-dom'; // Mock

// --- 1. Setup Mocks ---

// Mock 'api.js'
vi.mock('../../src/api', () => ({
  default: {
    post: vi.fn(), // Mock fungsi 'post'
  },
}));

// Mock 'react-router-dom'
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    // Kita juga perlu mock <Link> agar tidak error
    Link: ({ children, to }) => <a href={to}>{children}</a>, 
  };
});

// Mock 'window.alert'
// Fungsi 'alert' tidak ada di JSDOM, jadi kita mock
window.alert = vi.fn();

// --- 2. Tulis Tes ---
describe('RegisterPage Component', () => {

  // Bersihkan semua mock (api.post, mockNavigate, window.alert)
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Tes 1: Menampilkan error jika password tidak cocok
  it('should show error if passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    // Isi form
    await user.type(screen.getByLabelText(/Username/i), 'testuser');
    await user.type(screen.getByLabelText(/Email/i), 'test@email.com');
    await user.type(screen.getByLabelText(/^Password/i), 'password123'); // ^Password = yang awal
    await user.type(screen.getByLabelText(/Konfirmasi Password/i), 'passwordBEDA'); // Beda

    // Klik tombol Daftar
    await user.click(screen.getByRole('button', { name: /Daftar/i }));

    // Harapkan pesan error "tidak cocok" muncul
    expect(await screen.findByText(/tidak cocok/i)).toBeInTheDocument();
    
    // Pastikan API tidak dipanggil
    expect(api.post).not.toHaveBeenCalled();
  });

  // Tes 2: Menampilkan error jika ada field kosong (menggunakan fireEvent)
  it('should show client-side error if fields are empty', async () => {
    render(<RegisterPage />);

    // Langsung picu submit di form untuk bypass validasi 'required'
    const form = screen.getByRole('button', { name: /Daftar/i }).closest('form');
    fireEvent.submit(form);

    // Harapkan pesan error "wajib diisi"
    expect(await screen.findByText(/wajib diisi/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  // Tes 3: Menampilkan error dari API (misal: email sudah ada)
  it('should show API error on failed registration', async () => {
    const user = userEvent.setup();
    const apiErrorMsg = 'Email sudah terdaftar';

    // Atur mock 'api.post' untuk GAGAL
    api.post.mockRejectedValueOnce({
      response: { data: { msg: apiErrorMsg } },
    });

    render(<RegisterPage />);

    // Isi form dengan benar
    await user.type(screen.getByLabelText(/Username/i), 'testuser');
    await user.type(screen.getByLabelText(/Email/i), 'test@email.com');
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Konfirmasi Password/i), 'password123');
    
    // Klik Daftar
    await user.click(screen.getByRole('button', { name: /Daftar/i }));

    // Harapkan pesan error dari API muncul
    expect(await screen.findByText(apiErrorMsg)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Tes 4: Berhasil mendaftar dan navigasi ke /login
  it('should call alert and navigate to /login on successful registration', async () => {
    const user = userEvent.setup();

    // Atur mock 'api.post' untuk SUKSES
    api.post.mockResolvedValueOnce({
      status: 201,
      data: { msg: 'User berhasil terdaftar' },
    });

    render(<RegisterPage />);

    // Isi form dengan benar
    await user.type(screen.getByLabelText(/Username/i), 'userbaru');
    await user.type(screen.getByLabelText(/Email/i), 'userbaru@email.com');
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Konfirmasi Password/i), 'password123');
    
    // Klik Daftar
    await user.click(screen.getByRole('button', { name: /Daftar/i }));

    // Tunggu (waitFor) karena ada proses async
    // Pastikan 'api.post' dipanggil dengan data yang benar
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        username: 'userbaru',
        email: 'userbaru@email.com',
        password: 'password123',
      });
    });

    // Pastikan 'alert' dipanggil
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Registrasi berhasil!'));
    
    // Pastikan navigasi dipanggil ke /login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});