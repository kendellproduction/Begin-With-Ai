import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import SwipeNavigationWrapper from '../components/SwipeNavigationWrapper';
import LearningPathMap from '../components/LearningPathMap';
import { AdaptiveLessonService } from '../services/adaptiveLessonService';
import { isLearningPathActive, getCurrentLessonProgress, getLearningPath } from '../utils/learningPathUtils';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userStats, completeLesson, updateStreak } = useGamification();
  
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentFact, setCurrentFact] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [showAchievement, setShowAchievement] = useState(false);
  const [todaysChallenge, setTodaysChallenge] = useState(null);

  // Adaptive learning state
  const [adaptiveLessons, setAdaptiveLessons] = useState([]);
  const [userLearningPath, setUserLearningPath] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Quiz completion state
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

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
    
    // Check if user has completed the quiz
    const quizCompleted = localStorage.getItem('quizCompleted');
    if (quizCompleted) {
      const completionState = JSON.parse(quizCompleted);
      if (completionState.completed && completionState.results) {
        setIsQuizCompleted(true);
        setQuizResults(completionState.results);
      }
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
      // Load user's learning path and progress
      await loadUserLearningData();
      
      // Load adaptive lessons for quick access
      await loadAdaptiveLessons();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
        console.error('Error getting recommended lessons:', error);
      }
    }
  };

  const loadAdaptiveLessons = async () => {
    try {
      // Get user's skill level from assessment or default to intermediate
      const assessmentResults = localStorage.getItem('aiAssessmentResults');
      const skillLevel = assessmentResults ? JSON.parse(assessmentResults).skillLevel : 'intermediate';

      const adaptivePath = await AdaptiveLessonService.getAdaptedLearningPath(
        'prompt-engineering-mastery',
        { skillLevel }
      );
      
      if (adaptivePath && adaptivePath.modules) {
        // Get first few lessons for quick access
        const recentLessons = adaptivePath.modules.flatMap(module => 
          module.lessons.slice(0, 2).map(lesson => ({
            ...lesson,
            moduleTitle: module.title,
            pathTitle: adaptivePath.title,
            moduleId: module.id
          }))
        ).slice(0, 4);
        
        setAdaptiveLessons(recentLessons);
      }
    } catch (error) {
      console.error('Failed to load adaptive lessons:', error);
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
    if (isQuizCompleted && userLearningPath) {
      // Continue learning path or go to first lesson
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

  const handleQuickLesson = (lesson) => {
    navigate(`/lessons/${lesson.id}`, { 
      state: { 
        pathId: 'prompt-engineering-mastery',
        moduleId: lesson.moduleId 
      } 
    });
  };

  const calculateWeeklyProgress = () => {
    const lessonsThisWeek = userStats.lessonsCompletedThisWeek || 0;
    const goal = 5; // Weekly goal
    return Math.min((lessonsThisWeek / goal) * 100, 100);
  };

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
    <SwipeNavigationWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <LoggedInNavbar />
        
        {showAchievement && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-8 text-center max-w-md animate-bounce">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
              <p className="text-white/90 mb-6">You're on fire! Keep up the amazing progress!</p>
              <button
                onClick={() => setShowAchievement(false)}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all"
              >
                Awesome! 🎉
              </button>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section with Greeting and Progress */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/30">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {getUserGreeting()}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
                  {currentQuote}
                </p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                    <div className="text-3xl font-bold text-indigo-400">{userStats.streak || 0}</div>
                    <div className="text-sm text-gray-400">Day Streak 🔥</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                    <div className="text-3xl font-bold text-green-400">{userStats.lessonsCompleted || 0}</div>
                    <div className="text-sm text-gray-400">Lessons Done ✅</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                    <div className="text-3xl font-bold text-yellow-400">{userStats.xp || 0}</div>
                    <div className="text-sm text-gray-400">Total XP ⭐</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                    <div className="text-3xl font-bold text-purple-400">Lv.{userStats.level || 1}</div>
                    <div className="text-sm text-gray-400">Current Level 🏆</div>
                  </div>
                </div>

                <button
                  onClick={handleStartLearning}
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                  <span className="relative flex items-center gap-2">
                    {isQuizCompleted ? '🚀 Continue Learning' : '🎯 Start Your AI Journey'}
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Learning Path Progress - MOST PROMINENT SECTION */}
          {isQuizCompleted && userLearningPath ? (
            <section className="mb-8">
              {/* Learning Path Header */}
              <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 backdrop-blur-xl rounded-3xl p-8 mb-6 border-2 border-green-500/50 shadow-2xl shadow-green-500/20">
                <div className="text-center mb-6">
                  <h2 className="text-4xl font-bold text-green-400 mb-2 flex items-center justify-center gap-3">
                    🎯 Your Learning Journey
                  </h2>
                  <h3 className="text-3xl font-semibold mb-4 text-white">{userLearningPath.pathTitle}</h3>
                  <p className="text-xl text-green-200 mb-6">You're making incredible progress! Keep going!</p>
                </div>
                
                {/* Progress Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-green-500/20 rounded-2xl p-6 text-center border border-green-500/30">
                    <div className="text-3xl font-bold text-green-400">{learningProgress?.completedLessons || 0}</div>
                    <div className="text-sm text-gray-300">Completed</div>
                  </div>
                  <div className="bg-blue-500/20 rounded-2xl p-6 text-center border border-blue-500/30">
                    <div className="text-3xl font-bold text-blue-400">{(learningProgress?.totalLessons || 10) - (learningProgress?.completedLessons || 0)}</div>
                    <div className="text-sm text-gray-300">Remaining</div>
                  </div>
                  <div className="bg-purple-500/20 rounded-2xl p-6 text-center border border-purple-500/30">
                    <div className="text-3xl font-bold text-purple-400">{userStats.streak || 0}</div>
                    <div className="text-sm text-gray-300">Day Streak</div>
                  </div>
                  <div className="bg-yellow-500/20 rounded-2xl p-6 text-center border border-yellow-500/30">
                    <div className="text-3xl font-bold text-yellow-400">Lv.{userStats.level || 1}</div>
                    <div className="text-sm text-gray-300">Level</div>
                  </div>
                </div>
              </div>

              {/* Mario World Style Learning Path Map */}
              <LearningPathMap 
                userLearningPath={userLearningPath}
                learningProgress={learningProgress}
                className="mb-8"
              />
            </section>
          ) : !isQuizCompleted ? (
            // No Learning Path - Encourage to Start
            <section className="mb-8">
              <div className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-xl rounded-3xl p-8 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/20">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-indigo-400 mb-4 flex items-center justify-center gap-3">
                    🌟 Ready to Begin Your AI Journey?
                  </h2>
                  <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
                    Take our quick assessment to get a personalized learning path tailored to your experience level and goals.
                  </p>
                  <button
                    onClick={() => navigate('/learning-path/adaptive-quiz')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 text-xl shadow-lg shadow-indigo-500/30"
                  >
                    Start AI Assessment 🎯
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Next Lesson Recommendation */}
              {nextLesson && (
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/30">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    🎯 Up Next
                  </h2>
                  <div className="bg-black/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm font-medium">
                        {nextLesson.moduleName}
                      </span>
                      <span className="text-sm text-gray-400">15 min</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{nextLesson.title}</h3>
                    <p className="text-gray-300 mb-4">{nextLesson.coreConcept}</p>
                    <button
                      onClick={() => handleQuickLesson(nextLesson)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      Start Lesson →
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Access Lessons */}
              {adaptiveLessons.length > 0 && (
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    ⚡ Quick Access Lessons
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {adaptiveLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => handleQuickLesson(lesson)}
                        className="bg-black/30 hover:bg-black/50 p-4 rounded-xl transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs font-medium">
                            {lesson.moduleTitle}
                          </span>
                          <span className="text-xs text-gray-400">15 min</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {lesson.coreConcept}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => navigate('/lessons')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300"
                    >
                      View All Lessons →
                    </button>
                  </div>
                </div>
              )}

              {/* Weekly Goal Progress */}
              <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  🎯 Weekly Learning Goal
                </h2>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress this week</span>
                    <span>{Math.round(calculateWeeklyProgress())}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${calculateWeeklyProgress()}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-gray-300">
                  {calculateWeeklyProgress() >= 100 
                    ? "🎉 Amazing! You've crushed this week's goal!" 
                    : `Just ${Math.max(0, 5 - (userStats.lessonsCompletedThisWeek || 0))} more lessons to hit your weekly goal!`
                  }
                </p>
              </div>

              {/* AI Insight */}
              <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-6 border border-cyan-500/30">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  💡 AI Insight of the Day
                </h2>
                <p className="text-xl text-cyan-200 leading-relaxed">
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
              <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
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
                      explore-shadow group relative bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl 
                      rounded-3xl p-8 border border-indigo-500/30 hover:border-indigo-400/50 
                      transition-all duration-300 cursor-pointer hover:scale-105 
                      shadow-indigo-500/20 hover:shadow-indigo-500/40
                    "
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Explore All Lessons</h3>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      Browse through our adaptive lessons with our discovery interface. Each lesson adjusts to your skill level!
                    </p>
                    <div className="flex items-center space-x-2 text-indigo-400 font-medium">
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
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-center">
                <div className="text-4xl mb-3">🌟</div>
                <p className="text-lg font-medium text-purple-200 italic">
                  "The future belongs to those who learn, adapt, and grow. You're already ahead of 99% of people."
                </p>
                <p className="text-sm text-purple-300 mt-2">- Your AI Coach</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SwipeNavigationWrapper>
  );
};

export default HomePage;

