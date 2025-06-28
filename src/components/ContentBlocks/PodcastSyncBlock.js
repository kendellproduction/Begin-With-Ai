import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TextBlock from './TextBlock';

const PodcastSyncBlock = ({ 
  content,
  config = {},
  audioCurrentTime = 0,
  isHighlighted = false,
  onComplete = () => {},
  className = ""
}) => {
  const [isActivelyHighlighted, setIsActivelyHighlighted] = useState(false);
  const [hasBeenSynced, setHasBeenSynced] = useState(false);
  const blockRef = useRef(null);

  const defaultConfig = {
    startTime: 0,
    endTime: null,
    highlightColor: 'rgba(59, 130, 246, 0.3)',
    animationDuration: '0.5s',
    audioSync: true,
    visualFeedback: true,
    autoScroll: true
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Check if this block should be highlighted based on audio time
  useEffect(() => {
    if (!finalConfig.audioSync) return;

    const { startTime, endTime } = finalConfig;
    const shouldHighlight = audioCurrentTime >= startTime && 
                           (endTime === null || audioCurrentTime <= endTime);

    if (shouldHighlight !== isActivelyHighlighted) {
      setIsActivelyHighlighted(shouldHighlight);
      
      // Mark as synced when first highlighted
      if (shouldHighlight && !hasBeenSynced) {
        setHasBeenSynced(true);
        onComplete({ 
          type: 'podcast_sync', 
          synced: true, 
          audioTime: audioCurrentTime,
          timestamp: Date.now() 
        });
      }

      // Auto-scroll to highlighted block
      if (shouldHighlight && finalConfig.autoScroll && blockRef.current) {
        blockRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [audioCurrentTime, finalConfig, isActivelyHighlighted, hasBeenSynced, onComplete]);

  // Manual highlight override
  useEffect(() => {
    setIsActivelyHighlighted(isHighlighted);
  }, [isHighlighted]);

  // Convert time to readable format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBlockClick = () => {
    // Emit event to seek audio to this block's start time
    if (finalConfig.audioSync && window.podcastPlayerSeek) {
      window.podcastPlayerSeek(finalConfig.startTime);
    }
  };

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        backgroundColor: isActivelyHighlighted ? finalConfig.highlightColor : 'transparent',
        boxShadow: isActivelyHighlighted ? 
          `0 0 20px ${finalConfig.highlightColor}` : 
          '0 0 0px transparent'
      }}
      transition={{ 
        duration: parseFloat(finalConfig.animationDuration),
        backgroundColor: { duration: 0.3 },
        boxShadow: { duration: 0.3 }
      }}
      className={`podcast-sync-block cursor-pointer ${className}`}
      onClick={handleBlockClick}
      style={{
        borderRadius: '12px',
        padding: isActivelyHighlighted ? '20px' : '16px',
        margin: '16px 0',
        border: isActivelyHighlighted ? 
          `2px solid rgba(59, 130, 246, 0.6)` : 
          '2px solid transparent',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Audio timing indicator */}
      {finalConfig.audioSync && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5 7h4l-2-2v4" />
            </svg>
            <span>
              {formatTime(finalConfig.startTime)}
              {finalConfig.endTime && ` - ${formatTime(finalConfig.endTime)}`}
            </span>
          </div>

          {/* Sync status indicator */}
          <div className="flex items-center space-x-2">
            {isActivelyHighlighted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center space-x-1 text-xs text-blue-300"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Playing</span>
              </motion.div>
            )}
            
            {hasBeenSynced && !isActivelyHighlighted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center space-x-1 text-xs text-green-300"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Synced</span>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <TextBlock
        content={content}
        config={{
          sanitization: true,
          markdown: true,
          animations: false, // Disable TextBlock animations to avoid conflicts
          readingTime: false,
          styles: {
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '0',
            color: isActivelyHighlighted ? '#ffffff' : '#e5e7eb'
          }
        }}
        isVisible={isActivelyHighlighted}
        className="podcast-sync-content"
      />

      {/* Visual highlight effects */}
      {isActivelyHighlighted && finalConfig.visualFeedback && (
        <>
          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `linear-gradient(45deg, 
                rgba(59, 130, 246, 0.1), 
                rgba(59, 130, 246, 0.3), 
                rgba(59, 130, 246, 0.1))`,
              backgroundSize: '200% 200%'
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          {/* Pulse effect */}
          <motion.div
            className="absolute -inset-1 rounded-xl pointer-events-none"
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              filter: 'blur(8px)'
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'ease-in-out'
            }}
          />
        </>
      )}

      {/* Click hint */}
      {!isActivelyHighlighted && finalConfig.audioSync && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-1">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PodcastSyncBlock; 