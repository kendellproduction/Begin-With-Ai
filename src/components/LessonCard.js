import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const LessonCard = ({ lesson, onClick, className = "", showDifficultySelector = false, showEditButton = true }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  // If showDifficultySelector is true, default to 'free'. 
  // Otherwise, use the lesson's inherent difficulty (or 'free' as a fallback).
  const initialDifficulty = showDifficultySelector ? 'free' : (lesson.difficulty || 'free');
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
  
  const [showDifficultyOptions, setShowDifficultyOptions] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  // Check if user has admin permissions
  const isAdmin = user?.role === 'admin' || user?.role === 'developer';

  // TEMPORARILY DISABLED: Check if lesson requires premium access
  // const isPremiumLesson = lesson.difficulty === 'Intermediate' || lesson.difficulty === 'Advanced';
  const isPremiumLesson = false;

  const handleEditLesson = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to lesson builder with lesson data for editing
    navigate('/unified-lesson-builder', { 
      state: { 
        editingLesson: {
          ...lesson,
          isDraft: false,
          isPublished: true
        }
      } 
    });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(lesson);
    }
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyOptions(false);
    
    if (onClick) {
      onClick({ ...lesson, selectedDifficulty: difficulty });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'free':
      case 'beginner':
        return {
          bg: 'bg-emerald-500/90',
          border: 'border-emerald-400/50',
          shadow: 'shadow-emerald-500/30',
          text: 'text-emerald-100'
        };
      case 'premium':
      case 'intermediate':
      case 'advanced':
        return {
          bg: 'bg-blue-500/90',
          border: 'border-blue-400/50',
          shadow: 'shadow-blue-500/30',
          text: 'text-blue-100'
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

  // 24 rich, solid color palettes with warm and vibrant tones
  const colorPalettes = [
    // Warm Caramel
    {
      gradient: 'bg-amber-600/85',
      borderGlow: 'border-amber-400/70',
      shadowColor: 'shadow-amber-600/50',
      textAccent: 'text-amber-100',
      buttonStyle: 'from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600',
      particles: ['✨', '🍯', '🌟']
    },
    // Forest Green
    {
      gradient: 'bg-green-600/85',
      borderGlow: 'border-green-400/70',
      shadowColor: 'shadow-green-600/50',
      textAccent: 'text-green-100',
      buttonStyle: 'from-green-500 to-green-700 hover:from-green-400 hover:to-green-600',
      particles: ['🌿', '🍃', '🌱']
    },
    // Rich Terracotta
    {
      gradient: 'bg-orange-700/85',
      borderGlow: 'border-orange-500/70',
      shadowColor: 'shadow-orange-700/50',
      textAccent: 'text-orange-100',
      buttonStyle: 'from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700',
      particles: ['🏺', '🍂', '🌅']
    },
    // Ocean Blue
    {
      gradient: 'bg-blue-600/85',
      borderGlow: 'border-blue-400/70',
      shadowColor: 'shadow-blue-600/50',
      textAccent: 'text-blue-100',
      buttonStyle: 'from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600',
      particles: ['🌊', '💧', '🐟']
    },
    // Warm Chocolate
    {
      gradient: 'bg-amber-800/85',
      borderGlow: 'border-amber-600/70',
      shadowColor: 'shadow-amber-800/50',
      textAccent: 'text-amber-100',
      buttonStyle: 'from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800',
      particles: ['🍫', '☕', '🌰']
    },
    // Sage Green
    {
      gradient: 'bg-emerald-600/85',
      borderGlow: 'border-emerald-400/70',
      shadowColor: 'shadow-emerald-600/50',
      textAccent: 'text-emerald-100',
      buttonStyle: 'from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600',
      particles: ['🌿', '🕊️', '💚']
    },
    // Sunset Orange
    {
      gradient: 'bg-orange-600/85',
      borderGlow: 'border-orange-400/70',
      shadowColor: 'shadow-orange-600/50',
      textAccent: 'text-orange-100',
      buttonStyle: 'from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600',
      particles: ['🌅', '🔥', '☀️']
    },
    // Teal Waters
    {
      gradient: 'bg-teal-600/85',
      borderGlow: 'border-teal-400/70',
      shadowColor: 'shadow-teal-600/50',
      textAccent: 'text-teal-100',
      buttonStyle: 'from-teal-500 to-teal-700 hover:from-teal-400 hover:to-teal-600',
      particles: ['🌊', '🐚', '💎']
    },
    // Warm Rust
    {
      gradient: 'bg-red-700/85',
      borderGlow: 'border-red-500/70',
      shadowColor: 'shadow-red-700/50',
      textAccent: 'text-red-100',
      buttonStyle: 'from-red-600 to-red-800 hover:from-red-500 hover:to-red-700',
      particles: ['🍁', '🔥', '🌋']
    },
    // Deep Navy
    {
      gradient: 'bg-indigo-700/85',
      borderGlow: 'border-indigo-500/70',
      shadowColor: 'shadow-indigo-700/50',
      textAccent: 'text-indigo-100',
      buttonStyle: 'from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700',
      particles: ['⭐', '🌙', '💫']
    },
    // Warm Sand
    {
      gradient: 'bg-yellow-700/85',
      borderGlow: 'border-yellow-500/70',
      shadowColor: 'shadow-yellow-700/50',
      textAccent: 'text-yellow-100',
      buttonStyle: 'from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700',
      particles: ['🏖️', '☀️', '🌾']
    },
    // Pine Forest
    {
      gradient: 'bg-green-700/85',
      borderGlow: 'border-green-500/70',
      shadowColor: 'shadow-green-700/50',
      textAccent: 'text-green-100',
      buttonStyle: 'from-green-600 to-green-800 hover:from-green-500 hover:to-green-700',
      particles: ['🌲', '🏔️', '🦌']
    },
    // Sky Blue
    {
      gradient: 'bg-sky-600/85',
      borderGlow: 'border-sky-400/70',
      shadowColor: 'shadow-sky-600/50',
      textAccent: 'text-sky-100',
      buttonStyle: 'from-sky-500 to-sky-700 hover:from-sky-400 hover:to-sky-600',
      particles: ['☁️', '🌤️', '🕊️']
    },
    // Copper Glow
    {
      gradient: 'bg-orange-800/85',
      borderGlow: 'border-orange-600/70',
      shadowColor: 'shadow-orange-800/50',
      textAccent: 'text-orange-100',
      buttonStyle: 'from-orange-700 to-orange-900 hover:from-orange-600 hover:to-orange-800',
      particles: ['🔶', '⚡', '🌟']
    },
    // Moss Green
    {
      gradient: 'bg-lime-700/85',
      borderGlow: 'border-lime-500/70',
      shadowColor: 'shadow-lime-700/50',
      textAccent: 'text-lime-100',
      buttonStyle: 'from-lime-600 to-lime-800 hover:from-lime-500 hover:to-lime-700',
      particles: ['🍀', '🌱', '🦎']
    },
    // Denim Blue
    {
      gradient: 'bg-blue-700/85',
      borderGlow: 'border-blue-500/70',
      shadowColor: 'shadow-blue-700/50',
      textAccent: 'text-blue-100',
      buttonStyle: 'from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700',
      particles: ['🌀', '💙', '🦋']
    },
    // Jade Stone
    {
      gradient: 'bg-emerald-700/85',
      borderGlow: 'border-emerald-500/70',
      shadowColor: 'shadow-emerald-700/50',
      textAccent: 'text-emerald-100',
      buttonStyle: 'from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700',
      particles: ['💚', '🔮', '🏯']
    },
    // Warm Crimson
    {
      gradient: 'bg-red-600/85',
      borderGlow: 'border-red-400/70',
      shadowColor: 'shadow-red-600/50',
      textAccent: 'text-red-100',
      buttonStyle: 'from-red-500 to-red-700 hover:from-red-400 hover:to-red-600',
      particles: ['🌹', '❤️', '🎈']
    },
    // Midnight Blue
    {
      gradient: 'bg-slate-700/85',
      borderGlow: 'border-slate-500/70',
      shadowColor: 'shadow-slate-700/50',
      textAccent: 'text-slate-100',
      buttonStyle: 'from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700',
      particles: ['🌃', '🦇', '🌙']
    },
    // Warm Peach
    {
      gradient: 'bg-rose-600/85',
      borderGlow: 'border-rose-400/70',
      shadowColor: 'shadow-rose-600/50',
      textAccent: 'text-rose-100',
      buttonStyle: 'from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600',
      particles: ['🍑', '🌸', '🦩']
    },
    // Coffee Brown
    {
      gradient: 'bg-stone-700/85',
      borderGlow: 'border-stone-500/70',
      shadowColor: 'shadow-stone-700/50',
      textAccent: 'text-stone-100',
      buttonStyle: 'from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700',
      particles: ['☕', '🪨', '🏜️']
    },
    // Azure Blue
    {
      gradient: 'bg-cyan-600/85',
      borderGlow: 'border-cyan-400/70',
      shadowColor: 'shadow-cyan-600/50',
      textAccent: 'text-cyan-100',
      buttonStyle: 'from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600',
      particles: ['🌊', '🐬', '💎']
    },
    // Golden Hour
    {
      gradient: 'bg-amber-700/85',
      borderGlow: 'border-amber-500/70',
      shadowColor: 'shadow-amber-700/50',
      textAccent: 'text-amber-100',
      buttonStyle: 'from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700',
      particles: ['🌅', '✨', '🏆']
    },
    // Forest Canopy
    {
      gradient: 'bg-green-800/85',
      borderGlow: 'border-green-600/70',
      shadowColor: 'shadow-green-800/50',
      textAccent: 'text-green-100',
      buttonStyle: 'from-green-700 to-green-900 hover:from-green-600 hover:to-green-800',
      particles: ['🌳', '🦋', '🍃']
    }
  ];

  // Simple hash function to consistently assign colors based on lesson ID or title
  const getColorHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // Get icon based on lesson content
  const getThematicIcon = (lesson) => {
    const title = lesson.title?.toLowerCase() || '';
    const description = lesson.description?.toLowerCase() || '';
    const concept = lesson.coreConcept?.toLowerCase() || '';
    const content = `${title} ${description} ${concept}`;

    if (content.includes('welcome') || content.includes('introduction') || content.includes('start')) return '🚀';
    if (content.includes('history') || content.includes('foundation') || content.includes('got here')) return '📚';
    if (content.includes('think') || content.includes('data') || content.includes('decision')) return '🧠';
    if (content.includes('vocabulary') || content.includes('bootcamp') || content.includes('essential')) return '📖';
    if (content.includes('prompt') || content.includes('engineering') || content.includes('action')) return '⚙️';
    if (content.includes('creative') || content.includes('art') || content.includes('video')) return '🎨';
    if (content.includes('workflow') || content.includes('fundamental') || content.includes('business')) return '🔧';
    return '🤖';
  };

  // Get unique color palette for each lesson
  const getThematicBackground = (lesson) => {
    const lessonId = lesson.id || lesson.title || 'default';
    const hash = getColorHash(lessonId);
    const paletteIndex = hash % colorPalettes.length;
    const palette = colorPalettes[paletteIndex];
    
    return {
      ...palette,
      icon: getThematicIcon(lesson)
    };
  };

  const difficultyStyle = getDifficultyColor(selectedDifficulty);
  const hasImage = lesson.imageUrl && lesson.imageUrl !== '/path/to/default/image.jpg';
  const thematicBg = getThematicBackground(lesson);

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Edit Button - Shows on hover for admin users */}
      {isAdmin && showEditButton && (
        <button
          onClick={handleEditLesson}
          className={`absolute top-2 right-2 z-10 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
          title="Edit this lesson"
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>
      )}

      {/* Main Card */}
      <div
        className={`
          h-[480px] w-full
          bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95
          backdrop-blur-xl border-2 ${thematicBg.borderGlow}
          rounded-2xl cursor-pointer overflow-hidden
          transform transition-all duration-300 ease-out
          hover:scale-[1.02] hover:-translate-y-1
          hover:border-opacity-60 hover:shadow-xl ${thematicBg.shadowColor}
          ${isHovered ? 'ring-2 ring-white/20' : ''}
        `}
      >
        {/* Vibrant Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${thematicBg.gradient} opacity-80`} />
        
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {thematicBg.particles.map((particle, index) => (
            <div
              key={index}
              className={`absolute text-2xl opacity-20 transition-all duration-1000 ${
                isHovered ? 'opacity-40 scale-110' : 'opacity-20'
              }`}
              style={{
                left: `${15 + (index * 20)}%`,
                top: `${10 + (index * 20)}%`,
                animation: `float ${3 + index}s ease-in-out infinite`,
                animationDelay: `${index * 0.5}s`
              }}
            >
              {particle}
            </div>
          ))}
        </div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col p-6 z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            {/* Icon */}
            <div className="text-5xl opacity-90 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 drop-shadow-lg">
              {thematicBg.icon}
            </div>
            
            {/* Top badges */}
            <div className="flex flex-col items-end space-y-2">
              {/* Difficulty Badge */}
              <span className={`
                px-3 py-1 rounded-full text-xs font-bold
                ${difficultyStyle.bg} ${difficultyStyle.border} ${difficultyStyle.text}
                border-2 backdrop-blur-sm shadow-lg
                transform transition-all duration-300 group-hover:scale-105
              `}>
                {selectedDifficulty || lesson.difficulty || 'Beginner'}
              </span>
              
              {/* Interactive Badge */}
              {lesson.hasCodeSandbox && (
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-cyan-500/30 border-2 border-cyan-300/40 text-cyan-100 text-xs font-bold backdrop-blur-sm shadow-lg">
                  <span>⚡</span>
                  <span>Interactive</span>
                </div>
              )}
            </div>
          </div>

          {/* Module Tag */}
          {lesson.moduleTitle && (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-white/15 backdrop-blur-sm border border-white/30 ${thematicBg.textAccent} self-start shadow-sm`}>
              {lesson.moduleTitle}
            </span>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 leading-tight drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
            {lesson.title}
          </h3>

          {/* Description */}
          <div className="flex-1 mb-4">
            <p className="text-gray-200 text-sm leading-relaxed line-clamp-3 drop-shadow-sm">
              {lesson.description || lesson.coreConcept || 'Discover the fundamentals of AI and unlock new possibilities in your learning journey.'}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-auto">
            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-300 mb-4 bg-black/20 rounded-lg p-2 backdrop-blur-sm">
              <span className="flex items-center gap-1 font-medium">
                <span className="text-yellow-400">⏱️</span>
                {lesson.duration || '15'} min
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-yellow-400">⭐</span>
                +{lesson.xpReward || 150} XP
              </span>
            </div>

            {/* Start Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className={`
                w-full py-3 px-4 rounded-xl font-bold text-sm text-white
                bg-gradient-to-r ${thematicBg.buttonStyle}
                transition-all duration-300 shadow-lg
                transform group-hover:scale-105 hover:shadow-xl
                border border-white/20
              `}
            >
              Start Learning →
            </button>
          </div>
        </div>
      </div>

      {/* Float animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-6px) rotate(2deg); }
          66% { transform: translateY(-3px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
};

export default LessonCard;
