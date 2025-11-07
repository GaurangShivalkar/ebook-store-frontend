// src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
});

// This is a "request interceptor"
// It runs *before* every single API request
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