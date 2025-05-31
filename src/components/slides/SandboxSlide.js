import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SandboxSlide = ({ slide, onComplete, onNext, isActive }) => {
  const { title, instruction, scenario, suggestedPrompt, successCriteria } = slide.content;
  const [showInstructions, setShowInstructions] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleStartPractice = () => {
    setShowInstructions(false);
    setUserInput(suggestedPrompt); // Pre-fill with suggested prompt
  };

  const handleSubmit = () => {
    if (userInput.trim().length > 10) { // Basic validation
      setIsComplete(true);
      setTimeout(() => {
        onComplete(slide.id, {
          userPrompt: userInput,
          completed: true
        });
      }, 2000);
    }
  };

  if (showInstructions) {
    return (
      <div className="text-center space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {title}
          </h2>
        </motion.div>

        {/* Instruction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-blue-900/30 rounded-2xl p-6 border border-blue-500/30 text-left"
        >
          <h3 className="text-blue-200 font-semibold mb-3">🎯 Your Challenge:</h3>
          <p className="text-blue-100 leading-relaxed mb-4">{instruction}</p>
          {scenario && (
            <div className="bg-blue-800/30 rounded-xl p-4 border border-blue-400/30">
              <p className="text-blue-100 text-sm leading-relaxed italic">
                "{scenario}"
              </p>
            </div>
          )}
        </motion.div>

        {/* Suggested Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-green-900/20 rounded-2xl p-4 border border-green-500/30 text-left"
        >
          <h4 className="text-green-200 font-semibold mb-2 text-sm">💡 Suggested Prompt:</h4>
          <p className="text-green-100 text-sm font-mono leading-relaxed">
            "{suggestedPrompt}"
          </p>
        </motion.div>

        {/* Success Criteria */}
        {successCriteria && successCriteria.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-purple-900/20 rounded-2xl p-4 border border-purple-500/30 text-left"
          >
            <h4 className="text-purple-200 font-semibold mb-3 text-sm">✅ What makes a good response:</h4>
            <ul className="space-y-2">
              {successCriteria.map((criteria, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-purple-100 text-sm">{criteria}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Start Button */}
        <motion.button
          onClick={handleStartPractice}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all duration-300"
        >
          🔥 Start Practicing!
        </motion.button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Excellent Work!</h2>
          <p className="text-xl text-green-200">You've completed the hands-on practice!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">⚡</div>
        <h2 className="text-xl font-bold text-white">Practice Time!</h2>
        <p className="text-sm text-gray-300">Try the prompt below or modify it</p>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full h-32 p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
        />
        
        <motion.button
          onClick={handleSubmit}
          disabled={userInput.trim().length < 10}
          whileHover={{ scale: userInput.trim().length >= 10 ? 1.02 : 1 }}
          whileTap={{ scale: userInput.trim().length >= 10 ? 0.98 : 1 }}
          className={`
            w-full py-3 rounded-xl font-semibold transition-all duration-300
            ${userInput.trim().length >= 10
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {userInput.trim().length >= 10 ? '✨ Submit Your Prompt' : 'Write at least 10 characters...'}
        </motion.button>
      </div>

      {/* Note */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          In a real lesson, this would connect to ChatGPT for actual practice!
        </p>
      </div>
    </div>
  );
};

export default SandboxSlide; 