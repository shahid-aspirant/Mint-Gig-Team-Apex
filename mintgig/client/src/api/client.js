import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api/v1`
    : '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage as fallback for cross-domain cookies
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mintgig_token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: save token if received and handle errors consistently
api.interceptors.response.use(
  (response) => {
    if (response.data?.data?.token) {
      localStorage.setItem('mintgig_token', response.data.data.token);
    }
    return response.data;
  },
  (error) => {
    let message =
      error.response?.data?.message ||
      error.response?.data?.error;

    if (!message && error.response?.status === 405) {
      message =
        'Backend API endpoint not reachable (HTTP 405 Method Not Allowed). GitHub Pages only serves static assets. Please ensure the backend is deployed (e.g., Render/Railway) and VITE_API_URL is configured in your build settings.';
    } else if (!message) {
      message = error.message || 'An unexpected error occurred';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
