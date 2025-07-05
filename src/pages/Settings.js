import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { motion } from 'framer-motion';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { checkPasswordStrength } from '../utils/validation';
import BugReportModal from '../components/BugReportModal';

const Settings = () => {
  const { user: currentUser, reauthenticateWithPassword, updateUserPassword, deleteUserAccount } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true
  });
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [newPasswordStrengthDetails, setNewPasswordStrengthDetails] = useState(checkPasswordStrength(''));
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteConfirmationPassword, setDeleteConfirmationPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'newPassword') {
      setNewPasswordStrengthDetails(checkPasswordStrength(value));
    }
    setPasswordChangeError('');
    setPasswordChangeSuccess('');
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (passwordFormData.newPassword !== passwordFormData.confirmNewPassword) {
      setPasswordChangeError('New passwords do not match.');
      return;
    }

    const { criteria, strength } = checkPasswordStrength(passwordFormData.newPassword);
    let errorMessages = [];
    if (!criteria.length) errorMessages.push('New password must be at least 8 characters.');
    if (!criteria.uppercase) errorMessages.push('New password must contain an uppercase letter.');
    if (!criteria.lowercase) errorMessages.push('New password must contain a lowercase letter.');
    if (!criteria.number) errorMessages.push('New password must contain a number.');
    if (!criteria.specialChar) errorMessages.push('New password must contain a special character.');

    if (errorMessages.length > 0) {
      setPasswordChangeError(errorMessages.join(' '));
      return;
    }
    if (strength < 5) {
        setPasswordChangeError('New password does not meet all strength requirements.');
        return;
    }

    setIsUpdatingPassword(true);
    try {
      // IMPORTANT: Firebase requires recent login (re-authentication) to change password.
      // You need a reauthenticateWithPassword function in your AuthContext.
      if (!reauthenticateWithPassword || !updateUserPassword) {
          console.error('reauthenticateWithPassword or updateUserPassword not available in AuthContext');
          setPasswordChangeError('Password update service is currently unavailable. Please try again later.');
          setIsUpdatingPassword(false);
          return;
      }
      await reauthenticateWithPassword(passwordFormData.currentPassword);
      await updateUserPassword(passwordFormData.newPassword);
      setPasswordChangeSuccess('Password updated successfully!');
      setPasswordFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setNewPasswordStrengthDetails(checkPasswordStrength(''));
      setTimeout(() => setIsChangePasswordModalOpen(false), 2000); // Close modal after success
    } catch (err) {
      console.error("Password Change Error:", err);
      // Handle specific Firebase errors like 'wrong-password'
      if (err.code === 'auth/wrong-password' || err.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        setPasswordChangeError('Incorrect current password.');
      } else if (err.code === 'auth/requires-recent-login') {
         setPasswordChangeError('This operation is sensitive and requires recent authentication. Please log out and log back in.');
      } else {
        setPasswordChangeError(err.message || 'Failed to update password. Please try again.');
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteUserAccount) {
        console.error('deleteUserAccount function not available in AuthContext');
        setDeleteError('Account deletion service is currently unavailable.');
        return;
    }
    if (!currentUser || !currentUser.email) { // Check if user and user.email are available
        setDeleteError('User information is not available. Cannot proceed with deletion.');
        return;
    }

    setIsDeletingAccount(true);
    setDeleteError('');
    try {
      // Firebase delete user is sensitive, requires re-authentication.
      await deleteUserAccount(deleteConfirmationPassword);
      // On successful deletion, AuthContext's onAuthStateChanged should handle redirecting the user (e.g., to login/landing)
      // No need to manually navigate here usually as user becomes null.
      setIsDeleteAccountModalOpen(false); // Close modal
      // Optionally show a global success message if needed, but redirection is primary feedback
    } catch (err) {
      console.error("Account Deletion Error:", err);
      if (err.code === 'auth/wrong-password' || err.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        setDeleteError('Incorrect password. Please try again to confirm account deletion.');
      } else if (err.code === 'auth/requires-recent-login') {
         setDeleteError('This operation is sensitive and requires recent authentication. Please log out, log back in, and try again.');
      } else {
        setDeleteError(err.message || 'Failed to delete account. Please try again.');
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-400">
      <LoggedInNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/home"
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
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

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

        {/* Account Settings */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={currentUser?.email}
                disabled
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <button 
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-800">Email Notifications</h3>
                <p className="text-gray-600 text-sm">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-800">Push Notifications</h3>
                <p className="text-gray-600 text-sm">Receive push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => handleNotificationChange('push')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-800">Study Reminders</h3>
                <p className="text-gray-600 text-sm">Get reminded about your study schedule</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reminders}
                  onChange={() => handleNotificationChange('reminders')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-2 bg-white text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 bg-white text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Help & Support</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🐛</div>
                <div>
                  <h3 className="text-gray-800 font-semibold">Report a Bug</h3>
                  <p className="text-gray-600 text-sm">Found an issue? Help us improve by reporting it!</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBugReportModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              >
                Report Bug
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💬</div>
                <div>
                  <h3 className="text-gray-800 font-semibold">General Support</h3>
                  <p className="text-gray-600 text-sm">Need help or have questions? We're here for you!</p>
                </div>
              </div>
              <a 
                href="/contact"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-6">Danger Zone</h2>
          <div className="space-y-4">
            <button 
              onClick={() => setIsDeleteAccountModalOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-300"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
              <button onClick={() => setIsChangePasswordModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {passwordChangeError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                {passwordChangeError}
              </div>
            )}
            {passwordChangeSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
                {passwordChangeSuccess}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-5">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  required
                  value={passwordFormData.currentPassword}
                  onChange={handlePasswordFormChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your current password"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  required
                  value={passwordFormData.newPassword}
                  onChange={handlePasswordFormChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a new password"
                />
                {(passwordFormData.newPassword !== '' || newPasswordStrengthDetails.strength > 0) && (
                    <PasswordStrengthIndicator strengthDetails={newPasswordStrengthDetails} />
                )}
              </div>
              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  required
                  value={passwordFormData.confirmNewPassword}
                  onChange={handlePasswordFormChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your new password"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                    </span>
                ) : 'Update Password'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {isDeleteAccountModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-red-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-600">Delete Account</h2>
              <button onClick={() => { setIsDeleteAccountModalOpen(false); setDeleteError(''); setDeleteConfirmationPassword(''); }} className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <p className="text-gray-700 mb-4 text-sm">
              This action is irreversible. All your data, including progress and settings, will be permanently deleted. 
              To confirm, please enter your password.
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                {deleteError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="deleteConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Your Password</label>
                <input
                  type="password"
                  name="deleteConfirmPassword"
                  id="deleteConfirmPassword"
                  required
                  value={deleteConfirmationPassword}
                  onChange={(e) => { setDeleteConfirmationPassword(e.target.value); setDeleteError(''); }}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your password to confirm"
                />
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || !deleteConfirmationPassword}
                className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeletingAccount ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting Account...
                    </span>
                ) : 'Permanently Delete My Account'}
              </button>
              <button
                onClick={() => { setIsDeleteAccountModalOpen(false); setDeleteError(''); setDeleteConfirmationPassword(''); }}
                disabled={isDeletingAccount}
                className="w-full py-3 px-6 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-semibold shadow-sm transition-all duration-300 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bug Report Modal */}
      <BugReportModal 
        isOpen={isBugReportModalOpen} 
        onClose={() => setIsBugReportModalOpen(false)} 
      />
    </div>
  );
};

export default Settings; 