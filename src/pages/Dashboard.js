import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {['overview', 'profile', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* User Stats Panel */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400">Lessons Completed</p>
                  <p className="text-2xl font-bold">{userStats.lessonsCompleted}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400">XP Earned</p>
                  <p className="text-2xl font-bold">{userStats.xpEarned}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400">Skill Level</p>
                  <p className="text-2xl font-bold">{userStats.skillLevel}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold">{userStats.streak} days</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Level Progress</span>
                  <span>{userStats.levelProgress}%</span>
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
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  defaultValue={user?.displayName || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  defaultValue={user?.email || ''}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}`}
                    alt="Profile"
                    className="h-16 w-16 rounded-full"
                  />
                  <button className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Change Photo
                  </button>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="space-y-6">
              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={userSettings.notifications.email}
                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={userSettings.notifications.push}
                        onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weekly Digest</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={userSettings.notifications.weeklyDigest}
                        onChange={(e) => handleSettingChange('notifications', 'weeklyDigest', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Appearance</h3>
                <div className="flex items-center justify-between">
                  <span>Dark Mode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={userSettings.theme === 'dark'}
                      onChange={(e) => handleSettingChange('theme', '', e.target.checked ? 'dark' : 'light')}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Profile Visibility</span>
                    <select
                      className="bg-gray-700 rounded-lg px-4 py-2"
                      value={userSettings.privacy.profileVisibility}
                      onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Progress</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={userSettings.privacy.showProgress}
                        onChange={(e) => handleSettingChange('privacy', 'showProgress', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Subscription Management */}
              <div className="pt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Profile Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Profile</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete your profile? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Cancel Subscription</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 