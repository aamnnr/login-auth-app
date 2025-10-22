// server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ msg: 'Akses ditolak. Tidak ada token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 

  } catch (err) {
    console.error('Token tidak valid:', err.message);
    res.status(401).json({ msg: 'Token tidak valid.' });
  }
};