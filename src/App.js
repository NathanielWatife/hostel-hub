import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import ComplaintManagement from './components/complaints/ComplaintManagement';
import LostFound from './components/lost-found/LostFound';
import AdminPanel from './components/admin/AdminPanel';
import ForgotPassword from './components/auth/ForgotPassword';
import { ComplaintProvider } from './contexts/ComplaintContext';
import './index.css';

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userData } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userData?.role !== requiredRole && userData?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ComplaintProvider>
          <Layout>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/complaints" element={
              <ProtectedRoute>
                <ComplaintManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/lost-found" element={
              <ProtectedRoute>
                <LostFound />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            } />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout>
        </ComplaintProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;