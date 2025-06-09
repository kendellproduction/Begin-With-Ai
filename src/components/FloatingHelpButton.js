import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import BugReportModal from './BugReportModal';

const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);

  // Don't show on certain pages where it might interfere
  const currentPath = window.location.pathname;
  const hiddenPaths = ['/lesson-viewer/', '/lessons/first-time-welcome'];
  const shouldHide = hiddenPaths.some(path => currentPath.includes(path));

  if (shouldHide) return null;

  return (
    <>
      {/* Main floating button */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {/* Help options menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 mb-2"
            >
              <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-600/30 p-3 min-w-[240px]">
                {/* Bug Report Option */}
                <button
                  onClick={() => {
                    setIsBugReportModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-500/20 transition-colors duration-200 text-white"
                >
                  <div className="text-2xl">🐛</div>
                  <div className="text-left">
                    <div className="font-semibold">Report a Bug</div>
                    <div className="text-xs text-gray-400">Something not working?</div>
                  </div>
                </button>

                {/* General Help Option */}
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-green-500/20 transition-colors duration-200 text-white"
                >
                  <div className="text-2xl">💬</div>
                  <div className="text-left">
                    <div className="font-semibold">Get Help</div>
                    <div className="text-xs text-gray-400">Questions or feedback?</div>
                  </div>
                </Link>

                {/* Settings Option */}
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-500/20 transition-colors duration-200 text-white"
                >
                  <div className="text-2xl">⚙️</div>
                  <div className="text-left">
                    <div className="font-semibold">Settings</div>
                    <div className="text-xs text-gray-400">Account & preferences</div>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main help button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            rotate: isOpen ? 45 : 0,
            backgroundColor: isOpen ? '#6366f1' : undefined
          }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </motion.button>

        {/* Notification badge for quick access */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">!</span>
          </motion.div>
        )}
      </div>

      {/* Bug Report Modal */}
      <BugReportModal 
        isOpen={isBugReportModalOpen} 
        onClose={() => setIsBugReportModalOpen(false)} 
      />

      {/* Backdrop to close menu when clicking outside */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingHelpButton; 