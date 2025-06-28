import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const PodcastPlayer = ({ 
  audioUrl, 
  title = "AI Learning Podcast", 
  instructor = "BeginningWithAI",
  onTimeUpdate = null,
  currentChapter = null,
  chapters = [],
  isSticky = true,
  className = ""
}) => {
  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  // Load audio when URL changes
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);

  // Audio event handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      if (onTimeUpdate) {
        onTimeUpdate(current, duration);
      }
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressDrag = (e) => {
    if (!isDragging || !audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const dragX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min((dragX / rect.width) * duration, duration));
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkip = (seconds) => {
    if (!audioRef.current) return;
    
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    if (!audioRef.current || !volumeRef.current) return;

    const rect = volumeRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(clickX / rect.width, 1));
    
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleSpeedChange = (rate) => {
    if (!audioRef.current) return;
    
    setPlaybackRate(rate);
    audioRef.current.playbackRate = rate;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentChapter = () => {
    if (!chapters.length) return null;
    
    return chapters.find(chapter => 
      currentTime >= chapter.startTime && 
      currentTime < (chapter.endTime || duration)
    ) || chapters[0];
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (!audioUrl) {
    return null;
  }

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Podcast Player */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          ${isSticky ? 'fixed bottom-0 left-0 right-0 z-50' : 'relative'}
          bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 
          backdrop-blur-xl border-t border-white/10 shadow-2xl
          ${className}
        `}
      >
        {/* Compact Player */}
        <div className="px-4 py-3">
          <div className="flex items-center space-x-4">
            {/* Album Art / Avatar */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-xl">🎧</span>
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-medium truncate text-sm">
                    {getCurrentChapter()?.title || title}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">
                    {instructor} • {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-2 p-2 text-gray-400 hover:text-white transition-colors touch-manipulation"
                >
                  {isExpanded ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                </button>
              </div>

              {/* Progress Bar (Compact) */}
              {!isExpanded && (
                <div
                  ref={progressRef}
                  className="mt-2 h-1 bg-gray-700 rounded-full cursor-pointer touch-manipulation"
                  onClick={handleSeek}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseMove={handleProgressDrag}
                >
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-200"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              )}
            </div>

            {/* Compact Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSkip(-15)}
                className="p-2 text-gray-400 hover:text-white transition-colors touch-manipulation"
              >
                <FiSkipBack size={20} />
              </button>

              <button
                onClick={handlePlayPause}
                disabled={isLoading}
                className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform disabled:opacity-50 touch-manipulation"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <FiPause size={20} />
                ) : (
                  <FiPlay size={20} className="ml-0.5" />
                )}
              </button>

              <button
                onClick={() => handleSkip(15)}
                className="p-2 text-gray-400 hover:text-white transition-colors touch-manipulation"
              >
                <FiSkipForward size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Player */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/10 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-4">
                {/* Large Progress Bar */}
                <div className="space-y-2">
                  <div
                    ref={progressRef}
                    className="h-2 bg-gray-700 rounded-full cursor-pointer touch-manipulation"
                    onClick={handleSeek}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseMove={handleProgressDrag}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-200 relative"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Advanced Controls */}
                <div className="flex items-center justify-between">
                  {/* Speed Control */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Speed:</span>
                    <div className="flex space-x-1">
                      {speedOptions.map(speed => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`px-2 py-1 text-xs rounded transition-colors touch-manipulation ${
                            playbackRate === speed
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <FiVolume2 className="text-gray-400" size={16} />
                    <div
                      ref={volumeRef}
                      className="w-20 h-1 bg-gray-700 rounded-full cursor-pointer touch-manipulation"
                      onClick={handleVolumeChange}
                    >
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chapter Navigation */}
                {chapters.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">Chapters</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {chapters.map((chapter, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (audioRef.current) {
                              audioRef.current.currentTime = chapter.startTime;
                              setCurrentTime(chapter.startTime);
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors touch-manipulation ${
                            getCurrentChapter()?.title === chapter.title
                              ? 'bg-indigo-600/30 text-indigo-300'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="truncate">{chapter.title}</span>
                            <span className="ml-2 text-xs opacity-75">
                              {formatTime(chapter.startTime)}
                            </span>
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
      </motion.div>
    </>
  );
};

export default PodcastPlayer; 