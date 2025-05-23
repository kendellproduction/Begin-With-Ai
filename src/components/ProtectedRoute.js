import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EmailVerificationGuard from './EmailVerificationGuard';

const ProtectedRoute = ({ requireEmailVerification = true }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Let AuthProvider handle the loading state
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Wrap the outlet with email verification guard
  return (
    <EmailVerificationGuard requireVerification={requireEmailVerification}>
      <Outlet />
    </EmailVerificationGuard>
  );
};

export default ProtectedRoute; 