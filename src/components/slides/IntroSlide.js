import React from 'react';
import { motion } from 'framer-motion';

const IntroSlide = ({ slide, onNext, isActive }) => {
  const { title, subtitle, icon, description, keyPoints, estimatedTime, xpReward } = slide.content;

  return (
    <div className="text-center space-y-8">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.8, 
          type: "spring", 
          stiffness: 100,
          delay: 0.2 
        }}
        className="text-8xl mb-6"
      >
        {icon}
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-2xl md:text-3xl text-blue-100 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-4xl mx-auto font-medium px-4 mb-8"
        >
          {description}
        </motion.p>
      )}

      {/* What to Expect - Key Points */}
      {keyPoints && keyPoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10 max-w-3xl mx-auto"
        >
          <h3 className="text-lg font-semibold text-blue-200 text-center mb-4">What You'll Learn:</h3>
          <div className="space-y-3 text-left">
            {keyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1 + (index * 0.2) }}
                className="flex items-start space-x-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.2 + (index * 0.2) }}
                  className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5"
                >
                  {index + 1}
                </motion.div>
                <span className="text-gray-100 leading-relaxed text-base font-medium">{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Lesson Info - No estimated time or XP shown upfront */}

      {/* Continue Button */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold text-base shadow-lg shadow-blue-500/30 transition-all duration-300"
      >
        Let's Begin! 🚀
      </motion.button>

      {/* Swipe hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="text-gray-500 text-sm space-y-2"
      >
        <p>Tap button to continue</p>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl"
        >
          👆
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IntroSlide; 