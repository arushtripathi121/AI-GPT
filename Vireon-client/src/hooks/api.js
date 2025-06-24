import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const googleAuth = (code) => api.get(`google?code=${code}`);
