import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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
    console.log('Deleting profile...');
    setShowDeleteConfirm(false);
  };

  const handleCancelSubscription = () => {
    // Implement subscription cancellation logic
    console.log('Cancelling subscription...');
    setShowCancelConfirm(false);
  };

  const handleLessonNavigation = () => {
    // Navigate to lessons overview with reset filters state
    navigate('/lessons', { state: { resetFilters: true } });
  };

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: '#2061a6' }}
    >
      <LoggedInNavbar />

      {/* Star Animation Container for Dashboard */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ height: '100vh', width: '100vw' }}>
        {[...Array(200)].map((_, i) => {
          const screenH = window.innerHeight;
          const screenW = window.innerWidth;
          const initialY = Math.random() * screenH;
          const targetY = Math.random() * screenH;
          const initialX = Math.random() * screenW;
          const targetX = Math.random() * screenW;
          const starDuration = 30 + Math.random() * 25; 
          const starSize = Math.random() * 3 + 1; // 1px to 4px (bigger than before)

          return (
            <motion.div
              key={`dashboard-star-${i}`}
              className="absolute rounded-full bg-white/80"
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
        `}</style>
      
        <main className="container mx-auto px-4 py-8">
          {/* Hero Welcome Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent leading-tight py-2">
                Welcome back!
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Ready to continue your AI learning journey?
              </p>
            </div>
            
            {/* User Level Badge */}
            <div className="inline-flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-bold">
                  L{userStats.level}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm">
                  ��
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Level {userStats.level} Learner</h3>
                <p className="text-gray-300">{userStats.nextLevelPoints} XP to next level</p>
                <div className="w-32 h-2 bg-gray-700 rounded-full mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-1000"
                    style={{ width: `${(userStats.totalPoints % 1000) / 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Lessons Completed */}
            <div className="card-glow group bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-300">Lessons Completed</h3>
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📚</div>
              </div>
              <p className="text-3xl font-bold text-blue-400 mb-2">{userStats.lessonsCompleted}</p>
              <p className="text-sm text-gray-400">{userStats.lessonsCompleted === 0 ? 'Ready to start!' : 'Great progress!'}</p>
            </div>

            {/* Current Streak */}
            <div className="card-glow group bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-3xl p-6 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-300">Current Streak</h3>
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">🔥</div>
              </div>
              <p className="text-3xl font-bold text-orange-400 mb-2">{userStats.streak} day{userStats.streak !== 1 ? 's' : ''}</p>
              <p className="text-sm text-gray-400">{userStats.streak === 0 ? 'Start your streak!' : 'Keep it going!'}</p>
            </div>

            {/* Total Points */}
            <div className="card-glow group bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-3xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-300">Total Points</h3>
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">⭐</div>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-2">{userStats.totalPoints.toLocaleString()}</p>
              <p className="text-sm text-gray-400">{userStats.totalPoints === 0 ? 'Earn your first points!' : 'Amazing score!'}</p>
            </div>

            {/* Progress Percentage */}
            <div className="card-glow group bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-300">Overall Progress</h3>
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📈</div>
              </div>
              <p className="text-3xl font-bold text-purple-400 mb-2">{userStats.completionPercentage}%</p>
              <p className="text-sm text-gray-400">{userStats.completionPercentage === 0 ? 'Your journey begins!' : 'Almost there!'}</p>
            </div>
          </div>

          {/* Category Progress Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Learning Progress by Category
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(categoryProgress).map(([category, data]) => (
                <div
                  key={category}
                  className="card-glow group bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4 text-white">{category}</h3>
                    
                    {/* Circular Progress */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="rgba(75, 85, 99, 0.3)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={`url(#gradient-${category.replace(' ', '')})`}
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 40 * (data.percentage / 100)} ${2 * Math.PI * 40}`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id={`gradient-${category.replace(' ', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={data.color.end} />
                            <stop offset="100%" stopColor={data.color.start} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{data.percentage}%</div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400">{data.lessons} lessons completed</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Enhanced Achievements Section */}
            <div className="card-glow bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-2xl mr-3">🏆</span>
                Your Achievements
              </h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`group relative p-6 rounded-2xl transition-all duration-300 cursor-pointer hover:scale-105 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 hover:border-indigo-400/50'
                        : 'bg-gray-700/30 border border-gray-600/30 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`text-3xl p-3 rounded-2xl ${
                          achievement.unlocked 
                            ? `bg-gradient-to-br ${achievement.color} opacity-90` 
                            : 'bg-gray-600/50'
                        } group-hover:scale-110 transition-transform duration-300`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">{achievement.name}</h3>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                        </div>
                      </div>
                      {achievement.unlocked ? (
                        <div className="text-2xl text-green-400 group-hover:scale-110 transition-transform duration-300">✓</div>
                      ) : (
                        <div className="text-2xl text-gray-500">🔒</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Recent Activity Section */}
            <div className="card-glow bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-2xl mr-3">📈</span>
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105 border border-white/10 hover:border-white/20"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                          {activity.type === 'lesson' ? '📚' : 
                           activity.type === 'achievement' ? '🏆' : 
                           activity.type === 'streak' ? '🔥' : '⭐'}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{activity.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>{activity.date}</span>
                            <span className="text-yellow-400">+{activity.points} XP</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.type === 'lesson' ? (
                          <span className="text-green-400 text-xl">✓</span>
                        ) : activity.type === 'achievement' ? (
                          <span className="text-yellow-400 text-xl">🏆</span>
                        ) : (
                          <span className="text-orange-400 text-xl">🔥</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Ready to Start Learning?</h3>
                    <p className="text-gray-400 mb-6">Complete your first lesson to see your activity here!</p>
                    <button
                      onClick={handleLessonNavigation}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Browse Lessons
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Continue Learning Section */}
          <section className="text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Ready for More?
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Continue your AI learning journey with personalized lessons and engaging content
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={handleLessonNavigation}
                  className="dashboard-shadow group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 text-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Continue Learning</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/learning-path/adaptive-quiz')}
                  className="pulse-shadow group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 text-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Create Learning Path</span>
                    <span className="text-xl">🎯</span>
                  </div>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 