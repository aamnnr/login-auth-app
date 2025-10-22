import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'react-feather';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans dark:bg-gray-900">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 md:p-12">
        
        {/* Tombol Toggle Dark Mode */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <ThemeToggle />
        </div>
        
        <img 
          src="/javis.png" 
          alt="Javis Logo" 
          className="mx-auto mb-6 w-[120px]"
        />
        
        <h1 className="mb-4 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          Selamat Datang di Aplikasi Demo Saya
        </h1>
        
        <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-300">
          Ini adalah proyek demonstrasi untuk alur autentikasi MERN Stack.
        </p>

        {/* Kotak Informasi Proyek */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-700">
          <h2 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
            Tentang Proyek Ini
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Proyek ini mengimplementasikan sistem login yang aman menggunakan JWT (JSON Web Tokens) yang disimpan dalam HttpOnly Cookies.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Frontend:</strong> React, React Router, Tailwind CSS</li>
            <li><strong>Backend:</strong> Node.js, Express, JWT, bcryptjs</li>
            <li><strong>Fitur:</strong> Dark Mode, Rate Limiting, Unit Testing</li>
          </ul>
        </div>
        
        {/* Tombol Aksi */}
        <Link
          to="/login"
          className="mt-4 flex w-full items-center justify-center rounded-md bg-[#E53935] px-5 py-3 text-lg font-bold text-white transition-colors duration-300 hover:bg-[#C62828]"
        >
          <LogIn className="mr-2 h-5 w-5" />
          <span>Login</span>
        </Link>
        
        <Link
          to="/register"
          className="mt-4 flex w-full items-center justify-center rounded-md bg-[#E53935] px-5 py-3 text-lg font-bold text-white transition-colors duration-300 hover:bg-[#C62828]"
        >
          <LogIn className="mr-2 h-5 w-5" />
          <span>Register User</span>
        </Link>

      </div>
    </div>
  );
};

export default LandingPage;
