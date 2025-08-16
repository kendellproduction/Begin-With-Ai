import React, { useMemo, useEffect, useState, useCallback } from 'react';

const OptimizedStarField = ({ 
  starCount = 220, // Reduced from 250 by 30 stars
  opacity = 0.8, 
  className = "",
  speed = 1,
  size = 1 
}) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Debounced resize handler to prevent excessive re-renders
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  // Simple star configurations that work
  const starConfigs = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => {
      const screenH = dimensions.height;
      const screenW = dimensions.width;
      
      // Star variety
      const isLargeStar = i % 10 === 0; // 10% large stars
      const isMediumStar = i % 5 === 0 && !isLargeStar; // 20% medium stars
      
      let starSize;
      if (isLargeStar) {
        starSize = (3 + Math.random() * 2) * size; // 3-5px
      } else if (isMediumStar) {
        starSize = (2 + Math.random() * 1) * size; // 2-3px
      } else {
        starSize = (0.5 + Math.random() * 1.5) * size; // 0.5-2px
      }
      
      const starOpacity = isLargeStar ? 0.7 : isMediumStar ? 0.8 : 0.85;
      const duration = (Math.random() * 15 + 20) / speed; // 20-35 seconds
      const delay = Math.random() * 0.5; // Very short delay

      // Start stars scattered across visible screen
      const startX = Math.random() * screenW;
      const startY = Math.random() * screenH;
      
      // Simple movement - each star moves in a straight line
      const angle = Math.random() * 2 * Math.PI;
      const distance = 200 + Math.random() * 300; // 200-500px movement
      const endX = startX + Math.cos(angle) * distance;
      const endY = startY + Math.sin(angle) * distance;
      
      return {
        id: i,
        startX,
        startY,
        endX,
        endY,
        size: starSize,
        opacity: starOpacity * opacity,
        duration,
        delay,
        isLarge: isLargeStar,
        isMedium: isMediumStar
      };
    });
  }, [starCount, dimensions.width, dimensions.height, speed, size, opacity]);

  // Simple CSS animations
  const generateAnimationCSS = useMemo(() => {
    return starConfigs.map(star => `
      @keyframes starMove${star.id} {
        0% { 
          transform: translate(${star.startX}px, ${star.startY}px) scale(1);
          opacity: ${star.opacity};
        }
        50% {
          transform: translate(${star.endX}px, ${star.endY}px) scale(${star.isLarge ? 1.1 : 1});
          opacity: ${star.opacity};
        }
        100% { 
          transform: translate(${star.startX}px, ${star.startY}px) scale(1);
          opacity: ${star.opacity};
        }
      }
    `).join('\n');
  }, [starConfigs]);

  // Insert CSS
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = generateAnimationCSS;
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [generateAnimationCSS]);

  return (
    <div 
      className={`star-container fixed inset-0 pointer-events-none ${className}`}
      style={{ 
        zIndex: 1,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {starConfigs.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${
            star.isLarge ? 'bg-white/85' : 
            star.isMedium ? 'bg-white/90' : 
            'bg-white/95'
          }`}
          style={{
            width: star.size,
            height: star.size,
            boxShadow: star.isLarge 
              ? '0 0 8px rgba(255, 255, 255, 0.8)' 
              : star.isMedium 
                ? '0 0 6px rgba(255, 255, 255, 0.7)' 
                : '0 0 4px rgba(255, 255, 255, 0.6)',
            animation: `starMove${star.id} ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            // Start immediately visible at starting position
            opacity: star.opacity,
            transform: `translate(${star.startX}px, ${star.startY}px) scale(1)`,
          }}
        />
      ))}
    </div>
  );
};

export default OptimizedStarField; 