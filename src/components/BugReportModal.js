import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const BugReportModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    bugTitle: '',
    bugDescription: '',
    bugCategory: 'other',
    bugPriority: 'medium',
    reproductionSteps: '',
    expectedBehavior: '',
    actualBehavior: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Bug categories with icons and descriptions
  const bugCategories = [
    { 
      value: 'lesson-content', 
      label: 'Lesson Content', 
      icon: '📚', 
      description: 'Issues with lesson materials, quizzes, or content accuracy' 
    },
    { 
      value: 'authentication', 
      label: 'Login/Account', 
      icon: '🔐', 
      description: 'Problems with signing in, account access, or user settings' 
    },
    { 
      value: 'payment-billing', 
      label: 'Payment/Billing', 
      icon: '💳', 
      description: 'Issues with subscriptions, payments, or billing' 
    },
    { 
      value: 'user-interface', 
      label: 'User Interface', 
      icon: '🖥️', 
      description: 'Display issues, buttons not working, layout problems' 
    },
    { 
      value: 'performance', 
      label: 'Performance', 
      icon: '⚡', 
      description: 'Slow loading, crashes, or freezing issues' 
    },
    { 
      value: 'mobile-app', 
      label: 'Mobile Experience', 
      icon: '📱', 
      description: 'Mobile-specific issues, touch problems, or responsive design' 
    },
    { 
      value: 'data-sync', 
      label: 'Data & Progress', 
      icon: '🔄', 
      description: 'Progress not saving, data loss, or synchronization issues' 
    },
    { 
      value: 'other', 
      label: 'Other', 
      icon: '🐛', 
      description: 'Something else not covered by the above categories' 
    }
  ];

  // Priority levels
  const priorityLevels = [
    { 
      value: 'low', 
      label: 'Low', 
      icon: '🔵', 
      description: 'Minor issue, not blocking usage',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-400/20 to-blue-600/20',
      borderColor: 'border-blue-400/50'
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      icon: '🔶', 
      description: 'Noticeable issue, some impact on experience',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-400/20 to-orange-500/20',
      borderColor: 'border-yellow-400/50'
    },
    { 
      value: 'high', 
      label: 'High', 
      icon: '⚠️', 
      description: 'Significant problem, affects core functionality',
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-400/20 to-red-500/20',
      borderColor: 'border-orange-400/50'
    },
    { 
      value: 'critical', 
      label: 'Critical', 
      icon: '🚨', 
      description: 'App is broken or unusable',
      color: 'from-red-500 to-red-700',
      bgColor: 'from-red-500/20 to-red-700/20',
      borderColor: 'border-red-500/50'
    }
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSubmitStatus(null);
      setErrorMessage('');
      setFormData({
        bugTitle: '',
        bugDescription: '',
        bugCategory: 'other',
        bugPriority: 'medium',
        reproductionSteps: '',
        expectedBehavior: '',
        actualBehavior: ''
      });
      
      // Reset scroll position to top when modal opens
      setTimeout(() => {
        const scrollContainer = document.querySelector('.custom-scrollbar');
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }
      }, 100);
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSubmitStatus(null);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (!formData.bugTitle || !formData.bugDescription) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in the title and description.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      // Gather additional context
      const reportData = {
        bugTitle: formData.bugTitle,
        bugDescription: formData.bugDescription,
        bugCategory: formData.bugCategory,
        bugPriority: formData.bugPriority,
        reproductionSteps: formData.reproductionSteps,
        expectedBehavior: formData.expectedBehavior,
        actualBehavior: formData.actualBehavior,
        userEmail: currentUser?.email,
        userId: currentUser?.uid,
        userName: currentUser?.displayName || currentUser?.email?.split('@')[0],
        userAgent: navigator.userAgent,
        currentUrl: window.location.href,
        timestamp: new Date().toISOString()
      };

      // Submitting bug report

      // Submit to Firebase Function
      const response = await fetch('https://us-central1-beginai1.cloudfunctions.net/sendBugReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });

      // Response received from server

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Error parsing server response:', parseError);
        setSubmitStatus('error');
        setErrorMessage('Server returned an invalid response. Please try again or contact support directly.');
        return;
      }

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || `Server error (${response.status}): ${response.statusText}. Please try again.`);
      }

    } catch (error) {
      console.error('Error submitting bug report:', error);
      // Error occurred during submission
      setSubmitStatus('error');
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setErrorMessage(`Unexpected error: ${error.message}. Please try again or contact support.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = bugCategories.find(cat => cat.value === formData.bugCategory);
  const selectedPriority = priorityLevels.find(pri => pri.value === formData.bugPriority);

  // Determine if we should use mobile layout
  const isMobile = window.innerWidth < 768;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-[100] p-4">
        <motion.div 
          initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.9, y: 20 }}
          animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
          exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            bg-gradient-to-br from-slate-800/95 via-gray-800/95 to-slate-900/95 
            backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-600/30 text-white 
            relative overflow-hidden w-full flex flex-col
            ${isMobile 
              ? 'max-w-none h-[90vh] max-h-[90vh] rounded-b-none fixed bottom-0 left-0 right-0' 
              : 'max-w-2xl max-h-[85vh]'
            }
          `}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-purple-500/20 rounded-full blur-2xl"></div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-600/30 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🐛</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Report a Bug</h2>
                <p className="text-gray-400 text-sm">Help us improve BeginningWithAI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable with hidden scrollbar */}
          <div className="relative z-10 p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
            <style>
              {`
                .custom-scrollbar {
                  scrollbar-width: none; /* Firefox */
                  -ms-overflow-style: none; /* IE and Edge */
                }
                .custom-scrollbar::-webkit-scrollbar {
                  display: none; /* Chrome, Safari, Opera */
                }
              `}
            </style>

            {submitStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Bug Report Sent!</h3>
                <p className="text-gray-300">Thank you for helping us improve. We'll investigate this issue promptly.</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Step indicator */}
                <div className="flex items-center justify-center space-x-2 mb-6">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step === currentStep 
                          ? 'bg-blue-500 text-white' 
                          : step < currentStep 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-600 text-gray-400'
                      }`}
                    >
                      {step < currentStep ? '✓' : step}
                    </div>
                  ))}
                </div>

                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">What's the issue?</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bug Title *
                      </label>
                      <input
                        type="text"
                        value={formData.bugTitle}
                        onChange={(e) => handleInputChange('bugTitle', e.target.value)}
                        placeholder="Brief description of the issue"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.bugDescription}
                        onChange={(e) => handleInputChange('bugDescription', e.target.value)}
                        placeholder="Describe what happened in detail..."
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Category & Priority */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Categorize the issue</h3>
                    
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        What type of issue is this?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {bugCategories.map((category) => (
                          <motion.button
                            key={category.value}
                            onClick={() => handleInputChange('bugCategory', category.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                              formData.bugCategory === category.value
                                ? 'bg-blue-500/20 border-blue-400/50 text-blue-300'
                                : 'bg-gray-700/30 border-gray-600/30 hover:border-gray-500/50 text-gray-300'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{category.icon}</span>
                              <div className="flex-1">
                                <div className="font-semibold">{category.label}</div>
                                <div className="text-xs text-gray-400 mt-1">{category.description}</div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Priority Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        How urgent is this issue?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {priorityLevels.map((priority) => (
                          <motion.button
                            key={priority.value}
                            onClick={() => handleInputChange('bugPriority', priority.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                              formData.bugPriority === priority.value
                                ? `bg-gradient-to-br ${priority.bgColor} ${priority.borderColor} text-white`
                                : 'bg-gray-700/30 border-gray-600/30 hover:border-gray-500/50 text-gray-300'
                            }`}
                          >
                            <div className="text-2xl mb-2">{priority.icon}</div>
                            <div className="font-semibold">{priority.label}</div>
                            <div className="text-xs text-gray-400 mt-1">{priority.description}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Additional Details */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Additional details (optional)</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Steps to reproduce
                      </label>
                      <textarea
                        value={formData.reproductionSteps}
                        onChange={(e) => handleInputChange('reproductionSteps', e.target.value)}
                        placeholder="1. Go to...&#10;2. Click on...&#10;3. Expected to see..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        What did you expect to happen?
                      </label>
                      <textarea
                        value={formData.expectedBehavior}
                        onChange={(e) => handleInputChange('expectedBehavior', e.target.value)}
                        placeholder="Describe what you expected to see or happen..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        What actually happened?
                      </label>
                      <textarea
                        value={formData.actualBehavior}
                        onChange={(e) => handleInputChange('actualBehavior', e.target.value)}
                        placeholder="Describe what actually occurred..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Summary Preview */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-400/30">
                      <h4 className="font-semibold text-blue-300 mb-2">📋 Report Summary</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div><strong>Title:</strong> {formData.bugTitle || 'Not specified'}</div>
                        <div><strong>Category:</strong> {selectedCategory?.icon} {selectedCategory?.label}</div>
                        <div><strong>Priority:</strong> {selectedPriority?.icon} {selectedPriority?.label}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error message */}
                {submitStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-center"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Navigation buttons - Fixed at bottom */}
          {submitStatus !== 'success' && (
            <div className="relative z-10 p-6 border-t border-gray-600/30 flex-shrink-0">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-xl transition-colors duration-200"
                  >
                    ← Previous
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={currentStep === 1 && (!formData.bugTitle || !formData.bugDescription)}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.bugTitle || !formData.bugDescription}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    {isSubmitting ? 'Sending...' : '🚀 Submit Report'}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BugReportModal; 