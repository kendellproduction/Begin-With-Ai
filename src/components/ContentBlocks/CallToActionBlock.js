import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CallToActionBlock = ({ 
  content,
  config = {},
  onComplete = () => {},
  className = ""
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const defaultConfig = {
    style: 'primary', // 'primary', 'secondary', 'gradient', 'outline'
    size: 'large', // 'small', 'medium', 'large'
    animation: 'bounce', // 'bounce', 'pulse', 'glow'
    showIcon: true,
    trackClick: true
  };

  const finalConfig = { ...defaultConfig, ...config };

  const handleClick = () => {
    setIsClicked(true);
    
    if (finalConfig.trackClick) {
      onComplete({ 
        type: 'call_to_action', 
        clicked: true, 
        action: content.action,
        timestamp: Date.now() 
      });
    }

    // Handle different action types
    switch (content.action) {
      case 'navigate':
        if (content.path) {
          navigate(content.path, { state: content.state });
        }
        break;
      case 'external_link':
        if (content.url) {
          window.open(content.url, '_blank', 'noopener,noreferrer');
        }
        break;
      case 'scroll_to':
        if (content.targetId) {
          document.getElementById(content.targetId)?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }
        break;
      case 'custom':
        if (content.callback && typeof content.callback === 'function') {
          content.callback();
        }
        break;
      default:
        console.log('CTA clicked:', content.title);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95";
    
    const sizeStyles = {
      small: "px-4 py-2 text-sm",
      medium: "px-6 py-3 text-base",
      large: "px-8 py-4 text-lg"
    };

    const styleVariants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-lg shadow-gray-500/30",
      gradient: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30",
      outline: "border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
    };

    return `${baseStyles} ${sizeStyles[finalConfig.size]} ${styleVariants[finalConfig.style]}`;
  };

  const getAnimationProps = () => {
    switch (finalConfig.animation) {
      case 'bounce':
        return {
          animate: { y: [0, -5, 0] },
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'pulse':
        return {
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'glow':
        return {
          animate: { 
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 30px rgba(59, 130, 246, 0.6)",
              "0 0 20px rgba(59, 130, 246, 0.3)"
            ]
          },
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      default:
        return {};
    }
  };

  const getIcon = () => {
    if (!finalConfig.showIcon) return null;

    const iconMap = {
      navigate: "→",
      external_link: "↗",
      scroll_to: "↓",
      download: "⬇",
      play: "▶",
      custom: "✨"
    };

    return iconMap[content.action] || "→";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`call-to-action-block text-center ${className}`}
    >
      {/* Header content */}
      {content.title && (
        <h3 className="text-2xl font-bold text-white mb-3">
          {content.title}
        </h3>
      )}
      
      {content.description && (
        <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
          {content.description}
        </p>
      )}

      {/* Main CTA Button */}
      <motion.button
        onClick={handleClick}
        className={getButtonStyles()}
        {...getAnimationProps()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>{content.buttonText || 'Continue'}</span>
        {getIcon() && (
          <span className="text-xl">{getIcon()}</span>
        )}
      </motion.button>

      {/* Secondary actions */}
      {content.secondaryActions && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {content.secondaryActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                // Handle secondary action
                if (action.action === 'navigate' && action.path) {
                  navigate(action.path);
                }
              }}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
            >
              {action.text}
            </button>
          ))}
        </div>
      )}

      {/* Additional info */}
      {content.hint && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-sm text-gray-400 italic"
        >
          {content.hint}
        </motion.p>
      )}

      {/* Success feedback */}
      {isClicked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-full"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Action completed!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CallToActionBlock; 