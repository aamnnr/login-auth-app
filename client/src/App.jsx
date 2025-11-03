import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import ManageUsersPage from './pages/ManageUsersPage';


function App() {
  return (
    <div className="min-h-screen"> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/manage-users" element={<ManageUsersPage />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;