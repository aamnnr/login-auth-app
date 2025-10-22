// client/src/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://login-auth-app-javis.up.railway.app/api', 
  withCredentials: true,
});

export default api;