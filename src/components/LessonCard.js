import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LessonCard = ({ lesson, onClick, className = "" }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/lessons/${lesson.id}`);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return {
          bg: 'bg-emerald-500/90',
          border: 'border-emerald-400/50',
          shadow: 'shadow-emerald-500/30',
          text: 'text-emerald-100'
        };
      case 'intermediate':
        return {
          bg: 'bg-amber-500/90',
          border: 'border-amber-400/50',
          shadow: 'shadow-amber-500/30',
          text: 'text-amber-100'
        };
      case 'advanced':
        return {
          bg: 'bg-red-500/90',
          border: 'border-red-400/50',
          shadow: 'shadow-red-500/30',
          text: 'text-red-100'
        };
      default:
        return {
          bg: 'bg-indigo-500/90',
          border: 'border-indigo-400/50',
          shadow: 'shadow-indigo-500/30',
          text: 'text-indigo-100'
        };
    }
  };

  const difficultyStyle = getDifficultyColor(lesson.difficulty);
  const hasImage = lesson.imageUrl && lesson.imageUrl !== '/path/to/default/image.jpg';

  return (
    <div className={`group relative ${className}`}>
      {/* Main Card Container */}
      <div
        className={`
          relative h-[420px] md:h-[450px] lg:h-[480px] 
          bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-indigo-950/95
          backdrop-blur-xl border border-white/10
          rounded-3xl overflow-hidden cursor-pointer
          transform transition-all duration-500 ease-out
          hover:scale-[1.02] hover:-translate-y-2
          hover:shadow-2xl hover:shadow-indigo-500/25
          hover:border-white/20
          ${isHovered ? 'ring-2 ring-indigo-400/50' : ''}
        `}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image */}
        {hasImage && (
          <div className="absolute inset-0">
            <img
              src={lesson.imageUrl}
              alt={lesson.title}
              className={`
                w-full h-full object-cover
                transition-transform duration-700 ease-out
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/40" />
          </div>
        )}

        {/* Animated background pattern for cards without images */}
        {!hasImage && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
            <div className={`
              absolute inset-0 opacity-30
              bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
              from-indigo-400/20 via-transparent to-transparent
              transition-opacity duration-500
              ${isHovered ? 'opacity-50' : 'opacity-30'}
            `} />
          </div>
        )}

        {/* Content Container */}
        <div className="relative h-full flex flex-col p-6 md:p-7 lg:p-8 z-10">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            {/* Module Tag */}
            <div className="flex flex-col space-y-2">
              {lesson.moduleTitle && (
                <span className="
                  inline-block px-3 py-1 rounded-full text-xs font-medium
                  bg-white/10 backdrop-blur-sm border border-white/20
                  text-white/80 hover:text-white transition-colors duration-300
                ">
                  {lesson.moduleTitle}
                </span>
              )}
              
              {/* Difficulty Badge */}
              <span className={`
                inline-block px-3 py-1.5 rounded-full text-xs font-semibold
                ${difficultyStyle.bg} ${difficultyStyle.border} ${difficultyStyle.text}
                border backdrop-blur-sm shadow-lg ${difficultyStyle.shadow}
                transition-all duration-300
                ${isHovered ? 'scale-105 shadow-xl' : ''}
              `}>
                {lesson.difficulty || 'Intermediate'}
              </span>
            </div>

            {/* Interactive Badge */}
            {lesson.hasCodeSandbox && (
              <div className="
                flex items-center space-x-1 px-2.5 py-1 rounded-full
                bg-cyan-500/20 border border-cyan-400/30
                text-cyan-300 text-xs font-medium
                backdrop-blur-sm shadow-lg shadow-cyan-500/20
              ">
                <span>⚡</span>
                <span>Interactive</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className={`
            text-xl md:text-2xl font-bold text-white mb-3
            leading-tight line-clamp-2
            transition-all duration-300
            ${isHovered ? 'text-indigo-200' : ''}
          `}>
            {lesson.title}
          </h3>

          {/* Description */}
          <p className="
            text-slate-300 text-sm md:text-base leading-relaxed
            line-clamp-3 mb-6 flex-1
            transition-colors duration-300
            hover:text-slate-200
          ">
            {lesson.description || lesson.coreConcept || 'Discover the fundamentals of AI and how it can transform your understanding of technology.'}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-xs text-slate-400">
              {lesson.duration && (
                <div className="flex items-center space-x-1">
                  <span>⏱️</span>
                  <span>{lesson.duration} min</span>
                </div>
              )}
              {lesson.xpReward && (
                <div className="flex items-center space-x-1">
                  <span>⭐</span>
                  <span>{lesson.xpReward} XP</span>
                </div>
              )}
            </div>
            
            {/* Tags */}
            {lesson.tags && lesson.tags.length > 0 && (
              <div className="flex space-x-1">
                {lesson.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="
                      px-2 py-1 rounded-md text-xs
                      bg-white/5 border border-white/10
                      text-white/60 backdrop-blur-sm
                    "
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className={`
              w-full py-3.5 md:py-4 rounded-2xl font-semibold text-base
              bg-gradient-to-r from-indigo-500 to-purple-600
              hover:from-indigo-600 hover:to-purple-700
              text-white shadow-lg shadow-indigo-500/25
              border border-indigo-400/30
              backdrop-blur-sm
              transition-all duration-300 ease-out
              transform hover:scale-[1.02] active:scale-[0.98]
              hover:shadow-xl hover:shadow-indigo-500/40
              ${isHovered ? 'ring-2 ring-indigo-400/50' : ''}
            `}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Start Learning</span>
              <span className={`
                transition-transform duration-300
                ${isHovered ? 'translate-x-1' : ''}
              `}>
                →
              </span>
            </span>
          </button>
        </div>

        {/* Hover Effects */}
        <div className={`
          absolute inset-0 pointer-events-none
          bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5
          transition-opacity duration-500
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `} />

        {/* Animated border glow */}
        <div className={`
          absolute inset-0 rounded-3xl pointer-events-none
          bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20
          transition-opacity duration-500
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `} style={{
          background: isHovered ? 
            'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))' : 
            'transparent',
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'exclude'
        }} />
      </div>

      {/* Floating Elements */}
      <div className={`
        absolute -top-2 -right-2 w-4 h-4 rounded-full
        bg-gradient-to-br from-cyan-400 to-blue-500
        transition-all duration-500
        ${isHovered ? 'scale-125 shadow-lg shadow-cyan-400/50' : 'scale-100'}
      `} />
      <div className={`
        absolute -bottom-2 -left-2 w-3 h-3 rounded-full
        bg-gradient-to-br from-pink-400 to-purple-500
        transition-all duration-700
        ${isHovered ? 'scale-125 shadow-lg shadow-pink-400/50' : 'scale-100'}
      `} />
    </div>
  );
};

export default LessonCard;
