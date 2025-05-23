import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Mock data - replace with real data from your backend
  const userStats = {
    lessonsCompleted: 12,
    streak: 5,
    totalPoints: 1250,
    level: 3,
    nextLevelPoints: 500
  };

  const achievements = [
    { id: 1, name: 'Quick Learner', description: 'Complete 5 lessons', unlocked: true, icon: '🎯' },
    { id: 2, name: 'Consistent', description: 'Maintain a 3-day streak', unlocked: true, icon: '🔥' },
    { id: 3, name: 'Knowledge Seeker', description: 'Complete 10 lessons', unlocked: false, icon: '📚' },
    { id: 4, name: 'AI Master', description: 'Complete all lessons', unlocked: false, icon: '🤖' }
  ];

  const recentActivity = [
    { id: 1, type: 'lesson', title: 'Introduction to AI', completed: true, date: '2 hours ago' },
    { id: 2, type: 'achievement', title: 'Quick Learner', unlocked: true, date: '1 day ago' },
    { id: 3, type: 'lesson', title: 'AI Ethics', completed: true, date: '2 days ago' }
  ];

  const categoryProgress = {
    'OpenAI': 60,
    'Google AI': 40,
    'Meta AI': 20,
    'Claude': 80,
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
    <div className="min-h-screen bg-gray-900 text-white">
      <LoggedInNavbar />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 transition-all duration-300 hover:scale-[1.02]">
          <h1 className="text-3xl font-bold mb-2">Welcome back, User!</h1>
          <p className="text-gray-400">Track your progress and continue learning</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Lessons Completed */}
          <div className="bg-gray-800 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 hover:bg-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-400">Lessons Completed</h3>
              <span className="text-2xl">📚</span>
            </div>
            <p className="text-2xl font-bold text-white">{userStats.lessonsCompleted}</p>
          </div>

          {/* Current Streak */}
          <div className="bg-gray-800 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 hover:bg-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-400">Current Streak</h3>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-2xl font-bold text-white">{userStats.streak} days</p>
          </div>

          {/* Total Points */}
          <div className="bg-gray-800 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 hover:bg-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-400">Total Points</h3>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-2xl font-bold text-white">{userStats.totalPoints}</p>
          </div>

          {/* Current Level */}
          <div className="bg-gray-800 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 hover:bg-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-400">Current Level</h3>
              <span className="text-2xl">🏆</span>
            </div>
            <p className="text-2xl font-bold text-white">Level {userStats.level}</p>
            <p className="text-sm text-gray-400 mt-2">{userStats.nextLevelPoints} points to next level</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements Section */}
          <div className="bg-gray-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
            <h2 className="text-xl font-bold mb-6">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    achievement.unlocked
                      ? 'bg-indigo-600/20 hover:bg-indigo-600/30 hover:scale-105'
                      : 'bg-gray-700/50 hover:bg-gray-700/70'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h3 className="font-medium">{achievement.name}</h3>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.unlocked ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className="text-gray-500">🔒</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-gray-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-700/50 hover:bg-gray-700/70 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">
                      {activity.type === 'lesson' ? '📚' : '🏆'}
                    </span>
                    <div>
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                  {activity.type === 'lesson' ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className="text-yellow-400">🏆</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="mt-8">
          <button
            onClick={handleLessonNavigation}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20"
          >
            Continue Learning
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 