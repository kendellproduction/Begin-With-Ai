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
  const totalLessons = learningProgress?.totalLessons || 10;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const lessons = [
    { id: 1, title: "AI Basics", icon: "🚀" },
    { id: 2, title: "Understanding AI", icon: "🧠" },
    { id: 3, title: "Prompt Engineering", icon: "⚡" },
    { id: 4, title: "Advanced Prompts", icon: "🎯" },
    { id: 5, title: "AI Ethics", icon: "🛡️" },
    { id: 6, title: "Real Projects", icon: "🏗️" },
    { id: 7, title: "Industry Apps", icon: "🏢" },
    { id: 8, title: "AI Trends", icon: "🔮" },
    { id: 9, title: "Advanced Tools", icon: "🔧" },
    { id: 10, title: "Mastery", icon: "👑" },
  ];

  const containerClass = compact 
    ? "bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/30"
    : "bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl";

  const headerClass = compact ? "mb-6" : "mb-8";
  const titleClass = compact ? "text-xl font-bold text-white mb-2" : "text-2xl font-bold text-white mb-2";
  const subtitleClass = compact ? "text-slate-300 text-sm" : "text-slate-300 text-base";
  const trackMargin = compact ? "mb-6" : "mb-8";
  const nodeSize = compact ? "w-8 h-8" : "w-10 h-10";
  const iconSize = compact ? "text-sm" : "text-base";
  const labelSize = compact ? "text-xs" : "text-xs";

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Header */}
      <div className={`text-center ${headerClass}`}>
        <h2 className={titleClass}>
          {compact ? "Learning Path" : "Your Learning Journey"}
        </h2>
        {!compact && (
          <>
            <p className={subtitleClass}>{userLearningPath.pathTitle}</p>
            {completedLessons > 0 ? (
              <div className="mt-3 flex items-center justify-center space-x-4 text-xs">
                <span className="text-green-400 font-medium">
                  {completedLessons} Completed
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-blue-400 font-medium">
                  {totalLessons - completedLessons} Remaining
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-purple-400 font-medium">
                  {progressPercentage.toFixed(0)}% Complete
                </span>
              </div>
            ) : (
              <div className="mt-3 text-xs text-slate-400 text-center">
                Ready to start your learning journey
              </div>
            )}
          </>
        )}
        {compact && (
          <div className="flex items-center justify-center space-x-4 text-xs">
            {completedLessons > 0 ? (
              <>
                <span className="text-green-400">{completedLessons}/{totalLessons} Complete</span>
                <span className="text-blue-400">{progressPercentage.toFixed(0)}%</span>
              </>
            ) : (
              <span className="text-slate-400">Not started</span>
            )}
          </div>
        )}
      </div>
      
      {/* Progress Track */}
      <div className={`relative ${trackMargin}`}>
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-600/50 rounded-full transform -translate-y-1/2 z-0"></div>
        
        {/* Progress Track */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full transform -translate-y-1/2 z-10 transition-all duration-1000"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        
        {/* Lesson Nodes */}
        <div className="relative z-20 flex justify-between items-center">
          {lessons.map((lesson, index) => {
            const isCompleted = index < completedLessons;
            const isCurrent = index === completedLessons;
            const isLocked = index > completedLessons;
            
            return (
              <div key={lesson.id} className="flex flex-col items-center group relative">
                {/* Node Circle */}
                <div className={`relative ${nodeSize} rounded-full flex items-center justify-center border-3 transition-all duration-300 cursor-pointer hover:scale-110 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/30' 
                    : isCurrent
                    ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/40 animate-pulse'
                    : 'bg-slate-600 border-slate-500'
                }`}>
                  {/* Glow Effect */}
                  {(isCompleted || isCurrent) && (
                    <div className={`absolute inset-0 rounded-full blur-sm animate-pulse ${
                      isCompleted ? 'bg-green-500/30' : 'bg-blue-500/30'
                    }`}></div>
                  )}
                  
                  {/* Icon */}
                  <span className={`relative z-10 ${iconSize} ${
                    isCompleted ? 'text-white' :
                    isCurrent ? 'text-white' :
                    'text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : isCurrent ? lesson.icon : '●'}
                  </span>
                </div>
                
                {/* Label */}
                {!compact && (
                  <div className="mt-2 text-center">
                    <div className={`${labelSize} font-medium transition-colors duration-300 ${
                      isCompleted ? 'text-green-400' :
                      isCurrent ? 'text-blue-400' :
                      'text-slate-500'
                    }`}>
                      {lesson.title}
                    </div>
                  </div>
                )}
                
                {/* Compact mode tooltip */}
                {compact && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30">
                    <div className="bg-slate-800 text-white px-2 py-1 rounded text-xs font-medium shadow-xl border border-slate-600 whitespace-nowrap">
                      {lesson.title}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                )}
                
                {/* Current lesson tooltip */}
                {!compact && isCurrent && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-xl border border-slate-600">
                      Start Now
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Action Buttons (only if showActions is true) */}
      {showActions && !compact && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/lessons')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
          >
            {completedLessons > 0 ? 'Continue Learning →' : 'Start Learning →'}
          </button>
          <button
            onClick={() => navigate('/lessons')}
            className="px-5 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-all duration-300 border border-slate-600 text-sm"
          >
            View All Lessons
          </button>
        </div>
      )}
      
      {/* Compact mode action */}
      {showActions && compact && (
        <div className="text-center">
          <button
            onClick={() => navigate('/lessons')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
};

export default LearningPathVisual; 