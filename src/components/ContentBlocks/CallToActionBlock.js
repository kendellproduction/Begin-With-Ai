import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CallToActionBlock = ({ 
  content,
  config = {},
  onComplete = () => {},
  className = ""
}) => {
  const navigate = useNavigate();

  const defaultConfig = {
    style: 'primary',
    fullWidth: true,
    animate: true
  };

  const finalConfig = { ...defaultConfig, ...config };

  const handlePrimaryAction = () => {
    switch (content.action) {
      case 'next':
        // Navigate to next lesson (would need logic to determine next lesson)
        navigate('/lessons');
        break;
      case 'external':
        if (content.url) {
          window.open(content.url, '_blank');
        }
        break;
      case 'modal':
        // Could trigger a modal (not implemented yet)
        console.log('Modal action triggered');
        break;
      case 'submit':
        // Could submit a form
        console.log('Submit action triggered');
        break;
      default:
        navigate('/lessons');
    }
    
    onComplete({ 
      type: 'call_to_action', 
      action: content.action,
      timestamp: Date.now() 
    });
  };

  const handleSecondaryAction = () => {
    switch (content.secondaryAction) {
      case 'lessons':
        navigate('/lessons');
        break;
      case 'home':
        navigate('/');
        break;
      case 'back':
        navigate(-1);
        break;
      default:
        navigate('/lessons');
    }
  };

  const getButtonStyles = (isPrimary = true) => {
    const baseStyles = "font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4";
    
    if (finalConfig.style === 'primary') {
      return isPrimary 
        ? `${baseStyles} bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg focus:ring-blue-500/50`
        : `${baseStyles} bg-white/10 hover:bg-white/20 text-white border border-white/20 focus:ring-white/30`;
    } else if (finalConfig.style === 'success') {
      return isPrimary
        ? `${baseStyles} bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg focus:ring-green-500/50`
        : `${baseStyles} bg-white/10 hover:bg-white/20 text-white border border-white/20 focus:ring-white/30`;
    } else {
      return isPrimary
        ? `${baseStyles} bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white shadow-lg focus:ring-gray-500/50`
        : `${baseStyles} bg-white/10 hover:bg-white/20 text-white border border-white/20 focus:ring-white/30`;
    }
  };

  const MotionWrapper = finalConfig.animate ? motion.div : 'div';
  const motionProps = finalConfig.animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  } : {};

  return (
    <MotionWrapper
      {...motionProps}
      className={`call-to-action-block ${className}`}
    >
      <div className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30">
        {/* Icon or Visual Element */}
        {content.icon && (
          <div className="text-center mb-4">
            <span className="text-4xl">{content.icon}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-2xl font-bold text-white text-center mb-4">
          {content.title || "What's Next?"}
        </h3>

        {/* Description */}
        {content.description && (
          <p className="text-gray-300 text-center mb-8 leading-relaxed">
            {content.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary Button */}
          <button
            onClick={handlePrimaryAction}
            className={`w-full py-4 px-6 text-lg ${getButtonStyles(true)}`}
          >
            {content.buttonText || "Continue"}
          </button>

          {/* Secondary Button */}
          {content.secondaryButtonText && (
            <button
              onClick={handleSecondaryAction}
              className={`w-full py-3 px-6 ${getButtonStyles(false)}`}
            >
              {content.secondaryButtonText}
            </button>
          )}
        </div>

        {/* Additional Info */}
        {content.additionalInfo && (
          <div className="mt-6 pt-6 border-t border-gray-600/30">
            <p className="text-sm text-gray-400 text-center">
              {content.additionalInfo}
            </p>
          </div>
        )}
      </div>
    </MotionWrapper>
  );
};

export default CallToActionBlock; 