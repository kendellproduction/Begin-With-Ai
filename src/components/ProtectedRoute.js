import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Let AuthProvider handle the loading state
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 