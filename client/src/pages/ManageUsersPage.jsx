import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Edit, Trash2, Loader } from 'react-feather';
import ThemeToggle from '../components/ThemeToggle'; // Impor
import { useAuth } from '../context/AuthContext'; // Impor

// Komponen Modal untuk Form Edit
const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({ 
    username: user.username, 
    email: user.email,
    password: '' // Kosongkan password, hanya diisi jika ingin diubah
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave(user.id, formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Gagal menyimpan perubahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Edit User</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Form fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Baru (Opsional)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Kosongkan jika tidak ingin diubah" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} disabled={loading} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50">Batal</button>
            <button type="submit" disabled={loading} className="rounded-md bg-[#E53935] px-4 py-2 text-sm font-medium text-white hover:bg-[#C62828] disabled:opacity-50">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null); // State untuk user yg diedit
  const { logout } = useAuth(); // Ambil fungsi logout
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Gagal memuat daftar pengguna.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateUser = async (userId, data) => {
    // Buang field password jika kosong
    const payload = { ...data };
    if (!payload.password || payload.password === '') {
      delete payload.password;
    }
    // 'onSave' di modal akan me-throw error jika gagal
    await api.put(`/users/${userId}`, payload);
    fetchUsers(); // Re-fetch data setelah update
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak bisa dibatalkan.')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers(); // Re-fetch data setelah hapus
      } catch (err) {
        alert(err.response?.data?.msg || 'Gagal menghapus pengguna.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans dark:bg-gray-900">
      {/* Header Konsisten */}
      <header className="flex items-center justify-between bg-white px-4 py-4 shadow-md dark:bg-gray-800 md:px-10">
        <Link to="/dashboard">
          <img src="/javis.png" alt="Javis Logo" className="h-auto w-[120px]" />
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/dashboard" className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Dashboard
          </Link>
          <Link to="/tasks" className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Tugas Saya
          </Link>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="rounded-md bg-[#E53935] px-5 py-2 text-sm font-bold text-white
                       transition-colors duration-300 ease-in-out
                       hover:bg-[#C62828]"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="mx-auto my-8 max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Kelola Pengguna</h2>
        
        {loading && <Loader className="mx-auto mt-8 h-8 w-8 animate-spin text-gray-400" />}
        {error && <p className="mt-8 text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.id}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.username}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                    <td className="flex items-center gap-4 whitespace-nowrap px-6 py-4 text-sm">
                      <button onClick={() => setEditingUser(user)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" aria-label="Edit user"><Edit size={18} /></button>
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" aria-label="Delete user"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {editingUser && (
        <EditUserModal 
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
}

export default ManageUsersPage;