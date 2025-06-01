import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DifficultySelectionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  lesson = null,
  defaultDifficulty = 'Beginner' 
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(defaultDifficulty);

  const difficulties = [
    {
      id: 'Beginner',
      title: 'Beginner',
      icon: '🌱',
      description: 'Perfect for AI newcomers',
      duration: '15-20 min',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-400/20 to-emerald-500/20',
      borderColor: 'border-green-400/50'
    },
    {
      id: 'Intermediate',
      title: 'Intermediate',
      icon: '🎯',
      description: 'Ideal for expanding knowledge',
      duration: '20-30 min',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-400/20 to-cyan-500/20',
      borderColor: 'border-blue-400/50'
    },
    {
      id: 'Advanced',
      title: 'Advanced',
      icon: '🚀',
      description: 'For experienced practitioners',
      duration: '30-45 min',
      color: 'from-orange-400 to-amber-500',
      bgColor: 'from-orange-400/20 to-amber-500/20',
      borderColor: 'border-orange-400/50'
    }
  ];

  const handleConfirm = () => {
    onConfirm(selectedDifficulty);
  };

  const selectedDifficultyData = difficulties.find(d => d.id === selectedDifficulty);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-[100] p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut'}}
          className="bg-gradient-to-br from-slate-800/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl w-full max-w-lg border border-blue-400/30 text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">{lesson?.icon || '🤖'}</div>
              <h3 className="text-xl font-bold text-white mb-1">Choose Difficulty</h3>
              <p className="text-blue-200 text-sm truncate font-medium">
                {lesson?.title || 'AI Lesson'}
              </p>
            </div>

            {/* Difficulty Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {difficulties.map(difficulty => (
                <button 
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`text-center px-3 py-3 rounded-lg transition-all duration-200 font-semibold relative overflow-hidden border-2 group
                              ${selectedDifficulty === difficulty.id 
                                ? `bg-gradient-to-br ${difficulty.bgColor} ${difficulty.borderColor} scale-105 shadow-lg`
                                : 'bg-slate-700/50 border-slate-600 hover:bg-slate-600/70 hover:border-slate-500'}`}
                >
                  <div className="relative z-10">
                    <div className="text-xl mb-1">{difficulty.icon}</div>
                    <div className="text-sm font-bold mb-1">{difficulty.title}</div>
                    <div className="text-xs text-slate-300">{difficulty.duration}</div>
                  </div>
                  
                  {selectedDifficulty === difficulty.id && (
                    <motion.div 
                      layoutId="selectedDifficultyBg"
                      className={`absolute inset-0 bg-gradient-to-br ${difficulty.color} opacity-20 z-0`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Selected Difficulty Preview */}
            {selectedDifficultyData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${selectedDifficultyData.bgColor} rounded-xl p-3 mb-4 border ${selectedDifficultyData.borderColor}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{selectedDifficultyData.icon}</div>
                  <div className="text-sm font-bold mb-1">{selectedDifficultyData.title} Level</div>
                  <div className="text-xs text-slate-300 mb-2">
                    {selectedDifficultyData.description}
                  </div>
                  <div className="text-xs text-slate-400">
                    ⏱️ {selectedDifficultyData.duration}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                onClick={handleConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                🚀 Start Lesson
              </motion.button>
              
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3 bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DifficultySelectionModal; 