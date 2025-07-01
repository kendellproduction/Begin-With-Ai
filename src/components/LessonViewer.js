import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { initAudio, playSuccessChime, playErrorSound } from '../utils/audioUtils';
import logger from '../utils/logger';
import { getAdaptiveLessonById, getAdaptedLessonContent } from '../utils/adaptiveLessonData';

// Import slide components
import IntroSlide from './slides/IntroSlide';
import ConceptSlide from './slides/ConceptSlide';
import QuizSlide from './slides/QuizSlide';
import ExampleSlide from './slides/ExampleSlide';
import FillBlankSlide from './slides/FillBlankSlide';
import SandboxSlide from './slides/SandboxSlide';

const LessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [lesson, setLesson] = useState(null);
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCompletionButtons, setShowCompletionButtons] = useState(false);
  const [difficulty, setDifficulty] = useState('intermediate'); // Default difficulty
  
  // Removed touch navigation - now using button-only navigation
  const containerRef = useRef(null);

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
    
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('click', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  // Sample lesson data (replace with actual API call)
  useEffect(() => {
    loadLessonData();
  }, [lessonId, difficulty]);

  // Handle admin-generated lessons
  useEffect(() => {
    if (location.state?.fromAdmin && location.state?.lesson) {
      const adminLesson = location.state.lesson;
      console.log('Loading admin-generated lesson:', adminLesson);
      
      // Convert admin lesson format to slide format
      const convertedLesson = convertAdminLessonToSlides(adminLesson);
      setLesson(convertedLesson);
      setSlides(convertedLesson.slides);
      setIsLoading(false);
      return;
    }
  }, [location.state]);

  // Detect difficulty level from URL params or location state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlDifficulty = urlParams.get('difficulty');
    const stateDifficulty = location.state?.difficulty;
    
    // Default to beginner for vocabulary lessons to show proper exercises
    const selectedDifficulty = urlDifficulty || stateDifficulty || 'beginner';
    setDifficulty(selectedDifficulty.toLowerCase());
  }, [location]);

  const loadLessonData = async () => {
    logger.info('Loading lesson data for:', lessonId, 'difficulty:', difficulty);
    setIsLoading(true);
    
    try {
      // Get adaptive lesson content
      const adaptedLesson = getAdaptedLessonContent(lessonId, difficulty);
      
      if (adaptedLesson && adaptedLesson.slides.length > 0) {
        // Use adaptive lesson data
        setLesson(adaptedLesson);
        setSlides(adaptedLesson.slides);
        logger.info('Adaptive lesson loaded successfully:', adaptedLesson.title);
      } else {
        // Fallback to local lesson data if available
        logger.warn(`Lesson ${lessonId} not found in adaptive data, trying local fallback`);
        const localLesson = getLocalLessonFallback(lessonId, difficulty);
        setLesson(localLesson);
        setSlides(localLesson.slides);
      }
      
    } catch (error) {
      logger.error('Error loading lesson:', error);
      // Final fallback to ensure app doesn't break
      const fallbackLesson = createFallbackLesson(lessonId, difficulty);
      setLesson(fallbackLesson);
      setSlides(fallbackLesson.slides);
    }
    
    setIsLoading(false);
    logger.info('Lesson loading completed');
  };

  // Fallback for lessons that might be in local data
  const getLocalLessonFallback = (lessonId, difficulty) => {
    // Import local lessons data if available
    try {
      const { localLessonsData } = require('../data/lessonsData');
      const localLesson = localLessonsData[lessonId];
      
      if (localLesson) {
        return convertLocalLessonToSlides(localLesson, difficulty);
      }
    } catch (error) {
      logger.warn('Local lessons data not available');
    }
    
    return createFallbackLesson(lessonId, difficulty);
  };

  // Convert local lesson format to slides
  const convertLocalLessonToSlides = (localLesson, difficulty) => {
    const slides = [];
    
    // Intro slide
    slides.push({
      id: `${localLesson.id}-intro`,
      type: 'intro',
      content: {
        title: localLesson.title,
        subtitle: localLesson.coreConcept,
        icon: "🤖",
        description: localLesson.adaptedContent?.content?.introduction || localLesson.coreConcept,
        estimatedTime: localLesson.adaptedContent?.estimatedTime || 20,
        xpReward: localLesson.adaptedContent?.xpReward || 100
      }
    });

    // Main content slide
    if (localLesson.adaptedContent?.content) {
      const content = localLesson.adaptedContent.content;
      slides.push({
        id: `${localLesson.id}-concept`,
        type: 'concept',
        content: {
          title: localLesson.title,
          explanation: content.introduction,
          icon: "🤖",
          keyPoints: content.keyPoints || []
        }
      });

      // Add example slides
      if (content.examples) {
        content.examples.forEach((example, index) => {
          slides.push({
            id: `${localLesson.id}-example-${index}`,
            type: 'example',
            content: {
              title: `Example ${index + 1}`,
              example: example,
              explanation: "This demonstrates the concept in practice."
            }
          });
        });
      }
    }

    // Add quiz slides
    if (localLesson.adaptedContent?.assessment?.questions) {
      localLesson.adaptedContent.assessment.questions.forEach((question, index) => {
        slides.push({
          id: `${localLesson.id}-quiz-${index}`,
          type: 'quiz',
          content: question
        });
      });
    }

    // Add sandbox slide if required
    if (localLesson.sandbox?.required) {
      slides.push({
        id: `${localLesson.id}-sandbox`,
        type: 'sandbox',
        content: {
          title: "Practice What You've Learned",
          instructions: localLesson.adaptedContent?.sandbox?.instructions || "Try out the concepts!",
          exercises: localLesson.adaptedContent?.sandbox?.exercises || []
        }
      });
    }

    return {
      id: localLesson.id,
      title: localLesson.title,
      description: localLesson.coreConcept,
      estimatedTime: localLesson.adaptedContent?.estimatedTime || 20,
      xpReward: localLesson.adaptedContent?.xpReward || 100,
      slides: slides,
      difficulty: difficulty
    };
  };

  // Create a basic fallback lesson to prevent app crashes
  const createFallbackLesson = (lessonId, difficulty) => {
    const lessonTitles = {
      'welcome-ai-revolution': 'AI History: How We Got Here & Where We\'re Going',
      'how-ai-thinks': 'How AI "Thinks" — From Data to Decisions',
      'ai-vocabulary-bootcamp': 'AI Vocabulary Bootcamp',
      'prompting-essentials': 'Prompting Essentials',
      'prompt-engineering-action': 'Prompt Engineering in Action',
      'creative-ai-mastery': 'Creative AI — Art, Video, and Voice',
      'ai-workflow-fundamentals': 'AI Workflow Fundamentals',
      'ai-daily-applications': 'AI for School, Work, and Life',
      'local-ai-mastery': 'Hosting AI Locally & Open Source Models',
      'ai-problem-solving-capstone': 'AI Problem-Solving Lab',
      'vibe-code-video-game': 'Create a Video Game with AI'
    };

    const title = lessonTitles[lessonId] || 'AI Learning Lesson';
    
    return {
      id: lessonId,
      title: title,
      description: `Learn about ${title.toLowerCase()} in this interactive lesson.`,
      estimatedTime: 20,
      xpReward: 100,
      slides: [
        {
          id: `${lessonId}-intro`,
          type: 'intro',
          content: {
            title: title,
            subtitle: `Interactive ${difficulty} level lesson`,
            icon: "🤖",
            description: `Explore the fundamentals of ${title.toLowerCase()}.`,
            estimatedTime: 20,
            xpReward: 100
          }
        },
        {
          id: `${lessonId}-concept`,
          type: 'concept',
          content: {
            title: title,
            explanation: `This lesson covers the key concepts and principles of ${title.toLowerCase()}. Content is being loaded from the adaptive lesson system.`,
            icon: "🧠",
            keyPoints: [
              "Core concepts and fundamentals",
              "Practical applications and examples", 
              "Hands-on exercises and practice",
              "Assessment and skill validation"
            ]
          }
        },
        {
          id: `${lessonId}-sandbox`,
          type: 'sandbox',
          content: {
            title: "Practice & Apply",
            instructions: "Use the sandbox to practice what you've learned in this lesson!",
            exercises: ["Try out the concepts", "Experiment with examples", "Apply your knowledge"]
          }
        }
      ],
      difficulty: difficulty
    };
  };

  // Convert admin lesson format to slide-based format
  const convertAdminLessonToSlides = (adminLesson) => {
    const slides = [];
    
    console.log('Converting admin lesson:', adminLesson);
    
    // Intro slide with key points if available
    const introSlide = {
      id: `${adminLesson.id}-intro`,
      type: 'intro',
      content: {
        title: adminLesson.title,
        subtitle: adminLesson.description || 'Interactive AI lesson',
        icon: "🤖",
        description: adminLesson.description || 'Learn about this AI topic through interactive content.',
        estimatedTime: adminLesson.estimatedTimeMinutes || adminLesson.estimatedDuration || 15,
        xpReward: adminLesson.xpAward || 100
      }
    };

    // Add key points to intro slide if available
    if (adminLesson.keyPoints && adminLesson.keyPoints.length > 0) {
      introSlide.content.keyPoints = adminLesson.keyPoints;
    }

    slides.push(introSlide);

    // Convert content pages to slides
    if (adminLesson.content && Array.isArray(adminLesson.content) && adminLesson.content.length > 0) {
      console.log('Processing content pages:', adminLesson.content.length);
      
      adminLesson.content.forEach((contentPage, index) => {
        console.log(`Processing content page ${index}:`, contentPage);
        
        switch (contentPage.type) {
          case 'text':
            if (contentPage.value && contentPage.value.trim()) {
              slides.push({
                id: `${adminLesson.id}-content-${index}`,
                type: 'concept',
                content: {
                  title: `Concept ${index + 1}`,
                  explanation: contentPage.value,
                  icon: "📚"
                }
              });
            }
            break;
            
          case 'ai_professor_tip':
            if (contentPage.value && contentPage.value.trim()) {
              slides.push({
                id: `${adminLesson.id}-tip-${index}`,
                type: 'concept',
                content: {
                  title: "💡 AI Professor Tip",
                  explanation: contentPage.value,
                  icon: "💡",
                  isHighlight: true
                }
              });
            }
            break;
            
          case 'quiz':
            if (contentPage.question && contentPage.options) {
              slides.push({
                id: `${adminLesson.id}-quiz-${index}`,
                type: 'quiz',
                content: {
                  question: contentPage.question,
                  options: contentPage.options.map(opt => ({
                    text: typeof opt === 'string' ? opt : opt.text || opt,
                    correct: typeof opt === 'object' ? opt.correct : false
                  })),
                  feedback: contentPage.feedback || 'Great job!'
                }
              });
            }
            break;
            
          case 'code_challenge':
            if (contentPage.value && contentPage.value.trim()) {
              slides.push({
                id: `${adminLesson.id}-sandbox-${index}`,
                type: 'sandbox',
                content: {
                  title: "💻 Code Challenge",
                  instructions: contentPage.value,
                  exercises: contentPage.hints || ["Try out the concepts", "Experiment with the code"],
                  startingCode: contentPage.startingCode,
                  solution: contentPage.solution
                }
              });
            }
            break;
            
          case 'video':
            if (contentPage.url || contentPage.title) {
              slides.push({
                id: `${adminLesson.id}-video-${index}`,
                type: 'concept',
                content: {
                  title: contentPage.title || "🎥 Video Content",
                  explanation: contentPage.description || "Watch and learn from this video content.",
                  icon: "🎥",
                  videoUrl: contentPage.url
                }
              });
            }
            break;
            
          case 'image':
            if (contentPage.url || contentPage.altText) {
              slides.push({
                id: `${adminLesson.id}-image-${index}`,
                type: 'concept',
                content: {
                  title: contentPage.altText || "🖼️ Visual Content",
                  explanation: contentPage.caption || "Study this visual to understand the concept better.",
                  icon: "🖼️",
                  imageUrl: contentPage.url
                }
              });
            }
            break;
            
          default:
            // Handle unknown content types
            if (contentPage.value || contentPage.question || contentPage.text) {
              slides.push({
                id: `${adminLesson.id}-content-${index}`,
                type: 'concept',
                content: {
                  title: `Content ${index + 1}`,
                  explanation: contentPage.value || contentPage.question || contentPage.text || 'Content goes here',
                  icon: "📋"
                }
              });
            }
        }
      });
    } else {
      console.warn('No valid content found in admin lesson:', adminLesson);
      // Add a default content slide if no content is available
      slides.push({
        id: `${adminLesson.id}-content-default`,
        type: 'concept',
        content: {
          title: "Lesson Content",
          explanation: "This lesson is being prepared. Content will be available soon.",
          icon: "📋"
        }
      });
    }

    // Add sandbox slide if sandbox is enabled
    if (adminLesson.includeSandbox && adminLesson.sandboxType !== 'none') {
      const sandboxSlide = {
        id: `${adminLesson.id}-sandbox`,
        type: 'sandbox',
        content: {
          title: "🚀 Practice & Apply",
          instructions: "Use the sandbox to practice what you've learned in this lesson!",
          exercises: ["Apply the concepts you've learned", "Experiment with different approaches", "Test your understanding"]
        }
      };

      // Customize based on sandbox type
      if (adminLesson.sandboxType === 'openai_api') {
        sandboxSlide.content.title = "🤖 Try AI Prompting";
        sandboxSlide.content.instructions = "Practice prompting AI with what you've learned!";
        sandboxSlide.content.exercises = [
          "Send prompts to the AI based on lesson concepts",
          "Experiment with different prompt styles",
          "See how the AI responds to your inputs"
        ];
      } else if (adminLesson.sandboxType === 'replit') {
        sandboxSlide.content.title = "💻 Code Sandbox";
        sandboxSlide.content.instructions = "Write and test code based on the lesson!";
        sandboxSlide.content.exercises = [
          "Write code to implement lesson concepts",
          "Test your code in the sandbox",
          "Experiment with variations"
        ];
      } else if (adminLesson.sandboxType === 'both') {
        sandboxSlide.content.title = "🚀 Interactive Practice";
        sandboxSlide.content.instructions = "Practice with both AI prompting and coding!";
        sandboxSlide.content.exercises = [
          "Try AI prompting based on lesson concepts",
          "Write and test code in the sandbox",
          "Combine AI and coding for complete understanding"
        ];
      }

      slides.push(sandboxSlide);
    }

    // Add summary slide if summary is provided
    if (adminLesson.summary && adminLesson.summary.trim()) {
      slides.push({
        id: `${adminLesson.id}-summary`,
        type: 'concept',
        content: {
          title: "📋 Lesson Summary",
          explanation: adminLesson.summary,
          icon: "📋",
          isComplete: true
        }
      });
    }

    // Add final completion slide
    slides.push({
      id: `${adminLesson.id}-complete`,
      type: 'concept',
      content: {
        title: "🎉 Lesson Complete!",
        explanation: `Congratulations! You've completed "${adminLesson.title}". You've gained valuable knowledge that will help you in your AI journey.`,
        icon: "🎉",
        isComplete: true
      }
    });

    console.log('Generated slides:', slides.length);
    console.log('Slides summary:', slides.map(s => ({ id: s.id, type: s.type, title: s.content.title })));

    return {
      id: adminLesson.id,
      title: adminLesson.title,
      description: adminLesson.description,
      estimatedTime: adminLesson.estimatedTimeMinutes || adminLesson.estimatedDuration || 15,
      xpReward: adminLesson.xpAward || 100,
      slides: slides,
      difficulty: adminLesson.difficulty || 'intermediate',
      isAdminGenerated: true
    };
  };

  // Handle slide navigation
  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      // Scroll to top when changing slides
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleLessonComplete();
    }
  }, [currentSlideIndex, slides.length]);

  const goToPreviousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      // Scroll to top when changing slides
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSlideIndex]);

  // Handle slide completion
  const handleSlideComplete = useCallback((slideId, data) => {
    setUserProgress(prev => ({
      ...prev,
      [slideId]: {
        completed: true,
        timestamp: new Date().toISOString(),
        data
      }
    }));
    
    // Only auto-advance for certain slide types (not sandbox slides or interactive exercises)
    const currentSlide = slides[currentSlideIndex];
    const shouldAutoAdvance = currentSlide && 
      !['sandbox', 'interactive_sandbox', 'fill-blank', 'multiple-choice', 'interactive_check', 'quiz'].includes(currentSlide.type);
    
    if (shouldAutoAdvance) {
      // Auto-advance after a brief delay for content slides
      setTimeout(goToNextSlide, 1000);
    }
  }, [goToNextSlide, slides, currentSlideIndex]);

  // Handle lesson completion
  const handleLessonComplete = () => {
    setIsComplete(true);
    // User controls navigation - no auto-redirect
  };

  // Handle quiz answers with audio feedback
  const handleQuizAnswer = (isCorrect, answerData) => {
    if (isCorrect) {
      playSuccessChime();
    } else {
      playErrorSound();
    }
    
    return answerData;
  };

  // Removed touch navigation - lessons now use button-only navigation for better UX

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle keyboard navigation when user is typing in input elements
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          goToNextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goToPreviousSlide();
          break;
        case 'Escape':
          setShowExitModal(true);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPreviousSlide]);

  // Render appropriate slide component
  const renderSlide = (slide, index) => {
    const commonProps = {
      slide,
      onComplete: handleSlideComplete,
      onNext: goToNextSlide,
      isActive: index === currentSlideIndex,
      progress: userProgress[slide.id]
    };

    switch (slide.type) {
      case 'intro':
        return <IntroSlide {...commonProps} />;
      case 'concept':
        return <ConceptSlide {...commonProps} />;
      case 'interactive_teaching':
        return <ConceptSlide {...commonProps} />;
      case 'interactive_check':
        return <FillBlankSlide {...commonProps} onAnswer={handleQuizAnswer} />;
      case 'quiz':
        return <QuizSlide {...commonProps} onAnswer={handleQuizAnswer} />;
      case 'example':
        return <ExampleSlide {...commonProps} />;
      case 'fill-blank':
        return <FillBlankSlide {...commonProps} onAnswer={handleQuizAnswer} />;
      case 'sandbox':
        return <SandboxSlide {...commonProps} />;
      default:
        return <div className="text-white">Unknown slide type: {slide.type}</div>;
    }
  };

  if (isLoading) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center text-white overflow-hidden"
        style={{ backgroundColor: '#2061a6' }}
      >
        {/* Star Animation Container for Loading */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(100)].map((_, i) => {
            const screenH = window.innerHeight;
            const screenW = window.innerWidth;
            const initialY = Math.random() * screenH * 1.5 - screenH * 0.25;
            const targetY = Math.random() * screenH * 1.5 - screenH * 0.25;
            const initialX = Math.random() * screenW * 1.5 - screenW * 0.25;
            const targetX = Math.random() * screenW * 1.5 - screenW * 0.25;
            const starDuration = 30 + Math.random() * 25;
            const starSize = Math.random() * 2 + 0.5; // 0.5px to 2.5px (smaller, less distracting)

            return (
              <motion.div
                key={`loading-star-${i}`}
                className="absolute rounded-full bg-white/50"
                style={{
                  width: starSize,
                  height: starSize,
                }}
                initial={{
                  x: initialX,
                  y: initialY,
                  opacity: 0,
                }}
                animate={{
                  x: targetX,
                  y: targetY,
                  opacity: [0, 0.6, 0.6, 0],
                }}
                transition={{
                  duration: starDuration,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 2,
                  ease: "linear",
                  opacity: {
                    duration: starDuration,
                    ease: "linear",
                    times: [0, 0.1, 0.85, 1],
                    repeat: Infinity,
                    repeatDelay: Math.random() * 5 + 2,
                  }
                }}
              />
            );
          })}
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-xl text-white">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div 
        className="fixed inset-0 bg-gradient-to-br from-gray-950 via-slate-950 to-black flex items-center justify-center text-center"
        onClick={() => !showCompletionButtons && setShowCompletionButtons(true)}
      >
        {/* Star Animation Container for Completion */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(100)].map((_, i) => {
            const screenH = window.innerHeight;
            const screenW = window.innerWidth;
            const initialY = Math.random() * screenH * 1.5 - screenH * 0.25;
            const targetY = Math.random() * screenH * 1.5 - screenH * 0.25;
            const initialX = Math.random() * screenW * 1.5 - screenW * 0.25;
            const targetX = Math.random() * screenW * 1.5 - screenW * 0.25;
            const starDuration = 25 + Math.random() * 20;
            const starSize = Math.random() * 2 + 0.5; // 0.5px to 2.5px (smaller, less distracting)

            return (
              <motion.div
                key={`completion-star-${i}`}
                className="absolute rounded-full bg-white/50"
                style={{
                  width: starSize,
                  height: starSize,
                }}
                initial={{
                  x: initialX,
                  y: initialY,
                  opacity: 0,
                }}
                animate={{
                  x: targetX,
                  y: targetY,
                  opacity: [0, 0.7, 0.7, 0],
                }}
                transition={{
                  duration: starDuration,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 4 + 1,
                  ease: "linear",
                  opacity: {
                    duration: starDuration,
                    ease: "linear",
                    times: [0, 0.1, 0.85, 1],
                    repeat: Infinity,
                    repeatDelay: Math.random() * 4 + 1,
                  }
                }}
              />
            );
          })}
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto p-8"
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Lesson Complete!</h1>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-2xl text-green-200 mb-6 font-bold"
          >
            +{lesson?.xpReward || 150} XP
          </motion.div>

          {!showCompletionButtons ? (
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-300 text-sm"
            >
              Tap anywhere to continue
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <button
                onClick={() => navigate('/lessons/next-lesson-id')} // Replace with actual next lesson logic
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                Next Lesson →
              </button>
              
              <button
                onClick={() => navigate('/lessons')}
                className="w-full py-3 bg-white/10 rounded-2xl text-white font-medium transition-all duration-300 hover:bg-white/20"
              >
                Back to Lessons
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-gray-600/50 rounded-2xl text-gray-300 font-medium transition-all duration-300 hover:bg-gray-600/70"
              >
                Home
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / slides.length) * 100;

  return (
    <div 
      ref={containerRef}
      className="lesson-viewer fixed inset-0 bg-gradient-to-br from-gray-950 via-slate-950 to-black z-50 overflow-hidden"
    >
      {/* Star Animation Container for LessonViewer - High Performance GPU Accelerated */}
      <div className="star-container absolute inset-0 z-0 pointer-events-none">
        {[...Array(120)].map((_, i) => {
          const screenH = window.innerHeight;
          const screenW = window.innerWidth;
          const initialY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const targetY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const initialX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const targetX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const starDuration = 30 + Math.random() * 25;
          const starSize = Math.random() * 2 + 0.5; // 0.5px to 2.5px (smaller, less distracting)

          return (
            <motion.div
              key={`lesson-viewer-star-${i}`}
              className="star-element absolute rounded-full bg-white/50"
              style={{
                width: starSize,
                height: starSize,
              }}
              initial={{
                x: initialX,
                y: initialY,
                opacity: 0,
              }}
              animate={{
                x: targetX,
                y: targetY,
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: starDuration,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
                ease: "linear",
                type: "tween", // More performant than spring
                opacity: {
                  duration: starDuration,
                  ease: "linear",
                  times: [0, 0.1, 0.85, 1],
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 2,
                }
              }}
            />
          );
        })}
      </div>
      {/* Progress Bar */}
      <div className="lesson-progress-bar-container absolute top-0 left-0 right-0 h-auto bg-gray-800 z-10">
        <div className="h-1">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Exit Button (top-right corner) */}
      <button
        onClick={() => setShowExitModal(true)}
        className="lesson-exit-button absolute right-4 z-20 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        ✕
      </button>

      {/* Slide Counter (top-left corner) */}
      <div className="lesson-slide-counter absolute left-4 z-20 bg-black/50 rounded-full px-3 py-1 text-white text-sm">
        {currentSlideIndex + 1} / {slides.length}
      </div>

      {/* Main Slide Content */}
      <div className="h-full flex flex-col pt-12 pb-16 overflow-y-auto">
        <div className="flex-1 flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto"
            >
              {currentSlide && renderSlide(currentSlide, currentSlideIndex)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Dots (bottom) */}
      <div className="lesson-navigation-dots absolute left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlideIndex 
                  ? 'bg-blue-400 w-6 h-2' 
                  : index < currentSlideIndex 
                    ? 'bg-green-400 w-2 h-2' 
                    : 'bg-gray-600 w-2 h-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-sm mx-4 text-center"
          >
            <h3 className="text-xl font-bold text-white mb-4">Exit Lesson?</h3>
            <p className="text-gray-300 mb-6">Your progress will be saved, but you'll need to restart this slide.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Stay
              </button>
              <button
                onClick={() => navigate('/lessons')}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Exit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LessonViewer; 