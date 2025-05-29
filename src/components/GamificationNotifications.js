import React from 'react';
import { useGamification } from '../contexts/GamificationContext';

const GamificationNotifications = () => {
  const { notifications, dismissNotification } = useGamification();

  if (notifications.length === 0) return null;

  const getNotificationStyle = (type) => {
    const baseStyle = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 transform";
    
    switch (type) {
      case 'success':
        return `${baseStyle} bg-green-600/90 border-green-500 text-white`;
      case 'xp':
        return `${baseStyle} bg-purple-600/90 border-purple-500 text-white`;
      case 'streak':
        return `${baseStyle} bg-orange-600/90 border-orange-500 text-white`;
      case 'badge':
        return `${baseStyle} bg-yellow-600/90 border-yellow-500 text-white`;
      case 'error':
        return `${baseStyle} bg-red-600/90 border-red-500 text-white`;
      default:
        return `${baseStyle} bg-blue-600/90 border-blue-500 text-white`;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '🎉';
      case 'xp':
        return '⭐';
      case 'streak':
        return '🔥';
      case 'badge':
        return '🏆';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={getNotificationStyle(notification.type)}
          style={{
            transform: `translateY(${index * 70}px)`,
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{getNotificationIcon(notification.type)}</span>
              <span className="font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="ml-4 text-white/70 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default GamificationNotifications; 