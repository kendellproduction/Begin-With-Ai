import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProgressTracking } from '../hooks/useProgressTracking';
import { useGamification } from '../contexts/GamificationContext';
import ContentBlockRenderer from './ContentBlocks/ContentBlockRenderer';
import { BLOCK_TYPES } from './ContentBlocks/constants';
import { initAudio, playSuccessChime, playErrorSound } from '../utils/audioUtils';
import logger from '../utils/logger';

const SynchronizedLessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completeLesson, awardXP } = useProgressTracking();
  const { showNotification } = useGamification();
  
  // Audio/Video refs and state
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseReason, setPauseReason] = useState(null); // 'quiz', 'user', null
  
  // Lesson state
  const [lesson, setLesson] = useState(null);
  const [contentSections, setContentSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set());
  const [sectionProgress, setSectionProgress] = useState(new Map());
  
  // Synchronization timestamps (in seconds) - you can adjust these based on your audio
  const audioTimestamps = {
    section1_start: 0,        // The Wartime Origins and Early Dreams
    section1_quiz: 480,       // 8 minutes - pause for first quiz
    section2_start: 540,      // Internet Era and Machine Learning Revolution
    section2_quiz: 1020,      // 17 minutes - pause for second quiz  
    section3_start: 1080,     // ChatGPT Revolution and What's Next
    section3_end: 1620        // 27 minutes - end of lesson
  };

  // Load lesson data and setup timestamps
  useEffect(() => {
    const loadLessonData = async () => {
      setIsLoading(true);
      try {
        const { historyOfAiLesson } = await import('../utils/historyOfAiLesson');
        setLesson(historyOfAiLesson);
        
        // Convert slides to synchronized sections
        const sections = createSynchronizedSections(historyOfAiLesson.slides);
        setContentSections(sections);
        
        // Initialize audio
        await initAudio();
        
      } catch (error) {
        logger.error('Error loading synchronized lesson:', error);
        showNotification('Error loading lesson. Please try again.', 'error');
      }
      setIsLoading(false);
    };

    if (lessonId === 'history-of-ai' || lessonId === 'welcome-ai-revolution') {
      loadLessonData();
    }
  }, [lessonId, showNotification]);

  // Create synchronized sections from slides
  const createSynchronizedSections = (slides) => {
    const sections = [];
    let currentSection = null;
    let sectionIndex = 0;

    slides.forEach((slide, index) => {
      if (slide.type === 'concept') {
        // Start new content section
        if (currentSection) {
          sections.push(currentSection);
        }
        
        const sectionKey = `section${Math.floor(sectionIndex / 2) + 1}`;
        currentSection = {
          id: `section-${sectionIndex}`,
          type: 'content',
          title: slide.content.title,
          startTime: audioTimestamps[`${sectionKey}_start`] || 0,
          endTime: audioTimestamps[`${sectionKey}_quiz`] || null,
          blocks: [{
            type: BLOCK_TYPES.TEXT,
            content: {
              text: slide.content.explanation
            },
            config: {
              markdown: true,
              audioSync: true,
              startTime: audioTimestamps[`${sectionKey}_start`] || 0,
              endTime: audioTimestamps[`${sectionKey}_quiz`] || null
            },
            id: `content-${index}`
          }],
          isVisible: sectionIndex === 0, // First section visible
          precedingQuizId: sectionIndex > 0 ? `quiz-${sectionIndex - 1}` : null
        };
        sectionIndex++;
        
      } else if (slide.type === 'quiz') {
        // Add current section before quiz
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Create quiz section
        const quizSection = {
          id: `quiz-${sectionIndex}`,
          type: 'quiz',  
          title: 'Check Your Understanding',
          pauseAudio: true, // This section pauses audio
          blocks: [{
            type: BLOCK_TYPES.QUIZ,
            content: {
              question: slide.content.question,
              options: slide.content.options,
              correctAnswer: slide.content.options?.findIndex(opt => opt.correct === true) || 0,
              correctFeedback: slide.content.explanation,
              incorrectFeedback: "Not quite right. Try again!"
            },
            config: {
              instantFeedback: false,
              allowRetry: true,
              pauseAudioOnShow: true,
              resumeAudioOnComplete: true
            },
            id: `quiz-${index}`
          }],
          isVisible: true,
          isLastInGroup: slide.content.isLastInGroup || false
        };
        
        sections.push(quizSection);
        currentSection = null;
        sectionIndex++;
      }
    });

    // Add final section if exists
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  // Audio control functions
  const setupAudioListeners = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      setCurrentTime(currentTime);
      
      // Check if we need to pause for a quiz
      checkForQuizPause(currentTime);
      
      // Update section highlighting
      updateCurrentSection(currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Award completion XP
      awardXP(200, 'Completed History of AI lesson');
      showNotification('🎉 Lesson completed! Great job learning AI history!', 'success');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);  
      audio.removeEventListener('ended', handleEnded);
    };
  }, [awardXP, showNotification]);

  // Check if audio should pause for quiz
  const checkForQuizPause = (currentTime) => {
    const quizTimes = [
      audioTimestamps.section1_quiz,
      audioTimestamps.section2_quiz
    ];

    quizTimes.forEach((quizTime, index) => {
      if (Math.abs(currentTime - quizTime) < 1 && !completedQuizzes.has(`quiz-${index * 2 + 1}`)) {
        pauseAudio('quiz');
        showNotification('🎯 Audio paused for quiz - answer to continue!', 'info');
      }
    });
  };

  // Update which section should be highlighted
  const updateCurrentSection = (currentTime) => {
    let newSectionIndex = 0;
    
    if (currentTime >= audioTimestamps.section3_start) {
      newSectionIndex = 4; // Section 3
    } else if (currentTime >= audioTimestamps.section2_start) {
      newSectionIndex = 2; // Section 2  
    } else {
      newSectionIndex = 0; // Section 1
    }
    
    if (newSectionIndex !== currentSectionIndex) {
      setCurrentSectionIndex(newSectionIndex);
    }
  };

  // Audio control functions
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPaused(true);
      setPauseReason('user');
    } else {
      audio.play();
      setIsPaused(false);
      setPauseReason(null);
    }
    setIsPlaying(!isPlaying);
  };

  const pauseAudio = (reason = 'user') => {
    const audio = audioRef.current;
    if (!audio || isPaused) return;

    audio.pause();
    setIsPlaying(false);
    setIsPaused(true);
    setPauseReason(reason);
  };

  const resumeAudio = () => {
    const audio = audioRef.current;
    if (!audio || !isPaused) return;

    audio.play();
    setIsPlaying(true);
    setIsPaused(false);
    setPauseReason(null);
  };

  const seekAudio = (time) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    setCurrentTime(time);
  };

  // Handle quiz completion
  const handleQuizComplete = useCallback((quizId, completionData) => {
    setCompletedQuizzes(prev => new Set([...prev, quizId]));
    
    // Play success sound
    if (completionData.correct !== false) {
      playSuccessChime();
      awardXP(50, 'Quiz completed correctly');
      
      // Resume audio if it was paused for quiz
      if (pauseReason === 'quiz') {
        setTimeout(() => {
          resumeAudio();
          showNotification('✅ Great job! Audio resumed', 'success');
        }, 2000);
      }
      
      // Unlock next section
      unlockNextSection(quizId);
    } else {
      playErrorSound();
    }
  }, [pauseReason, awardXP, showNotification]);

  // Unlock next content section after quiz completion
  const unlockNextSection = (quizId) => {
    setContentSections(prevSections => 
      prevSections.map(section => {
        if (section.precedingQuizId === quizId) {
          return { ...section, isVisible: true };
        }
        return section;
      })
    );
  };

  // Setup audio listeners
  useEffect(() => {
    if (audioRef.current) {
      return setupAudioListeners();
    }
  }, [setupAudioListeners]);

  // Format time for display
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading synchronized lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Fixed Audio Player */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Audio Element */}
          <audio
            ref={audioRef}
            src="/The Incredible Story of AI_ From Turing to Today.wav"
            preload="metadata"
            onError={() => {
              console.warn('Audio file not found - running in demo mode');
              // Component will still work without audio
            }}
          />
          
          {/* Player Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">{lesson?.title}</h2>
              <p className="text-sm text-gray-400">Synchronized Audio Experience</p>
            </div>
            
            {/* Pause Status */}
            {isPaused && pauseReason === 'quiz' && (
              <div className="flex items-center space-x-2 text-orange-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Paused for Quiz</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div 
              className="w-full h-2 bg-gray-700 rounded-full cursor-pointer relative group"
              onClick={(e) => {
                const clickX = e.nativeEvent.offsetX;
                const width = e.target.offsetWidth;
                const newTime = (clickX / width) * duration;
                seekAudio(newTime);
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-150"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-gray-400 text-sm mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => seekAudio(Math.max(0, currentTime - 15))}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Skip back 15s"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8z"/>
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">15</text>
              </svg>
            </button>

            <button
              onClick={togglePlayPause}
              disabled={pauseReason === 'quiz'}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors shadow-lg"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            <button
              onClick={() => seekAudio(Math.min(duration, currentTime + 30))}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Skip forward 30s"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">30</text>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="pt-40 pb-8">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {contentSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: section.isVisible ? 1 : 0.3,
                y: 0,
                scale: currentSectionIndex === sectionIndex ? 1.02 : 1
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
              className={`${section.isVisible ? '' : 'pointer-events-none'} ${
                currentSectionIndex === sectionIndex ? 'ring-2 ring-blue-500/30 shadow-2xl' : ''
              } rounded-xl p-6 bg-gray-800/30`}
            >
              <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
              
              {/* Show locked content indicator */}
              {!section.isVisible && section.precedingQuizId && (
                <div className="mb-4 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
                  <p className="text-gray-500 text-center text-sm">
                    🔒 Complete the quiz above to unlock this content
                  </p>
                </div>
              )}
              
              {/* Content blocks */}
              <div className={!section.isVisible ? 'filter blur-sm' : ''}>
                <ContentBlockRenderer
                  blocks={section.blocks}
                  audioCurrentTime={currentTime}
                  onBlockComplete={section.type === 'quiz' ? 
                    (blockIndex, data) => handleQuizComplete(section.id, data) :
                    () => {}
                  }
                  config={{
                    lazyLoading: true,
                    animations: section.isVisible,
                    trackProgress: section.isVisible,
                    disabled: !section.isVisible
                  }}
                  className={`space-y-6 ${!section.isVisible ? 'opacity-40' : ''}`}
                />
              </div>
              
              {/* Quiz completion hint */}
              {section.type === 'quiz' && section.isLastInGroup && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm text-center">
                    💡 Answer this quiz to unlock the next section and resume audio!
                  </p>
                </div>
              )}
            </motion.div>
          ))}

          {/* Completion Message */}
          {completedQuizzes.size >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl border border-green-500/30"
            >
              <h3 className="text-2xl font-bold text-white mb-2">🎉 Lesson Complete!</h3>
              <p className="text-gray-300 mb-4">
                You've mastered the incredible history of AI from Turing to ChatGPT!
              </p>
              <button
                onClick={() => navigate('/lessons')}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all"
              >
                Continue Learning
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SynchronizedLessonViewer; 