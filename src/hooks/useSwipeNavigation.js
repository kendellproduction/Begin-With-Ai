import { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useSwipeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const touchStartTime = useRef(null);
  const isDragging = useRef(false);

  // Define the main pages in order for horizontal navigation
  const mainPages = [
    { path: '/home', name: 'Home' },
    { path: '/lessons', name: 'Lessons' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/profile', name: 'Profile' }
  ];

  // Get current page index
  const getCurrentPageIndex = () => {
    const currentPath = location.pathname;
    
    // Handle sub-routes (like /lessons/explore)
    for (let i = 0; i < mainPages.length; i++) {
      if (currentPath.startsWith(mainPages[i].path)) {
        return i;
      }
    }
    
    // Default to home if no match
    return 0;
  };

  // Enhanced haptic feedback function
  const triggerHapticFeedback = (type = 'light') => {
    try {
      if (window.navigator && window.navigator.vibrate) {
        const patterns = {
          light: [30],
          medium: [50],
          success: [50, 50, 50],
          navigation: [40, 30, 40]
        };
        window.navigator.vibrate(patterns[type] || patterns.light);
      }
    } catch (error) {
      // Haptic feedback not supported
    }
  };

  const handleTouchStart = (e) => {
    // Only handle on mobile (screen width check)
    if (window.innerWidth >= 768) return;
    
    // Don't interfere with specific swipe-enabled pages
    if (location.pathname.includes('/lessons/explore')) return;
    
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    isDragging.current = false;
    
    triggerHapticFeedback('light');
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current || window.innerWidth >= 768) return;
    if (location.pathname.includes('/lessons/explore')) return;
    
    const currentX = e.touches[0].clientX;
    const deltaX = Math.abs(currentX - touchStartX.current);
    
    // Start tracking as drag if moved more than 20px (increased from 10px)
    if (deltaX > 20) {
      isDragging.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !isDragging.current || window.innerWidth >= 768) {
      touchStartX.current = null;
      touchStartTime.current = null;
      isDragging.current = false;
      return;
    }

    if (location.pathname.includes('/lessons/explore')) {
      touchStartX.current = null;
      touchStartTime.current = null;
      isDragging.current = false;
      return;
    }
    
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchEndX.current - touchStartX.current;
    const timeElapsed = Date.now() - touchStartTime.current;
    const velocity = Math.abs(deltaX) / timeElapsed; // pixels per millisecond
    
    // Much stricter requirements for swipe:
    // 1. Minimum distance of 120px (increased from 60px)
    // 2. Minimum velocity of 0.3 pixels/ms
    // 3. Maximum time of 800ms (prevent slow drags)
    if (Math.abs(deltaX) > 120 && velocity > 0.3 && timeElapsed < 800) {
      const currentIndex = getCurrentPageIndex();
      let targetIndex = currentIndex;
      
      if (deltaX > 0 && currentIndex > 0) {
        // Swipe right: go to previous page
        targetIndex = currentIndex - 1;
        triggerHapticFeedback('navigation');
      } else if (deltaX < 0 && currentIndex < mainPages.length - 1) {
        // Swipe left: go to next page
        targetIndex = currentIndex + 1;
        triggerHapticFeedback('navigation');
      } else {
        // At edge of navigation - give feedback
        triggerHapticFeedback('medium');
      }
      
      // Navigate to the target page
      if (targetIndex !== currentIndex) {
        console.log(`Swiping from ${mainPages[currentIndex].name} to ${mainPages[targetIndex].name}`);
        navigate(mainPages[targetIndex].path);
      }
    }
    
    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartTime.current = null;
    isDragging.current = false;
  };

  // Return the touch handlers
  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    currentPageIndex: getCurrentPageIndex(),
    totalPages: mainPages.length,
    currentPageName: mainPages[getCurrentPageIndex()]?.name || 'Unknown'
  };
};

export default useSwipeNavigation; 