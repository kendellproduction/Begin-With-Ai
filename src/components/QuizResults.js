import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OptimizedStarField from './OptimizedStarField';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total } = location.state || { score: 0, total: 0 };
  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage >= 90) return "Outstanding! You're an AI expert!";
    if (percentage >= 70) return "Great job! You've got a solid understanding!";
    if (percentage >= 50) return "Good effort! Keep learning!";
    return "Keep practicing! You'll get there!";
  };

  const getColor = () => {
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-green-300";
    if (percentage >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4" style={{ backgroundColor: '#3b82f6' }}>
      {/* Optimized Star Field */}
      <OptimizedStarField starCount={150} opacity={0.8} speed={1} size={1.2} />

      <div className="max-w-2xl w-full bg-gray-800 rounded-3xl p-8 shadow-2xl text-center relative z-10">
        <h1 className="text-3xl font-bold mb-6">Quiz Complete!</h1>
        
        {/* Score Circle */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#374151"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={percentage >= 70 ? "#34D399" : percentage >= 50 ? "#FBBF24" : "#EF4444"}
              strokeWidth="10"
              strokeDasharray={`${percentage * 2.83} 283`}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getColor()}`}>{percentage}%</span>
            <span className="text-sm text-gray-400">Score</span>
          </div>
        </div>

        {/* Message */}
        <p className="text-xl mb-8">{getMessage()}</p>

        {/* Score Details */}
        <div className="bg-gray-700/50 rounded-xl p-6 mb-8">
          <p className="text-2xl font-bold mb-2">
            {score} out of {total} correct
          </p>
          <p className="text-gray-400">
            {score === total ? "Perfect score!" : "Keep practicing to improve!"}
          </p>
        </div>

        {/* Back to Lessons Button */}
        <button
          onClick={() => navigate('/lessons')}
          className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/20"
        >
          Back to Lessons
        </button>
      </div>
    </div>
  );
};

export default QuizResults; 