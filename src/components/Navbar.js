import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ openAuthModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const navbarHeight = 64;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthClick = (mode) => {
    if (openAuthModal) {
      openAuthModal(mode);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav 
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#3b82f6' }}
    >
      {/* Removed navbar stars to improve performance - stars handled by OptimizedStarField */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-bold text-white group-hover:text-gray-200 transition-all duration-300">
                BeginningWithAI
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300"
            >
              About
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300"
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
                        <button
              onClick={() => handleAuthClick('login')}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium px-4 py-2 text-sm transition-all duration-300 rounded-lg transform hover:scale-105 shadow-md hover:shadow-lg border border-blue-500/30 hover:border-blue-400/50 group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Sign In</span>
            </button>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="relative overflow-hidden flex items-center bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 text-sm transition-all duration-300 rounded-lg transform hover:scale-105 shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              {!isLoading && (
                <svg className="w-4 h-4 mr-2 relative z-10" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isLoading && (
                <div className="w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin relative z-10"></div>
              )}
              <span className="relative z-10">{isLoading ? 'Signing In...' : 'Google'}</span>
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-500 bg-opacity-90 backdrop-blur-sm rounded-lg mt-2">
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <button
                onClick={() => {
                  handleAuthClick('login');
                  setIsMenuOpen(false);
                }}
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium w-full text-center px-4 py-3 rounded-lg text-base transition-all duration-300 shadow-md group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Sign In</span>
              </button>
              <button
                onClick={() => {
                  handleGoogleSignIn();
                  setIsMenuOpen(false);
                }}
                disabled={isLoading}
                className="relative overflow-hidden bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium flex items-center justify-center w-full px-4 py-3 rounded-lg text-base transition-all duration-300 mt-3 shadow-md border border-gray-200 hover:border-gray-300 group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                {!isLoading && (
                  <svg className="w-5 h-5 mr-2 relative z-10" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {isLoading && (
                  <div className="w-5 h-5 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin relative z-10"></div>
                )}
                <span className="relative z-10">{isLoading ? 'Signing In...' : 'Google'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 