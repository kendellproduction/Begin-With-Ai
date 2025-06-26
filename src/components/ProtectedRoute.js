import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import EmailVerificationGuard from './EmailVerificationGuard'; // Still commented out for now

const ProtectedRoute = ({ 
  children, 
  requireEmailVerification = true, 
  requireAdminRole = false 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // AuthProvider handles global loading state
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check for admin role if required
  if (requireAdminRole) {
    const userRole = user.role || 'user';
    const isAdmin = userRole === 'admin' || userRole === 'developer';
    
    if (!isAdmin) {
      // Redirect non-admin users to dashboard with a message
      return <Navigate to="/dashboard?error=admin_required" replace />;
    }
  }

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