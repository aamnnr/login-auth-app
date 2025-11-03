import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

// READ - Dapatkan semua user (tanpa password mereka)
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email FROM users ORDER BY id ASC'
    );
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// UPDATE - Edit user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    // User tidak bisa mengedit dirinya sendiri di halaman ini
    // (Anda bisa menambahkan logika admin di sini nanti)
    if (parseInt(id, 10) === req.user.id) {
        return res.status(403).json({ msg: 'Anda tidak bisa mengedit akun Anda sendiri di halaman ini.' });
    }

    if (!username || !email) {
      return res.status(400).json({ msg: 'Username dan Email tidak boleh kosong.' });
    }

    // Jika password juga di-update, hash password baru
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await pool.query(
        'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
        [username, email, hashedPassword, id]
      );
    } else {
      // Jika password tidak di-update
      await pool.query(
        'UPDATE users SET username = ?, email = ? WHERE id = ?',
        [username, email, id]
      );
    }

    res.status(200).json({ msg: 'User berhasil diupdate.' });

  } catch (err) {
    // Tangani error jika username/email sudah ada
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ msg: 'Email atau Username sudah digunakan oleh akun lain.' });
    }
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// DELETE - Hapus user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // User tidak bisa menghapus dirinya sendiri
    if (parseInt(id, 10) === req.user.id) {
        return res.status(403).json({ msg: 'Anda tidak bisa menghapus akun Anda sendiri.' });
    }

    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'User tidak ditemukan.' });
    }

    res.status(200).json({ msg: 'User berhasil dihapus.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};