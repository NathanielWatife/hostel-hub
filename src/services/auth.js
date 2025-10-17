import { authAPI } from './api';

export const loginUser = async (credentials) => {
  const response = await authAPI.login(credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await authAPI.register(userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await authAPI.getProfile();
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await authAPI.updateProfile(data);
  return response.data;
};