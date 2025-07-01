import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Route specific lessons to their specialized viewers
    if (lessonId === 'history-of-ai' || lessonId === 'welcome-ai-revolution') {
      // Use synchronized audio viewer for History of AI lesson
      navigate(`/lesson-sync/${lessonId}`, { replace: true });
    } else {
      // Use standard modern lesson viewer for other lessons
      navigate(`/lesson-viewer/${lessonId}`, { replace: true });
    }
  }, [lessonId, navigate]);

  // Show brief loading while redirecting
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center text-white overflow-hidden"
      style={{ backgroundColor: '#2061a6' }}
    >
      {/* Star Animation Container for LessonDetail - High Performance GPU Accelerated */}
      <div className="star-container absolute inset-0 z-0 pointer-events-none">
        {[...Array(80)].map((_, i) => {
          const screenH = window.innerHeight;
          const screenW = window.innerWidth;
          const initialY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const targetY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const initialX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const targetX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const starDuration = 30 + Math.random() * 25;
          const starSize = Math.random() * 2 + 0.5; // 0.5px to 2.5px (smaller, less distracting)

          return (
            <motion.div
              key={`lesson-detail-star-${i}`}
              className="star-element absolute rounded-full bg-white/50"
              style={{
                width: starSize,
                height: starSize,
              }}
              initial={{
                x: initialX,
                y: initialY,
                opacity: 0,
              }}
              animate={{
                x: targetX,
                y: targetY,
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: starDuration,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
                ease: "linear",
                type: "tween", // More performant than spring
                opacity: {
                  duration: starDuration,
                  ease: "linear",
                  times: [0, 0.1, 0.85, 1],
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 2,
                }
              }}
            />
          );
        })}
      </div>
      <div className="text-center text-white relative z-10">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-xl">
          {(lessonId === 'history-of-ai' || lessonId === 'welcome-ai-revolution') 
            ? 'Loading synchronized audio experience...' 
            : 'Loading immersive lesson experience...'}
        </p>
      </div>
    </div>
  );
};

export default LessonDetail; 