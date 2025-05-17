import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleCardClick = (path) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      navigate(path);
    }
  };

  const navItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Lessons',
      path: '/lessons',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Google AI',
      path: '/lessons/google',
      image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'OpenAI',
      path: '/lessons/openai',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Meta AI',
      path: '/lessons/meta',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Claude',
      path: '/lessons/claude',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-400">BeginAI</span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                  <Link to="/profile" className="flex items-center">
                    <div className="relative">
                      <img
                        className="h-8 w-8 rounded-full border-2 border-indigo-500 hover:border-indigo-400 transition-colors duration-300"
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=6366f1&color=fff`}
                        alt={user.email}
                      />
                      {location.pathname === '/profile' && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-300"
                >
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Navigation Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleCardClick(item.path)}
              className={`group relative block overflow-hidden rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 ${
                location.pathname === item.path ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default Navigation; 