import React from 'react';
import { motion } from 'framer-motion';

const IntroSlide = ({ slide, onNext, isActive }) => {
  const { title, subtitle, icon, description } = slide.content;

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

      {/* Continue Button */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
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
        transition={{ duration: 0.5, delay: 1.2 }}
        className="text-gray-500 text-sm space-y-2"
      >
        <p>Swipe up or tap to continue</p>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl"
        >
          ⬆️
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IntroSlide; 