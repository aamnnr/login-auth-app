# Javis Challenge - Aplikasi Demo Autentikasi

Proyek demonstrasi implementasi sistem autentikasi yang aman menggunakan MERN Stack (MySQL, Express.js, React, Node.js) dengan fitur dark mode dan unit testing.

## Tech Stack

### Frontend
- **React 19** - Library JavaScript untuk UI
- **Vite** - Build tool dan development server
- **React Router DOM** - Routing untuk SPA
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - HTTP client untuk API calls
- **React Feather** - Icon library
- **Context API** - State management untuk autentikasi dan tema

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework untuk Node.js
- **MySQL2** - Driver MySQL untuk Node.js
- **JWT (JSON Web Tokens)** - Autentikasi berbasis token
- **bcrypt** - Hashing password
- **CORS** - Cross-Origin Resource Sharing
- **express-rate-limit** - Rate limiting untuk keamanan
- **cookie-parser** - Parsing HTTP cookies

### Database
- **MySQL** - Relational database management system

### Testing
- **Vitest** - Test runner untuk Vite
- **React Testing Library** - Testing utilities untuk React
- **@testing-library/jest-dom** - Custom matchers untuk DOM testing
- **jsdom** - DOM implementation untuk testing

### Development Tools
- **Nodemon** - Auto-restart server saat development
- **ESLint** - Linting JavaScript/React
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda memiliki:

- **Node.js** (versi 16 atau lebih baru)
- **npm** atau **yarn**
- **MySQL Server** (versi 5.7 atau lebih baru)
- **Git** (untuk cloning repository)

## Instalasi dan Setup

### 1. Clone Repository

```bash
git clone https://github.com/aamnnr/login-auth-app.git
cd tes-javis
```

### 2. Setup Database

Buat database MySQL baru dan tabel users:

```sql
CREATE DATABASE javis_auth;

USE javis_auth;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Setup Environment Variables

Buat file `.env` di folder `server/`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=javis_auth

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Install Dependencies

#### Backend (Server)
```bash
cd server
npm install
```

#### Frontend (Client)
```bash
cd ../client
npm install
```

## Cara Menjalankan

### Development Mode

#### 1. Jalankan Backend Server
```bash
cd server
npm run dev
```
Server akan berjalan di `http://localhost:5000`

#### 2. Jalankan Frontend (di terminal baru)
```bash
cd client
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

### Production Mode

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
cd client
npm run build
npm run preview
```

## Arsitektur Aplikasi

### Struktur Folder

```
tes-javis/
├── client/                 # Frontend React Application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api.js         # Axios configuration
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   ├── components/    # Reusable components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/       # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   └── assets/        # Static assets
│   ├── tests/             # Unit tests
│   └── package.json
├── server/                 # Backend Node.js Application
│   ├── config/
│   │   └── database.js    # Database connection
│   ├── controllers/
│   │   └── authController.js # Authentication logic
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   ├── routes/
│   │   └── authRoutes.js  # API routes
│   ├── index.js           # Server entry point
│   └── package.json
└── README.md
```

### Alur Autentikasi

1. **Registrasi**: User mengisi form registrasi → Password di-hash dengan bcrypt → Data disimpan ke MySQL
2. **Login**: User mengisi kredensial → Verifikasi password dengan bcrypt → JWT token dibuat dan dikirim sebagai HttpOnly cookie
3. **Protected Routes**: Frontend memeriksa status autentikasi via Context API → API calls menggunakan cookies untuk autentikasi
4. **Logout**: Server menghapus cookie token → Frontend membersihkan state

### Arsitektur Frontend

- **Routing**: React Router dengan protected routes
- **State Management**: Context API untuk autentikasi dan tema
- **Styling**: Tailwind CSS dengan dark mode support
- **API Communication**: Axios dengan base URL dan credentials

### Arsitektur Backend

- **MVC Pattern**: Controllers, Routes, Middleware
- **Security**: JWT tokens, bcrypt hashing, rate limiting, CORS
- **Database**: MySQL dengan connection pooling
- **Error Handling**: Centralized error responses

## Fitur

### 🔐 Autentikasi
- Registrasi user baru
- Login dengan email/username dan password
- JWT-based authentication dengan HttpOnly cookies
- Protected routes untuk halaman dashboard
- Rate limiting pada endpoint login (5 attempts per menit)

### 🎨 UI/UX
- Responsive design dengan Tailwind CSS
- Dark mode toggle dengan localStorage persistence
- Loading states dan error handling
- Form validation (client-side dan server-side)

### 🧪 Testing
- Unit tests untuk components dan pages
- Mocking untuk API calls dan context
- Coverage untuk critical functionality

### 🔒 Keamanan
- Password hashing dengan bcrypt
- JWT tokens dengan expiration
- HttpOnly cookies untuk token storage
- CORS configuration
- Input validation dan sanitization

## Testing

### Menjalankan Tests

```bash
cd client
npm run test
```

### Test Coverage

Tests mencakup:
- ProtectedRoute component behavior
- ThemeToggle functionality
- Dashboard page rendering dan interactions
- Login page form validation dan API integration
- Register page form handling dan error states

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Verifikasi token dan dapatkan user info
- `POST /api/auth/logout` - Logout user

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Pastikan MySQL server sedang berjalan
   - Periksa kredensial database di `.env`

2. **CORS Error**
   - Pastikan frontend mengakses backend di port yang benar
   - Periksa konfigurasi CORS di server

3. **JWT Token Issues**
   - Pastikan `JWT_SECRET` di `.env` sudah di-set
   - Periksa expiration time token

4. **Build Errors**
   - Pastikan semua dependencies ter-install
   - Clear node_modules dan reinstall jika perlu
