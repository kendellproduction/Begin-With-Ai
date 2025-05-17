import React, { useState } from 'react';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle, signUpWithEmail } = useAuth();

  const handleRegister = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signUpWithEmail(email, password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to BeginAI! 🚀
            </h2>
            <p className="text-gray-400">
              Join our community and start your AI learning journey today - it's completely free!
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
            ) : (
              <>
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                />
                Continue with Google
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                required
                disabled={isLoading}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                disabled={isLoading}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between space-x-4 mt-6">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Sign in'
              )}
            </button>
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
              ) : (
                'Sign up'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-4 text-gray-400 hover:text-white text-sm font-medium"
          >
            Maybe later
          </button>
        </motion.div>
      </div>
    </LazyMotion>
  );
};

export default LoginModal; 