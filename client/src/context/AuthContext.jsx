// client/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api'; // Instance axios kita
import { useNavigate } from 'react-router-dom';

// 1. Buat Context
const AuthContext = createContext(null);

// 2. Buat Provider (komponen yang "membungkus" aplikasi)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // State loading untuk pengecekan awal
  const navigate = useNavigate();

  // 3. Fungsi untuk mengecek status login saat app load (penting untuk refresh)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Panggil endpoint /me untuk verifikasi token
        const response = await api.get('/auth/me'); 
        
        // Jika sukses (token valid), set data user
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        // Jika gagal (token tidak ada/tidak valid)
        setUser(null);
        setIsAuthenticated(false);
        console.log('User tidak terautentikasi');
      } finally {
        // Selesai loading
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // [] berarti hanya jalan sekali saat app mount

  // 4. Fungsi yang akan dipanggil oleh LoginPage
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  // 5. Fungsi yang akan dipanggil oleh tombol Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout'); // Panggil API logout [cite: 24]
    } catch (err) {
      console.error('Gagal logout di server:', err);
    } finally {
      // Bersihkan state di client
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  // 6. Sediakan nilai-nilai ini ke semua komponen di dalamnya
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {/* Jangan render app sebelum pengecekan awal selesai */}
      {!loading && children} 
    </AuthContext.Provider>
  );
};

// 7. Hook kustom untuk memudahkan penggunaan context
export const useAuth = () => {
  return useContext(AuthContext);
};