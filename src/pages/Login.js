import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { useAuth } from "../contexts/AuthContext";
import { sanitizeText, checkRateLimit } from "../utils/sanitization";
import { navigateAfterAuth } from "../utils/navigationUtils";
import OptimizedStarField from '../components/OptimizedStarField';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" });
  const { user, signInWithEmail, signInWithGoogle, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigateAfterAuth(navigate, true);
    }
  }, [user, navigate]);

  // Password strength validation function
  const isPasswordStrong = (password) => {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasLetter && hasNumber && hasSymbol;
  };

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, feedback: "" };
    
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score += 1;
    else feedback.push("at least 8 characters");
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("lowercase letters");
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("uppercase letters");
    
    if (/\d/.test(password)) score += 1;
    else feedback.push("numbers");
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push("symbols");
    
    const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["text-red-500", "text-orange-500", "text-yellow-500", "text-blue-500", "text-green-500"];
    
    return {
      score,
      label: strengthLabels[score],
      color: strengthColors[score],
      feedback: feedback.length > 0 ? `Missing: ${feedback.join(", ")}` : "Strong password!"
    };
  };

  const handleEmailChange = (e) => {
    const sanitizedEmail = sanitizeText(e.target.value);
    setEmail(sanitizedEmail);
  };

  const handlePasswordChange = (e) => {
    const sanitizedPassword = sanitizeText(e.target.value);
    setPassword(sanitizedPassword);
    setPasswordStrength(calculatePasswordStrength(sanitizedPassword));
  };

  const handleRegister = async () => {
    setError("");
    
    // Rate limiting check
    const clientId = `register_${email}`;
    const rateCheck = checkRateLimit(clientId, 3, 60000); // 3 attempts per minute
    if (!rateCheck.allowed) {
      setError("Too many registration attempts. Please wait a minute before trying again.");
      return;
    }
    
    // Validate password strength
    if (!isPasswordStrong(password)) {
      setError("Password must be at least 8 characters with letters, numbers, and symbols");
      return;
    }
    
    setIsLoading(true);
    try {
      await signUpWithEmail(email, password);
      navigateAfterAuth(navigate, false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    
    // Rate limiting check
    const clientId = `login_${email}`;
    const rateCheck = checkRateLimit(clientId, 5, 60000); // 5 attempts per minute
    if (!rateCheck.allowed) {
      setError("Too many login attempts. Please wait a minute before trying again.");
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      navigateAfterAuth(navigate, false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    
    // Rate limiting check for Google login
    const clientId = `google_login_${Date.now()}`;
    const rateCheck = checkRateLimit(clientId, 10, 60000); // 10 attempts per minute
    if (!rateCheck.allowed) {
      setError("Too many login attempts. Please wait a minute before trying again.");
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigateAfterAuth(navigate, false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#3b82f6' }}>
      {/* Optimized Star Field */}
      <OptimizedStarField starCount={150} opacity={0.8} speed={1} size={1.2} />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome to BeginningWithAI
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
                onChange={handleEmailChange}
                maxLength={254}
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
                onChange={handlePasswordChange}
                maxLength={128}
              />
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Password Strength:</span>
                <span className={passwordStrength.color}>{passwordStrength.label}</span>
              </div>
              <div className="mt-1 w-full bg-gray-700 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    passwordStrength.score >= 4 ? 'bg-green-500' :
                    passwordStrength.score >= 3 ? 'bg-blue-500' :
                    passwordStrength.score >= 2 ? 'bg-yellow-500' :
                    passwordStrength.score >= 1 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                ></div>
              </div>
              {passwordStrength.feedback && (
                <p className="text-xs text-gray-400 mt-1">{passwordStrength.feedback}</p>
              )}
            </div>
          )}

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
