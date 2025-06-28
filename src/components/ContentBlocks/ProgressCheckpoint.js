import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProgressCheckpoint = ({ 
  content,
  config = {},
  onComplete = () => {},
  className = ""
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null

  const defaultConfig = {
    autoSave: true,
    showProgress: true,
    milestone: false,
    customMessage: null
  };

  const finalConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (finalConfig.autoSave) {
      handleSaveProgress();
    }
  }, [finalConfig.autoSave]);

  const handleSaveProgress = async () => {
    setIsSaving(true);
    setIsActivated(true);

    try {
      // Simulate save operation (replace with actual save logic)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage as fallback
      const progressData = {
        checkpoint: content.id || Date.now(),
        timestamp: new Date().toISOString(),
        lessonId: content.lessonId,
        completed: true
      };
      
      localStorage.setItem('lastCheckpoint', JSON.stringify(progressData));
      
      setSaveStatus('success');
      onComplete({ 
        type: 'progress_checkpoint', 
        saved: true, 
        checkpointId: content.id,
        timestamp: Date.now() 
      });
      
    } catch (error) {
      console.error('Failed to save progress:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = () => {
    if (!isSaving) {
      handleSaveProgress();
    }
  };

  const getStatusIcon = () => {
    if (isSaving) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"
        />
      );
    }
    
    if (saveStatus === 'success') {
      return (
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (saveStatus === 'error') {
      return (
        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  };

  const getStatusMessage = () => {
    if (isSaving) return "Saving progress...";
    if (saveStatus === 'success') return "Progress saved successfully!";
    if (saveStatus === 'error') return "Failed to save progress. Please try again.";
    return finalConfig.customMessage || "Progress checkpoint reached";
  };

  const getStatusColor = () => {
    if (isSaving) return "text-blue-300 border-blue-400";
    if (saveStatus === 'success') return "text-green-300 border-green-400";
    if (saveStatus === 'error') return "text-red-300 border-red-400";
    return "text-gray-300 border-gray-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`progress-checkpoint ${className}`}
    >
      {/* Milestone checkpoint */}
      {finalConfig.milestone ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl border border-purple-400/30"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          
          <h3 className="text-2xl font-bold text-white mb-2">
            {content.title || 'Milestone Reached!'}
          </h3>
          
          <p className="text-purple-200 mb-6">
            {content.description || 'Great job! You\'ve reached an important milestone in your learning journey.'}
          </p>
          
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusMessage()}</span>
          </div>
        </motion.div>
      ) : (
        /* Regular checkpoint */
        <div className={`flex items-center space-x-4 p-4 rounded-lg border ${getStatusColor()} bg-gray-800/50`}>
          <div className="flex-shrink-0">
            {getStatusIcon()}
          </div>
          
          <div className="flex-1">
            <p className="font-medium">{getStatusMessage()}</p>
            {content.description && (
              <p className="text-sm text-gray-400 mt-1">{content.description}</p>
            )}
          </div>
          
          {!finalConfig.autoSave && (
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded-md transition-colors disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Progress'}
            </button>
          )}
        </div>
      )}

      {/* Progress indicator */}
      {finalConfig.showProgress && content.progress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <span>Progress:</span>
            <div className="flex items-center space-x-1">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${content.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>
              <span className="font-medium">{content.progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressCheckpoint; 