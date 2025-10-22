import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'react-feather'; 
import api from '../api'; 
import { useAuth } from '../context/AuthContext'; 

function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  // ... (fungsi handleSubmit tetap sama, tidak perlu diubah)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Email/Username dan Password wajib diisi.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { identifier, password });
      setLoading(false);
      login(response.data.user); 
      navigate('/dashboard'); 
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };


  return (
    // Wrapper: Latar abu-abu (light) atau abu-abu gelap (dark)
    <div className="flex min-h-screen items-center justify-center 
                   bg-gray-100 font-sans dark:bg-gray-900">
      
      {/* Kartu Login: Latar putih (light) atau abu-abu (dark) */}
      <div className="w-full max-w-sm rounded-lg 
                     bg-white p-6 shadow-lg 
                     dark:bg-gray-800 md:p-10">
        
        <img 
          src="/javis.png" 
          alt="Javis Teknologi Albarokah Logo" 
          className="mx-auto mb-5 w-[100px]"
        />
        
        <h2 className="mb-6 text-center text-xl font-bold text-gray-800 dark:text-gray-100">
          PT. Javis Teknologi Albarokah
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Grup Input Identifier */}
          <div>
            <label 
              htmlFor="identifier" 
              className="mb-2 block text-left font-bold text-gray-600 dark:text-gray-300"
            >
              Email atau Username:
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-3 text-base
                         border-gray-300 bg-white text-gray-900
                         dark:border-gray-600 dark:bg-gray-700 dark:text-white
                         focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E53935]"
              placeholder="example@email.com"
            />
          </div>
          
          {/* Grup Input Password */}
          <div>
            <label 
              htmlFor="password" 
              className="mb-2 block text-left font-bold text-gray-600 dark:text-gray-300"
            >
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-3 pr-12 text-base 
                           border-gray-300 bg-white text-gray-900
                           dark:border-gray-600 dark:bg-gray-700 dark:text-white
                           focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E53935]"
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
              'Login'
            )}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
            Belum punya akun?{' '}
            <Link to="/register" className="font-medium text-[#E53935] hover:underline">
              Daftar di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;