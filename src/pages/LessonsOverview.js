import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import LessonCard from '../components/LessonCard';
import LearningPathVisual from '../components/LearningPathVisual';
import DifficultySelectionModal from '../components/DifficultySelectionModal';
import { AdaptiveLessonService } from '../services/adaptiveLessonService';
import { getAllLearningPaths } from '../services/adminService'; // Add this import
import { isLearningPathActive, getCurrentLessonProgress, getLearningPath } from '../utils/learningPathUtils';
import { motion, AnimatePresence } from 'framer-motion';
import logger from '../utils/logger';
import OptimizedStarField from '../components/OptimizedStarField';

const LessonsOverview = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [userLearningPath, setUserLearningPath] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const [adaptiveLessons, setAdaptiveLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalLessons, setTotalLessons] = useState(0);
  
  // Dynamic motivational quotes
  const motivationalQuotes = [
    { quote: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { quote: "The future belongs to those who learn more skills and combine them in creative ways.", author: "Robert Greene" },
    { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
    { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
    { quote: "Intelligence is not a privilege, it's a gift. And you use it for the good of mankind.", author: "Dr. Octopus" },
    { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
    { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { quote: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
    { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { quote: "Your limitation—it's only your imagination.", author: "Unknown" }
  ];
  
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Recent searches (stored in localStorage)
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('recentLessonSearches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  // State for difficulty selection modal
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Helper function for targeted fuzzy text matching (only meaningful content)
  const fuzzyMatch = useCallback((text, query) => {
    if (!text || !query || typeof text !== 'string' || typeof query !== 'string') return false;
    const textLower = text.toLowerCase().trim();
    const queryLower = query.toLowerCase().trim();
    
    // Exact substring match for titles, concepts, and tags
    if (textLower.includes(queryLower)) return true;
    
    // Word boundary matches only for multi-word queries
    if (queryLower.includes(' ')) {
      const words = queryLower.split(/\s+/).filter(word => word.length > 2); // Ignore short words
      return words.length > 0 && words.every(word => textLower.includes(word));
    }
    
    // For single words, require minimum length to avoid random matches
    return queryLower.length >= 3 && textLower.includes(queryLower);
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, []);

  useEffect(() => {
    if (location.state?.resetFilters) {
      navigate(location.pathname, { replace: true });
    }
    
    // Enhanced quiz completion detection - same as HomePage
    initializeLearningData();
    loadAdaptiveLessons();
  }, [location.state, navigate, location.pathname]);

  const initializeLearningData = async () => {
    // Enhanced quiz completion detection - check both localStorage and Firebase
    try {
      let quizCompletedState = false;
      let quizResultsData = null;
      let learningPathData = null;
      
      // First check localStorage
      const localQuizCompleted = localStorage.getItem('quizCompleted');
      const localAiAssessmentResults = localStorage.getItem('aiAssessmentResults');
      const localActiveLearningPath = localStorage.getItem('activeLearningPath');
      
      if (localQuizCompleted || localAiAssessmentResults || localActiveLearningPath) {
        quizCompletedState = true;
        
        if (localQuizCompleted) {
          const completionState = JSON.parse(localQuizCompleted);
          quizResultsData = completionState.results;
        } else if (localAiAssessmentResults) {
          quizResultsData = JSON.parse(localAiAssessmentResults);
        }
        
        if (localActiveLearningPath) {
          learningPathData = JSON.parse(localActiveLearningPath);
        }
      }
      
      // If we have a user, also check/sync with Firebase
      if (user?.uid) {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../firebase');
          
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Check if quiz is completed in database
            if (userData.quizCompleted || userData.aiAssessmentResults || userData.activeLearningPath) {
              quizCompletedState = true;
              
              if (userData.aiAssessmentResults) {
                quizResultsData = userData.aiAssessmentResults;
              }
              
              if (userData.activeLearningPath) {
                learningPathData = userData.activeLearningPath;
              }
              
              // Sync to localStorage if not already there
              if (!localQuizCompleted && userData.quizCompleted) {
                localStorage.setItem('quizCompleted', JSON.stringify(userData.quizCompleted));
              }
              if (!localAiAssessmentResults && userData.aiAssessmentResults) {
                localStorage.setItem('aiAssessmentResults', JSON.stringify(userData.aiAssessmentResults));
              }
              if (!localActiveLearningPath && userData.activeLearningPath) {
                localStorage.setItem('activeLearningPath', JSON.stringify(userData.activeLearningPath));
              }
            }
          }
        } catch (error) {
          logger.error('Error syncing with Firebase in lessons page:', error);
        }
      }
      
      // Set the learning path data if found
      if (learningPathData) {
        setUserLearningPath(learningPathData);
        
        // Create progress object
        const progress = {
          nextLessonIndex: learningPathData.nextLessonIndex || 0,
          completedLessons: learningPathData.completedLessons?.length || 0, // Real data only
          totalLessons: learningPathData.totalLessons || 10,
          progressPercentage: Math.round(((learningPathData.completedLessons?.length || 0) / (learningPathData.totalLessons || 10)) * 100)
        };
        setLearningProgress(progress);
        
        logger.log('Lessons page - Learning path detected:', { learningPathData, progress });
      } else {
        logger.log('Lessons page - No learning path found');
      }
      
      logger.log('Lessons page - Quiz completion state:', { quizCompletedState, quizResultsData, learningPathData });
    } catch (error) {
      logger.error('Error loading learning data:', error);
      // Fallback to old method
      if (isLearningPathActive()) {
        const pathData = getLearningPath();
        const progress = getCurrentLessonProgress();
        setUserLearningPath(pathData);
        setLearningProgress(progress);
        logger.log('Lessons page - Using fallback method:', { pathData, progress });
      }
    }
  };

  const loadAdaptiveLessons = async () => {
    try {
      setIsLoading(true);
      
      // Get user's skill level from assessment
      const assessmentResults = localStorage.getItem('aiAssessmentResults');
      const skillLevel = assessmentResults ? JSON.parse(assessmentResults).skillLevel : 'intermediate';

      // Load ONLY lessons from the database - no static content
      const allLessons = [];

      try {
        // Get all learning paths from database (this includes lessons created in admin)
        const allLearningPaths = await getAllLearningPaths();
        
        logger.info('Loaded learning paths from database:', allLearningPaths.length);
        
        // Extract all lessons from all paths and modules
        allLearningPaths.forEach((path, pathIndex) => {
          if (path.modules && Array.isArray(path.modules)) {
            path.modules.forEach((module, moduleIndex) => {
              if (module.lessons && Array.isArray(module.lessons)) {
                const pathLessons = module.lessons
                  .filter(lesson => {
                    // FIXED: Only show published lessons on the public lessons page
                    return lesson.status === 'published' || lesson.published === true || lesson.isPublished === true;
                  })
                  .map((lesson, lessonIndex) => ({
                    ...lesson,
                    moduleTitle: module.title,
                    pathTitle: path.title,
                    pathId: path.id,
                    moduleId: module.id,
                    pathIcon: path.icon || '📚',
                    isPremium: path.isPremium || lesson.isPremium || false,
                    globalIndex: pathIndex * 1000 + moduleIndex * 100 + lessonIndex,
                    moduleIndex,
                    lessonIndex,
                    category: path.category || lesson.category || 'General',
                    tags: lesson.tags || [path.category?.toLowerCase(), 'lesson'],
                    // Ensure proper lesson data
                    duration: lesson.estimatedTimeMinutes ? `${lesson.estimatedTimeMinutes} min` : (lesson.duration || '15 min'),
                    xpReward: lesson.xpAward || 100,
                    difficulty: lesson.difficulty || 'beginner'
                  }));
                allLessons.push(...pathLessons);
              }
            });
          }
        });
        
        logger.info(`Successfully loaded ${allLessons.length - 1} published lessons from ${allLearningPaths.length} learning paths`);
        
      } catch (error) {
        logger.error('Error loading lessons from database:', error);
        // No fallback - only show database lessons
      }
      
      // Note: Deduplication is handled in the filteredLessons useMemo to ensure
      // only one result per unique lesson appears in search results
      setAdaptiveLessons(allLessons);
      setTotalLessons(allLessons.length);
      
    } catch (error) {
      logger.error('Error loading adaptive lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-prediction for search with enhanced error handling and deduplication
  useEffect(() => {
    if (searchQuery && searchQuery.length >= 1) {
      setIsSearching(true);
    }
    
    const timeoutId = setTimeout(() => {
      setIsSearching(false);
      try {
        if (searchQuery && searchQuery.length >= 2 && Array.isArray(adaptiveLessons)) {
        const suggestions = new Set();
        const searchLower = searchQuery.toLowerCase().trim();
        
        // Deduplicate lessons first to avoid suggesting duplicates
        const uniqueLessons = new Map();
        adaptiveLessons.forEach(lesson => {
          if (!lesson || typeof lesson !== 'object') return;
          
          const uniqueKey = lesson.id || `${lesson.title}-${lesson.moduleId || 'unknown'}`;
          if (!uniqueLessons.has(uniqueKey)) {
            uniqueLessons.set(uniqueKey, lesson);
          }
        });
        
        // Generate suggestions from unique lessons only
        uniqueLessons.forEach(lesson => {
          // Add title matches (highest priority)
          if (fuzzyMatch(lesson.title, searchQuery)) {
            suggestions.add(lesson.title);
          }
          
          // Add core concept matches (high priority for themes/use cases)
          if (fuzzyMatch(lesson.coreConcept, searchQuery)) {
            suggestions.add(lesson.coreConcept);
          }
          
          // Add module matches (medium priority)
          if (fuzzyMatch(lesson.moduleTitle, searchQuery)) {
            suggestions.add(lesson.moduleTitle);
          }
          
          // Add tag matches (relevant topics/themes)
          if (Array.isArray(lesson.tags)) {
            lesson.tags.forEach(tag => {
              if (fuzzyMatch(tag, searchQuery)) {
                suggestions.add(tag);
              }
            });
          }
        });
        
        setSearchSuggestions(Array.from(suggestions).slice(0, 6));
        setShowSuggestions(true);
      } else if (searchQuery === '' && recentSearches.length > 0) {
        // Show recent searches when input is focused but empty
        setSearchSuggestions(recentSearches.slice(0, 4));
        setShowSuggestions(true);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        }
      } catch (error) {
        logger.error('Error generating search suggestions:', error);
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, adaptiveLessons, fuzzyMatch, recentSearches]);

  // Optimized filter lessons with memoization, enhanced error handling, and deduplication
  const filteredLessons = useMemo(() => {
    try {
      if (!Array.isArray(adaptiveLessons)) {
        return [];
      }
      
      // First, filter lessons based on search criteria
      const matchingLessons = adaptiveLessons.filter(lesson => {
        // Ensure lesson has basic required properties
        if (!lesson || typeof lesson !== 'object' || !lesson.title || typeof lesson.title !== 'string') {
          return false;
        }

        // Only search in meaningful fields: title, core concept, tags, and module title
        // Exclude description to avoid random word matches
        const matchesSearch = searchQuery === '' || 
          fuzzyMatch(lesson.title, searchQuery) ||
          fuzzyMatch(lesson.coreConcept, searchQuery) ||
          fuzzyMatch(lesson.moduleTitle, searchQuery) ||
          (Array.isArray(lesson.tags) && lesson.tags.some(tag => fuzzyMatch(tag, searchQuery)));

        const matchesDifficulty = !selectedDifficulty || lesson.difficulty === selectedDifficulty;
        const matchesModule = !selectedModule || lesson.moduleTitle === selectedModule;

        return matchesSearch && matchesDifficulty && matchesModule;
      });

      // Deduplicate lessons - ensure only one result per unique lesson
      // Use lesson ID as primary key, fallback to title if ID not available
      const seenLessons = new Map();
      const uniqueLessons = [];

      matchingLessons.forEach(lesson => {
        // Create a unique key for this lesson (prefer ID, fallback to title + moduleId)
        const uniqueKey = lesson.id || `${lesson.title}-${lesson.moduleId || 'unknown'}`;
        
        if (!seenLessons.has(uniqueKey)) {
          seenLessons.set(uniqueKey, true);
          uniqueLessons.push(lesson);
        }
      });

      return uniqueLessons;
    } catch (error) {
      logger.error('Error filtering lessons:', error);
      return [];
    }
  }, [adaptiveLessons, searchQuery, selectedDifficulty, selectedModule, fuzzyMatch]);

  // Get unique modules for filter with memoization
  const availableModules = useMemo(() => {
    return [...new Set(adaptiveLessons.map(lesson => lesson.moduleTitle).filter(Boolean))];
  }, [adaptiveLessons]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    
    // Save to recent searches (avoid duplicates and limit to 10)
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== suggestion);
      const updated = [suggestion, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('recentLessonSearches', JSON.stringify(updated));
      } catch (error) {
        logger.warn('Failed to save recent search:', error);
      }
      return updated;
    });
  }, []);

  const handleLessonClick = useCallback((lesson, selectedDifficulty = null) => {
    // Check if user has premium subscription
    const isPremiumUser = user?.subscriptionTier === 'premium' || user?.isPremium === true;
    
    if (selectedDifficulty) {
      // Direct navigation with specific difficulty
      navigate(`/lessons/${lesson.id}`, { 
        state: { 
          pathId: 'prompt-engineering-mastery',
          moduleId: lesson.moduleId,
          difficulty: selectedDifficulty
        } 
      });
    } else if (isPremiumUser) {
      // Premium users go directly to premium content, no modal
      navigate(`/lessons/${lesson.id}`, { 
        state: { 
          pathId: 'prompt-engineering-mastery',
          moduleId: lesson.moduleId,
          difficulty: 'Premium'
        } 
      });
    } else {
      // Free users see difficulty selection modal
      setSelectedLesson(lesson);
      setShowDifficultyModal(true);
    }
  }, [navigate, user?.subscriptionTier, user?.isPremium]);

  const handleDifficultyConfirm = useCallback((difficulty) => {
    if (!selectedLesson) return;
    
    navigate(`/lessons/${selectedLesson.id}`, { 
      state: { 
        pathId: 'prompt-engineering-mastery',
        moduleId: selectedLesson.moduleId,
        difficulty: difficulty
      } 
    });
    
    setShowDifficultyModal(false);
    setSelectedLesson(null);
  }, [navigate, selectedLesson]);

  const handleCreateLearningPath = useCallback(() => {
    navigate('/learning-path/adaptive-quiz');
  }, [navigate]);

  const handleContinueLearning = useCallback(() => {
    if (userLearningPath && learningProgress) {
      // Find the next lesson to continue
      const nextLessonIndex = learningProgress.nextLessonIndex || 0;
      
      // If we have adaptive lessons loaded, find the next one
      if (adaptiveLessons.length > nextLessonIndex) {
        const nextLesson = adaptiveLessons[nextLessonIndex];
        navigate(`/lessons/${nextLesson.id}`, {
          state: {
            pathId: 'prompt-engineering-mastery',
            moduleId: nextLesson.moduleId,
            fromLearningPath: true
          }
        });
      } else {
        // Fallback to lessons continue route
        navigate('/lessons/continue');
      }
    } else {
      // No learning path, redirect to create one
      navigate('/learning-path/adaptive-quiz');
    }
  }, [navigate, userLearningPath, learningProgress, adaptiveLessons]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedDifficulty('');
    setSelectedModule('');
    setShowSuggestions(false);
  }, []);

  // Quick stats with memoization
  const stats = useMemo(() => ({
    totalLessons: adaptiveLessons.length,
    completedLessons: learningProgress?.completedLessons || 0,
    modules: availableModules.length,
    avgDuration: Math.round(
      adaptiveLessons.reduce((acc, lesson) => acc + (lesson.duration || 15), 0) / (adaptiveLessons.length || 1)
    )
  }), [adaptiveLessons.length, learningProgress?.completedLessons, availableModules.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white">
        <LoggedInNavbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300">Loading your AI learning experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen bg-black text-white overflow-hidden"
    >
      <LoggedInNavbar />

      {/* Optimized Star Field */}
      <OptimizedStarField starCount={100} opacity={0.8} speed={1} size={1.2} />
      
      {/* Main content wrapper */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4 leading-tight py-2">
              Lessons
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Master AI through adaptive lessons designed for your skill level
            </p>
          </div>

          {/* Progress Section (if user has active path) or CTA */}
          {userLearningPath && learningProgress ? (
            <div className="mb-8">
              <div className="bg-gradient-to-br from-yellow-500/10 via-amber-400/8 to-orange-500/10 backdrop-blur-sm rounded-2xl p-4 relative transition-all duration-500 border border-yellow-200/30" style={{
                boxShadow: '0 0 30px rgba(251, 191, 36, 0.3), 0 0 45px rgba(245, 158, 11, 0.2), 0 0 60px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(255, 215, 0, 0.15)'
              }}>
                
                {/* Motivational Quote */}
                <div className="relative z-10 text-center mb-4">
                  <p className="text-white text-lg font-medium italic drop-shadow-lg" style={{
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}>
                    "{currentQuote.quote}"
                  </p>
                  <p className="text-yellow-50 text-sm mt-1 drop-shadow-md" style={{
                    textShadow: '0 0 16px rgba(255, 255, 255, 0.6), 0 0 32px rgba(255, 215, 0, 0.4), 0 0 48px rgba(255, 215, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}>- {currentQuote.author}</p>
                </div>
                
                <LearningPathVisual 
                  learningProgress={learningProgress}
                  userLearningPath={userLearningPath}
                  compact={true}
                  showActions={false}
                  className="max-w-4xl mx-auto relative z-10"
                  onLessonClick={(lesson) => {
                    setSelectedLesson(lesson);
                    setShowDifficultyModal(true);
                  }}
                />
                
                {/* Continue Learning Button - Integrated */}
                <div className="text-center mt-3 relative z-10">
                  <button
                    onClick={handleContinueLearning}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                    style={{
                      boxShadow: '0 0 30px rgba(251, 191, 36, 0.8), 0 0 60px rgba(245, 158, 11, 0.6), 0 0 90px rgba(255, 215, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3) inset'
                    }}
                  >
                    🚀 Continue Learning Journey
                  </button>
                  <p className="mt-2 text-white text-xs drop-shadow-sm" style={{
                    textShadow: '0 0 14px rgba(255, 255, 255, 0.8), 0 0 28px rgba(255, 215, 0, 0.5), 0 0 42px rgba(255, 215, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}>
                    Pick up where you left off in your personalized path
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/30 text-center mb-12">
              <h2 className="text-3xl font-bold text-indigo-400 mb-4">🚀 Ready to Start Your AI Journey?</h2>
              <p className="text-xl text-indigo-200 mb-6">
                Take our quick assessment to get a personalized learning path
              </p>
              <button
                onClick={handleCreateLearningPath}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Start AI Assessment 🎯
              </button>
            </div>
          )}

          {/* Explore All Lessons Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Explore All Lessons</h2>
            {/* Search and Filter Bar */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-8 border border-white/10">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                {/* Search with auto-prediction */}
                <div className="flex-1 relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
                    ) : (
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </div>
                  {searchQuery && (
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input blur
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors duration-200 z-10"
                      type="button"
                      tabIndex={-1}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <input
                    type="text"
                    placeholder="Search by lesson name, theme, or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.length >= 2) {
                        setShowSuggestions(true);
                      } else if (recentSearches.length > 0) {
                        setSearchSuggestions(recentSearches.slice(0, 4));
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearchQuery('');
                        setShowSuggestions(false);
                        e.target.blur();
                      } else if (e.key === 'Enter' && searchSuggestions.length > 0 && showSuggestions) {
                        // Auto-select first suggestion on Enter
                        handleSuggestionClick(searchSuggestions[0]);
                      }
                    }}
                    className={`w-full pl-12 ${searchQuery ? 'pr-12' : 'pr-4'} py-3 text-sm sm:text-base bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-colors duration-200`}
                  />
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden z-50 shadow-xl max-h-64 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input blur
                            handleSuggestionClick(suggestion);
                          }}
                          className="w-full text-left px-4 py-3 text-white hover:bg-indigo-500/20 transition-colors duration-200 border-b border-white/10 last:border-b-0 text-sm sm:text-base"
                        >
                          <span className="flex items-center space-x-2">
                            <span className="text-slate-400 text-xs">
                              {searchQuery === '' ? '🕒' : '🔍'}
                            </span>
                            <span className="truncate">{suggestion}</span>
                            {searchQuery === '' && (
                              <span className="text-xs text-slate-500 ml-auto">recent</span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 sm:px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer text-sm sm:text-base min-w-0 sm:min-w-[120px]"
                  >
                    <option value="" className="bg-slate-800">All Levels</option>
                    <option value="beginner" className="bg-slate-800">Beginner</option>
                    <option value="intermediate" className="bg-slate-800">Intermediate</option>
                    <option value="advanced" className="bg-slate-800">Advanced</option>
                  </select>

                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 sm:px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer text-sm sm:text-base min-w-0 sm:min-w-[140px]"
                  >
                    <option value="" className="bg-slate-800">All Modules</option>
                    {availableModules.map(module => (
                      <option key={module} value={module} className="bg-slate-800">{module}</option>
                    ))}
                  </select>

                  {(searchQuery || selectedDifficulty || selectedModule) && (
                    <button
                      onClick={clearFilters}
                      className="px-3 sm:px-4 py-3 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results Summary */}
            {(searchQuery || selectedDifficulty || selectedModule) && (
              <div className="mb-6 text-center">
                <p className="text-slate-300 text-sm sm:text-base">
                  {filteredLessons.length > 0 
                    ? `Found ${filteredLessons.length} lesson${filteredLessons.length === 1 ? '' : 's'}`
                    : 'No lessons found'
                  }
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
            )}

            {/* Lessons Grid */}
            {filteredLessons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredLessons.map((lesson, index) => (
                  <div
                    key={lesson.id || `lesson-${index}`}
                    className="lesson-card-container"
                    style={{
                      animationDelay: `${Math.min(index * 30, 600)}ms`,
                      animation: 'fadeInUp 0.4s ease-out forwards',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <LessonCard
                      lesson={lesson}
                      onClick={() => handleLessonClick(lesson)}
                      showDifficultyModal={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-8xl mb-8">🔍</div>
                <h3 className="text-3xl font-bold text-white mb-4">No lessons found</h3>
                <p className="text-slate-400 text-lg mb-8">
                  Try adjusting your search or filters to find more lessons
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Show All Lessons
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Difficulty Selection Modal */}
      <DifficultySelectionModal
        isOpen={showDifficultyModal}
        onClose={() => {
          setShowDifficultyModal(false);
          setSelectedLesson(null);
        }}
        onConfirm={handleDifficultyConfirm}
        lesson={selectedLesson}
        defaultDifficulty="Intermediate"
      />

      {/* Custom CSS for animations and performance */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes breathingShadow {
          0% {
            box-shadow: 0 0 15px rgba(251, 191, 36, 0.4), 0 0 30px rgba(245, 158, 11, 0.2), 0 0 45px rgba(217, 119, 6, 0.15);
          }
          50% {
            box-shadow: 0 0 25px rgba(251, 191, 36, 0.6), 0 0 50px rgba(245, 158, 11, 0.35), 0 0 75px rgba(217, 119, 6, 0.25);
          }
          100% {
            box-shadow: 0 0 15px rgba(251, 191, 36, 0.4), 0 0 30px rgba(245, 158, 11, 0.2), 0 0 45px rgba(217, 119, 6, 0.15);
          }
        }

        .breathing-shadow {
          animation: breathingShadow 6s ease-in-out infinite;
        }

        /* Performance optimizations - only apply to specific elements that benefit */
        .lesson-card-container {
          contain: layout style;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Optimize star animations for better performance */
        .lessons-star-animation {
          will-change: transform, opacity;
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
});

export default LessonsOverview; 