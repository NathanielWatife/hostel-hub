import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const complaintAPI = {
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  create: (data) => api.post('/complaints', data),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
  addComment: (id, comment) => api.post(`/complaints/${id}/comment`, { message: comment }),
  getMyComplaints: () => api.get('/complaints/user/my-complaints'),
};

export const lostFoundAPI = {
  getLostItems: (params) => api.get('/lost-found/lost', { params }),
  getFoundItems: (params) => api.get('/lost-found/found', { params }),
  reportLost: (data) => api.post('/lost-found/lost', data),
  reportFound: (data) => api.post('/lost-found/found', data),
  claimItem: (id) => api.put(`/lost-found/found/${id}/claim`),
  getMatches: () => api.get('/lost-found/matches'),
  getMyItems: () => api.get('/lost-found/user/my-items'),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export default api;