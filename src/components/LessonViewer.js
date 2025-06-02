import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { initAudio, playSuccessChime, playErrorSound } from '../utils/audioUtils';
import logger from '../utils/logger';

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
  
  // Touch handling
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
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
  }, [lessonId]);

  // Detect difficulty level from URL params or location state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlDifficulty = urlParams.get('difficulty');
    const stateDifficulty = location.state?.difficulty;
    
    const selectedDifficulty = urlDifficulty || stateDifficulty || 'intermediate';
    setDifficulty(selectedDifficulty.toLowerCase());
    
    // Reload lesson data when difficulty changes
    if (selectedDifficulty.toLowerCase() !== difficulty) {
      loadLessonData();
    }
  }, [location, difficulty]);

  const loadLessonData = async () => {
    logger.info('Loading lesson data for:', lessonId);
    setIsLoading(true);
    
    try {
      // Check if lesson exists in adaptiveLessonData
      const adaptiveLesson = getAdaptiveLessonById(lessonId);
      
      if (adaptiveLesson) {
        // Use adaptive lesson data structure
        setLesson(adaptiveLesson);
        setSlides(adaptiveLesson.slides || []);
        logger.info('Adaptive lesson loaded successfully');
      } else {
        // Fallback to generic content if lesson not found locally
        logger.warn(`Lesson ${lessonId} not found in local data, using fallback content`);
        const mockLesson = getLessonContent(difficulty);
        setLesson(mockLesson);
        setSlides(mockLesson.slides);
      }
      
    } catch (error) {
      logger.error('Error loading lesson:', error);
      // Fallback to mock lesson on error
      const mockLesson = getLessonContent(difficulty);
      setLesson(mockLesson);
      setSlides(mockLesson.slides);
    }
    
    setIsLoading(false);
    logger.info('Loading completed');
  };

  // Map lesson IDs to their path/module structure
  const getLessonMetadata = (lessonId) => {
    const lessonMap = {
      'welcome-ai-revolution': { pathId: 'prompt-engineering-mastery', moduleId: 'ai-foundations' },
      'how-ai-thinks': { pathId: 'prompt-engineering-mastery', moduleId: 'ai-foundations' },
      'ai-vocabulary-bootcamp': { pathId: 'prompt-engineering-mastery', moduleId: 'ai-foundations' },
      'prompting-essentials': { pathId: 'prompt-engineering-mastery', moduleId: 'prompting-skills' },
      'prompt-engineering-action': { pathId: 'prompt-engineering-mastery', moduleId: 'prompting-skills' },
      'creative-ai-mastery': { pathId: 'prompt-engineering-mastery', moduleId: 'creative-applications' },
      'ai-workflow-fundamentals': { pathId: 'prompt-engineering-mastery', moduleId: 'practical-applications' },
      'ai-daily-applications': { pathId: 'prompt-engineering-mastery', moduleId: 'practical-applications' },
      'local-ai-mastery': { pathId: 'prompt-engineering-mastery', moduleId: 'practical-applications' },
      'ai-problem-solving-capstone': { pathId: 'prompt-engineering-mastery', moduleId: 'practical-applications' },
      'vibe-code-video-game': { pathId: 'vibe-coding', moduleId: 'interactive-coding' }
    };
    
    return lessonMap[lessonId];
  };

  // Convert lesson data to slides format
  const convertLessonToSlides = (lesson) => {
    const slides = [];
    
    // Add intro slide
    slides.push({
      id: `${lesson.id}-intro`,
      type: 'intro',
      content: {
        title: lesson.title,
        description: lesson.coreConcept,
        estimatedTime: lesson.adaptedContent?.estimatedTime || 20,
        xpReward: lesson.adaptedContent?.xpReward || 100
      }
    });

    // Add concept slides from lesson content
    if (lesson.adaptedContent?.content) {
      const content = lesson.adaptedContent.content;
      
      // Main concept slide
      slides.push({
        id: `${lesson.id}-concept`,
        type: 'concept',
        content: {
          title: lesson.title,
          explanation: content.introduction || lesson.coreConcept,
          icon: "🤖",
          keyPoints: content.keyPoints || []
        }
      });

      // Add examples if available
      if (content.examples && content.examples.length > 0) {
        content.examples.forEach((example, index) => {
          slides.push({
            id: `${lesson.id}-example-${index}`,
            type: 'example',
            content: {
              title: `Example ${index + 1}`,
              example: example,
              explanation: `This shows how ${lesson.title.toLowerCase()} works in practice.`
            }
          });
        });
      }

      // Add quiz if available from assessment
      if (lesson.adaptedContent?.assessment?.questions && lesson.adaptedContent.assessment.questions.length > 0) {
        lesson.adaptedContent.assessment.questions.forEach((question, index) => {
          slides.push({
            id: `${lesson.id}-quiz-${index}`,
            type: 'quiz',
            content: question
          });
        });
      }
    }

    // Add sandbox slide if available
    if (lesson.sandbox?.required) {
      slides.push({
        id: `${lesson.id}-sandbox`,
        type: 'sandbox',
        content: {
          title: "Try It Yourself",
          instructions: lesson.adaptedContent?.sandbox?.instructions || "Practice what you've learned!",
          exercises: lesson.adaptedContent?.sandbox?.exercises || []
        }
      });
    }

    // Ensure we have at least some slides
    if (slides.length === 0) {
      slides.push({
        id: `${lesson.id}-fallback`,
        type: 'concept',
        content: {
          title: lesson.title,
          explanation: lesson.coreConcept,
          icon: "🤖",
          keyPoints: ["This lesson covers important AI concepts"]
        }
      });
    }

    return slides;
  };

  // Get lesson content based on difficulty level (fallback function)
  const getLessonContent = (difficultyLevel) => {
    const baseContent = createIntermediateContent(); // Use existing intermediate content as base
    
    if (difficultyLevel === 'beginner') {
      return {
        ...baseContent,
        title: "How AI Makes Decisions",
        description: "Simple introduction to how computers think and make choices",
        estimatedTime: 20,
        xpReward: 75,
        slides: baseContent.slides.slice(0, 12).map(slide => simplifyForBeginners(slide))
      };
    } else if (difficultyLevel === 'advanced') {
      return {
        ...baseContent,
        title: "AI Decision-Making: Computational Mechanisms & Neural Architectures",
        description: "Deep dive into AI decision-making processes, neural architectures, and computational mechanisms",
        estimatedTime: 45,
        xpReward: 200,
        slides: [...baseContent.slides, ...createAdvancedSlides()].map(slide => enhanceForAdvanced(slide))
      };
    }
    
    return baseContent; // Return intermediate content as-is
  };

  // Simplify content for beginners (kids/seniors)
  const simplifyForBeginners = (slide) => {
    if (slide.type === 'concept') {
      return {
        ...slide,
        content: {
          ...slide.content,
          explanation: slide.content.explanation.replace(/mathematical|statistical|computational/gi, 'smart computer')
            .replace(/parameters|embeddings|tokens/gi, 'computer memory')
            .replace(/neural networks/gi, 'computer brain'),
          keyPoints: slide.content.keyPoints.map(point => 
            point.replace(/AI operates on|GPT-4 has|Training cost/gi, 'The computer')
              .replace(/billion|trillion/gi, 'lots of')
              .replace(/probability calculations/gi, 'smart guessing')
          )
        }
      };
    } else if (slide.type === 'quiz') {
      return {
        ...slide,
        content: {
          ...slide.content,
          explanation: slide.content.explanation.replace(/statistical|mathematical/gi, 'smart pattern finding')
        }
      };
    }
    return slide;
  };

  // Enhance content for advanced users
  const enhanceForAdvanced = (slide) => {
    if (slide.type === 'concept') {
      return {
        ...slide,
        content: {
          ...slide.content,
          keyPoints: [
            ...slide.content.keyPoints,
            `Technical insight: ${getAdvancedInsight(slide.content.title)}`
          ]
        }
      };
    }
    return slide;
  };

  const getAdvancedInsight = (title) => {
    const insights = {
      'Pattern Recognition at Scale': 'Uses sparse attention patterns and mixture-of-experts architectures',
      'How AI Makes Decisions': 'Implements softmax normalization over logit distributions',
      'The Role of Neural Networks': 'Employs gradient-based optimization with Adam/AdamW optimizers',
      'Why AI Can Be Wrong': 'Suffers from distribution shift and out-of-distribution generalization failures'
    };
    return insights[title] || 'Advanced computational mechanisms at play';
  };

  const createAdvancedSlides = () => [
    {
      id: "slide-advanced-1",
      type: "concept",
      content: {
        title: "Mechanistic Interpretability",
        explanation: "Understanding AI decision-making requires reverse-engineering learned algorithms and identifying causal mechanisms in neural networks through circuit analysis.",
        icon: "🔬",
        keyPoints: [
          "Circuit-level analysis using activation patching",
          "Sparse dictionary learning for feature decomposition",
          "Identifying polysemantic neurons and superposition",
          "Causal intervention studies on attention heads"
        ]
      }
    },
    {
      id: "slide-advanced-2",
      type: "quiz",
      content: {
        question: "What is the primary goal of mechanistic interpretability research?",
        options: [
          { text: "Making AI run faster", correct: false },
          { text: "Reverse-engineering learned algorithms in neural networks", correct: true },
          { text: "Reducing model size", correct: false },
          { text: "Improving training efficiency", correct: false }
        ],
        explanation: "Mechanistic interpretability aims to understand the internal algorithms and circuits that emerge in trained neural networks, providing insights into AI decision-making processes."
      }
    }
  ];

  const createIntermediateContent = () => ({
    id: lessonId,
    title: "How AI 'Thinks' — From Data to Decisions",
    description: "Deep dive into how artificial intelligence processes information and makes decisions",
    estimatedTime: 35,
    xpReward: 150,
    slides: [
      {
        id: "slide-1",
        type: "intro",
        content: {
          title: "How AI 'Thinks'",
          subtitle: "From Data to Decisions",
          icon: "🧠",
          description: "Understanding the fundamental processes behind artificial intelligence decision-making"
        }
      },
      {
        id: "slide-2",
        type: "concept",
        content: {
          title: "The Big Misconception",
          explanation: "AI doesn't 'think' like humans do. It doesn't have consciousness, emotions, or subjective experiences. Instead, AI processes information through mathematical patterns and statistical relationships.",
          icon: "💭",
          keyPoints: [
            "AI operates on mathematical computations, not conscious thought",
            "No emotions, intuition, or subjective experience",
            "Decisions based on pattern recognition in data",
            "Every output is a calculated probability"
          ]
        }
      },
      {
        id: "slide-3",
        type: "quiz",
        content: {
          question: "What is the most accurate description of how AI makes decisions?",
          options: [
            { text: "AI uses logic and reasoning like humans", correct: false },
            { text: "AI follows pre-written rules and instructions", correct: false },
            { text: "AI calculates probabilities based on data patterns", correct: true },
            { text: "AI randomly generates responses", correct: false }
          ],
          explanation: "AI makes decisions by calculating probabilities based on patterns it learned from training data. It doesn't use human-like logic or follow pre-written rules."
        }
      },
      {
        id: "slide-4",
        type: "concept",
        content: {
          title: "What is Data to AI?",
          explanation: "To understand AI decision-making, we must first understand how AI sees data. Data is the raw material that AI systems use to learn patterns and make predictions.",
          icon: "📊",
          keyPoints: [
            "Text becomes numbers (tokens and embeddings)",
            "Images become pixel values and feature maps",
            "Everything is converted to mathematical representations",
            "GPT-3 was trained on ~45TB of text data (570GB compressed)"
          ]
        }
      },
      {
        id: "slide-5",
        type: "example",
        content: {
          title: "Data Conversion Example",
          prompt: "How does AI see the word 'happy'?",
          response: "AI converts 'happy' into:\n\n• Token ID: 8057 (in GPT models)\n• Vector embedding: 1,536 numbers like [0.23, -0.41, 0.78...]\n• Each number represents learned associations\n• Similar words get similar number patterns\n\nWords like 'joyful', 'cheerful' have similar embeddings.",
          explanation: "AI doesn't understand 'happy' as an emotion. It sees mathematical patterns that connect 'happy' to other words based on how they appeared together in training data."
        }
      },
      {
        id: "slide-6",
        type: "concept",
        content: {
          title: "The Learning Process",
          explanation: "AI learns by analyzing millions of examples to find patterns. This process involves adjusting billions of parameters to minimize prediction errors.",
          icon: "📚",
          keyPoints: [
            "GPT-4 has approximately 1.76 trillion parameters",
            "Training cost: estimated $63-78 million for compute alone",
            "Used ~13 trillion tokens of text data",
            "Training took several months on thousands of GPUs"
          ]
        }
      },
      {
        id: "slide-7",
        type: "quiz",
        content: {
          question: "What are 'parameters' in an AI model?",
          options: [
            { text: "Settings that humans manually adjust", correct: false },
            { text: "Mathematical weights learned during training", correct: true },
            { text: "Rules programmed by developers", correct: false },
            { text: "The questions users ask the AI", correct: false }
          ],
          explanation: "Parameters are mathematical weights that get automatically adjusted during training. Modern models like GPT-4 have over a trillion of these learned weights that encode patterns from training data."
        }
      },
      {
        id: "slide-8",
        type: "concept",
        content: {
          title: "Pattern Recognition at Scale",
          explanation: "AI excels at finding subtle patterns in data that humans might miss. These patterns form the basis of all AI predictions and decisions.",
          icon: "🔍",
          keyPoints: [
            "Can process patterns across billions of data points simultaneously",
            "Identifies correlations invisible to human analysis", 
            "Finds non-linear relationships in high-dimensional data",
            "ChatGPT processes ~100 billion words per day globally"
          ]
        }
      },
      {
        id: "slide-9",
        type: "example",
        content: {
          title: "Pattern Recognition in Action",
          prompt: "The weather is sunny, so I'll wear my ____",
          response: "AI Pattern Analysis:\n\n1. 'sunny' + 'wear' context detected\n2. Statistical relationships from training:\n   • 'sunglasses' appears after 'sunny' in 12% of cases\n   • 'shorts' appears in 8% of cases\n   • 'hat' appears in 6% of cases\n\n3. Selects highest probability: 'sunglasses'",
          explanation: "The AI doesn't understand weather or clothing. It recognizes that in its training data, 'sunglasses' frequently followed similar sentence patterns."
        }
      },
      {
        id: "slide-10",
        type: "quiz",
        content: {
          question: "If an AI consistently suggests 'pizza' when asked about dinner, what's the most likely reason?",
          options: [
            { text: "The AI loves pizza", correct: false },
            { text: "Pizza appeared frequently in training data dinner contexts", correct: true },
            { text: "The AI was programmed to prefer pizza", correct: false },
            { text: "Pizza is objectively the best dinner choice", correct: false }
          ],
          explanation: "AI suggestions reflect patterns in training data. If 'pizza' appeared often in dinner-related text, the AI learned this statistical association, not a preference."
        }
      },
      {
        id: "slide-11",
        type: "concept",
        content: {
          title: "Why AI Can Be Wrong",
          explanation: "AI errors occur when training data is incomplete, biased, or when encountering patterns outside its training scope.",
          icon: "⚠️",
          keyPoints: [
            "Limited by training data coverage",
            "Can't reason about truly novel situations",
            "May confidently give wrong answers",
            "GPT-4 has ~8% error rate on standardized tests"
          ]
        }
      },
      {
        id: "slide-12",
        type: "fill-blank",
        content: {
          sentence: "AI makes decisions based on ______ rather than genuine understanding",
          answer: "patterns",
          options: ["patterns", "emotions", "logic", "intuition"],
          hint: "Think about what AI learns from training data",
          explanation: "AI identifies and uses statistical patterns from training data to make decisions. It doesn't have genuine understanding, emotions, or intuitive reasoning."
        }
      },
      {
        id: "slide-13",
        type: "sandbox",
        content: {
          title: "Apply Your Understanding",
          instruction: "Analyze how AI would handle a real-world scenario",
          scenario: "You ask AI to help write a professional email declining a job offer while keeping the door open for future opportunities.",
          suggestedPrompt: "Explain: 1) How AI processes this request, 2) What patterns it uses, 3) Why it might succeed or fail, 4) What limitations to consider.",
          successCriteria: [
            "Explains pattern matching from training data",
            "Identifies relevant learned associations (politeness, professionalism)",
            "Recognizes probability-based word selection",
            "Acknowledges AI lacks true understanding of emotions/career implications"
          ]
        }
      }
    ]
  });

  // Handle slide navigation
  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      handleLessonComplete();
    }
  }, [currentSlideIndex, slides.length]);

  const goToPreviousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
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
    
    // Only auto-advance for certain slide types (not sandbox slides)
    const currentSlide = slides[currentSlideIndex];
    const shouldAutoAdvance = currentSlide && 
      !['sandbox', 'interactive_sandbox', 'fill-blank', 'multiple-choice'].includes(currentSlide.type);
    
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

  // Touch event handlers for mobile navigation
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartY.current || !touchStartX.current) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    
    const diffY = touchStartY.current - touchEndY;
    const diffX = touchStartX.current - touchEndX;
    
    // Detect swipe direction (prioritize vertical swipes)
    if (Math.abs(diffY) > Math.abs(diffX)) {
      // Vertical swipe
      if (diffY > 50) {
        // Swipe up - next slide
        goToNextSlide();
      } else if (diffY < -50) {
        // Swipe down - previous slide
        goToPreviousSlide();
      }
    } else {
      // Horizontal swipe
      if (diffX > 50) {
        // Swipe left - next slide
        goToNextSlide();
      } else if (diffX < -50) {
        // Swipe right - previous slide
        goToPreviousSlide();
      }
    }
    
    touchStartY.current = null;
    touchStartX.current = null;
  };

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
            const starSize = Math.random() * 3 + 1;

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
            const starSize = Math.random() * 3 + 1;

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
      className="fixed inset-0 bg-gradient-to-br from-gray-950 via-slate-950 to-black z-50 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Star Animation Container for LessonViewer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(120)].map((_, i) => {
          const screenH = window.innerHeight;
          const screenW = window.innerWidth;
          const initialY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const targetY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const initialX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const targetX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const starDuration = 30 + Math.random() * 25;
          const starSize = Math.random() * 3 + 1;

          return (
            <motion.div
              key={`lesson-viewer-star-${i}`}
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
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
        <motion.div 
          className="h-full bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Exit Button (top-right corner) */}
      <button
        onClick={() => setShowExitModal(true)}
        className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        ✕
      </button>

      {/* Slide Counter (top-left corner) */}
      <div className="absolute top-4 left-4 z-20 bg-black/50 rounded-full px-3 py-1 text-white text-sm">
        {currentSlideIndex + 1} / {slides.length}
      </div>

      {/* Main Slide Content */}
      <div className="h-full flex flex-col pt-8 pb-20 overflow-y-auto">
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
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