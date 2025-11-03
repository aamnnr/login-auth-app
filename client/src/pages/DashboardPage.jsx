import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans dark:bg-gray-900">
      
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-4 py-4 shadow-md dark:bg-gray-800 md:px-10">
        <img src="/javis.png" alt="Javis Logo" className="h-auto w-[50px]" />
        
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/tasks" className="...">Tugas Saya</Link>
          <Link to="/manage-users" className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Kelola Pengguna
          </Link>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="rounded-md bg-[#E53935] px-5 py-2 text-sm font-bold text-white
                       transition-colors duration-300 ease-in-out hover:bg-[#C62828]"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Konten Dashboard */}
      <main className="mx-auto my-8 max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Selamat Datang di Dashboard!
        </h2>

        <hr className="my-6 border-t border-gray-200 dark:border-gray-700" />

        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Informasi User
        </h3>

        {user ? (
          <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-700">
            <p className="py-1 text-gray-700 dark:text-gray-200">
              <strong>Username:</strong> {user.username || 'Data tidak tersedia'}
            </p>
            <p className="py-1 text-gray-700 dark:text-gray-200">
              <strong>Email:</strong> {user.email || 'Data tidak tersedia'}
            </p>
          </div>
        ) : (
          <p className="mt-4 dark:text-gray-300">Memuat data user...</p>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
