import axios from 'axios';

const API_URL = window.location.origin;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const resourceService = {
  getAll: () => api.get('/resources'),
};

export const alertService = {
  getAll: () => api.get('/alerts'),
  resolve: (id) => api.post(`/alerts/resolve/${id}`),
};

export const scanService = {
  runScan: () => api.post('/scan'),
  analyze: (config) => api.post('/scan/analyze', { configuration: config }),
};

export const reportService = {
  getStats: () => api.get('/report/stats'),
};

export default api;
