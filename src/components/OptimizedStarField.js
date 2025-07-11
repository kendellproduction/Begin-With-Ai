import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const OptimizedStarField = ({ 
  starCount = 180, 
  opacity = 0.8, 
  className = "",
  speed = 1,
  size = 1 
}) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize star configurations to prevent recalculation
  const starConfigs = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => {
      const screenH = dimensions.height;
      const screenW = dimensions.width;
      
      // Initial and target positions - simple straight line movement
      const initialY = Math.random() * screenH;
      const targetY = Math.random() * screenH;
      const initialX = Math.random() * screenW;
      const targetX = Math.random() * screenW;
      
      // Create variety in star types
      const isLargeStar = i % 10 === 0; // 10% large stars
      const isMediumStar = i % 5 === 0 && !isLargeStar; // 20% medium stars (excluding large)
      
      // Star size with variety - some bigger stars
      let starSize;
      if (isLargeStar) {
        starSize = (Math.random() * 2 + 3) * size; // 3-5px for large stars
      } else if (isMediumStar) {
        starSize = (Math.random() * 1 + 2) * size; // 2-3px for medium stars
      } else {
        starSize = (Math.random() * 1.5 + 0.5) * size; // 0.5-2px for small stars
      }
      
      // Duration between 8-20 seconds, adjusted by speed
      const baseDuration = 8 + Math.random() * 12; // 8-20 seconds
      const starDuration = baseDuration / speed;
      
      // Increased opacity for better visibility
      const baseOpacity = isLargeStar ? 0.95 : isMediumStar ? 0.9 : 0.85;
      
      return {
        id: i,
        initialX,
        initialY,
        targetX,
        targetY,
        size: starSize,
        duration: starDuration,
        delay: Math.random() * 0.5, // 0-0.5 second delay (much faster start)
        baseOpacity,
        isLarge: isLargeStar,
        isMedium: isMediumStar
      };
    });
  }, [starCount, dimensions.width, dimensions.height, speed, size]);

  return (
    <div 
      className={`star-container fixed inset-0 pointer-events-none ${className}`}
      style={{ 
        zIndex: 1,
        width: '100vw',
        height: '100vh'
      }}
    >
      {starConfigs.map((star) => (
        <motion.div
          key={star.id}
          className={`star-element absolute rounded-full ${
            star.isLarge ? 'bg-white/95' : 
            star.isMedium ? 'bg-white/90' : 
            'bg-white/85'
          }`}
          style={{
            width: star.size,
            height: star.size,
            // Enhanced glow for better visibility
            boxShadow: star.isLarge ? '0 0 6px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 255, 255, 0.4)' : 
                      star.isMedium ? '0 0 4px rgba(255, 255, 255, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)' : 
                      '0 0 2px rgba(255, 255, 255, 0.4)'
          }}
          initial={{
            x: star.initialX,
            y: star.initialY,
            opacity: 0,
          }}
          animate={{
            x: star.targetX,
            y: star.targetY,
            opacity: [0, star.baseOpacity * opacity, star.baseOpacity * opacity, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatDelay: star.delay,
            ease: "linear",
            type: "tween", // More performant than spring
            opacity: {
              duration: star.duration,
              ease: "linear",
              times: [0, 0.05, 0.95, 1], // Faster fade-in, longer visibility
              repeat: Infinity,
              repeatDelay: star.delay,
            }
          }}
        />
      ))}
    </div>
  );
};

export default OptimizedStarField; 