import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const PodcastPlayer = ({ 
  audioUrl = null, 
  title = "AI History Podcast",
  description = "Listen to the fascinating story of artificial intelligence",
  onTimeUpdate = null,
  chapters = []
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

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

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate, chapters, currentChapter]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
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

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const jumpToChapter = (chapterIndex) => {
    const audio = audioRef.current;
    if (!audio || !chapters[chapterIndex]) return;

    audio.currentTime = chapters[chapterIndex].time;
    setCurrentTime(chapters[chapterIndex].time);
    setCurrentChapter(chapterIndex);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
        {chapters.length > 0 && currentChapter < chapters.length && (
          <p className="text-purple-400 text-sm mt-2">
            Chapter {currentChapter + 1}: {chapters[currentChapter]?.title}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          className="w-full h-2 bg-gray-700 rounded-full cursor-pointer relative group"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progressPercentage}%`, marginLeft: '-8px' }}
          />
        </div>
        <div className="flex justify-between text-gray-400 text-sm mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        {/* Skip Backward */}
        <button
          onClick={() => skipTime(-15)}
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="Skip back 15s"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8z"/>
            <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">15</text>
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          disabled={!audioUrl}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-full p-4 transition-colors shadow-lg"
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Skip Forward */}
        <button
          onClick={() => skipTime(30)}
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="Skip forward 30s"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
            <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">30</text>
          </svg>
        </button>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center justify-between">
        {/* Volume Control */}
        <div className="flex items-center space-x-2 relative">
          <button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          {showVolumeSlider && (
            <div className="absolute bottom-full mb-2 left-0">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Speed Control */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="text-gray-400 hover:text-white transition-colors px-3 py-1 border border-gray-600 rounded text-sm"
          >
            {playbackRate}x
          </button>
          {showSpeedMenu && (
            <div className="absolute bottom-full mb-2 right-0 bg-gray-800 border border-gray-600 rounded-lg p-2 min-w-[80px]">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`block w-full text-left px-2 py-1 text-sm transition-colors rounded ${
                    speed === playbackRate 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chapters */}
      {chapters.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-white font-medium mb-3">Chapters</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => jumpToChapter(index)}
                className={`w-full text-left p-2 rounded transition-colors ${
                  index === currentChapter
                    ? 'bg-purple-600/30 text-purple-200'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{chapter.title}</span>
                  <span className="text-sm">{formatTime(chapter.time)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area (when no audio) */}
      {!audioUrl && (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 8v8m6-8v8" />
          </svg>
          <p className="text-gray-400 mb-2">No podcast audio loaded</p>
          <p className="text-gray-500 text-sm">Upload an MP4 audio file to get started</p>
        </div>
      )}
    </div>
  );
};

export default PodcastPlayer; 