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
      
      // Create variety in star types like AI News page LoggedInNavbar
      const isLargeStar = i % 10 === 0; // 10% large stars
      const isMediumStar = i % 5 === 0 && !isLargeStar; // 20% medium stars (excluding large)
      
      // Use the same size range as AI News page
      let starSize;
      if (isLargeStar) {
        starSize = (3 + Math.random() * 2) * size; // 3-5px for large stars
      } else if (isMediumStar) {
        starSize = (2 + Math.random() * 1) * size; // 2-3px for medium stars
      } else {
        starSize = (0.5 + Math.random() * 1.5) * size; // 0.5-2px for small stars
      }
      
      const starOpacity = isLargeStar ? 0.9 : isMediumStar ? 0.85 : 0.8;
      const duration = (Math.random() * 20 + 15) / speed; // 15-35 seconds adjusted by speed
      const delay = Math.random() * 10; // 0-10 seconds delay

      const initialY = Math.random() * screenH;
      const targetY = Math.random() * screenH;
      const initialX = Math.random() * screenW;
      const targetX = Math.random() * screenW;
      
      return {
        id: i,
        initialX,
        initialY,
        targetX,
        targetY,
        size: starSize,
        opacity: starOpacity * opacity,
        duration,
        delay,
        isLarge: isLargeStar,
        isMedium: isMediumStar
      };
    });
  }, [starCount, dimensions.width, dimensions.height, speed, size, opacity]);

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
            boxShadow: star.isLarge 
              ? '0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.6)' 
              : star.isMedium 
                ? '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.5)' 
                : '0 0 6px rgba(255, 255, 255, 0.6)'
          }}
          initial={{
            x: star.initialX,
            y: star.initialY,
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            x: [star.initialX, star.targetX, star.initialX],
            y: [star.initialY, star.targetY, star.initialY],
            opacity: [0, star.opacity, star.opacity, 0],
            scale: [0.5, 1, 1.1, 1, 0.5]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatDelay: star.delay,
            ease: "easeInOut",
            type: "tween",
            opacity: {
              duration: star.duration,
              ease: "easeInOut",
              times: [0, 0.1, 0.8, 1],
              repeat: Infinity,
              repeatDelay: star.delay,
            },
            scale: {
              duration: star.duration,
              ease: "easeInOut",  
              times: [0, 0.2, 0.5, 0.8, 1],
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