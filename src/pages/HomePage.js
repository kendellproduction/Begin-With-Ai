import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import LoggedInNavbar from '../components/LoggedInNavbar';

import LearningPathMap from '../components/LearningPathMap';
import LearningPathVisual from '../components/LearningPathVisual';
import DifficultySelectionModal from '../components/DifficultySelectionModal';
import FloatingHelpButton from '../components/FloatingHelpButton';
import { AdaptiveLessonService } from '../services/adaptiveLessonService';
import { isLearningPathActive, getCurrentLessonProgress, getLearningPath } from '../utils/learningPathUtils';
import { NewUserOnboardingService } from '../services/newUserOnboardingService';
import { motion } from 'framer-motion'; // Direct import for debugging
import { animations } from '../utils/framerMotion';
import logger from '../utils/logger';


const HomePage = () => {
  const navigate = useNavigate();
  const { user, currentUser } = useAuth();
  const { userStats, completeLesson, updateStreak } = useGamification();
  
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentFact, setCurrentFact] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [showAchievement, setShowAchievement] = useState(false);
  const [todaysChallenge, setTodaysChallenge] = useState(null);

  // Adaptive learning state
  const [adaptiveLessons, setAdaptiveLessons] = useState([]);
  const [availablePaths, setAvailablePaths] = useState([]);
  const [userLearningPath, setUserLearningPath] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Quiz completion state
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  // State for difficulty selection modal for quick access lessons
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [lessonForDifficultySelection, setLessonForDifficultySelection] = useState(null);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  // Inspirational quotes based on time of day
  const quotes = {
    morning: [
      "Good morning, AI pioneer! Today is your chance to learn something that will change your career forever.",
      "Rise and shine! The future belongs to those who start their AI journey today.",
      "Every expert was once a beginner. Your AI mastery journey starts with this moment.",
      "The best time to plant a tree was 20 years ago. The second best time is now. Start learning AI today!"
    ],
    afternoon: [
      "Keep pushing forward! Each lesson brings you closer to AI mastery.",
      "Progress, not perfection. Every small step in AI learning compounds into expertise.",
      "You're building the skills that will define the next decade of your career.",
      "The future of work is AI-powered. You're preparing for that future right now."
    ],
    evening: [
      "End your day with growth. A few minutes of AI learning today = a transformed tomorrow.",
      "While others are watching TV, you're building skills that will change your life.",
      "Consistency beats intensity. Your evening AI session is an investment in your future.",
      "The person you'll be in 6 months starts with what you learn tonight."
    ]
  };

  // AI facts and insights
  const aiFacts = [
    "🤖 AI can help you write code, even if you've never programmed before",
    "💡 ChatGPT was trained on data up to 2021, but newer models know even more",
    "🚀 Companies using AI are 5x more likely to be top performers in their industry",
    "📈 AI-skilled professionals earn 20-30% more than their peers",
    "🎯 Prompt engineering is now a $300,000+ per year career",
    "⚡ AI can reduce repetitive tasks by up to 80% in most jobs",
    "🌟 You don't need a computer science degree to master AI tools",
    "🔥 The next 5 years will see more AI advancement than the last 50 years combined"
  ];

  // Daily challenges
  const dailyChallenges = [
    {
      title: "Prompt Master",
      description: "Create a prompt that generates a professional email",
      xp: 50,
      icon: "✍️",
      difficulty: "Easy"
    },
    {
      title: "AI Assistant",
      description: "Use AI to solve a real problem from your work",
      xp: 100,
      icon: "🤝",
      difficulty: "Medium"
    },
    {
      title: "Creative Genius",
      description: "Generate 5 creative ideas for your next project using AI",
      xp: 75,
      icon: "🎨",
      difficulty: "Easy"
    },
    {
      title: "Data Detective",
      description: "Ask AI to analyze a dataset or spreadsheet",
      xp: 120,
      icon: "🔍",
      difficulty: "Medium"
    }
  ];

  useEffect(() => {
    initializeDashboard();
  }, [userStats]);

  const initializeDashboard = async () => {
    setIsLoading(true);
    
    // Note: Redirect logic for new users is now handled in LandingPage.js
    // This ensures consistent routing based on authentication state
    
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
          
          // If we have local data but not in database, sync to database
          if (quizCompletedState && (!userDoc.exists() || !userDoc.data().quizCompleted)) {
            const { setDoc, updateDoc } = await import('firebase/firestore');
            
            const updateData = {};
            if (quizResultsData) {
              updateData.aiAssessmentResults = quizResultsData;
              updateData.quizCompleted = { completed: true, timestamp: new Date(), results: quizResultsData };
            }
            if (learningPathData) {
              updateData.activeLearningPath = learningPathData;
            }
            
            if (Object.keys(updateData).length > 0) {
              if (userDoc.exists()) {
                await updateDoc(userDocRef, updateData);
              } else {
                await setDoc(userDocRef, {
                  ...updateData,
                  createdAt: new Date(),
                  lastLogin: new Date()
                });
              }
            }
          }
        } catch (error) {
          logger.error('Error syncing quiz state with Firebase:', error);
        }
      }
      
      // Set the states
      setIsQuizCompleted(quizCompletedState);
      setQuizResults(quizResultsData);
      
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
      }
      
      logger.log('Quiz completion state:', { quizCompletedState, quizResultsData, learningPathData });
    } catch (error) {
      logger.error('Error initializing dashboard:', error);
    }
    
    // Set time-based content
    const hour = new Date().getHours();
    let timeCategory = 'morning';
    if (hour >= 12 && hour < 17) timeCategory = 'afternoon';
    else if (hour >= 17) timeCategory = 'evening';
    
    setTimeOfDay(timeCategory);
    setCurrentQuote(quotes[timeCategory][Math.floor(Math.random() * quotes[timeCategory].length)]);
    setCurrentFact(aiFacts[Math.floor(Math.random() * aiFacts.length)]);
    setTodaysChallenge(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)]);

    // Check for achievements
    if (userStats.streak >= 3 && !localStorage.getItem('streak_achievement_shown')) {
      setShowAchievement(true);
      localStorage.setItem('streak_achievement_shown', 'true');
    }

    try {
      // Load adaptive lessons for quick access
      await loadAdaptiveLessons();
    } catch (error) {
      logger.error('Error loading dashboard data:', error);
    }
    
    setIsLoading(false);
  };

  const loadUserLearningData = async () => {
    // Check for active learning path from quiz completion
    const activePath = localStorage.getItem('activeLearningPath');
    if (activePath) {
      const pathData = JSON.parse(activePath);
      setUserLearningPath(pathData);
      
      // Create progress object compatible with learning path map
      const progress = {
        nextLessonIndex: pathData.nextLessonIndex || 0,
        completedLessons: pathData.completedLessons?.length || 0,
        totalLessons: pathData.totalLessons || 10, // Default estimate
        progressPercentage: Math.round(((pathData.completedLessons?.length || 0) / (pathData.totalLessons || 10)) * 100)
      };
      setLearningProgress(progress);
    }
    
    // Legacy check for old learning path system
    if (isLearningPathActive()) {
      const pathData = getLearningPath();
      const progress = getCurrentLessonProgress();
      setUserLearningPath(pathData);
      setLearningProgress(progress);

      // Get next lesson recommendation
      try {
        const recommendedLessons = await AdaptiveLessonService.getRecommendedLessons(
          user?.uid, 
          pathData.pathId || 'prompt-engineering-mastery', 
          1
        );
        if (recommendedLessons.length > 0) {
          setNextLesson(recommendedLessons[0]);
        }
      } catch (error) {
        logger.error('Error getting recommended lessons:', error);
      }
    }
  };

  const loadAdaptiveLessons = async () => {
    try {
      // Get user's skill level from assessment or default to intermediate
      const assessmentResults = localStorage.getItem('aiAssessmentResults');
      const skillLevel = assessmentResults ? JSON.parse(assessmentResults).skillLevel : 'intermediate';

      // Load multiple learning paths
      const paths = ['prompt-engineering-mastery', 'vibe-coding'];
      const allLessons = [];
      const pathsData = [];

      for (const pathId of paths) {
        try {
          const adaptivePath = await AdaptiveLessonService.getAdaptedLearningPath(pathId, { skillLevel });
          
          if (adaptivePath && adaptivePath.modules) {
            // Store path data
            pathsData.push({
              id: adaptivePath.id,
              title: adaptivePath.title,
              description: adaptivePath.description,
              icon: adaptivePath.icon || '📚',
              color: adaptivePath.color || 'from-blue-500 to-purple-600',
              isPremium: adaptivePath.isPremium || false,
              estimatedHours: adaptivePath.estimatedHours,
              totalLessons: adaptivePath.totalLessons,
              category: adaptivePath.category,
              difficulty: adaptivePath.difficulty
            });

            // Get lessons from this path
            const pathLessons = adaptivePath.modules.flatMap(module => 
              module.lessons.slice(0, 2).map(lesson => ({
                ...lesson,
                moduleTitle: module.title,
                pathTitle: adaptivePath.title,
                pathId: adaptivePath.id,
                moduleId: module.id,
                isPremium: adaptivePath.isPremium || lesson.isPremium || false,
                pathColor: adaptivePath.color || 'from-blue-500 to-purple-600',
                pathIcon: adaptivePath.icon || '📚'
              }))
            );
            allLessons.push(...pathLessons);
          }
        } catch (error) {
          logger.warn(`Failed to load path ${pathId}:`, error);
        }
      }
      
      setAvailablePaths(pathsData);
      setAdaptiveLessons(allLessons.slice(0, 6)); // Show up to 6 lessons total
    } catch (error) {
      logger.error('Failed to load adaptive lessons:', error);
    }
  };

  const getUserGreeting = () => {
    const name = user?.displayName || user?.email?.split('@')[0] || 'AI Learner';
    const greetings = {
      morning: `Good morning, ${name}!`,
      afternoon: `Good afternoon, ${name}!`,
      evening: `Good evening, ${name}!`
    };
    return greetings[timeOfDay];
  };

  const handleStartLearning = () => {
    if (isQuizCompleted && userLearningPath && learningProgress) {
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
        // Try to load the next lesson from the learning path
        navigate('/lessons/continue');
      }
    } else if (isQuizCompleted && userLearningPath) {
      // Has learning path but no progress loaded, go to lessons page
      navigate('/lessons');
    } else {
      // Start adaptive assessment
      navigate('/learning-path/adaptive-quiz');
    }
  };

  const handleCompleteChallenge = () => {
    if (todaysChallenge) {
      completeLesson(`challenge-${Date.now()}`, todaysChallenge.xp);
      setTodaysChallenge(null);
    }
  };

  const handleLearningPathClick = (path) => {
    logger.info('[Learning Path Click] Starting first lesson for path:', path.title);
    
    // Find the first lesson in this path
    const pathLessons = adaptiveLessons.filter(lesson => lesson.pathId === path.id);
    
    if (pathLessons.length > 0) {
      const firstLesson = pathLessons[0];
      logger.info('[Learning Path Click] Found first lesson:', firstLesson.title);
      
      // Navigate directly to the first lesson
      navigate(`/lessons/${firstLesson.id}`, {
        state: {
          pathId: path.id,
          moduleId: firstLesson.moduleId,
          fromLearningPath: true,
          pathData: path
        }
      });
    } else {
      logger.info('[Learning Path Click] No lessons found, falling back to lessons page');
      // Fallback to lessons page if no lessons found
      navigate('/lessons', { 
        state: { 
          selectedPath: path.id,
          pathData: path 
        } 
      });
    }
  };

  const handleUpgradeToPremium = async () => {
    try {
      setShowPaywallModal(false);
      
      // Stripe Checkout Integration - To be implemented
      // When ready, uncomment and implement the following:
      /*
      const { createCheckoutSession } = await import('../services/stripeService');
      const checkoutUrl = await createCheckoutSession({
        userId: user?.uid,
        priceId: process.env.REACT_APP_STRIPE_PRICE_ID || 'price_premium_monthly',
        successUrl: `${window.location.origin}/home?upgrade=success`,
        cancelUrl: `${window.location.origin}/home?upgrade=cancelled`
      });
      window.location.href = checkoutUrl;
      */
      
      // Temporary: Navigate to pricing page
      navigate('/pricing');
    } catch (error) {
      logger.error('Error initiating upgrade:', error);
      // Consider using a toast notification library for user feedback
    }
  };

  const handleQuickLessonClick = (lesson) => {
    setLessonForDifficultySelection(lesson);
    setShowDifficultyModal(true);
  };

  const handleConfirmQuickAccessDifficulty = (selectedDifficulty) => {
    if (!lessonForDifficultySelection) return;

    logger.debug('[Paywall Check] Lesson:', lessonForDifficultySelection.title);
    logger.debug('[Paywall Check] lessonForDifficultySelection.isPremium:', lessonForDifficultySelection.isPremium);
    logger.debug('[Paywall Check] selectedDifficulty:', selectedDifficulty);
    logger.debug('[Paywall Check] currentUser?.subscriptionTier:', currentUser?.subscriptionTier);

    const isPremiumLessonPart = 
      !!lessonForDifficultySelection.isPremium && // Ensure isPremium is treated as boolean
      (selectedDifficulty === 'Intermediate' || selectedDifficulty === 'Advanced');
    
    logger.debug('[Paywall Check] isPremiumLessonPart:', isPremiumLessonPart);
    
    // TEMPORARILY DISABLED: Premium paywall for testing
    // const hasAccess = !isPremiumLessonPart || (currentUser?.subscriptionTier === 'premium');
    const hasAccess = true; // Always allow access for testing
    logger.debug('[Paywall Check] hasAccess:', hasAccess);

    if (hasAccess) {
      navigate(`/lessons/${lessonForDifficultySelection.id}`, {
        state: {
          pathId: 'prompt-engineering-mastery',
          moduleId: lessonForDifficultySelection.moduleId,
          selectedDifficulty: selectedDifficulty
        }
      });
      setShowDifficultyModal(false);
      setLessonForDifficultySelection(null);
    } else {
      setShowPaywallModal(true);
      setShowDifficultyModal(false);
      setLessonForDifficultySelection(null);
    }
  };

  const calculateWeeklyProgress = () => {
    const lessonsThisWeek = userStats.lessonsCompletedThisWeek || 0;
    const goal = 5; // Weekly goal
    return Math.min((lessonsThisWeek / goal) * 100, 100);
  };

  // Quick Access Lessons (Example)
  const quickAccessLessons = [
    { id: 'qa1', title: 'Welcome to the AI Revolution', category: 'AI Foundations', duration: '15 min', icon: '🌟', isPremium: true },
    { id: 'qa2', title: 'How AI "Thinks" – From Data to Decisions', category: 'AI Foundations', duration: '20 min', icon: '🧠', isPremium: true },
    { id: 'qa3', title: 'Your First AI Prompt: A Beginner\'s Guide', category: 'Prompt Engineering', duration: '10 min', icon: '✍️', isPremium: true },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <LoggedInNavbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300">Preparing your AI learning dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: '#2061a6' }}
    >
      <LoggedInNavbar />

      {/* Star Animation Container for HomePage - High Performance GPU Accelerated */}
      <div className="star-container fixed inset-0 z-0 pointer-events-none" style={{ height: '100vh', width: '100vw' }}>
        {[...Array(200)].map((_, i) => {

          const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
          const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
          const initialY = Math.random() * screenH;
          const targetY = Math.random() * screenH;
          const initialX = Math.random() * screenW;
          const targetX = Math.random() * screenW;
          const starDuration = 30 + Math.random() * 25; // 30-55 seconds (subtle)
          const starSize = Math.random() * 2 + 0.5; // 0.5px to 2.5px (smaller, less distracting)

          return (
            <motion.div
              key={`homepage-star-${i}`}
              className="star-element absolute rounded-full bg-white/80"
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
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: starDuration,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
                ease: "linear",
                type: "tween", // More performant than spring
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
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <section className="mb-6">
              <div className="bg-blue-500/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/40 relative transition-all duration-500" style={{boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.2), 0 0 45px rgba(59, 130, 246, 0.15)'}}>
                
                {/* Greeting and Quote */}
                <div className="text-center mb-4">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight py-2">
                    {getUserGreeting()}
                  </h1>
                  <p className="text-md md:text-lg text-blue-100 mb-4 leading-relaxed max-w-2xl mx-auto">
                    {currentQuote}
                  </p>
                </div>

                {/* Real User Stats - Updated with correct property names */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                    <div className="text-xl font-bold text-orange-300">{userStats.currentStreak || 0}</div>
                    <div className="text-xs text-blue-200">Day Streak 🔥</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                    <div className="text-xl font-bold text-green-300">{userStats.completedLessons || 0}</div>
                    <div className="text-xs text-blue-200">Lessons Done ✅</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                    <div className="text-xl font-bold text-yellow-300">{userStats.xp || 0}</div>
                    <div className="text-xs text-blue-200">Total XP ⭐</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                    <div className="text-xl font-bold text-purple-300">Lv.{userStats.level || 1}</div>
                    <div className="text-xs text-blue-200">Current Level 🏆</div>
                  </div>
                </div>

                {/* Learning Path Visual and Continue Button */}
                {isQuizCompleted && userLearningPath && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <LearningPathVisual 
                      learningProgress={learningProgress}
                      userLearningPath={userLearningPath}
                      compact={true}
                      showActions={false}
                      onLessonClick={handleQuickLessonClick}
                    />
                    <div className="text-center mt-3">
                      <button
                        onClick={handleStartLearning}
                        className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm shadow-indigo-500/20"
                      >
                        🚀 {learningProgress?.nextLessonIndex > 0 ? 'Continue Learning Journey' : 'Start Learning Journey'}
                      </button>
                      <p className="mt-1 text-indigo-200 text-xs">
                        Pick up where you left off in your personalized path.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Fallback Start Button if no learning path yet */}
                {!userLearningPath && (
                   <div className="text-center mt-4">
                     <button
                       onClick={handleStartLearning}
                       className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                     >
                       <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                       <span className="relative flex items-center gap-2">
                         🎯 Start Your AI Journey
                       </span>
                     </button>
                   </div>
                )}
              </div>
            </section>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Next Lesson Recommendation */}
                {nextLesson && (
                  <div className="bg-gradient-to-br from-cyan-500/40 to-blue-600/40 backdrop-blur-xl rounded-3xl p-6 border border-cyan-400/50 shadow-md">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      🎯 Up Next
                    </h2>
                    <div className="bg-white/20 rounded-2xl p-6 border border-white/30">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-blue-400/30 text-blue-100 rounded-full text-sm font-medium">
                          {nextLesson.moduleName}
                        </span>
                        <span className="text-sm text-cyan-200">15 min</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{nextLesson.title}</h3>
                      <p className="text-cyan-100 mb-4">{nextLesson.coreConcept}</p>
                      <button
                        onClick={() => handleQuickLessonClick(nextLesson)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Start Lesson →
                      </button>
                    </div>
                  </div>
                )}

                {/* Available Learning Paths Section */}
                {availablePaths.length > 0 && (
                  <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">🗺️ Explore Learning Paths</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {availablePaths.map((path) => (
                        <div
                          key={path.id}
                          className={`relative group cursor-pointer ${
                            path.id === 'vibe-coding' 
                              ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
                              : 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
                          } backdrop-blur-sm p-8 rounded-2xl border ${
                            path.id === 'vibe-coding'
                              ? 'border-purple-500/30 hover:border-purple-400/50'
                              : 'border-cyan-500/30 hover:border-cyan-400/50'
                          } transition-all duration-300 transform hover:scale-105 ${
                            path.id === 'vibe-coding'
                              ? 'shadow-[0_0_10px_rgba(168,85,247,0.3),0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_15px_rgba(168,85,247,0.4),0_0_30px_rgba(168,85,247,0.2)]'
                              : 'shadow-[0_0_10px_rgba(6,182,212,0.3),0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4),0_0_30px_rgba(6,182,212,0.2)]'
                          } h-80 flex flex-col`}
                          onClick={() => handleLearningPathClick(path)}
                        >
                          {/* Premium Badge */}
                          {path.isPremium && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                              ✨ PREMIUM
                            </div>
                          )}
                          
                          {/* Header Section - Fixed Height */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`text-4xl filter flex-shrink-0 ${
                              path.id === 'vibe-coding' 
                                ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                                : 'drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                            }`}>
                              {path.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg leading-tight">{path.title}</h3>
                              <p className="text-gray-300 text-sm leading-relaxed h-12 overflow-hidden">{path.description}</p>
                            </div>
                          </div>
                          
                          {/* Tags Section - Fixed Position */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            <span className={`px-2 py-0.5 ${
                              path.id === 'vibe-coding'
                                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                                : 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                            } text-xs rounded-full backdrop-blur-sm font-medium`}>
                              {path.category}
                            </span>
                            <span className={`px-2 py-0.5 ${
                              path.id === 'vibe-coding'
                                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                                : 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                            } text-xs rounded-full backdrop-blur-sm font-medium`}>
                              {path.difficulty}
                            </span>
                            <span className={`px-2 py-0.5 ${
                              path.id === 'vibe-coding'
                                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                                : 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                            } text-xs rounded-full backdrop-blur-sm font-medium`}>
                              {path.estimatedHours}h • {path.totalLessons} lessons
                            </span>
                          </div>
                          
                          {/* Spacer to push bottom content down */}
                          <div className="flex-grow"></div>
                          
                          {/* Bottom Section - Always at bottom */}
                          <div className="space-y-3">
                            {/* Access Status */}
                            <div className="text-center">
                              {path.isPremium ? (
                                <div className="text-amber-300 text-sm font-medium drop-shadow-sm">
                                  🔒 Premium Required
                                </div>
                              ) : (
                                <div className="text-emerald-300 text-sm font-medium drop-shadow-sm">
                                  ✅ Free Access
                                </div>
                              )}
                            </div>
                            
                            {/* Big Button - Always at bottom */}
                            <button className={`w-full py-4 px-6 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-1px] ${
                              path.id === 'vibe-coding' 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25 hover:shadow-purple-500/40' 
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/25 hover:shadow-cyan-500/40'
                            }`}>
                              Start Learning Journey →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center mt-6">
                      <button
                        onClick={() => navigate('/lessons')}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 border border-white/20"
                      >
                        View All Lessons & Paths →
                      </button>
                    </div>
                  </div>
                )}

                {/* Weekly Goal Progress */}
                <div className="bg-gradient-to-br from-emerald-500/40 to-green-600/40 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/50 shadow-md">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    🎯 Weekly Learning Goal
                  </h2>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-emerald-200 mb-2">
                      <span>Progress this week</span>
                      <span>{Math.round(calculateWeeklyProgress())}%</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-3 border border-white/40">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${calculateWeeklyProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-emerald-100">
                    {calculateWeeklyProgress() >= 100 
                      ? "🎉 Amazing! You've crushed this week's goal!" 
                      : `Just ${Math.max(0, 5 - (userStats.lessonsCompletedThisWeek || 0))} more lessons to hit your weekly goal!`
                    }
                  </p>
                </div>

                {/* AI Insight */}
                <div className="bg-gradient-to-br from-sky-500/40 to-cyan-600/40 backdrop-blur-xl rounded-3xl p-6 border border-sky-400/50 shadow-md">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    💡 AI Insight of the Day
                  </h2>
                  <p className="text-xl text-sky-100 leading-relaxed">
                    {currentFact}
                  </p>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                
                {/* Today's Challenge */}
                {todaysChallenge && (
                  <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      ⚡ Today's Challenge
                    </h2>
                    <div className="text-center">
                      <div className="text-4xl mb-3">{todaysChallenge.icon}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{todaysChallenge.title}</h3>
                      <p className="text-orange-200 mb-4 text-sm">{todaysChallenge.description}</p>
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium">+{todaysChallenge.xp} XP</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          todaysChallenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                          todaysChallenge.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>{todaysChallenge.difficulty}</span>
                      </div>
                      <button 
                        onClick={handleCompleteChallenge}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300"
                      >
                        Accept Challenge 💪
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-indigo-500/40 to-blue-600/40 backdrop-blur-xl rounded-3xl p-6 border border-indigo-400/50 shadow-md">
                  <h2 className="text-xl font-bold text-white mb-4">⚡ Quick Actions</h2>
                  <div className="space-y-3">
                    {!isQuizCompleted && (
                      <button
                        onClick={() => navigate('/learning-path/adaptive-quiz')}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-left flex items-center gap-2"
                      >
                        <span className="text-lg">🎯</span> Take AI Assessment
                      </button>
                    )}
                    <div
                      onClick={() => navigate('/lessons')}
                      className="
                        group relative bg-gradient-to-br from-blue-400/30 to-indigo-500/30 backdrop-blur-xl 
                        rounded-3xl p-8 border border-blue-400/40 hover:border-blue-300/60 
                        transition-all duration-300 cursor-pointer hover:scale-105 
                        shadow-md hover:shadow-lg
                      "
                    >
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold mb-3 text-white">Explore All Lessons</h3>
                      <p className="text-blue-100 mb-6 leading-relaxed">
                        Browse through our adaptive lessons with our discovery interface. Each lesson adjusts to your skill level!
                      </p>
                      <div className="flex items-center space-x-2 text-blue-200 font-medium">
                        <span>Start Exploring</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-left flex items-center gap-2"
                    >
                      <span className="text-lg">📊</span> View Progress
                    </button>
                  </div>
                </div>

                {/* Motivational Quote */}
                <div className="bg-gradient-to-r from-pink-500/40 to-rose-600/40 backdrop-blur-xl rounded-3xl p-6 border border-pink-400/50 text-center shadow-md">
                  <div className="text-4xl mb-3">🌟</div>
                  <p className="text-lg font-medium text-pink-100 italic">
                    "The future belongs to those who learn, adapt, and grow. You're already ahead of 99% of people."
                  </p>
                  <p className="text-sm text-pink-200 mt-2">- Your AI Coach</p>
                </div>
              </div>
            </div>


          </main>
      </div>

      {/* Difficulty Selection Modal for Quick Access Lessons */}
      <DifficultySelectionModal
        isOpen={showDifficultyModal}
        onClose={() => {
          setShowDifficultyModal(false);
          setLessonForDifficultySelection(null);
        }}
        onConfirm={handleConfirmQuickAccessDifficulty}
        lesson={lessonForDifficultySelection}
        defaultDifficulty="Beginner"
      />

      {/* Paywall Modal */}
      {showPaywallModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.3, ease: 'easeOut'}}
            className="bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl w-full max-w-md border border-blue-400/30 text-white relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-purple-500/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">👑</div>
                <h3 className="text-2xl font-bold text-white mb-2">Unlock Premium Content</h3>
                <p className="text-blue-200 text-lg leading-relaxed">
                  Access Intermediate & Advanced lessons with your Premium subscription
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-emerald-300">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">All difficulty levels unlocked</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-300">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Advanced AI techniques & strategies</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-300">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Priority support & feedback</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded-2xl p-4 mb-6 border border-blue-400/30">
                <div className="text-center">
                  <div className="text-sm text-blue-200 mb-1">Premium Plan</div>
                  <div className="text-3xl font-bold text-white mb-1">
                    $10<span className="text-lg text-blue-200">/month</span>
                  </div>
                  <div className="text-xs text-blue-300">Cancel anytime</div>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleUpgradeToPremium}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">💳 Upgrade Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                </motion.button>
                
                <button 
                  onClick={() => {
                    setShowPaywallModal(false);
                    setLessonForDifficultySelection(null);
                  }}
                  className="w-full text-slate-300 hover:text-white font-medium py-2 transition-colors duration-200 text-sm"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>
  );
};

export default HomePage;

