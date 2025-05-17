import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true
  });
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        {/* Account Settings */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Password</label>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white">Email Notifications</h3>
                <p className="text-gray-400 text-sm">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white">Push Notifications</h3>
                <p className="text-gray-400 text-sm">Receive push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => handleNotificationChange('push')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white">Study Reminders</h3>
                <p className="text-gray-400 text-sm">Get reminded about your study schedule</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reminders}
                  onChange={() => handleNotificationChange('reminders')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-500 mb-6">Danger Zone</h2>
          <div className="space-y-4">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings; 