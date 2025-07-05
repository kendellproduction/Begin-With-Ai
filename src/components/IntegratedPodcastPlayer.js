import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntegratedPodcastPlayer = ({ 
  audioUrl = null, 
  title = "AI History Podcast",
  onTimeUpdate = null,
  chapters = [],
  className = ""
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(audio.currentTime);
      }
      
      // Update current chapter based on time
      if (chapters.length > 0) {
        const chapterIndex = chapters.findIndex((chapter, index) => {
          const nextChapter = chapters[index + 1];
          return audio.currentTime >= chapter.time && (!nextChapter || audio.currentTime < nextChapter.time);
        });
        if (chapterIndex !== -1 && chapterIndex !== currentChapter) {
          setCurrentChapter(chapterIndex);
        }
      }
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e) => {
      console.error('Audio loading error:', e);
      setHasError(true);
      setErrorMessage('Audio file could not be loaded. Please try a different browser or check your internet connection.');
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onTimeUpdate, chapters, currentChapter]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => {
        console.error('Audio play failed:', e);
        setHasError(true);
        setErrorMessage('Audio playback failed. The file may not be compatible with your browser.');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const retryAudio = () => {
    setHasError(false);
    setErrorMessage('');
    const audio = audioRef.current;
    if (audio) {
      audio.load(); // Reload the audio element
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clickX = e.nativeEvent.offsetX;
    const width = e.target.offsetWidth;
    const newTime = (clickX / width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!audioUrl) {
    return (
      <div className={`relative z-30 bg-amber-500/10 border border-amber-500/20 rounded-lg p-6 mx-2 sm:mx-0 mb-16 ${className}`}
           style={{
             boxShadow: `
               0 0 20px rgba(245, 158, 11, 0.4),
               0 0 40px rgba(245, 158, 11, 0.2),
               0 0 60px rgba(245, 158, 11, 0.1),
               0 10px 30px rgba(0, 0, 0, 0.3)
             `
           }}>
        <div className="flex items-start space-x-4 text-amber-600">
          <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-sm flex-1">
            <div className="font-medium mb-2 text-lg">🎙️ Optional Audio Enhancement</div>
            <p className="text-amber-600/80 leading-relaxed mb-3">
              ✨ This lesson includes an optional audio companion to enhance your learning experience. You can read the content with or without the audio - it's completely up to you!
            </p>
            <p className="text-amber-500/60 text-sm">
              Audio content: <span className="font-mono font-medium">{title}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative z-30 bg-gray-800/40 backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden mx-2 sm:mx-0 mb-16 ${className}`}
         style={{
           boxShadow: `
             0 0 20px rgba(147, 51, 234, 0.4),
             0 0 40px rgba(147, 51, 234, 0.2),
             0 0 60px rgba(147, 51, 234, 0.1),
             0 10px 30px rgba(0, 0, 0, 0.3)
           `
         }}>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />

      {/* Compact Header */}
      <div className="p-4 sm:p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlayPause}
                disabled={!audioUrl}
                className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-full p-2 transition-all shadow-sm hover:shadow-purple-500/50"
                style={{
                  boxShadow: isPlaying 
                    ? '0 0 15px rgba(147, 51, 234, 0.6), 0 0 30px rgba(147, 51, 234, 0.4)' 
                    : '0 0 8px rgba(147, 51, 234, 0.3)'
                }}
              >
                {isPlaying ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-white truncate">🎙️ {title}</h4>
                <p className="text-xs text-purple-300 truncate">
                  ✨ Optional: Listen while reading • AI History Podcast
                </p>
                {chapters.length > 0 && currentChapter < chapters.length && (
                  <p className="text-xs text-purple-400 truncate mt-1">
                    {chapters[currentChapter]?.title}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 text-gray-400 hover:text-white p-1 transition-colors ml-2"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d={isExpanded ? "M5 15l7-7 7 7" : "M7 10l5 5 5-5"}/>
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div 
          className="w-full h-1 bg-gray-700 rounded-full cursor-pointer relative group"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progressPercentage}%`, marginLeft: '-4px' }}
          />
        </div>

        {/* Error Display */}
        {hasError && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-400 text-xs">{errorMessage}</span>
              </div>
              <button
                onClick={retryAudio}
                className="text-red-400 hover:text-red-300 text-xs bg-red-500/20 px-2 py-1 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-700/50"
          >
            <div className="p-3 space-y-3">
              {/* Additional Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => skipTime(-15)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  title="Skip back 15s"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8z"/>
                    <text x="12" y="16" textAnchor="middle" fontSize="6" fill="currentColor">15</text>
                  </svg>
                </button>

                <button
                  onClick={() => skipTime(30)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  title="Skip forward 30s"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                    <text x="12" y="16" textAnchor="middle" fontSize="6" fill="currentColor">30</text>
                  </svg>
                </button>

                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3z"/>
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value);
                      setVolume(newVolume);
                      if (audioRef.current) {
                        audioRef.current.volume = newVolume;
                      }
                    }}
                    className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Chapters */}
              {chapters.length > 0 && (
                <div>
                  <h5 className="text-white text-xs font-medium mb-2">Chapters</h5>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {chapters.map((chapter, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = chapter.time;
                            setCurrentTime(chapter.time);
                            setCurrentChapter(index);
                          }
                        }}
                        className={`w-full text-left p-1.5 rounded text-xs transition-colors ${
                          index === currentChapter
                            ? 'bg-purple-600/30 text-purple-200'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium truncate">{chapter.title}</span>
                          <span className="text-xs ml-2 flex-shrink-0">{formatTime(chapter.time)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegratedPodcastPlayer; 