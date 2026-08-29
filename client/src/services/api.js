import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to all outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Gmail Integration Endpoints
export const gmailAPI = {
  getConnectUrl: () => api.get('/gmail/connect'),
  getStatus: () => api.get('/gmail/status'),
  simulateConnect: (connected) => api.post('/gmail/simulate-connect', { connected }),
  disconnect: () => api.post('/gmail/disconnect'),
};

// Email Management Endpoints
export const emailAPI = {
  getEmails: (params) => api.get('/emails', { params }),
  getEmailById: (id) => api.get(`/emails/${id}`),
  toggleRead: (id) => api.patch(`/emails/${id}/read`),
  toggleStar: (id) => api.patch(`/emails/${id}/star`),
  archiveEmail: (id) => api.patch(`/emails/${id}/archive`),
  deleteEmail: (id) => api.delete(`/emails/${id}`),
  sendEmail: (data) => api.post('/emails/send', data),
  saveDraft: (data) => api.post('/emails/draft', data),
};

// AI Intelligence Endpoints
export const aiAPI = {
  summarize: (data) => api.post('/ai/summarize', data),
  generateReply: (data) => api.post('/ai/reply', data),
  classify: (data) => api.post('/ai/classify', data),
  extractActionItems: (data) => api.post('/ai/action-items', data),
  explain: (data) => api.post('/ai/explain', data),
  rewrite: (data) => api.post('/ai/rewrite', data),
};

// Analytics & Dashboard Endpoints
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
};

export default api;
