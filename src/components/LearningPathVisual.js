import React from 'react';
import { useNavigate } from 'react-router-dom';

const LearningPathVisual = ({ 
  learningProgress, 
  userLearningPath, 
  compact = false, 
  showActions = true,
  className = "" 
}) => {
  const navigate = useNavigate();

  if (!learningProgress || !userLearningPath) {
    return null;
  }

  // Use real user data - no fake fallbacks
  const completedLessons = learningProgress?.completedLessons || 0;
  const totalLessons = lessons.length; // Use actual lessons array length instead of passed value
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const lessons = [
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

  // Handle lesson click - navigate to difficulty selection
  const handleLessonClick = (lesson, index) => {
    const isCompleted = index < completedLessons;
    const isCurrent = index === completedLessons;
    const isNext = index === completedLessons + 1;
    const isLocked = index > completedLessons + 1;
    
    if (isLocked) {
      return; // Can't access locked lessons
    }
    
    // Navigate to lesson start page with difficulty selection
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
  };

  const containerClass = compact 
    ? "bg-gradient-to-br from-indigo-900/60 via-purple-900/50 to-blue-900/60 backdrop-blur-xl rounded-3xl p-6 border border-indigo-400/30 shadow-2xl shadow-indigo-500/20"
    : "bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-blue-900/70 backdrop-blur-xl rounded-3xl p-8 border border-indigo-400/40 shadow-2xl shadow-indigo-500/30";

  const headerClass = compact ? "mb-8" : "mb-10";
  const titleClass = compact ? "text-2xl font-bold text-white mb-3" : "text-3xl font-bold text-white mb-4";
  const subtitleClass = compact ? "text-indigo-200 text-base" : "text-indigo-200 text-lg";
  const trackMargin = compact ? "mb-8" : "mb-12";
  const nodeSize = compact ? "w-12 h-12" : "w-16 h-16";
  const iconSize = compact ? "text-lg" : "text-2xl";
  const labelSize = compact ? "text-sm" : "text-sm";

  return (
    <div className={`relative ${containerClass} ${className} overflow-hidden`}>
      {/* Animated background particles with continuous movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        {/* Add some larger moving stars */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-br from-cyan-400/40 to-purple-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `drift ${8 + Math.random() * 6}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-10px) translateX(5px); opacity: 0.8; }
          100% { transform: translateY(-20px) translateX(-5px); opacity: 0.1; }
        }
        @keyframes drift {
          0% { transform: translateX(-100px) translateY(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-50px) rotate(360deg); opacity: 0; }
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
              <div key={lesson.id} className="flex flex-col items-center group relative">
                {/* Enhanced Node Circle */}
                <div 
                  className={`
                    relative ${nodeSize} rounded-full flex items-center justify-center 
                    transition-all duration-300 transform hover:scale-110 cursor-pointer
                    ${nodeClasses} ${shadowClasses} ${borderClasses}
                    ${!isLocked ? 'hover:rotate-6' : 'cursor-not-allowed'}
                  `}
                  onClick={() => handleLessonClick(lesson, index)}
                >
                  {/* Enhanced Glow Effect */}
                  {(isCompleted || isCurrent || isNext) && (
                    <div className={`absolute inset-0 rounded-full blur-md ${
                      isCompleted ? 'bg-emerald-400/40' : 
                      isCurrent ? 'bg-cyan-400/50' : 
                      'bg-orange-400/40'
                    } animate-pulse`}></div>
                  )}
                  
                  {/* Sparkle Effect for Current */}
                  {isCurrent && (
                    <>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    </>
                  )}
                  
                  {/* Icon */}
                  <span className={`relative z-10 ${iconSize} ${iconColor} transition-transform duration-300 group-hover:scale-110`}>
                    {isCompleted ? '✅' : lesson.icon}
                  </span>
                </div>
                
                {/* Enhanced Labels */}
                {!compact && (
                  <div className="mt-3 text-center">
                    <div className={`${labelSize} font-semibold transition-colors duration-300 ${
                      isCompleted ? 'text-emerald-300' :
                      isCurrent ? 'text-cyan-300' :
                      isNext ? 'text-orange-300' :
                      isLocked ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {lesson.title}
                    </div>
                    {!isLocked && (
                      <div className="text-xs text-indigo-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Click to start
                      </div>
                    )}
                  </div>
                )}
                
                {/* Enhanced Tooltips */}
                {compact && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30">
                    <div className="bg-slate-800/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium shadow-xl border border-indigo-400/30 whitespace-nowrap">
                      {lesson.title}
                      {!isLocked && <div className="text-xs text-indigo-300 mt-1">Click to start</div>}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                )}
                
                {/* Status indicators */}
                {!compact && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' :
                      isCurrent ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' :
                      isNext ? 'bg-orange-500/20 text-orange-300 border border-orange-400/40' :
                      isLocked ? 'bg-slate-500/20 text-slate-400 border border-slate-500/40' :
                      'bg-slate-500/20 text-slate-300 border border-slate-400/40'
                    }`}>
                      {isCompleted ? 'Completed' : 
                       isCurrent ? 'Current' : 
                       isNext ? 'Available' : 
                       isLocked ? 'Locked' : 'Ready'}
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