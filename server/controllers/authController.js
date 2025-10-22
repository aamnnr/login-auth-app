// server/controllers/authController.js

import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Harap isi semua field.' });
    }

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ msg: 'User berhasil terdaftar', userId: result.insertId });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ msg: 'Email atau Username sudah terdaftar.' });
    }
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ msg: 'Harap isi email/username dan password.' });
    }

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ msg: 'Email/Username atau Password salah.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Email/Username atau Password salah.' });
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    delete user.password;
    res.status(200).json({ msg: 'Login berhasil', user: user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const checkAuth = (req, res) => {
  res.status(200).json({ msg: 'User terautentikasi', user: req.user });
};

export const logout = (req, res) => {
  try {
    res.clearCookie('token');   
    res.status(200).json({ msg: 'Logout berhasil' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};