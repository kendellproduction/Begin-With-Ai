import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Mock data - replace with real data from your backend
  const userStats = {
    lessonsCompleted: 12,
    xpEarned: 1250,
    skillLevel: 3,
    streak: 5,
    levelProgress: 75,
    nextLevelXp: 1500
  };

  const badges = [
    { id: 1, name: 'Quick Learner', description: 'Complete 5 lessons', unlocked: true, icon: '🎯' },
    { id: 2, name: 'Streak Master', description: 'Maintain a 7-day streak', unlocked: true, icon: '🔥' },
    { id: 3, name: 'AI Expert', description: 'Complete all AI fundamentals', unlocked: false, icon: '🤖' },
    { id: 4, name: 'Perfect Score', description: 'Get 100% on any quiz', unlocked: false, icon: '⭐' },
  ];

  const recentActivity = [
    { id: 1, action: 'Completed OpenAI Basics', xp: 50, timestamp: '2 hours ago' },
    { id: 2, action: 'Earned Quick Learner badge', xp: 100, timestamp: '3 hours ago' },
    { id: 3, action: 'Completed Google AI Quiz', xp: 75, timestamp: '1 day ago' },
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

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <LoggedInNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
        <div className="space-y-8">
          {/* User Stats Panel */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400">Lessons Completed</p>
                <p className="text-2xl font-bold text-white">{userStats.lessonsCompleted}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400">XP Earned</p>
                <p className="text-2xl font-bold text-white">{userStats.xpEarned}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400">Skill Level</p>
                <p className="text-2xl font-bold text-white">{userStats.skillLevel}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-white">{userStats.streak} days</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Level Progress</span>
                <span className="text-gray-400">{userStats.levelProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${userStats.levelProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {userStats.nextLevelXp - userStats.xpEarned} XP until next level
              </p>
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Badges & Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-gray-700 rounded-lg p-4 text-center ${
                    !badge.unlocked && 'opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-bold">{badge.name}</h3>
                  <p className="text-sm text-gray-400">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-400">{activity.timestamp}</p>
                    </div>
                    <span className="text-green-400">+{activity.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Category Progress</h2>
            <div className="space-y-4">
              {Object.entries(categoryProgress).map(([category, progress]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{category}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 