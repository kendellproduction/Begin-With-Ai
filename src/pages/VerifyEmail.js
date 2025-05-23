import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleResendVerification = async () => {
    if (!user) return;
    
    try {
      setSending(true);
      setError(null);
      
      await sendEmailVerification(user);
      
      setSuccess(true);
      setSending(false);
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError(error.message);
      setSending(false);
    }
  };

  const handleContinue = () => {
    // Check if user is verified now
    if (user?.emailVerified) {
      navigate(from, { replace: true });
    } else {
      // Refresh the user to check if verification status has changed
      user.reload().then(() => {
        if (user.emailVerified) {
          navigate(from, { replace: true });
        } else {
          setError('Your email is not verified yet. Please check your inbox and verify your email before continuing.');
        }
      }).catch(error => {
        console.error('Error reloading user:', error);
        setError(error.message);
      });
    }
  };

  if (!user) {
    return navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Verify Your Email</h1>
        
        <div className="bg-gray-700 p-4 rounded-md mb-6">
          <p className="text-gray-300 mb-2">
            We've sent a verification email to:
          </p>
          <p className="text-white font-medium break-all">{user.email}</p>
        </div>
        
        <p className="text-gray-300 mb-6">
          Please check your inbox and click the verification link to activate your account.
          If you don't see the email, check your spam folder.
        </p>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/50 border border-green-500 text-green-200 p-3 rounded-md mb-4">
            Verification email sent! Please check your inbox.
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={handleResendVerification}
            disabled={sending}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending...' : 'Resend Verification Email'}
          </button>
          
          <button
            onClick={handleContinue}
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
          >
            I've Verified My Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 