import axios from 'axios';
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    // Get the token from our Zustand store
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;