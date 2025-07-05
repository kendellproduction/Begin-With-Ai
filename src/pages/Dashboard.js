import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { motion } from 'framer-motion';
import OptimizedStarField from '../components/OptimizedStarField';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check for error messages from redirects (e.g., admin access denied)
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'admin_required') {
      setErrorMessage('Admin access required. Contact an administrator to access that feature.');
      // Clear the URL parameter
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('error');
      navigate({ search: newSearchParams.toString() }, { replace: true });
    }
  }, [searchParams, navigate]);

  // Real user data - replace with actual data from your backend when available
  const userStats = {
    lessonsCompleted: 0,
    streak: 0,
    totalPoints: 0,
    level: 1,
    nextLevelPoints: 1000,
    completionPercentage: 0
  };

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', unlocked: false, icon: '🎯', color: 'from-blue-500 to-cyan-600' },
    { id: 2, name: 'Getting Started', description: 'Maintain a 3-day streak', unlocked: false, icon: '🔥', color: 'from-orange-500 to-red-600' },
    { id: 3, name: 'Knowledge Seeker', description: 'Complete 10 lessons', unlocked: false, icon: '📚', color: 'from-green-500 to-emerald-600' },
    { id: 4, name: 'AI Master', description: 'Complete all lessons', unlocked: false, icon: '🤖', color: 'from-purple-500 to-indigo-600' }
  ];

  const recentActivity = [
    // No mock activity - this will be populated with real user activity when available
  ];

  const categoryProgress = {
    // Starting with realistic empty progress - will be updated as user completes lessons
    'OpenAI': { percentage: 0, lessons: 0, color: { start: '#10b981', end: '#059669' } },
    'Google AI': { percentage: 0, lessons: 0, color: { start: '#3b82f6', end: '#0ea5e9' } },
    'Meta AI': { percentage: 0, lessons: 0, color: { start: '#8b5cf6', end: '#6366f1' } },
    'Claude': { percentage: 0, lessons: 0, color: { start: '#f97316', end: '#dc2626' } },
  };

  const settings = {
    notifications: {
      email: true,
      push: true,
      weeklyDigest: false
    },
    theme: 'dark',
    language: 'en',
    privacy: {
      profileVisibility: 'public',
      showProgress: true
    }
  };

  const [userSettings, setUserSettings] = useState(settings);

  const handleSettingChange = (category, setting, value) => {
    setUserSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleDeleteProfile = () => {
    // Implement profile deletion logic
    setShowDeleteConfirm(false);
  };

  const handleCancelSubscription = () => {
    // Implement subscription cancellation logic
    setShowCancelConfirm(false);
  };

  const handleLessonNavigation = () => {
    // Navigate to lessons overview with reset filters state
    navigate('/lessons', { state: { resetFilters: true } });
  };

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: '#3b82f6' }}
    >
      <LoggedInNavbar />

      {/* Optimized Star Field */}
      <OptimizedStarField starCount={150} opacity={0.8} speed={1} size={1.2} />
      
      {/* Custom CSS for animated shadows - wrapped in relative div */}
      <div className="relative z-10"> 
        <style jsx>{`
          @keyframes dashboard-glow {
            0% {
              box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(236, 72, 153, 0.2);
            }
            25% {
              box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(236, 72, 153, 0.3), 0 0 60px rgba(59, 130, 246, 0.2);
            }
            50% {
              box-shadow: 0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(34, 197, 94, 0.2);
            }
            75% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(34, 197, 94, 0.3), 0 0 60px rgba(99, 102, 241, 0.2);
            }
            100% {
              box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(236, 72, 153, 0.2);
            }
          }

          @keyframes pulse-glow {
            0% {
              box-shadow: 0 0 15px rgba(99, 102, 241, 0.3), 0 0 30px rgba(139, 92, 246, 0.2);
            }
            50% {
              box-shadow: 0 0 25px rgba(99, 102, 241, 0.5), 0 0 50px rgba(139, 92, 246, 0.4);
            }
            100% {
              box-shadow: 0 0 15px rgba(99, 102, 241, 0.3), 0 0 30px rgba(139, 92, 246, 0.2);
            }
          }

          .dashboard-shadow {
            animation: dashboard-glow 3s ease-in-out infinite;
          }

          .pulse-shadow {
            animation: pulse-glow 2s ease-in-out infinite;
          }

          .card-glow {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(99, 102, 241, 0.1);
            transition: all 0.3s ease;
          }

          .card-glow:hover {
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 10px 30px rgba(99, 102, 241, 0.3);
          }

          @media (max-width: 768px) {
            .card-glow {
              margin: 0.5rem 0;
              padding: 1rem !important;
            }
          }
        `}</style>
      
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Error Message Display */}
          {errorMessage && (
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="bg-red-500/20 border border-red-400/50 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3">
                <div className="text-red-400 text-xl">⚠️</div>
                <div className="text-red-200">{errorMessage}</div>
                <button 
                  onClick={() => setErrorMessage('')}
                  className="ml-auto text-red-300 hover:text-red-100 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Header Section with Glass Effect */}
          <section className="glass-card rounded-3xl p-6 sm:p-8 mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Learner'}! 🎯
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
                Track your AI learning journey and celebrate your progress
              </p>
            </motion.div>
          </section>

          {/* Stats Grid with Glass Effects */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <motion.div
              className="glass-warning rounded-2xl p-4 sm:p-6 text-center pulse-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-300 mb-2">
                {userStats.streak || 0}
              </div>
              <div className="text-sm sm:text-base text-orange-200">Day Streak 🔥</div>
            </motion.div>

            <motion.div
              className="glass-success rounded-2xl p-4 sm:p-6 text-center pulse-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-300 mb-2">
                {userStats.lessonsCompleted || 0}
              </div>
              <div className="text-sm sm:text-base text-green-200">Lessons Completed ✅</div>
            </motion.div>

            <motion.div
              className="glass-primary rounded-2xl p-4 sm:p-6 text-center pulse-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-300 mb-2">
                {userStats.totalPoints.toLocaleString() || 0}
              </div>
              <div className="text-sm sm:text-base text-blue-200">Total XP ⭐</div>
            </motion.div>

            <motion.div
              className="glass-secondary rounded-2xl p-4 sm:p-6 text-center pulse-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-300 mb-2">
                Lv.{userStats.level || 1}
              </div>
              <div className="text-sm sm:text-base text-purple-200">Current Level 🏆</div>
            </motion.div>
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Recent Activity */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Recent Progress with Glass Effect */}
              <motion.section
                className="glass-card rounded-3xl p-6 sm:p-8 dashboard-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  📈 Recent Progress
                </h2>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        className="glass-surface rounded-2xl p-4 flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <div className="text-2xl">{activity.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{activity.title}</div>
                          <div className="text-sm text-blue-200">{activity.description}</div>
                        </div>
                        <div className="text-xs text-cyan-300">{activity.time}</div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="glass-surface rounded-2xl p-8 text-center">
                      <div className="text-4xl mb-4">🚀</div>
                      <h3 className="text-lg font-semibold text-white mb-2">Ready to start learning?</h3>
                      <p className="text-blue-200 mb-4">Complete your first lesson to see your progress here!</p>
                      <button
                        onClick={handleLessonNavigation}
                        className="glass-button bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Start Learning Now
                      </button>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Learning Milestones with Glass Effect */}
              <motion.section
                className="glass-accent rounded-3xl p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  🏅 Learning Milestones
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      className={`glass-surface rounded-2xl p-4 text-center ${
                        achievement.unlocked ? 'ring-2 ring-green-400/50' : 'opacity-75'
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    >
                      <div className={`text-3xl mb-2 ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="text-sm font-semibold text-white mb-1">{achievement.name}</div>
                      <div className="text-xs text-blue-200">{achievement.description}</div>
                      {achievement.unlocked && (
                        <div className="text-xs text-green-300 mt-2 font-semibold">✨ Achieved!</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions with Glass Effect */}
              <motion.section
                className="glass-primary rounded-3xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">⚡ Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleLessonNavigation}
                    className="w-full glass-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-3 rounded-xl transition-all duration-300 text-left flex items-center gap-2"
                  >
                    <span className="text-lg">🔍</span>
                    <span className="text-sm font-medium">Explore Lessons</span>
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full glass-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-xl transition-all duration-300 text-left flex items-center gap-2"
                  >
                    <span className="text-lg">👤</span>
                    <span className="text-sm font-medium">View Profile</span>
                  </button>
                  <button
                    onClick={() => navigate('/ai-news')}
                    className="w-full glass-button bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-3 rounded-xl transition-all duration-300 text-left flex items-center gap-2"
                  >
                    <span className="text-lg">📰</span>
                    <span className="text-sm font-medium">AI News</span>
                  </button>
                </div>
              </motion.section>

              {/* Learning Goals with Glass Effect */}
              <motion.section
                className="glass-secondary rounded-3xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">🎯 This Week's Goal</h2>
                <div className="glass-surface rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-white">Complete 3 lessons</span>
                    <span className="text-sm text-purple-200">{Math.min(userStats.lessonsCompleted || 0, 3)}/3</span>
                  </div>
                  <div className="w-full glass-surface rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((userStats.lessonsCompleted || 0) / 3 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-200">
                    {(userStats.lessonsCompleted || 0) >= 3 
                      ? "🎉 Goal achieved! You're crushing it!" 
                      : `${Math.max(0, 3 - (userStats.lessonsCompleted || 0))} more to reach your goal!`
                    }
                  </p>
                </div>
              </motion.section>

              {/* AI Learning Tip with Glass Effect */}
              <motion.section
                className="glass-accent rounded-3xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">💡 Daily AI Tip</h2>
                <div className="glass-surface rounded-2xl p-4">
                  <p className="text-sm text-cyan-100 leading-relaxed">
                    "When working with AI models, specificity in your prompts leads to better results. 
                    Instead of asking 'Tell me about dogs,' try 'Explain the key differences between 
                    training a Golden Retriever versus a Border Collie for agility competitions.'"
                  </p>
                  <div className="text-xs text-cyan-300 mt-3 text-right">— AI Training Wisdom</div>
                </div>
              </motion.section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 