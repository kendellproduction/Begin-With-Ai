import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Restored
// import EmailVerificationGuard from './EmailVerificationGuard'; // Still commented out for now

const ProtectedRoute = ({ children, requireEmailVerification = true }) => {
  const { user, loading } = useAuth(); // Restored

  console.log('ProtectedRoute - User:', user, 'Loading:', loading);

  if (loading) {
    console.log('ProtectedRoute - Loading, returning null');
    return null; // AuthProvider handles global loading state
  }

  if (!user) {
    console.log('ProtectedRoute - No user, navigating to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - User found, rendering Outlet');
  return <Outlet />;

  /* Original EmailVerificationGuard logic - keep commented for now
  return (
    <EmailVerificationGuard requireVerification={requireEmailVerification}>
      <Outlet />
    </EmailVerificationGuard>
  );
  */
};

export default ProtectedRoute; 