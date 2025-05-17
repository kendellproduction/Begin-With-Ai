import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, signInWithEmail, signInWithGoogle, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('User is logged in, redirecting to dashboard...');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegister = async () => {
    setError("");
    setIsLoading(true);
    try {
      console.log('Attempting to register with email:', email);
      await signUpWithEmail(email, password);
      console.log('Registration successful');
      navigate("/dashboard");
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      console.log('Attempting to login with email:', email);
      await signInWithEmail(email, password);
      console.log('Login successful');
      navigate("/dashboard");
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      console.log('Attempting Google login...');
      await signInWithGoogle();
      console.log('Google login successful');
      navigate("/dashboard");
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome to BeginAI
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Your journey to AI mastery starts here
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
              </div>
            </div>
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between space-x-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
              ) : (
                'Register'
              )}
            </button>
          </div>

          {error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
