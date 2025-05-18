import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Profile = () => {
  const { currentUser } = useAuth();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Mock data for gamification
  const userStats = {
    totalXP: 1250,
    level: 5,
    xpToNextLevel: 500,
    lessonsCompleted: 8,
    badgesEarned: 3,
    currentStreak: 5,
  };

  const badges = [
    { id: 1, name: 'Quick Learner', icon: '🚀', description: 'Completed 5 lessons' },
    { id: 2, name: 'Quiz Master', icon: '🎯', description: 'Scored 100% on 3 quizzes' },
    { id: 3, name: 'Early Bird', icon: '🌅', description: 'Completed a lesson before 9 AM' },
  ];

  const recentLessons = [
    { id: '1-1', title: 'Introduction to AI', completed: true },
    { id: '1-2', title: 'Machine Learning Basics', completed: true },
    { id: '2-1', title: 'Neural Networks', completed: false },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <LoggedInNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/home"
            className="inline-flex items-center text-gray-300 hover:text-white"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Display Name
              </label>
              <input
                type="text"
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                defaultValue={currentUser?.displayName || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                defaultValue={currentUser?.email || ''}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <img
                  src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.email}`}
                  alt="Profile"
                  className="h-16 w-16 rounded-full"
                />
                <button className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 text-white">
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-400 mb-2">Total XP</h3>
            <p className="text-3xl font-bold text-white">{userStats.totalXP}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-400 mb-2">Lessons Completed</h3>
            <p className="text-3xl font-bold text-white">{userStats.lessonsCompleted}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-400 mb-2">Badges Earned</h3>
            <p className="text-3xl font-bold text-white">{userStats.badgesEarned}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-400 mb-2">Current Streak</h3>
            <p className="text-3xl font-bold text-white">{userStats.currentStreak} days</p>
          </div>
        </div>

        {/* Progress to Next Level */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-white">Progress to Level {userStats.level + 1}</h3>
            <span className="text-gray-400">{userStats.totalXP % userStats.xpToNextLevel}/{userStats.xpToNextLevel} XP</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(userStats.totalXP % userStats.xpToNextLevel) / userStats.xpToNextLevel * 100}%` }}
            />
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Your Badges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div key={badge.id} className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4">
                <div className="text-4xl">{badge.icon}</div>
                <div>
                  <h4 className="text-lg font-medium text-white">{badge.name}</h4>
                  <p className="text-gray-400 text-sm">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Lessons */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Recent Lessons</h3>
          <div className="space-y-4">
            {recentLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                <span className="text-white">{lesson.title}</span>
                {lesson.completed ? (
                  <span className="text-green-400">✓ Completed</span>
                ) : (
                  <span className="text-yellow-400">In Progress</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Management */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Subscription Management</h3>
          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      </main>

      {/* Cancel Subscription Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-lg w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Cancel Subscription</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to premium content and features.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => {
                  // Mock cancellation logic
                  setIsCancelModalOpen(false);
                  alert('Subscription cancelled successfully');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Cancellation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile; 