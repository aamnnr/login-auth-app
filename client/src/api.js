import axios from 'axios';

// Instance Axios untuk komunikasi dengan backend
const api = axios.create({
  baseURL: 'https://login-auth-app-javis.up.railway.app/api',
  withCredentials: true,
});

export default api;
