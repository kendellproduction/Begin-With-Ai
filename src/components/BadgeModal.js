import React, { useEffect, useState } from 'react';
import { useGamification } from '../contexts/GamificationContext';

const BadgeModal = () => {
  const { showBadgeModal, setShowBadgeModal, newBadges, getBadgeById } = useGamification();
  const [animate, setAnimate] = useState(false);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  useEffect(() => {
    if (showBadgeModal && newBadges.length > 0) {
      setAnimate(true);
      setCurrentBadgeIndex(0);
      
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showBadgeModal, newBadges]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setShowBadgeModal(false);
      setCurrentBadgeIndex(0);
    }, 300);
  };

  const handleNext = () => {
    if (currentBadgeIndex < newBadges.length - 1) {
      setCurrentBadgeIndex(currentBadgeIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentBadgeIndex > 0) {
      setCurrentBadgeIndex(currentBadgeIndex - 1);
    }
  };

  if (!showBadgeModal || !newBadges || newBadges.length === 0) return null;

  const currentBadge = newBadges[currentBadgeIndex];
  const badgeInfo = getBadgeById(currentBadge.id);

  const getBadgeColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      yellow: 'from-yellow-500 to-yellow-600',
      gold: 'from-yellow-400 to-yellow-600',
      gray: 'from-gray-500 to-gray-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md mx-4 text-white text-center transform transition-all duration-300 border border-white/10 ${
          animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Badge Icon with Animation */}
        <div className="relative mb-6">
          <div 
            className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getBadgeColor(badgeInfo.color)} flex items-center justify-center text-4xl animate-pulse shadow-lg`}
          >
            {badgeInfo.icon}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-yellow-400 rounded-full animate-ping opacity-30"></div>
          </div>
        </div>

        {/* Badge Content */}
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          NEW BADGE!
        </h2>
        
        <h3 className="text-2xl font-bold mb-2 text-white">
          {badgeInfo.name}
        </h3>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          {badgeInfo.description}
        </p>

        {/* Badge Counter */}
        {newBadges.length > 1 && (
          <div className="flex justify-center space-x-2 mb-6">
            {newBadges.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentBadgeIndex ? 'bg-yellow-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4">
          {newBadges.length > 1 && currentBadgeIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
            >
              Previous
            </button>
          )}
          
          <button
            onClick={newBadges.length > 1 && currentBadgeIndex < newBadges.length - 1 ? handleNext : handleClose}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {newBadges.length > 1 && currentBadgeIndex < newBadges.length - 1 ? 'Next Badge' : 'Awesome!'}
          </button>
        </div>

        {/* Progress Indicator */}
        {newBadges.length > 1 && (
          <p className="text-sm text-gray-400 mt-4">
            Badge {currentBadgeIndex + 1} of {newBadges.length}
          </p>
        )}

        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-400 animate-ping"
              style={{
                left: `${15 + i * 10}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.5s',
                fontSize: '12px'
              }}
            >
              ✨
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeModal; 