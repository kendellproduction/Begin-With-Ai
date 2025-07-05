import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LessonCard = ({ lesson, onClick, className = "", showDifficultySelector = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  // If showDifficultySelector is true, default to 'free'. 
  // Otherwise, use the lesson's inherent difficulty (or 'free' as a fallback).
  const initialDifficulty = showDifficultySelector ? 'free' : (lesson.difficulty || 'free');
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
  
  const [showDifficultyOptions, setShowDifficultyOptions] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  // TEMPORARILY DISABLED: Check if lesson requires premium access
  // const isPremiumLesson = lesson.difficulty === 'Intermediate' || lesson.difficulty === 'Advanced';
  const isPremiumLesson = false; // Always false for testing
  
  // Activate paywall: Check user's subscription tier from AuthContext
  // const hasAccess = user?.subscriptionTier === 'premium' || !isPremiumLesson; // Old logic

  const handleClick = () => {
    // TEMPORARILY DISABLED: Premium paywall for testing
    // What difficulty is the user attempting to start?
    // const attemptingPremiumDifficulty = selectedDifficulty === 'Intermediate' || selectedDifficulty === 'Advanced';
    // Does the user have a premium subscription?
    // const userIsActuallyPremium = user?.subscriptionTier === 'premium';

    // TEMPORARILY DISABLED: Premium access check
    // If the user is trying to access premium-tier difficulty (Inter/Adv) 
    // AND they are NOT actually premium:
    // if (attemptingPremiumDifficulty && !userIsActuallyPremium) {
    //   setShowPaywallModal(true); // Show the modal
    //   return; // And stop further action
    // }

    // If we've reached this point, it means either:
    // 1. The user selected 'Beginner' (attemptingPremiumDifficulty is false). Access is allowed.
    // OR
    // 2. The user IS premium (userIsActuallyPremium is true). Access is allowed for any selected difficulty.
    
    // Proceed to call the onClick handler (likely navigates to the lesson)
    if (onClick) {
      onClick(selectedDifficulty); // Pass the difficulty level the user selected/attempted
    } else {
      // Fallback navigation if no onClick prop is given (e.g. card used standalone)
      // Ensure difficulty is passed in navigation state
      navigate(`/lessons/${lesson.id}`, { state: { difficulty: selectedDifficulty } });
    }
  };

  const handleUpgradeClick = () => {
    setShowPaywallModal(false);
    // Navigate to pricing/subscription page
    navigate('/pricing');
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyOptions(false);
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

  // 24 vibrant, energetic color palettes that are full of life!
  const colorPalettes = [
    // Electric Ocean
    {
      gradient: 'from-blue-400/70 via-cyan-500/60 to-teal-500/70',
      borderGlow: 'border-cyan-300/60',
      shadowColor: 'shadow-cyan-500/40',
      textAccent: 'text-cyan-100',
      buttonStyle: 'from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500',
      particles: ['✨', '💫', '🌟']
    },
    // Vibrant Forest
    {
      gradient: 'from-green-400/70 via-emerald-500/60 to-lime-500/70',
      borderGlow: 'border-green-300/60',
      shadowColor: 'shadow-emerald-500/40',
      textAccent: 'text-green-100',
      buttonStyle: 'from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500',
      particles: ['🌿', '🍃', '🌱']
    },
    // Neon Sunset
    {
      gradient: 'from-orange-400/70 via-red-500/60 to-pink-500/70',
      borderGlow: 'border-orange-300/60',
      shadowColor: 'shadow-red-500/40',
      textAccent: 'text-orange-100',
      buttonStyle: 'from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500',
      particles: ['🔥', '☀️', '🌅']
    },
    // Electric Mint
    {
      gradient: 'from-emerald-300/70 via-cyan-400/60 to-blue-500/70',
      borderGlow: 'border-emerald-300/60',
      shadowColor: 'shadow-emerald-400/40',
      textAccent: 'text-emerald-100',
      buttonStyle: 'from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400',
      particles: ['🔷', '💎', '✨']
    },
    // Cosmic Purple
    {
      gradient: 'from-purple-400/70 via-violet-500/60 to-indigo-600/70',
      borderGlow: 'border-purple-300/60',
      shadowColor: 'shadow-purple-500/40',
      textAccent: 'text-purple-100',
      buttonStyle: 'from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500',
      particles: ['🌟', '🔮', '💜']
    },
    // Tropical Paradise
    {
      gradient: 'from-cyan-300/70 via-teal-400/60 to-emerald-500/70',
      borderGlow: 'border-cyan-300/60',
      shadowColor: 'shadow-teal-400/40',
      textAccent: 'text-cyan-100',
      buttonStyle: 'from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400',
      particles: ['🐚', '🌊', '💫']
    },
    // Sunshine Sky
    {
      gradient: 'from-yellow-300/70 via-blue-400/60 to-indigo-500/70',
      borderGlow: 'border-yellow-300/60',
      shadowColor: 'shadow-blue-400/40',
      textAccent: 'text-yellow-100',
      buttonStyle: 'from-yellow-400 to-blue-500 hover:from-yellow-300 hover:to-blue-400',
      particles: ['☁️', '🌤️', '⭐']
    },
    // Electric Lime
    {
      gradient: 'from-lime-300/70 via-green-400/60 to-emerald-500/70',
      borderGlow: 'border-lime-300/60',
      shadowColor: 'shadow-lime-400/40',
      textAccent: 'text-lime-100',
      buttonStyle: 'from-lime-400 to-green-500 hover:from-lime-300 hover:to-green-400',
      particles: ['🌿', '🍀', '🌱']
    },
    // Galaxy Dream
    {
      gradient: 'from-indigo-500/70 via-purple-600/60 to-pink-600/70',
      borderGlow: 'border-indigo-400/60',
      shadowColor: 'shadow-indigo-600/40',
      textAccent: 'text-indigo-100',
      buttonStyle: 'from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600',
      particles: ['🌙', '⭐', '🌟']
    },
    // Ocean Breeze
    {
      gradient: 'from-teal-300/70 via-cyan-400/60 to-blue-400/70',
      borderGlow: 'border-teal-300/60',
      shadowColor: 'shadow-teal-400/40',
      textAccent: 'text-teal-100',
      buttonStyle: 'from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400',
      particles: ['🌊', '🐠', '💧']
    },
    // Rose Gold Magic
    {
      gradient: 'from-rose-300/70 via-pink-400/60 to-red-500/70',
      borderGlow: 'border-rose-300/60',
      shadowColor: 'shadow-rose-400/40',
      textAccent: 'text-rose-100',
      buttonStyle: 'from-rose-400 to-pink-500 hover:from-rose-300 hover:to-pink-400',
      particles: ['🌹', '💖', '💎']
    },
    // Emerald Energy
    {
      gradient: 'from-emerald-400/70 via-green-500/60 to-teal-600/70',
      borderGlow: 'border-emerald-300/60',
      shadowColor: 'shadow-emerald-500/40',
      textAccent: 'text-emerald-100',
      buttonStyle: 'from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500',
      particles: ['💚', '🔮', '✨']
    },
    // Electric Blue
    {
      gradient: 'from-blue-500/70 via-cyan-600/60 to-sky-700/70',
      borderGlow: 'border-blue-400/60',
      shadowColor: 'shadow-blue-500/40',
      textAccent: 'text-blue-100',
      buttonStyle: 'from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500',
      particles: ['🔵', '💙', '⚡']
    },
    // Solar Flare
    {
      gradient: 'from-amber-400/70 via-orange-500/60 to-red-600/70',
      borderGlow: 'border-amber-300/60',
      shadowColor: 'shadow-amber-500/40',
      textAccent: 'text-amber-100',
      buttonStyle: 'from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500',
      particles: ['🔥', '☄️', '💥']
    },
    // Jungle Vibe
    {
      gradient: 'from-green-500/70 via-emerald-600/60 to-teal-700/70',
      borderGlow: 'border-green-400/60',
      shadowColor: 'shadow-green-500/40',
      textAccent: 'text-green-100',
      buttonStyle: 'from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500',
      particles: ['🌲', '🍃', '🌿']
    },
    // Crystal Clear
    {
      gradient: 'from-cyan-400/70 via-blue-500/60 to-sky-600/70',
      borderGlow: 'border-cyan-300/60',
      shadowColor: 'shadow-cyan-500/40',
      textAccent: 'text-cyan-100',
      buttonStyle: 'from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500',
      particles: ['🌀', '💫', '🌊']
    },
    // Neon Jungle
    {
      gradient: 'from-teal-400/70 via-green-500/60 to-emerald-600/70',
      borderGlow: 'border-teal-300/60',
      shadowColor: 'shadow-teal-500/40',
      textAccent: 'text-teal-100',
      buttonStyle: 'from-teal-500 to-green-600 hover:from-teal-400 hover:to-green-500',
      particles: ['🍀', '🌱', '💚']
    },
    // Midnight Storm
    {
      gradient: 'from-slate-400/70 via-blue-600/60 to-indigo-800/70',
      borderGlow: 'border-slate-400/60',
      shadowColor: 'shadow-blue-600/40',
      textAccent: 'text-slate-100',
      buttonStyle: 'from-slate-600 to-blue-700 hover:from-slate-500 hover:to-blue-600',
      particles: ['🛡️', '⚔️', '🏰']
    },
    // Aqua Dream
    {
      gradient: 'from-cyan-300/70 via-teal-400/60 to-blue-500/70',
      borderGlow: 'border-cyan-300/60',
      shadowColor: 'shadow-cyan-400/40',
      textAccent: 'text-cyan-100',
      buttonStyle: 'from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400',
      particles: ['🐚', '🌊', '💎']
    },
    // Forest Fire
    {
      gradient: 'from-green-600/70 via-orange-700/60 to-red-800/70',
      borderGlow: 'border-green-400/60',
      shadowColor: 'shadow-orange-600/40',
      textAccent: 'text-green-100',
      buttonStyle: 'from-green-600 to-orange-700 hover:from-green-500 hover:to-orange-600',
      particles: ['🌲', '🔥', '🌿']
    },
    // Royal Blue
    {
      gradient: 'from-blue-500/70 via-indigo-600/60 to-purple-700/70',
      borderGlow: 'border-blue-400/60',
      shadowColor: 'shadow-blue-500/40',
      textAccent: 'text-blue-100',
      buttonStyle: 'from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500',
      particles: ['💎', '👑', '✨']
    },
    // Electric Paradise
    {
      gradient: 'from-teal-300/70 via-cyan-400/60 to-emerald-500/70',
      borderGlow: 'border-teal-300/60',
      shadowColor: 'shadow-teal-400/40',
      textAccent: 'text-teal-100',
      buttonStyle: 'from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400',
      particles: ['🌊', '🐟', '💧']
    },
    // Lightning Storm
    {
      gradient: 'from-yellow-500/70 via-blue-600/60 to-purple-700/70',
      borderGlow: 'border-yellow-400/60',
      shadowColor: 'shadow-blue-500/40',
      textAccent: 'text-yellow-100',
      buttonStyle: 'from-yellow-500 to-blue-600 hover:from-yellow-400 hover:to-blue-500',
      particles: ['⚡', '🌩️', '☁️']
    },
    // Emerald Kingdom
    {
      gradient: 'from-emerald-400/70 via-green-500/60 to-cyan-600/70',
      borderGlow: 'border-emerald-300/60',
      shadowColor: 'shadow-emerald-500/40',
      textAccent: 'text-emerald-100',
      buttonStyle: 'from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500',
      particles: ['💚', '🏰', '✨']
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
    <div className={`group relative ${className}`}>
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
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
                handleClick();
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
