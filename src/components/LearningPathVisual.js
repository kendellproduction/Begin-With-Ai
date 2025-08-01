import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';

const LearningPathVisual = ({ 
  learningProgress, 
  userLearningPath, 
  compact = false, 
  showActions = true,
  className = "",
  onLessonClick = null // Optional callback for lesson clicks
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hoveredLesson, setHoveredLesson] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!learningProgress || !userLearningPath) {
    return null;
  }

  const baseLessons = userLearningPath.lessons || [
    { id: 1, title: "AI Basics", icon: "🚀", difficulty: "beginner" },
    { id: 2, title: "Understanding AI", icon: "🧠", difficulty: "beginner" },
    { id: 3, title: "Prompt Engineering", icon: "⚡", difficulty: "intermediate" },
    { id: 4, title: "Advanced Prompts", icon: "🎯", difficulty: "intermediate" },
    { id: 5, title: "AI Ethics", icon: "🛡️", difficulty: "intermediate" },
    { id: 6, title: "Real Projects", icon: "🏗️", difficulty: "advanced" },
    { id: 7, title: "Industry Apps", icon: "🏢", difficulty: "advanced" },
    { id: 8, title: "AI Trends", icon: "🔮", difficulty: "advanced" },
    { id: 9, title: "Advanced Tools", icon: "🔧", difficulty: "expert" },
    { id: 10, title: "Mastery", icon: "👑", difficulty: "expert" },
  ];

  const lessons = isMobile ? baseLessons.slice(0, 5) : baseLessons;

  // Use real user data
  const completedLessons = learningProgress?.completedLessons || 0;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Handle lesson click - define AFTER completedLessons is available
  const handleLessonClick = useCallback((lesson, index) => {
    const isCompleted = index < completedLessons;
    const isCurrent = index === completedLessons;
    const isNext = index === completedLessons + 1;
    const isLocked = index > completedLessons + 1;
    
    if (isLocked) {
      return; // Can't access locked lessons
    }
    
    // Check if user has premium subscription
    const isPremiumUser = user?.subscriptionTier === 'premium' || user?.isPremium === true;
    
    if (onLessonClick) {
      // If premium user, modify the lesson data to indicate premium access
      const lessonData = {
        ...lesson,
        title: lesson.title,
        icon: lesson.icon,
        isCompleted,
        isCurrent,
        isNext,
        fromLearningPath: true,
        difficulty: isPremiumUser ? 'Premium' : 'Free'
      };
      
      // For premium users, we can call onLessonClick with premium difficulty pre-set
      if (isPremiumUser) {
        // Skip the modal and go directly to lesson with premium content
        navigate(`/lessons/${lesson.id}`, {
          state: {
            pathId: 'prompt-engineering-mastery',
            moduleId: lesson.moduleId || 'intro-to-ai',
            difficulty: 'Premium',
            fromLearningPath: true
          }
        });
      } else {
        // Use the provided callback for free users (will show modal)
        onLessonClick(lessonData);
      }
    } else {
      // Navigate to lesson start page with difficulty selection (fallback)
      if (isPremiumUser) {
        // Premium users go directly to lesson with premium content
        navigate(`/lessons/${lesson.id}`, {
          state: {
            pathId: 'prompt-engineering-mastery',
            moduleId: lesson.moduleId || 'intro-to-ai',
            difficulty: 'Premium',
            fromLearningPath: true
          }
        });
      } else {
        // Free users go to lesson start page with difficulty selection
        navigate(`/lessons/start/${lesson.id}`, {
          state: {
            lessonTitle: lesson.title,
            lessonIcon: lesson.icon,
            isCompleted,
            isCurrent,
            isNext,
            fromLearningPath: true
          }
        });
      }
    }
  }, [completedLessons, onLessonClick, navigate, user?.subscriptionTier, user?.isPremium]);

  const containerClass = compact 
    ? "bg-gradient-to-br from-gray-900/95 via-slate-900/90 to-black/95 backdrop-blur-xl rounded-xl p-4 border border-gray-600/40 shadow-2xl shadow-gray-500/25 hover:shadow-3xl hover:shadow-gray-400/30 transition-all duration-500"
    : "bg-gradient-to-br from-gray-900/95 via-slate-900/90 to-black/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/50 shadow-2xl shadow-gray-500/30 hover:shadow-3xl hover:shadow-gray-400/40 transition-all duration-500";

  const headerClass = compact ? "mb-5" : "mb-10";
  const titleClass = compact ? "text-xl font-bold text-white mb-2" : "text-3xl font-bold text-white mb-4";
  const subtitleClass = compact ? "text-indigo-200 text-sm" : "text-indigo-200 text-lg";
  const trackMargin = compact ? "mb-5" : "mb-12";
  const nodeSize = compact ? "w-10 h-10" : "w-16 h-16";
  const iconSize = compact ? "text-sm" : "text-2xl";
  const labelSize = compact ? "text-sm" : "text-sm";

  return (
    <div className={`relative ${containerClass} ${className} overflow-hidden group`}>
      {/* Animated border glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Enhanced animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Small floating particles */}
        {[...Array(compact ? 15 : 25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-br from-cyan-300/40 to-blue-300/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `learning-path-float ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Medium sparkle particles */}
        {[...Array(compact ? 8 : 12)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1.5 h-1.5 bg-gradient-to-br from-purple-300/50 to-pink-300/50 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Larger drifting stars */}
        {[...Array(compact ? 5 : 8)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-br from-cyan-400/60 to-purple-400/60 rounded-full shadow-lg shadow-cyan-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `learning-path-drift ${8 + Math.random() * 6}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* CSS animations - using inline styles for Tailwind compatibility */}
      <style>{`
        @keyframes learning-path-float {
          0% { transform: translateY(0px) translateX(0px) scale(0.8); opacity: 0.4; }
          50% { transform: translateY(-15px) translateX(8px) scale(1.2); opacity: 0.9; }
          100% { transform: translateY(-30px) translateX(-8px) scale(0.6); opacity: 0.2; }
        }
        @keyframes learning-path-drift {
          0% { transform: translateX(-100px) translateY(0px) rotate(0deg) scale(0.5); opacity: 0; }
          10% { opacity: 1; transform: scale(1); }
          90% { opacity: 1; transform: scale(1); }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-60px) rotate(360deg) scale(0.3); opacity: 0; }
        }
        @keyframes learning-path-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(139, 92, 246, 0.2); }
          50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.5), 0 0 60px rgba(139, 92, 246, 0.4); }
        }
      `}</style>

      {/* Header */}
      <div className={`text-center ${headerClass} relative z-10`}>
        <h2 className={`${titleClass} bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent`}>
          {compact ? "🗺️ Learning Path" : "🗺️ Your Learning Journey"}
        </h2>
        {!compact && (
          <>
            <p className={`${subtitleClass} font-medium`}>{userLearningPath.pathTitle}</p>
            {completedLessons > 0 ? (
              <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                  <span className="text-emerald-300 font-semibold">
                    {completedLessons} Completed
                  </span>
                </div>
                <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                  <span className="text-cyan-300 font-semibold">
                    {totalLessons - completedLessons} Remaining
                  </span>
                </div>
                <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                  <span className="text-purple-300 font-semibold">
                    {progressPercentage.toFixed(0)}% Complete
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-indigo-300 text-center font-medium">
                ✨ Ready to start your learning journey
              </div>
            )}
          </>
        )}
        {compact && (
          <div className="flex items-center justify-center space-x-4 text-sm">
            {completedLessons > 0 ? (
              <>
                <span className="text-emerald-300 font-semibold">{completedLessons}/{totalLessons} Complete</span>
                <span className="text-purple-300 font-semibold">{progressPercentage.toFixed(0)}%</span>
              </>
            ) : (
              <span className="text-indigo-300 font-medium">Ready to begin</span>
            )}
          </div>
        )}
      </div>
      
      {/* Enhanced Progress Track */}
      <div className={`relative ${trackMargin}`}>
        {/* Glowing Background Track */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-full transform -translate-y-1/2 z-0 shadow-inner"></div>
        
        {/* Animated Progress Track with Glow */}
        <div 
          className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-500 rounded-full transform -translate-y-1/2 z-10 transition-all duration-1000 shadow-lg"
          style={{ 
            width: `${progressPercentage}%`,
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(34, 211, 238, 0.3), 0 0 60px rgba(139, 92, 246, 0.2)'
          }}
        >
          {/* Flowing animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"></div>
        </div>
        
        {/* Enhanced Lesson Nodes */}
        <div className="relative z-20 flex justify-between items-center">
          {lessons.map((lesson, index) => {
            const isCompleted = index < completedLessons;
            const isCurrent = index === completedLessons;
            const isNext = index === completedLessons + 1;
            const isLocked = index > completedLessons + 1;
            
            let nodeClasses, shadowClasses, iconColor, borderClasses;
            
            if (isCompleted) {
              nodeClasses = 'bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500';
              shadowClasses = 'shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-400/60';
              iconColor = 'text-white';
              borderClasses = 'border-2 border-emerald-300/80';
            } else if (isCurrent) {
              nodeClasses = 'bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400';
              shadowClasses = 'shadow-xl shadow-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-400/70 animate-pulse';
              iconColor = 'text-white';
              borderClasses = 'border-2 border-cyan-300/90 ring-4 ring-cyan-400/30';
            } else if (isNext) {
              nodeClasses = 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400';
              shadowClasses = 'shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-400/60';
              iconColor = 'text-white';
              borderClasses = 'border-2 border-yellow-300/80';
            } else if (isLocked) {
              nodeClasses = 'bg-gradient-to-br from-slate-600 to-slate-700';
              shadowClasses = 'shadow-md shadow-slate-600/30';
              iconColor = 'text-slate-500 opacity-50';
              borderClasses = 'border-2 border-slate-500/50';
            } else {
              nodeClasses = 'bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-400 hover:to-slate-500';
              shadowClasses = 'shadow-md shadow-slate-500/40 hover:shadow-lg hover:shadow-slate-400/50';
              iconColor = 'text-slate-300';
              borderClasses = 'border-2 border-slate-400/60';
            }
            
            return (
              <div key={lesson.id} className="flex flex-col items-center relative">
                {/* Enhanced Node Circle - with controlled hover area */}
                <div 
                  className={`
                    relative ${nodeSize} rounded-full flex items-center justify-center 
                    transition-all duration-300 transform cursor-pointer
                    ${nodeClasses} ${shadowClasses} ${borderClasses}
                    ${!isLocked ? '' : 'cursor-not-allowed'}
                  `}
                  onClick={() => handleLessonClick(lesson, index)}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredLesson(lesson.id);
                    if (!isLocked) {
                      e.currentTarget.style.transform = 'scale(1.1) rotate(6deg)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    setHoveredLesson(null);
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  }}
                >
                  {/* Enhanced Glow Effect */}
                  {(isCompleted || isCurrent || isNext) && (
                    <div className={`absolute inset-0 rounded-full blur-md ${
                      isCompleted ? 'bg-emerald-400/40' : 
                      isCurrent ? 'bg-cyan-400/50' : 
                      'bg-orange-400/40'
                    } animate-pulse pointer-events-none`}></div>
                  )}
                  
                  {/* Sparkle Effect for Current */}
                  {isCurrent && (
                    <>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping pointer-events-none"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-ping pointer-events-none" style={{animationDelay: '0.5s'}}></div>
                    </>
                  )}
                  
                  {/* Icon */}
                  <span className={`relative z-10 ${iconSize} ${iconColor} transition-transform duration-300 pointer-events-none`}>
                    {isCompleted ? '✅' : lesson.icon}
                  </span>
                </div>
                
                {/* Tooltip - positioned outside the icon container - only show for this specific lesson */}
                {hoveredLesson === lesson.id && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 pointer-events-none z-50">
                    <div className="bg-slate-800/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium shadow-xl border border-indigo-400/30 whitespace-nowrap">
                      {lesson.title}
                      {!isLocked && <div className="text-xs text-indigo-300 mt-1">Click to start</div>}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Enhanced Action Buttons */}
      {showActions && !compact && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <button
            onClick={() => {
              const currentLesson = lessons[completedLessons];
              if (currentLesson) {
                handleLessonClick(currentLesson, completedLessons);
              } else {
                navigate('/lessons');
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-400/40 text-lg"
          >
            {completedLessons > 0 ? '🚀 Continue Learning Journey' : '✨ Start Learning Journey'}
          </button>
          <button
            onClick={() => navigate('/lessons')}
            className="px-6 py-4 bg-slate-700/80 hover:bg-slate-600/80 text-white font-semibold rounded-2xl transition-all duration-300 border border-slate-500/50 hover:border-slate-400/60 backdrop-blur-sm text-lg"
          >
            📚 Browse All Lessons
          </button>
        </div>
      )}
      
      {/* Enhanced Compact mode action */}
      {showActions && compact && (
        <div className="text-center relative z-10">
          <button
            onClick={() => {
              const currentLesson = lessons[completedLessons];
              if (currentLesson) {
                handleLessonClick(currentLesson, completedLessons);
              } else {
                navigate('/lessons');
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
};

export default LearningPathVisual; 