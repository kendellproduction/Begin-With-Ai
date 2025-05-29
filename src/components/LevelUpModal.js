import React, { useEffect, useState } from 'react';
import { useGamification } from '../contexts/GamificationContext';

const LevelUpModal = () => {
  const { showLevelUpModal, setShowLevelUpModal, userStats } = useGamification();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (showLevelUpModal) {
      setAnimate(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUpModal]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setShowLevelUpModal(false);
    }, 300);
  };

  if (!showLevelUpModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className={`bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 max-w-md mx-4 text-white text-center transform transition-all duration-300 ${
          animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Celebration Animation */}
        <div className="relative mb-6">
          <div className="text-8xl animate-bounce">🎉</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-yellow-400 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Level Up Content */}
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          LEVEL UP!
        </h2>
        
        <div className="text-6xl font-bold mb-4 text-yellow-400">
          {userStats.level}
        </div>
        
        <p className="text-xl mb-6 text-purple-100">
          Congratulations! You've reached level {userStats.level}!
        </p>

        {/* XP Progress */}
        <div className="bg-white/20 rounded-full p-1 mb-6">
          <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-full h-3 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {userStats.xp} XP
            </span>
          </div>
        </div>

        {/* Motivational Message */}
        <p className="text-purple-200 mb-6">
          Keep up the amazing work! You're becoming an AI expert! 🚀
        </p>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          Continue Learning
        </button>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal; 