import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { useAuth } from '../../src/context/AuthContext';

// --- Mock Context dan Halaman ---
vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../src/pages/DashboardPage', () => ({
  default: () => <div>Halaman Dashboard</div>,
}));

vi.mock('../../src/pages/LoginPage', () => ({
  default: () => <div>Halaman Login</div>,
}));

describe('ProtectedRoute Component', () => {

  const renderWithRoutes = (isAuthenticated = false) => {
    useAuth.mockReturnValue({ isAuthenticated });

    return render(
      <BrowserRouter>
        <Routes>
          {/* Protected Route */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<div>Halaman Dashboard</div>} />
          </Route>

          {/* Public Route */}
          <Route path="/login" element={<div>Halaman Login</div>} />
        </Routes>
      </BrowserRouter>
    );
  };

  it('renders child component (Dashboard) if user is authenticated', () => {
    window.history.pushState({}, '', '/dashboard');
    renderWithRoutes(true);

    expect(screen.getByText(/Halaman Dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/Halaman Login/i)).not.toBeInTheDocument();
  });

  it('redirects to /login if user is NOT authenticated', () => {
    window.history.pushState({}, '', '/dashboard');
    renderWithRoutes(false);

    expect(screen.getByText(/Halaman Login/i)).toBeInTheDocument();
    expect(screen.queryByText(/Halaman Dashboard/i)).not.toBeInTheDocument();
  });
});
