// client/src/components/ProtectedRoute.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Ambil status autentikasi

  if (!isAuthenticated) {
    // Jika tidak login, redirect paksa ke halaman login
    return <Navigate to="/login" replace />; 
  }

  // Jika sudah login, tampilkan halaman yang seharusnya (misal: Dashboard)
  return <Outlet />; 
};

export default ProtectedRoute;