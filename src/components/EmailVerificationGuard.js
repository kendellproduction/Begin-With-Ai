import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import OptimizedStarField from './OptimizedStarField';

/**
 * EmailVerificationGuard component
 * Enforces email verification before allowing access to lessons and sensitive features
 * Following BeginningWithAi security guidelines
 */
const EmailVerificationGuard = ({ children, requireVerification = true }) => {
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // If verification is not required, render children
  if (!requireVerification) {
    return children;
  }

  // If user is not logged in, this should be handled by ProtectedRoute
  if (!user) {
    return null;
  }

  // If email is verified, render children
  if (user.emailVerified) {
    return children;
  }

  // Email not verified - show verification required screen
  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage('');
    
    try {
      await sendEmailVerification(user);
      setResendMessage('Verification email sent! Please check your inbox and spam folder.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      setResendMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#3b82f6' }}>
      {/* Optimized Star Field */}
      <OptimizedStarField starCount={220} opacity={0.8} speed={1} size={1.2} />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          {/* Email verification icon */}
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Email Verification Required
          </h2>
          
          <p className="mt-2 text-center text-sm text-gray-400">
            To access lessons and coding exercises, please verify your email address
          </p>
          
          <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-800/50 rounded-lg">
            <p className="text-sm text-yellow-200">
              <strong>Why verification is required:</strong>
            </p>
            <ul className="text-xs text-yellow-200 mt-2 list-disc list-inside space-y-1">
              <li>Secure access to coding sandbox environments</li>
              <li>Protection of your progress and user data</li>
              <li>Compliance with educational platform security standards</li>
              <li>Prevention of unauthorized access to premium features</li>
            </ul>
          </div>
          
          <div className="mt-6 text-sm text-gray-300">
            <p>
              We sent a verification email to: <br />
              <span className="font-medium text-white">{user.email}</span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            I've verified my email - Refresh page
          </button>
          
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              'Resend verification email'
            )}
          </button>

          {resendMessage && (
            <div className={`p-3 rounded-md ${resendMessage.includes('sent') ? 'bg-green-900/30 border border-green-800/50' : 'bg-red-900/30 border border-red-800/50'}`}>
              <p className={`text-sm ${resendMessage.includes('sent') ? 'text-green-200' : 'text-red-200'}`}>
                {resendMessage}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-2">Having trouble?</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure {user.email} is correct</li>
              <li>• Wait a few minutes for the email to arrive</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationGuard; 