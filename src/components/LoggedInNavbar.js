import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion } from 'framer-motion';
import BugReportModal from './BugReportModal';
import AccountSwitcher from './admin/AccountSwitcher';

const LoggedInNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const { user: currentUser, logout } = useAuth();
  const { userStats } = useGamification();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if current page should use dark space theme
  const isDarkSpacePage = location.pathname.startsWith('/lessons') || 
                          location.pathname.includes('/learning-path/adaptive-quiz');

  // Check if user has admin role
  const isAdminUser = currentUser?.role === 'admin' || currentUser?.role === 'developer';
  


  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleSwitchAccount = () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    setIsAccountSwitcherOpen(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const numStars = 50;

  return (
    <nav 
      className={`app-header sticky top-0 z-50 ${
        isDarkSpacePage 
          ? 'bg-gradient-to-br from-gray-950 via-slate-950 to-black' 
          : ''
      }`}
      style={!isDarkSpacePage ? { backgroundColor: '#3b82f6' } : {}}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(numStars)].map((_, i) => {
          const size = Math.random() * 2.5 + 0.8;
          const opacity = Math.random() * 0.4 + 0.2;
          const duration = Math.random() * 20 + 15;
          const delay = Math.random() * 10;

          const initialY = Math.random() * 80 - 10;
          const targetY = Math.random() * 80 - 10;
          
          const initialX = Math.random() * window.innerWidth;
          const targetX = Math.random() * window.innerWidth;

          return (
            <motion.div
              key={`navbar-star-${i}`}
              className="absolute rounded-full bg-white/70"
              style={{
                width: size,
                height: size,
                left: initialX,
                top: initialY,
              }}
              initial={{ opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
              animate={{
                x: targetX - initialX,
                y: targetY - initialY,
                opacity: [0, opacity, opacity, 0],
                scale: [0.5, Math.random() * 0.8 + 0.6, 0.5],
              }}
              transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
                opacity: {
                  times: [0, 0.2, 0.8, 1],
                  duration: duration,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'linear',
                },
                scale: {
                    times: [0, 0.5, 1],
                    duration: duration,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut'
                }
              }}
            />
          );
        })}
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pwa-safe-top-padding">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white">BeginningWithAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/lessons" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Lessons
            </Link>
            <Link to="/ai-news" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              AI News
            </Link>
            {currentUser?.subscriptionTier !== 'premium' && (
              <Link 
                to="/pricing"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Upgrade 🚀
              </Link>
            )}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-slate-300">
              XP: {userStats.xp || 0}
            </div>
            <div className="text-sm text-slate-300">
              Level {userStats.level || 1}
            </div>

            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center focus:outline-none p-1 rounded-full hover:bg-slate-700/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                  {currentUser?.email?.[0].toUpperCase() || 'U'}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-xl bg-slate-800 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    {isAdminUser && (
                      <>
                        <div className="border-t border-slate-600 my-1"></div>
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-purple-300 hover:bg-slate-700 hover:text-purple-200 transition-colors"
                          role="menuitem"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <span className="mr-2">⚙️</span>
                          Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="border-t border-slate-600 my-1"></div>
                    <button
                      onClick={handleSwitchAccount}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      role="menuitem"
                    >
                      <span className="mr-2">🔄</span>
                      Switch Account
                    </button>
                    <button
                      onClick={() => { 
                        setIsBugReportModalOpen(true); 
                        setIsProfileOpen(false); 
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      role="menuitem"
                    >
                      <span className="mr-2">🐛</span>
                      Report Bug
                    </button>
                    <div className="border-t border-slate-600 my-1"></div>
                    <button
                      onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      role="menuitem"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden relative ${
          isDarkSpacePage 
            ? 'bg-gradient-to-br from-gray-950 via-slate-950 to-black' 
            : ''
        }`}
        style={!isDarkSpacePage ? { backgroundColor: '#3b82f6' } : {}}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/home" className="text-slate-300 hover:text-white hover:bg-slate-700/50 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/dashboard" className="text-slate-300 hover:text-white hover:bg-slate-700/50 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          <Link to="/lessons" className="text-slate-300 hover:text-white hover:bg-slate-700/50 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Lessons</Link>
          <Link to="/ai-news" className="text-slate-300 hover:text-white hover:bg-slate-700/50 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>AI News</Link>
          {isAdminUser && (
            <Link 
              to="/admin" 
              className="text-purple-300 hover:text-purple-200 hover:bg-slate-700/50 block px-3 py-2 rounded-md text-base font-medium transition-colors" 
              onClick={() => setIsMenuOpen(false)}
            >
              ⚙️ Admin Panel
            </Link>
          )}
          {currentUser?.subscriptionTier !== 'premium' && (
            <Link 
              to="/pricing"
              className="bg-yellow-500 hover:bg-yellow-600 text-white block px-3 py-2 rounded-md text-base font-bold transition-colors shadow-md mt-2 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Upgrade to Premium 🚀
            </Link>
          )}
        </div>
        <div className="border-t border-slate-700 pt-4 pb-3">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-base font-semibold">
                {currentUser?.email?.[0].toUpperCase() || 'U'}
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">{currentUser?.displayName || currentUser?.email}</div>
              <div className="text-sm font-medium text-slate-400">Level {userStats.level || 1} &bull; {userStats.xp || 0} XP</div>
            </div>
          </div>
          <div className="mt-3 px-2 space-y-1">
            <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Your Profile</Link>
            <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Settings</Link>
            <button
              onClick={handleSwitchAccount}
              className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <span className="mr-2">🔄</span>
              Switch Account
            </button>
            <button 
              onClick={() => { 
                setIsBugReportModalOpen(true); 
                setIsMenuOpen(false); 
              }} 
              className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <span className="mr-2">🐛</span>
              Report Bug
            </button>
            <div className="border-t border-slate-600 mx-3 my-2"></div>
            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">Log Out</button>
          </div>
        </div>
      </div>

      {/* Bug Report Modal */}
      <BugReportModal 
        isOpen={isBugReportModalOpen} 
        onClose={() => setIsBugReportModalOpen(false)} 
      />

      {/* Account Switcher Modal */}
      <AccountSwitcher 
        isOpen={isAccountSwitcherOpen}
        onClose={() => setIsAccountSwitcherOpen(false)}
      />
    </nav>
  );
};

export default LoggedInNavbar;