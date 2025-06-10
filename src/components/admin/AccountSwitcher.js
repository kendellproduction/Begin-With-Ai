import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const AccountSwitcher = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { switchAccount, logout } = useAuth();
  const [error, setError] = useState('');

  const handleSwitchAccount = async () => {
    setIsLoading(true);
    setError('');
    try {
      await switchAccount();
      onClose();
    } catch (error) {
      console.error('Failed to switch account:', error);
      setError('Failed to switch account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAndLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await logout();
      // The user will be redirected to the login page automatically
      // by the auth state change in the AuthContext
      onClose();
    } catch (error) {
      console.error('Failed to logout:', error);
      setError('Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearBrowserData = () => {
    try {
      // Clear all local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies for the current domain
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      // Reload the page to ensure all data is cleared
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear browser data:', error);
      setError('Failed to clear browser data. Please manually clear your browser cache.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Switch Account
            </h2>
            <p className="text-gray-400">
              Choose how you'd like to switch to a different account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {/* Quick Switch Account */}
            <button
              onClick={handleSwitchAccount}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <span className="mr-2">🔄</span>
                  Quick Switch (Google)
                </>
              )}
            </button>

            {/* Logout and Login Fresh */}
            <button
              onClick={handleLogoutAndLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-2">🚪</span>
              Logout & Login Fresh
            </button>

            {/* Clear Browser Data */}
            <button
              onClick={handleClearBrowserData}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-yellow-600 rounded-lg shadow-sm text-sm font-medium text-yellow-300 bg-yellow-900/20 hover:bg-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-2">🧹</span>
              Clear All Browser Data
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p><strong>Quick Switch:</strong> Sign out and immediately show Google account picker</p>
            <p><strong>Logout & Login Fresh:</strong> Complete logout, then manually login</p>
            <p><strong>Clear Browser Data:</strong> Remove all saved login data (requires page reload)</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AccountSwitcher; 