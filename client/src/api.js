// client/src/api.js

import axios from 'axios';

// Buat instance axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true,
});

export default api;