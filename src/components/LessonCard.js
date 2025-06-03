import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LessonCard = ({ lesson, onClick, className = "", showDifficultySelector = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  // If showDifficultySelector is true, default to 'Beginner'. 
  // Otherwise, use the lesson's inherent difficulty (or 'Beginner' as a fallback).
  const initialDifficulty = showDifficultySelector ? 'Beginner' : (lesson.difficulty || 'Beginner');
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
  
  const [showDifficultyOptions, setShowDifficultyOptions] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  // Check if lesson requires premium access
  const isPremiumLesson = lesson.difficulty === 'Intermediate' || lesson.difficulty === 'Advanced';
  
  // Activate paywall: Check user's subscription tier from AuthContext
  // const hasAccess = user?.subscriptionTier === 'premium' || !isPremiumLesson; // Old logic

  const handleClick = () => {
    // What difficulty is the user attempting to start?
    const attemptingPremiumDifficulty = selectedDifficulty === 'Intermediate' || selectedDifficulty === 'Advanced';
    // Does the user have a premium subscription?
    const userIsActuallyPremium = user?.subscriptionTier === 'premium';

    // If the user is trying to access premium-tier difficulty (Inter/Adv) 
    // AND they are NOT actually premium:
    if (attemptingPremiumDifficulty && !userIsActuallyPremium) {
      setShowPaywallModal(true); // Show the modal
      return; // And stop further action
    }

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

  // Generate unique thematic background based on lesson content
  const getThematicBackground = (lesson) => {
    const title = lesson.title?.toLowerCase() || '';
    const description = lesson.description?.toLowerCase() || '';
    const concept = lesson.coreConcept?.toLowerCase() || '';
    const content = `${title} ${description} ${concept}`;

    // AI Revolution / Welcome themes
    if (content.includes('revolution') || content.includes('welcome') || title.includes('ai revolution')) {
      return {
        gradient: 'from-blue-600/30 via-purple-600/20 to-cyan-500/30',
        pattern: 'radial-gradient(circle at 20% 80%, rgba(120, 113, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
        accent: 'from-blue-400 to-purple-500',
        icon: '🚀',
        particles: ['💫', '⭐', '✨']
      };
    }
    
    // AI Thinking / How AI Works themes
    if (content.includes('think') || content.includes('data') || content.includes('decision') || title.includes('how ai')) {
      return {
        gradient: 'from-emerald-600/30 via-teal-600/20 to-cyan-500/30',
        pattern: 'radial-gradient(circle at 30% 40%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
        accent: 'from-emerald-400 to-cyan-500',
        icon: '🧠',
        particles: ['⚡', '🔄', '📊']
      };
    }
    
    // Vocabulary / Learning themes
    if (content.includes('vocabulary') || content.includes('bootcamp') || content.includes('learn') || title.includes('vocabulary')) {
      return {
        gradient: 'from-orange-600/30 via-amber-600/20 to-yellow-500/30',
        pattern: 'radial-gradient(circle at 25% 25%, rgba(251, 146, 60, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)',
        accent: 'from-orange-400 to-yellow-500',
        icon: '📚',
        particles: ['📖', '💡', '🎓']
      };
    }
    
    // Prompting / Engineering themes
    if (content.includes('prompt') || content.includes('engineering') || content.includes('essential') || title.includes('prompting')) {
      return {
        gradient: 'from-violet-600/30 via-purple-600/20 to-fuchsia-500/30',
        pattern: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 90%, rgba(217, 70, 239, 0.3) 0%, transparent 50%)',
        accent: 'from-violet-400 to-fuchsia-500',
        icon: '⚙️',
        particles: ['🔧', '⚡', '💎']
      };
    }
    
    // Creative / Art themes
    if (content.includes('creative') || content.includes('art') || content.includes('image') || content.includes('video')) {
      return {
        gradient: 'from-pink-600/30 via-rose-600/20 to-red-500/30',
        pattern: 'radial-gradient(circle at 40% 60%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)',
        accent: 'from-pink-400 to-red-500',
        icon: '🎨',
        particles: ['🌈', '✨', '🎭']
      };
    }
    
    // Business / Workflow themes
    if (content.includes('business') || content.includes('workflow') || content.includes('automat') || content.includes('professional')) {
      return {
        gradient: 'from-slate-600/30 via-gray-600/20 to-zinc-500/30',
        pattern: 'radial-gradient(circle at 60% 30%, rgba(71, 85, 105, 0.3) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(82, 82, 91, 0.3) 0%, transparent 50%)',
        accent: 'from-slate-400 to-zinc-500',
        icon: '💼',
        particles: ['📈', '⚡', '🎯']
      };
    }
    
    // Voice / Audio themes
    if (content.includes('voice') || content.includes('audio') || content.includes('sound') || content.includes('speech')) {
      return {
        gradient: 'from-indigo-600/30 via-blue-600/20 to-sky-500/30',
        pattern: 'radial-gradient(circle at 45% 45%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 25%, rgba(14, 165, 233, 0.3) 0%, transparent 50%)',
        accent: 'from-indigo-400 to-sky-500',
        icon: '🎤',
        particles: ['🔊', '🎵', '🎧']
      };
    }
    
    // Analysis / Data themes
    if (content.includes('analys') || content.includes('data') || content.includes('research') || content.includes('insight')) {
      return {
        gradient: 'from-teal-600/30 via-cyan-600/20 to-blue-500/30',
        pattern: 'radial-gradient(circle at 35% 65%, rgba(13, 148, 136, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 35%, rgba(34, 211, 238, 0.3) 0%, transparent 50%)',
        accent: 'from-teal-400 to-blue-500',
        icon: '📊',
        particles: ['📈', '🔍', '💹']
      };
    }
    
    // Default theme for other lessons
    return {
      gradient: 'from-indigo-600/25 via-purple-600/15 to-pink-600/25',
      pattern: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 50%), radial-gradient(circle at 25% 75%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
      accent: 'from-indigo-400 to-purple-500',
      icon: '🤖',
      particles: ['⚡', '💫', '🔮']
    };
  };

  const difficultyStyle = getDifficultyColor(selectedDifficulty);
  const hasImage = lesson.imageUrl && lesson.imageUrl !== '/path/to/default/image.jpg';
  const thematicBg = getThematicBackground(lesson);

  return (
    <div className={`group relative ${className} rounded-2xl`}>
      {/* Main Card Clickable Area: also has rounded corners, NO overflow-hidden */}
      <div
        className={`
          h-[420px] md:h-[440px] lg:h-[460px]
          bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90
          backdrop-blur-xl border border-white/20
          rounded-2xl cursor-pointer 
          transform transition-all duration-500 ease-out
          hover:scale-[1.03] hover:-translate-y-1
          hover:shadow-2xl hover:shadow-${thematicBg.accent.split(' ')[1]}/20
          hover:border-white/30
          ${isHovered ? `ring-2 ring-${thematicBg.accent.split(' ')[1]}/50` : ''}
        `}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thematic Background: MUST have rounded-2xl AND overflow-hidden to clip background to card shape */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {hasImage ? (
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/30" />
            </div>
          ) : (
            <div className="absolute inset-0">
              {/* Dynamic thematic gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${thematicBg.gradient}`} />
              
              {/* Dynamic pattern overlay */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{ background: thematicBg.pattern }}
              />
              
              {/* Animated particles */}
              <div className="absolute inset-0 overflow-hidden">
                {thematicBg.particles.map((particle, index) => (
                  <div
                    key={index}
                    className={`
                      absolute text-2xl opacity-20
                      transition-all duration-1000
                      ${isHovered ? 'opacity-40 scale-110' : 'opacity-20'}
                    `}
                    style={{
                      left: `${15 + (index * 25)}%`,
                      top: `${10 + (index * 15)}%`,
                      animationDelay: `${index * 0.5}s`,
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    {particle}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Container - This is already relative, which is good for dropdown positioning */}
        <div className="relative h-full flex flex-col p-5 md:p-6 z-10">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-3">
            {/* Theme Icon */}
            <div className="flex flex-col items-start space-y-2">
              <div className="text-3xl md:text-4xl opacity-80">
                {thematicBg.icon}
              </div>
              
              {/* Difficulty Badge */}
              <span className={`
                inline-block px-3 py-1 rounded-full text-xs font-semibold
                ${difficultyStyle.bg} ${difficultyStyle.border} ${difficultyStyle.text}
                border backdrop-blur-sm shadow-lg ${difficultyStyle.shadow}
                transition-all duration-300
                ${isHovered ? 'scale-105 shadow-xl' : ''}
              `}>
                {selectedDifficulty}
              </span>
            </div>

            {/* Badges Container */}
            <div className="flex flex-col items-end space-y-2">
              {/* Premium Badge */}
              {isPremiumLesson && (
                <div className="
                  flex items-center space-x-1 px-2.5 py-1 rounded-full
                  bg-gradient-to-r from-yellow-500/30 to-amber-500/30 
                  border border-yellow-400/40
                  text-yellow-200 text-xs font-medium
                  backdrop-blur-sm shadow-lg shadow-yellow-500/20
                ">
                  <span>👑</span>
                  <span>Premium</span>
                </div>
              )}

              {/* Interactive Badge */}
              {lesson.hasCodeSandbox && (
                <div className="
                  flex items-center space-x-1 px-2.5 py-1 rounded-full
                  bg-cyan-500/30 border border-cyan-400/40
                  text-cyan-200 text-xs font-medium
                  backdrop-blur-sm shadow-lg shadow-cyan-500/20
                ">
                  <span>⚡</span>
                  <span>Interactive</span>
                </div>
              )}
            </div>
          </div>

          {/* Module Tag */}
          {lesson.moduleTitle && (
            <span className="
              inline-block px-3 py-1 rounded-full text-xs font-medium mb-3
              bg-white/10 backdrop-blur-sm border border-white/20
              text-white/70 hover:text-white transition-colors duration-300
              self-start
            ">
              {lesson.moduleTitle}
            </span>
          )}

          {/* Title */}
          <h3 className={`
            text-lg md:text-xl font-bold text-white mb-3
            leading-tight line-clamp-2
            transition-all duration-300
            ${isHovered ? `bg-gradient-to-r ${thematicBg.accent} bg-clip-text text-transparent` : ''}
          `}>
            {lesson.title}
          </h3>

          {/* Description - Fixed height to prevent buttons from floating */}
          <p className="
            text-slate-300 text-sm leading-relaxed
            mb-4 h-20 overflow-hidden
            transition-colors duration-300
            hover:text-slate-200
          ">
            {lesson.description || lesson.coreConcept || 'Discover the fundamentals of AI and how it can transform your understanding of technology.'}
          </p>

          {/* Spacer to push meta and button to bottom */}
          <div className="flex-1"></div>

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 text-xs text-slate-400">
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
          </div>

          {/* Action Button */}
          <div className="space-y-3">
            {/* Difficulty Selector (if enabled) */}
            {showDifficultySelector && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDifficultyOptions(!showDifficultyOptions);
                  }}
                  className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300 flex items-center justify-between"
                >
                  <span>Difficulty: {selectedDifficulty}</span>
                  <span className={`transition-transform duration-300 ${showDifficultyOptions ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </button>
                
                {/* Difficulty Options Dropdown */}
                {showDifficultyOptions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800/95 backdrop-blur-xl rounded-lg border border-white/20 overflow-hidden z-50 shadow-xl">
                    {['Beginner', 'Intermediate', 'Advanced'].map((difficultyLevel) => {
                      const isPremiumDifficulty = difficultyLevel === 'Intermediate' || difficultyLevel === 'Advanced';
                      return (
                        <button
                          key={difficultyLevel}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDifficultyChange(difficultyLevel);
                          }}
                          className={`w-full text-left px-3 py-2 text-white transition-colors duration-200 capitalize flex items-center justify-between ${
                            selectedDifficulty === difficultyLevel 
                              ? 'bg-indigo-500/30 text-indigo-200' 
                              : 'hover:bg-white/10'
                          }`}
                        >
                          <span>{difficultyLevel}</span>
                          {isPremiumDifficulty && <span className="text-xs text-yellow-400">👑</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className={`
                w-full py-2 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm
                bg-gradient-to-r ${thematicBg.accent}
                hover:shadow-lg hover:shadow-${thematicBg.accent.split(' ')[1]}/30
                text-white shadow-md
                border border-white/20
                backdrop-blur-sm
                transition-all duration-300 ease-out
                transform hover:scale-[1.02] active:scale-[0.98]
                ${isHovered ? 'ring-1 ring-white/30' : ''}
              `}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{showDifficultySelector ? `Start as ${selectedDifficulty}` : 'Start Learning'}</span>
                <span className={`
                  transition-transform duration-300
                  ${isHovered ? 'translate-x-1' : ''}
                `}>
                  →
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className={`
          absolute inset-0 pointer-events-none rounded-2xl
          bg-gradient-to-r ${thematicBg.accent} opacity-0
          transition-opacity duration-500
          ${isHovered ? 'opacity-10' : 'opacity-0'}
        `} />
      </div>

      {/* Paywall Modal */}
      {showPaywallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="text-center">
              {/* Premium Icon */}
              <div className="text-6xl mb-4">👑</div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4">
                Premium Content
              </h3>
              
              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                This {selectedDifficulty.toLowerCase()} lesson is part of our premium content. 
                Upgrade to access advanced AI lessons and unlock your full learning potential.
              </p>
              
              {/* Features List */}
              <div className="text-left mb-6 space-y-2">
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  <span>Access to all intermediate & advanced lessons</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  <span>Interactive coding sandboxes</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  <span>AI-powered feedback and guidance</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  <span>Priority support</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleUpgradeClick}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Upgrade to Premium
                </button>
                <button
                  onClick={() => setShowPaywallModal(false)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 border border-white/20"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonCard;
