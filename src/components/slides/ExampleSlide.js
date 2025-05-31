import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ExampleSlide = ({ slide, onNext, isActive }) => {
  const { title, prompt, response, explanation } = slide.content;
  const [showResponse, setShowResponse] = useState(false);

  const handleShowExample = () => {
    setShowResponse(true);
    // User controls advancement - no auto-advance timer
  };

  return (
    <div className="text-center space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-5xl mb-4">💡</div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {title}
        </h2>
      </motion.div>

      {/* Prompt Example */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-blue-900/30 rounded-2xl p-6 border border-blue-500/30 text-left"
      >
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span className="text-blue-200 font-semibold text-sm">Prompt</span>
        </div>
        <p className="text-blue-100 font-mono text-sm leading-relaxed">
          "{prompt}"
        </p>
      </motion.div>

      {!showResponse ? (
        /* Show Example Button */
        <motion.button
          onClick={handleShowExample}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all duration-300"
        >
          ✨ See the Result!
        </motion.button>
      ) : (
        <>
          {/* Response */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-green-900/30 rounded-2xl p-6 border border-green-500/30 text-left"
          >
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-green-200 font-semibold text-sm">ChatGPT Response</span>
            </div>
            <div className="text-green-100 text-sm leading-relaxed whitespace-pre-line">
              {response}
            </div>
          </motion.div>

          {/* Explanation */}
          {explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-purple-900/20 rounded-2xl p-4 border border-purple-500/30"
            >
              <div className="flex items-start space-x-3">
                <div className="text-xl">🎯</div>
                <div className="flex-1 text-left">
                  <h4 className="text-purple-200 font-semibold mb-2">Why this works:</h4>
                  <p className="text-purple-100 text-sm leading-relaxed">
                    {explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Continue Button */}
          <motion.button
            onClick={onNext}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all duration-300"
          >
            Continue →
          </motion.button>
        </>
      )}

      {/* Hint */}
      {!showResponse && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            opacity: { duration: 2, repeat: Infinity },
            initial: { duration: 0.5, delay: 0.8 }
          }}
          className="text-gray-500 text-sm"
        >
          Tap to see the AI response
        </motion.p>
      )}
    </div>
  );
};

export default ExampleSlide; 