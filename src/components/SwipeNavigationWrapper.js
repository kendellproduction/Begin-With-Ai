import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useSwipeNavigation from '../hooks/useSwipeNavigation';

const SwipeNavigationWrapper = ({ children }) => {
  const location = useLocation();
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    currentPageIndex,
    totalPages,
    currentPageName
  } = useSwipeNavigation();

  // Check if on mobile - more strict detection
  useEffect(() => {
    const checkMobile = () => {
      // More strict mobile detection
      const isMobileDevice = window.innerWidth < 768 && 
        ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show swipe indicator on first visit - ONLY on mobile
  useEffect(() => {
    const hasSeenSwipeIndicator = localStorage.getItem('hasSeenSwipeIndicator');
    if (!hasSeenSwipeIndicator && isMobile) {
      setShowSwipeIndicator(true);
      setTimeout(() => {
        setShowSwipeIndicator(false);
        localStorage.setItem('hasSeenSwipeIndicator', 'true');
      }, 3000);
    }
  }, [isMobile]);

  // Add transition effect when location changes - ONLY on mobile
  useEffect(() => {
    if (isMobile) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isMobile]);

  // Don't add swipe functionality to certain pages OR on desktop
  const shouldEnableSwipe = () => {
    if (!isMobile) return false; // Never enable on desktop
    
    const excludedPaths = [
      '/lessons/explore',
      '/learning-path',
      '/ai-news'
    ];
    
    return !excludedPaths.some(path => location.pathname.includes(path));
  };

  // Only apply swipe props if we're on mobile and should enable swipe
  const swipeProps = shouldEnableSwipe() ? {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  } : {};

  // If not mobile, just return children without any wrapper modifications
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <>
      {/* CSS for page transition animations - ONLY on mobile */}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .page-transition {
          animation: slideInFromRight 0.3s ease-out;
        }

        .page-indicator-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>

      <div 
        className={`relative min-h-screen ${isTransitioning ? 'page-transition' : ''}`} 
        {...swipeProps}
      >
        {children}
        
        {/* Swipe Indicator Tutorial - ONLY on mobile */}
        {showSwipeIndicator && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center pointer-events-none">
            <div className="bg-gradient-to-br from-indigo-600/90 to-purple-600/90 backdrop-blur-xl rounded-3xl p-6 m-6 text-center border border-white/20 shadow-xl animate-pulse">
              <div className="text-4xl mb-4">👆</div>
              <h3 className="text-xl font-bold text-white mb-2">Swipe to Navigate!</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                Swipe left or right to move between pages
              </p>
              <div className="flex items-center justify-center space-x-2 text-white/80 text-xs">
                <span>←</span>
                <span>{currentPageName}</span>
                <span>→</span>
              </div>
            </div>
          </div>
        )}

        {/* Page Indicator - ONLY on mobile */}
        {shouldEnableSwipe() && (
          <div 
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 shadow-lg z-40"
            style={{
              bottom: `max(calc(env(safe-area-inset-bottom) + 16px), 20px)`
            }}
          >
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <div
                  key={index}
                  className={`transition-all duration-200 ${
                    index === currentPageIndex 
                      ? 'w-6 h-2 bg-white rounded-full page-indicator-pulse' 
                      : 'w-2 h-2 bg-white/40 rounded-full'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SwipeNavigationWrapper; 