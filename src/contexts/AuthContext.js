import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setAuthError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    localStorage.setItem('token', response.token);
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    localStorage.setItem('token', response.token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    authError,
    setAuthError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};