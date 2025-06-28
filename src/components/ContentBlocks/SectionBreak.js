import React from 'react';
import { motion } from 'framer-motion';

const SectionBreak = ({ 
  content,
  config = {},
  className = ""
}) => {
  const defaultConfig = {
    style: 'line', // 'line', 'dots', 'wave', 'gradient', 'text'
    animation: 'fade', // 'fade', 'slide', 'grow', 'pulse'
    thickness: 2,
    color: 'rgba(156, 163, 175, 0.3)',
    spacing: 'large' // 'small', 'medium', 'large'
  };

  const finalConfig = { ...defaultConfig, ...config };

  const spacingMap = {
    small: 'my-6',
    medium: 'my-12',
    large: 'my-20'
  };

  const getAnimationProps = () => {
    switch (finalConfig.animation) {
      case 'slide':
        return {
          initial: { scaleX: 0 },
          animate: { scaleX: 1 },
          transition: { duration: 1, ease: "easeOut" }
        };
      case 'grow':
        return {
          initial: { scale: 0 },
          animate: { scale: 1 },
          transition: { duration: 0.8, ease: "easeOut" }
        };
      case 'pulse':
        return {
          initial: { opacity: 0 },
          animate: { opacity: [0, 1, 0.7, 1] },
          transition: { duration: 1.5, ease: "easeInOut" }
        };
      default: // fade
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.8 }
        };
    }
  };

  const renderBreak = () => {
    switch (finalConfig.style) {
      case 'dots':
        return (
          <div className="flex items-center justify-center space-x-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: finalConfig.color }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            ))}
          </div>
        );

      case 'wave':
        return (
          <div className="flex items-center justify-center">
            <svg 
              width="200" 
              height="20" 
              viewBox="0 0 200 20"
              className="opacity-30"
            >
              <motion.path
                d="M0,10 Q50,2 100,10 T200,10"
                stroke={finalConfig.color.replace(/rgba?\([^)]+\)/, '#9CA3AF')}
                strokeWidth={finalConfig.thickness}
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </div>
        );

      case 'gradient':
        return (
          <div 
            className="h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${finalConfig.color}, transparent)`,
              height: `${finalConfig.thickness}px`
            }}
          />
        );

      case 'text':
        return (
          <div className="flex items-center justify-center space-x-4">
            <div 
              className="flex-1 h-px"
              style={{ backgroundColor: finalConfig.color }}
            />
            <span className="text-gray-400 text-sm font-medium px-4">
              {content.text || '• • •'}
            </span>
            <div 
              className="flex-1 h-px"
              style={{ backgroundColor: finalConfig.color }}
            />
          </div>
        );

      default: // line
        return (
          <div 
            className="w-full"
            style={{
              height: `${finalConfig.thickness}px`,
              backgroundColor: finalConfig.color
            }}
          />
        );
    }
  };

  return (
    <motion.div
      {...getAnimationProps()}
      className={`section-break ${spacingMap[finalConfig.spacing]} ${className}`}
    >
      <div className="max-w-md mx-auto">
        {renderBreak()}
      </div>
      
      {/* Optional section label */}
      {content.label && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-4"
        >
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            {content.label}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SectionBreak; 