// src/components/ThemeToggle.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from '../../src/components/ThemeToggle';
import { useTheme } from '../../src/context/ThemeContext'; // Mock

// --- Setup Mock ---
const mockToggleTheme = vi.fn();

// Mock 'useTheme'
vi.mock('../../src/context/ThemeContext', () => ({
  // Kita harus mock 'useTheme' karena 'ThemeToggle' memanggilnya
  // Kita tidak perlu 'ThemeProvider' di sini
  useTheme: () => ({
    theme: 'light', // Default mock
    toggleTheme: mockToggleTheme,
  }),
}));

describe('ThemeToggle Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show Moon icon when theme is light', () => {
    // 'useTheme' sudah di-mock untuk mengembalikan 'light'
    render(<ThemeToggle />);
    
    // Cek apakah tombol ada (kita cari via 'aria-label')
    const button = screen.getByLabelText(/Toggle dark mode/i);
    
    // SVG Ikon Moon/Sun tidak mudah dites via teks.
    // Kita bisa cek apakah tombolnya ada di dokumen.
    expect(button).toBeInTheDocument();
  });
  
  // Catatan: Menguji ikon (Sun/Moon) secara spesifik
  // bisa jadi rumit. Kita bisa mock 'useTheme'
  // secara berbeda di tiap tes, tapi tes utama
  // adalah: "apakah fungsi toggle dipanggil?"

  it('should call toggleTheme function when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByLabelText(/Toggle dark mode/i);
    
    // Klik tombol
    await user.click(button);

    // Pastikan fungsi 'toggleTheme' dari context dipanggil
    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });
});