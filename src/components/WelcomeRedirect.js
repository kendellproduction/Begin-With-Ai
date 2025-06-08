import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to the new adaptive quiz
    navigate('/learning-path/adaptive-quiz', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-xl text-gray-300">Redirecting to your updated assessment...</p>
      </div>
    </div>
  );
};

export default WelcomeRedirect; 