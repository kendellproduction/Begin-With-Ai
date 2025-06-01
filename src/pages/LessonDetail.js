import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new slide-based lesson viewer for immersive learning
    navigate(`/lesson-viewer/${lessonId}`, { replace: true });
  }, [lessonId, navigate]);

  // Show brief loading while redirecting
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-xl">Loading immersive lesson experience...</p>
      </div>
    </div>
  );
};

export default LessonDetail; 