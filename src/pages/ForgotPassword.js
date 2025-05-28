import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth will provide sendPasswordReset function
import Navbar from '../components/Navbar'; // Or a minimal header if Navbar is too complex/not needed here

const ForgotPassword = () => {
  const { sendPasswordReset } = useAuth(); // We'll need to add sendPasswordReset to AuthContext
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!sendPasswordReset) {
        console.error('sendPasswordReset function not available in AuthContext');
        setError('Password reset service is currently unavailable. Please try again later.');
        setLoading(false);
        return;
    }

    try {
      await sendPasswordReset(email);
      setSuccessMessage('Password reset email sent! Please check your inbox (and spam folder).');
      setEmail('');
    } catch (err) {
      console.error('Forgot Password Error:', err);
      if (err.code === 'auth/user-not-found' || err.message.includes('USER_NOT_FOUND') || err.message.includes('INVALID_EMAIL')) {
        setError('No user found with this email address. Please check the email and try again.');
      } else {
        setError(err.message || 'Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <Navbar /> {/* Using Navbar for consistent look, ensure it doesn't require auth-specific props here */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Forgot Your Password?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              No worries! Enter your email below and we'll send you a link to reset it.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm text-center">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email address"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Link...
                    </>
                  ) : (
                    'Send Password Reset Link'
                  )}
                </span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword; 