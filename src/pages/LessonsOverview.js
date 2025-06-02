import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import LessonCard from '../components/LessonCard';
import LearningPathVisual from '../components/LearningPathVisual';
import DifficultySelectionModal from '../components/DifficultySelectionModal';
import { AdaptiveLessonService } from '../services/adaptiveLessonService';
import { isLearningPathActive, getCurrentLessonProgress, getLearningPath } from '../utils/learningPathUtils';
import { motion } from 'framer-motion';
import logger from '../utils/logger';

const LessonsOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [userLearningPath, setUserLearningPath] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const [adaptiveLessons, setAdaptiveLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // View state
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' or 'browse'

  // State for Foundation Lessons carousel
  const [foundationPage, setFoundationPage] = useState(0);
  const [foundationItemsPerPage, setFoundationItemsPerPage] = useState(3);

  // State for difficulty selection modal
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (window.innerWidth < 640) { // Tailwind's 'sm' breakpoint
        setFoundationItemsPerPage(1);
      } else if (window.innerWidth < 1024) { // Tailwind's 'lg' breakpoint
        setFoundationItemsPerPage(2);
      } else {
        setFoundationItemsPerPage(3);
      }
    };

    calculateItemsPerPage(); // Initial calculation
    window.addEventListener('resize', calculateItemsPerPage);
    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, []);

  // Set random quote on component mount
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

      // Load multiple learning paths
      const paths = ['prompt-engineering-mastery', 'vibe-coding'];
      const allLessons = [];

      for (const pathId of paths) {
        try {
          const adaptivePath = await AdaptiveLessonService.getAdaptedLearningPath(pathId, { skillLevel });
          
          if (adaptivePath && adaptivePath.modules) {
            // Get all lessons from this path
            const pathLessons = adaptivePath.modules.flatMap((module, moduleIndex) => 
              module.lessons.map((lesson, lessonIndex) => ({
                ...lesson,
                moduleTitle: module.title,
                pathTitle: adaptivePath.title,
                pathId: adaptivePath.id,
                moduleId: module.id,
                pathIcon: adaptivePath.icon || '📚',
                isPremium: adaptivePath.isPremium || lesson.isPremium || false,
                globalIndex: moduleIndex * 100 + lessonIndex,
                moduleIndex,
                lessonIndex
              }))
            );
            allLessons.push(...pathLessons);
          }
        } catch (error) {
          logger.warn(`Failed to load path ${pathId}:`, error);
        }
      }
      
      setAdaptiveLessons(allLessons);
      
      // Update available modules based on all loaded lessons
      const modules = [...new Set(allLessons.map(lesson => lesson.moduleTitle))];
      setAvailableModules(modules);
      
    } catch (error) {
      logger.error('Error loading adaptive lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-prediction for search
  useEffect(() => {
    if (searchQuery.length > 1) {
      const suggestions = new Set();
      adaptiveLessons.forEach(lesson => {
        // Add title matches
        if (lesson.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(lesson.title);
        }
        // Add tag matches
        lesson.tags?.forEach(tag => {
          if (tag.toLowerCase().includes(searchQuery.toLowerCase())) {
            suggestions.add(tag);
          }
        });
        // Add module matches
        if (lesson.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(lesson.moduleTitle);
        }
        // Add concept matches
        if (lesson.coreConcept?.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(lesson.coreConcept);
        }
      });
      setSearchSuggestions(Array.from(suggestions).slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, adaptiveLessons]);

  // Filter lessons
  const getFilteredLessons = () => {
    return adaptiveLessons.filter(lesson => {
      const matchesSearch = searchQuery === '' || 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lesson.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.coreConcept.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty = !selectedDifficulty || lesson.difficulty === selectedDifficulty;
      const matchesModule = !selectedModule || lesson.moduleTitle === selectedModule;

      return matchesSearch && matchesDifficulty && matchesModule;
    });
  };

  const filteredLessons = getFilteredLessons();

  // Get unique modules for filter
  const availableModules = [...new Set(adaptiveLessons.map(lesson => lesson.moduleTitle))];

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleLessonClick = (lesson, selectedDifficulty = null) => {
    if (selectedDifficulty) {
      // Direct navigation with specific difficulty
      navigate(`/lessons/${lesson.id}`, { 
        state: { 
          pathId: 'prompt-engineering-mastery',
          moduleId: lesson.moduleId,
          difficulty: selectedDifficulty
        } 
      });
    } else {
      // Show difficulty selection modal
      setSelectedLesson(lesson);
      setShowDifficultyModal(true);
    }
  };

  const handleDifficultyConfirm = (difficulty) => {
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
  };

  const handleCreateLearningPath = () => {
    navigate('/learning-path/adaptive-quiz');
  };

  const handleContinueLearning = () => {
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
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('');
    setSelectedModule('');
    setShowSuggestions(false);
  };

  // Quick stats
  const stats = {
    totalLessons: adaptiveLessons.length,
    completedLessons: learningProgress?.completedLessons || 0,
    modules: availableModules.length,
    avgDuration: Math.round(
      adaptiveLessons.reduce((acc, lesson) => acc + (lesson.duration || 15), 0) / (adaptiveLessons.length || 1)
    )
  };

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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white overflow-hidden">
      <LoggedInNavbar />

      {/* Star Animation Container for LessonsOverview */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(140)].map((_, i) => {
          const screenH = window.innerHeight;
          const screenW = window.innerWidth;
          const initialY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const targetY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const initialX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const targetX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const starDuration = 30 + Math.random() * 25;
          const starSize = Math.random() * 3 + 1; // 1px to 4px

          return (
            <motion.div
              key={`lessons-star-${i}`}
              className="absolute rounded-full bg-white/50"
              style={{
                width: starSize,
                height: starSize,
              }}
              initial={{
                x: initialX,
                y: initialY,
                opacity: 0,
              }}
              animate={{
                x: targetX,
                y: targetY,
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: starDuration,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
                ease: "linear",
                opacity: {
                  duration: starDuration,
                  ease: "linear",
                  times: [0, 0.1, 0.85, 1],
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 2,
                }
              }}
            />
          );
        })}
      </div>
      
      {/* Main content wrapper */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4 leading-tight py-2">
              Your AI Learning Journey
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Master AI through adaptive lessons designed for your skill level
            </p>
          </div>

          {/* Progress Section (if user has active path) */}
          {userLearningPath && learningProgress && (
            <div className="mb-8">
              <div className="bg-gradient-to-br from-yellow-500/25 via-amber-400/20 to-orange-500/25 backdrop-blur-xl rounded-2xl p-4 border border-yellow-300/60 relative transition-all duration-500 breathing-shadow">
                
                {/* Motivational Quote */}
                <div className="relative z-10 text-center mb-4">
                  <p className="text-yellow-100 text-lg font-medium italic drop-shadow-lg">
                    "{currentQuote.quote}"
                  </p>
                  <p className="text-yellow-200/90 text-sm mt-1 drop-shadow-md">- {currentQuote.author}</p>
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
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/60 hover:shadow-xl hover:shadow-yellow-300/80 border-2 border-yellow-200/40"
                  >
                    🚀 Continue Learning Journey
                  </button>
                  <p className="mt-2 text-yellow-100/90 text-xs drop-shadow-sm">
                    Pick up where you left off in your personalized path
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs - Simplified */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => {
                // If user has a learning path, take them to next lesson
                if (userLearningPath && learningProgress) {
                  handleContinueLearning();
                } else {
                  // Otherwise just show the overview section
                  setActiveSection('overview');
                }
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeSection === 'overview'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              } ${userLearningPath ? 'hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600' : ''}`}
            >
              {userLearningPath ? '🚀 Continue Learning' : '✨ Start Here'}
            </button>
            <button
              onClick={() => setActiveSection('browse')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeSection === 'browse'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              🔍 Browse All ({adaptiveLessons.length})
            </button>
          </div>

          {activeSection === 'overview' ? (
            /* Overview Section */
            <div className="space-y-8">
              {/* Start Learning CTA */}
              {!userLearningPath && (
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/30 text-center">
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

              {/* Featured Lessons - Now with Carousel Controls */}
              <div className="pb-20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">✨ Start Here - Foundation Lessons</h3>
                  {adaptiveLessons.length > foundationItemsPerPage && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setFoundationPage(p => Math.max(0, p - 1))}
                        disabled={foundationPage === 0}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setFoundationPage(p => Math.min(p + 1, Math.ceil(adaptiveLessons.length / foundationItemsPerPage) - 1))}
                        disabled={foundationPage >= Math.ceil(adaptiveLessons.length / foundationItemsPerPage) - 1}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adaptiveLessons.slice(foundationPage * foundationItemsPerPage, (foundationPage + 1) * foundationItemsPerPage).map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={{
                        ...lesson,
                        id: lesson.id,
                        title: lesson.title,
                        description: lesson.coreConcept || lesson.content?.beginner?.introduction || 'Interactive AI lesson',
                        difficulty: lesson.difficulty || 'Intermediate',
                        duration: lesson.estimatedTime?.beginner || 15,
                        company: 'BeginningWithAI',
                        category: lesson.pathTitle || 'AI Learning',
                        pathIcon: lesson.pathIcon,
                        isPremium: lesson.isPremium,
                        tags: [
                          ...(lesson.tags || []),
                          lesson.pathTitle,
                          lesson.moduleTitle
                        ].filter(Boolean).slice(0, 4), // Limit to 4 tags
                        hasCodeSandbox: lesson.sandbox?.required || false
                      }}
                      onClick={() => handleLessonClick(lesson)}
                      showDifficultyModal={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Browse All Lessons Section */
            <div>
              {/* Search and Filter Bar - All on one line */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  {/* Search with auto-prediction */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search lessons, topics, concepts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all duration-300"
                    />
                    
                    {/* Auto-predictions dropdown */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden z-50 shadow-xl">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-3 text-white hover:bg-indigo-500/20 transition-colors duration-200 border-b border-white/10 last:border-b-0"
                          >
                            <span className="flex items-center space-x-2">
                              <span className="text-slate-400">🔍</span>
                              <span>{suggestion}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                    >
                      <option value="" className="bg-slate-800">All Levels</option>
                      <option value="beginner" className="bg-slate-800">Beginner</option>
                      <option value="intermediate" className="bg-slate-800">Intermediate</option>
                      <option value="advanced" className="bg-slate-800">Advanced</option>
                    </select>

                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                    >
                      <option value="" className="bg-slate-800">All Modules</option>
                      {availableModules.map(module => (
                        <option key={module} value={module} className="bg-slate-800">{module}</option>
                      ))}
                    </select>

                    {/* Clear filters button */}
                    {(searchQuery || selectedDifficulty || selectedModule) && (
                      <button
                        onClick={clearFilters}
                        className="px-4 py-3 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Results count */}
                <div className="mt-4 text-slate-300">
                  <span className="text-indigo-300 font-bold">{filteredLessons.length}</span> of{' '}
                  <span className="text-white">{adaptiveLessons.length}</span> lessons
                  {(searchQuery || selectedDifficulty || selectedModule) && (
                    <span className="text-slate-400"> matching your filters</span>
                  )}
                </div>
              </div>

              {/* Lessons Grid */}
              {filteredLessons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredLessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <LessonCard
                        lesson={{
                          ...lesson,
                          id: lesson.id,
                          title: lesson.title,
                          description: lesson.coreConcept || lesson.content?.beginner?.introduction || 'Interactive AI lesson',
                          difficulty: lesson.difficulty || 'Intermediate',
                          duration: lesson.estimatedTime?.beginner || 15,
                          company: 'BeginningWithAI',
                          category: lesson.pathTitle || 'AI Learning',
                          pathIcon: lesson.pathIcon,
                          isPremium: lesson.isPremium,
                          tags: [
                            ...(lesson.tags || []),
                            lesson.pathTitle,
                            lesson.moduleTitle
                          ].filter(Boolean).slice(0, 4), // Limit to 4 tags
                          hasCodeSandbox: lesson.sandbox?.required || false
                        }}
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

              {/* Collection Stats - Only in browse mode */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4 text-center">📊 Collection Overview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                    <div className="text-xl font-bold text-indigo-400">{stats.totalLessons}</div>
                    <div className="text-xs text-slate-400">Total Lessons</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                    <div className="text-xl font-bold text-green-400">{stats.completedLessons}</div>
                    <div className="text-xs text-slate-400">Completed</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                    <div className="text-xl font-bold text-purple-400">{stats.modules}</div>
                    <div className="text-xs text-slate-400">Modules</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                    <div className="text-xl font-bold text-yellow-400">{stats.avgDuration}m</div>
                    <div className="text-xs text-slate-400">Avg Duration</div>
                  </div>
                </div>
              </div>
            </div>
          )}
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
      `}</style>
    </div>
  );
};

export default LessonsOverview; 