import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // List of public routes where footer should be shown
  const publicRoutes = ['/', '/about', '/features', '/contact', '/pricing', '/login', '/signup', '/privacy', '/faq', '/blog'];

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Show footer only on public routes when user is not logged in
  const showFooter = !user && isPublicRoute;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout; 