import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OptimizedStarField from '../components/OptimizedStarField';

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
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white overflow-hidden"
    >
      {/* Optimized Star Field */}
      <OptimizedStarField starCount={220} opacity={0.6} speed={0.8} size={1} />
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