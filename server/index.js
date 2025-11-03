import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/database.js';

// 1. Impor rute yang Anda perlukan
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/taskRoutes.js';

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

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

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