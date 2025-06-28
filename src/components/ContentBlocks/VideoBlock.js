import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const VideoBlock = ({ 
  content,
  config = {},
  onComplete = () => {},
  className = ""
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const blockRef = useRef(null);

  const defaultConfig = {
    lazy: true,
    autoplay: false,
    controls: true,
    responsive: true,
    preload: 'metadata',
    trackProgress: true,
    completionThreshold: 0.8 // 80% watched = completed
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Intersection observer for lazy loading
  useEffect(() => {
    if (!finalConfig.lazy || !blockRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, [finalConfig.lazy]);

  // Auto-load for non-lazy videos
  useEffect(() => {
    if (!finalConfig.lazy) {
      setIsVisible(true);
    }
  }, [finalConfig.lazy]);

  const handleVideoLoad = () => {
    setIsLoaded(true);
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);

      // Check for completion
      if (finalConfig.trackProgress && duration > 0) {
        const watchedPercentage = current / duration;
        if (watchedPercentage >= finalConfig.completionThreshold) {
          onComplete({ 
            type: 'video', 
            completed: true, 
            watchedPercentage,
            totalDuration: duration,
            timestamp: Date.now() 
          });
        }
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onComplete({ 
      type: 'video', 
      completed: true, 
      watchedPercentage: 1,
      totalDuration: duration,
      timestamp: Date.now() 
    });
  };

  const getVideoSource = () => {
    if (content.embedUrl) {
      // Handle YouTube, Vimeo, etc.
      return content.embedUrl;
    }
    return content.src || content.url;
  };

  const isEmbedded = content.embedUrl && 
    (content.embedUrl.includes('youtube') || content.embedUrl.includes('vimeo'));

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`video-block ${className}`}
    >
      {/* Video container */}
      <div className="relative rounded-lg overflow-hidden bg-gray-900">
        {!isVisible && finalConfig.lazy ? (
          /* Lazy loading placeholder */
          <div className="aspect-video flex items-center justify-center bg-gray-800">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
              </svg>
              <p>Video will load when visible</p>
            </div>
          </div>
        ) : isEmbedded ? (
          /* Embedded video (YouTube, Vimeo) */
          <div className="aspect-video">
            <iframe
              src={getVideoSource()}
              title={content.title || "Video"}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoLoad}
            />
          </div>
        ) : (
          /* Native HTML5 video */
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-auto"
              controls={finalConfig.controls}
              autoPlay={finalConfig.autoplay}
              preload={finalConfig.preload}
              onLoadedMetadata={handleVideoLoad}
              onPlay={handlePlay}
              onPause={handlePause}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
              poster={content.poster}
            >
              <source src={getVideoSource()} type="video/mp4" />
              <p className="text-gray-400 p-4">
                Your browser doesn't support HTML5 video. 
                <a href={getVideoSource()} className="text-blue-400 hover:text-blue-300 underline ml-1">
                  Download the video
                </a>
              </p>
            </video>

            {/* Custom progress indicator for native videos */}
            {!finalConfig.controls && isLoaded && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <div className="flex items-center space-x-2 text-white text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex-1 h-1 bg-gray-600 rounded overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-200"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading indicator */}
        {isVisible && !isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Play button overlay for autoplay disabled */}
        {isLoaded && !isPlaying && !hasStarted && !finalConfig.autoplay && !isEmbedded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <motion.button
              onClick={() => videoRef.current?.play()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </motion.button>
          </div>
        )}
      </div>

      {/* Video metadata */}
      <div className="mt-4">
        {content.title && (
          <h3 className="text-lg font-semibold text-white mb-2">
            {content.title}
          </h3>
        )}
        
        {content.description && (
          <p className="text-gray-300 text-sm leading-relaxed">
            {content.description}
          </p>
        )}

        {/* Video stats */}
        {isLoaded && !isEmbedded && (
          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
            {duration > 0 && (
              <span>Duration: {formatTime(duration)}</span>
            )}
            {hasStarted && (
              <span>
                Progress: {duration > 0 ? Math.round((currentTime / duration) * 100) : 0}%
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoBlock; 