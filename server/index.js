import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/database.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT;

app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: [
    'login-auth-app-javis.up.railway.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/auth', authRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
