import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'react-feather';
import api from '../api'; // Instance Axios Anda

function RegisterPage() {
  // State untuk semua field
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State untuk UX
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Fungsi submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validasi Sisi Klien
    if (!username || !email || !password || !confirmPassword) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 2. Panggil API Registrasi
      await api.post('/auth/register', {
        username,
        email,
        password,
      });
      
      setLoading(false);
      alert('Registrasi berhasil! Silakan login dengan akun baru Anda.');
      navigate('/login'); // Arahkan ke halaman login setelah sukses

    } catch (err) {
      // 3. Tangani Error dari Backend
      setLoading(false);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg); // Misal: "Email sudah terdaftar"
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  // Style untuk input (bisa dibuat konstan agar rapi)
  const inputClassName = `w-full rounded-md border px-3 py-3 text-base
                          border-gray-300 bg-white text-gray-900
                          dark:border-gray-600 dark:bg-gray-700 dark:text-white
                          focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E53935]`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 font-sans dark:bg-gray-900">
      
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 md:p-10">
        
        <img 
          src="/javis.png" 
          alt="Javis Logo" 
          className="mx-auto mb-5 w-[100px]"
        />
        
        <h2 className="mb-6 text-center text-xl font-bold text-gray-800 dark:text-gray-100">
          Buat Akun Baru
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Username */}
          <div>
            <label htmlFor="username" className="mb-2 block text-left font-bold text-gray-600 dark:text-gray-300">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={inputClassName}
              placeholder="javis_user"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-left font-bold text-gray-600 dark:text-gray-300">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClassName}
              placeholder="example@email.com"
            />
          </div>
          
          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-2 block text-left font-bold text-gray-600 dark:text-gray-300">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${inputClassName} pr-12`}
                placeholder="••••••••"
              />
              <button
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-left font-bold text-gray-600 dark:text-gray-300">
              Konfirmasi Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`${inputClassName} pr-12`}
                placeholder="••••••••"
              />
              <button
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="rounded-md border border-red-700 bg-red-100 p-2.5 
                          text-center text-sm text-red-700 
                          dark:border-red-500 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}
          
          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center rounded-md bg-[#E53935] px-5 py-3 
                       text-lg font-bold text-white transition-colors duration-300
                       hover:bg-[#C62828] 
                       disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-500"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              'Daftar'
            )}
          </button>

          {/* Link ke Halaman Login */}
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-[#E53935] hover:underline">
              Login di sini
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default RegisterPage;