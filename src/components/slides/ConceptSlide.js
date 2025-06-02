import React from 'react';
import { motion } from 'framer-motion';

const ConceptSlide = ({ slide, onNext, isActive }) => {
  const { title, explanation, icon, keyPoints } = slide.content;

  return (
    <div className="text-center space-y-8">
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="text-6xl mb-4"
      >
        {icon}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-white mb-4"
      >
        {title}
      </motion.h1>

      {/* Explanation */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl md:text-2xl text-gray-100 leading-relaxed font-medium max-w-5xl mx-auto px-4 mb-8 tracking-wide"
      >
        {explanation}
      </motion.p>

      {/* Key Points */}
      {keyPoints && keyPoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-3 text-left bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-blue-200 text-center mb-4">Key Points:</h3>
          {keyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + (index * 0.2) }}
              className="flex items-start space-x-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1 + (index * 0.2) }}
                className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"
              />
              <span className="text-gray-100 leading-relaxed text-base font-medium">{point}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-semibold text-base shadow-lg transition-all duration-300"
      >
        Got it! Continue →
      </motion.button>

      {/* Progress hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="text-gray-500 text-sm"
      >
        Swipe up when ready
      </motion.p>
    </div>
  );
};

export default ConceptSlide; 