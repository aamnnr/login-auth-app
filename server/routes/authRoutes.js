import express from 'express';
// Impor controller Anda
import { register, login, checkAuth, logout } from '../controllers/authController.js'; 
import { verifyToken } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5, 
  message: { 
    msg: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 1 menit.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/me', verifyToken, checkAuth); 
router.post('/logout', logout);

export default router;