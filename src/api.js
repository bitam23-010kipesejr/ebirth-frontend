import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://ebirth-production.up.railway.app",
});

export default api;
