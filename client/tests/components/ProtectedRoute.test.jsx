// tests/components/ProtectedRoute.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute';

// Mock AuthContext
vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock halaman
vi.mock('../../src/pages/DashboardPage', () => ({
  default: () => <div>Halaman Dashboard</div>,
}));

vi.mock('../../src/pages/LoginPage', () => ({
  default: () => <div>Halaman Login</div>,
}));

import { useAuth } from '../../src/context/AuthContext';

describe('ProtectedRoute Component', () => {
  const renderWithRoutes = (isAuthenticated = false) => {
    // Mock useAuth hook
    useAuth.mockReturnValue({ isAuthenticated });

    return render(
      <BrowserRouter>
        <Routes>
          {/* Protected route */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<div>Halaman Dashboard</div>} />
          </Route>
          {/* Public route */}
          <Route path="/login" element={<div>Halaman Login</div>} />
        </Routes>
      </BrowserRouter>
    );
  };

  it('seharusnya merender komponen child (Dashboard) jika user sudah login', () => {
    // Render dengan user terautentikasi dan navigasi ke dashboard
    window.history.pushState({}, '', '/dashboard');
    renderWithRoutes(true); // User terautentikasi

    expect(screen.getByText(/Halaman Dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/Halaman Login/i)).not.toBeInTheDocument();
  });

  it('seharusnya redirect ke /login jika user TIDAK login', () => {
    // Render dengan user tidak terautentikasi dan navigasi ke dashboard
    window.history.pushState({}, '', '/dashboard');
    renderWithRoutes(false); // User TIDAK terautentikasi

    expect(screen.getByText(/Halaman Login/i)).toBeInTheDocument();
    expect(screen.queryByText(/Halaman Dashboard/i)).not.toBeInTheDocument();
  });
});