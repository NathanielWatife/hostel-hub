import axios from 'axios';

// Prefer explicit API url via env; fallback to '/api' which our server exposes
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

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
  getAll: (params) => api.get('/complaints', { params }).then(response => ({
    data: response.data.data, // Extract the data array
    pagination: response.data.pagination
  })),
  getById: (id) => api.get(`/complaints/${id}`).then(response => ({
    data: response.data.data // Extract the complaint object
  })),
  create: (data) => api.post('/complaints', data).then(response => ({
    data: response.data.data // Extract the created complaint
  })),
  update: (id, data) => api.put(`/complaints/${id}`, data).then(response => ({
    data: response.data.data // Extract the updated complaint
  })),
  updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }).then(response => ({
    data: response.data.data // Extract the updated complaint
  })),
  addComment: (id, comment) => api.post(`/complaints/${id}/comment`, { message: comment }).then(response => ({
    data: response.data.data // Extract the new comment
  })),
  getMyComplaints: () => api.get('/complaints/user/my-complaints').then(response => ({
    data: response.data.data // Extract the complaints array
  })),
};

export const lostFoundAPI = {
  getLostItems: (params) => api.get('/lost-found/lost', { params }).then(response => ({
    data: response.data.data // Extract the lost items array
  })),
  getFoundItems: (params) => api.get('/lost-found/found', { params }).then(response => ({
    data: response.data.data // Extract the found items array
  })),
  reportLost: (data) => api.post('/lost-found/lost', data).then(response => ({
    data: response.data.data // Extract the created lost item
  })),
  reportFound: (data) => api.post('/lost-found/found', data).then(response => ({
    data: response.data.data // Extract the created found item
  })),
  claimItem: (id) => api.put(`/lost-found/found/${id}/claim`).then(response => ({
    data: response.data.data // Extract the updated found item
  })),
  getMatches: () => api.get('/lost-found/matches').then(response => ({
    data: response.data.data // Extract the matches array
  })),
  getMyItems: () => api.get('/lost-found/user/my-items').then(response => ({
    data: response.data.data // Extract the items object
  })),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }).then(response => ({
    data: response.data.data,
    pagination: response.data.pagination
  })),
  getById: (id) => api.get(`/users/${id}`).then(response => ({ data: response.data.data })),
  update: (id, data) => api.put(`/users/${id}`, data).then(response => ({ data: response.data.data }))
};

export default api;