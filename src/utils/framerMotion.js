// Centralized framer-motion configuration for optimal performance
import { LazyMotion, domAnimation, m } from 'framer-motion';

// Export LazyMotion wrapper for optimal performance
export const MotionProvider = ({ children }) => (
  <LazyMotion features={domAnimation}>
    {children}
  </LazyMotion>
);

// Export optimized motion component
export const motion = m;

// Re-export necessary components for backwards compatibility
export { AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';

// Common animation presets for consistent performance
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 }
  },
  
  slideInFromLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },
  
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

// Performance-optimized spring configurations
export const springs = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  snappy: { type: "spring", stiffness: 300, damping: 30 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 }
}; 