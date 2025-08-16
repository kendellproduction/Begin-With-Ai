import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, animations } from '../utils/framerMotion';
import { useAuth } from '../contexts/AuthContext';
import { useProgressTracking } from '../hooks/useProgressTracking';
import { useGamification } from '../contexts/GamificationContext';
import ContentBlockRenderer from './ContentBlocks/ContentBlockRenderer';
import { BLOCK_TYPES } from './ContentBlocks/constants';
import { initAudio, playSuccessChime, playErrorSound } from '../utils/audioUtils';
// Note: Static adaptive lesson imports removed - using database only
import { findLessonAcrossAllPaths } from '../services/firestoreService';
import IntegratedPodcastPlayer from './IntegratedPodcastPlayer';
import OptimizedStarField from './OptimizedStarField';
import logger from '../utils/logger';

const ModernLessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { completeLesson, awardXP } = useProgressTracking();
  const { showNotification } = useGamification();
  
  // Core state
  const [lesson, setLesson] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [isComplete, setIsComplete] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  
  // Progress tracking
  const [completedBlocks, setCompletedBlocks] = useState(new Set());
  const [totalProgress, setTotalProgress] = useState(0);
  const [lastBookmark, setLastBookmark] = useState(null);
  
  // Quiz completion tracking for conditional content display
  const [quizCompletionState, setQuizCompletionState] = useState(new Map());
  const [contentSections, setContentSections] = useState([]);
  
  // Navigation and UX
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [xpNotifications, setXpNotifications] = useState([]);
  const [showPodcastPlayer, setShowPodcastPlayer] = useState(false);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  // Initialize audio and scroll tracking
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
    
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('click', handleFirstInteraction);
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;
      
      setShowScrollToTop(scrollTop > 300);
      updateProgressBar(scrollProgress);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Load lesson data and convert to content blocks
  useEffect(() => {
    loadLessonData();
  }, [lessonId, difficulty]);

  // Determine lesson tier based on user subscription
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlDifficulty = urlParams.get('difficulty');
    const stateDifficulty = location.state?.difficulty;
    
    // Map user subscription to lesson tier
    const userTier = user?.subscriptionTier || 'free';
    const lessonTier = userTier === 'premium' ? 'premium' : 'free';
    
    // Use provided difficulty or default to user's tier
    let finalDifficulty = urlDifficulty || stateDifficulty || lessonTier;
    
    // Map old difficulty levels to new system
    if (finalDifficulty === 'beginner' || finalDifficulty === 'intermediate') {
      finalDifficulty = 'free';
    } else if (finalDifficulty === 'advanced') {
      finalDifficulty = 'premium';
    }
    
    setDifficulty(finalDifficulty);
  }, [location, user?.subscriptionTier]);

  // Check for preview mode and data
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const isPreviewMode = urlParams.get('preview') === 'true';
    const previewData = urlParams.get('data');
    
    if (isPreviewMode) {
      if (previewData) {
        // Load preview data from URL parameter
        try {
          const parsedData = JSON.parse(decodeURIComponent(previewData));
          setLesson(parsedData);
          
          // Convert pages to content blocks
          if (parsedData.pages && Array.isArray(parsedData.pages)) {
            const blocks = parsedData.pages.flatMap(page => page.blocks || []);
            setContentBlocks(blocks);
          }
          
          setIsLoading(false);
          logger.info('Loaded lesson from preview data');
          return;
        } catch (error) {
          logger.error('Error parsing preview data:', error);
        }
      } else {
        // Check localStorage for preview data
        const previewKey = `lesson_preview_${lessonId}`;
        const storedPreview = localStorage.getItem(previewKey);
        
        if (storedPreview) {
          try {
            const previewLesson = JSON.parse(storedPreview);
            setLesson(previewLesson);
            
            // Convert lesson data to content blocks format
            const convertedLesson = convertFirestoreLessonToViewer(previewLesson);
            const blocks = convertLessonToContentBlocks(convertedLesson);
            setContentBlocks(blocks);
            
            setIsLoading(false);
            logger.info('Loaded lesson from preview localStorage');
            return;
          } catch (error) {
            logger.error('Error parsing stored preview data:', error);
          }
        }
      }
    }
  }, [lessonId, location.search]);

  const loadLessonData = async () => {
    setIsLoading(true);
    logger.info('Loading lesson for modern viewer:', lessonId, 'difficulty:', difficulty);
    
    try {
      let lessonData = null;
      let loadedFromFirestore = false;
      
      // FIRST: Check if this lesson exists in Firestore (published via admin panel)
      // This should always take priority over static content
      try {
        const firestoreLesson = await findLessonAcrossAllPaths(lessonId);
        if (firestoreLesson && firestoreLesson.title && firestoreLesson.id) {
          logger.info(`Found lesson ${lessonId} in Firestore:`, firestoreLesson);
          
          // Convert Firestore lesson format to content blocks format
          lessonData = convertFirestoreLessonToViewer(firestoreLesson);
          loadedFromFirestore = true;
          setLesson(lessonData);
          const blocks = convertLessonToContentBlocks(lessonData);
          const sections = organizeBlocksIntoSections(blocks);
          setContentSections(sections);
          
          // Flatten sections to blocks for backward compatibility
          const flattenedBlocks = sections.flatMap(section => section.blocks);
          setContentBlocks(flattenedBlocks);
          
          // Load saved progress/bookmark
          loadLessonBookmark(lessonId);
          setIsLoading(false);
          
          logger.info(`Successfully loaded lesson ${lessonId} from Firestore`);
          return;
        } else {
          logger.error(`Lesson ${lessonId} not found in database`);
          setError(`Lesson "${lessonId}" not found. Please contact support if this lesson should exist.`);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        logger.error('Error loading lesson from database:', error);
        setError(`Error loading lesson "${lessonId}". Please try again or contact support.`);
        setIsLoading(false);
        return;
      }
      
      setLesson(lessonData);
      const blocks = convertLessonToContentBlocks(lessonData);
      const sections = organizeBlocksIntoSections(blocks);
      setContentSections(sections);
      
      // Flatten sections to blocks for backward compatibility
      const flattenedBlocks = sections.flatMap(section => section.blocks);
      setContentBlocks(flattenedBlocks);
      
      // Load saved progress/bookmark
      loadLessonBookmark(lessonId);
      
    } catch (error) {
      logger.error('Error loading lesson:', error);
      showNotification('Error loading lesson. Please try again.', 'error');
      
      // Final fallback - create a basic lesson so the app doesn't break
      const fallbackLesson = createFallbackLesson(lessonId, difficulty);
      setLesson(fallbackLesson);
      const blocks = convertLessonToContentBlocks(fallbackLesson);
      setContentBlocks(blocks);
    }
    
    setIsLoading(false);
  };

  // Convert Firestore lesson format to the format expected by the lesson viewer
  const convertFirestoreLessonToViewer = (firestoreLesson) => {
    const contentPages = firestoreLesson.content || firestoreLesson.contentVersions?.free?.pages || [];
    const premiumPages = firestoreLesson.premiumContent || firestoreLesson.contentVersions?.premium?.pages || [];
    
    // Use appropriate pages based on user tier
    const pagesToUse = (difficulty === 'premium' && premiumPages.length > 0) ? premiumPages : contentPages;
    
    // Convert content blocks to slides format for compatibility
    const slides = [];
    
    pagesToUse.forEach((page, pageIndex) => {
      if (page.blocks && Array.isArray(page.blocks)) {
        page.blocks.forEach((block, blockIndex) => {
          const slideId = `${firestoreLesson.id}-page-${pageIndex}-block-${blockIndex}`;
          
          switch (block.type) {
            case 'heading':
              slides.push({
                id: slideId,
                type: 'intro',
                content: {
                  title: block.content?.text || 'Lesson Content',
                  subtitle: firestoreLesson.title || 'Published Lesson',
                  description: firestoreLesson.description || 'Lesson published from admin panel',
                  estimatedTime: firestoreLesson.estimatedTimeMinutes || 15,
                  xpReward: firestoreLesson.xpAward || 100
                }
              });
              break;
              
            case 'text':
              slides.push({
                id: slideId,
                type: 'concept',
                content: {
                  title: block.content?.title || 'Lesson Content',
                  explanation: block.content?.text || '',
                  keyPoints: block.content?.keyPoints || []
                }
              });
              break;
              
            case 'quiz':
              slides.push({
                id: slideId,
                type: 'quiz',
                content: {
                  question: block.content?.question || 'Quiz Question',
                  options: block.content?.options || [],
                  correctAnswer: block.content?.correctAnswer || 0,
                  explanation: block.content?.explanation || 'Good job!'
                }
              });
              break;
              
            case 'sandbox':
              slides.push({
                id: slideId,
                type: 'sandbox',
                content: {
                  title: block.content?.title || 'Practice Exercise',
                  instructions: block.content?.instructions || 'Try the exercise below',
                  code: block.content?.code || '',
                  language: block.content?.language || 'javascript'
                }
              });
              break;
              
            default:
              // Convert other block types to concept slides
              slides.push({
                id: slideId,
                type: 'concept',
                content: {
                  title: block.content?.title || 'Content',
                  explanation: block.content?.text || block.content?.description || 'Lesson content',
                  keyPoints: []
                }
              });
              break;
          }
        });
      }
    });
    
    // If no slides were created, add a default intro slide
    if (slides.length === 0) {
      slides.push({
        id: `${firestoreLesson.id}-default`,
        type: 'intro',
        content: {
          title: firestoreLesson.title || 'Published Lesson',
          subtitle: 'Updated Content',
          description: firestoreLesson.description || 'This lesson has been updated through the admin panel.',
          estimatedTime: firestoreLesson.estimatedTimeMinutes || 15,
          xpReward: firestoreLesson.xpAward || 100
        }
      });
    }
    
    return {
      id: firestoreLesson.id,
      title: firestoreLesson.title || 'Published Lesson',
      description: firestoreLesson.description || 'Lesson from admin panel',
      estimatedTime: firestoreLesson.estimatedTimeMinutes || 15,
      xpReward: firestoreLesson.xpAward || 100,
      slides: slides,
      difficulty: difficulty,
      pathInfo: {
        pathId: firestoreLesson.pathId,
        pathTitle: firestoreLesson.pathTitle,
        moduleId: firestoreLesson.moduleId,
        moduleTitle: firestoreLesson.moduleTitle
      },
      isFromFirestore: true
    };
  };

  const convertLessonToContentBlocks = (lessonData) => {
    const blocks = [];
    
    // Just the lesson title - no setup content
    blocks.push({
      type: BLOCK_TYPES.HEADING,
      content: {
        text: lessonData.title,
        level: 1,
        animate: true
      },
      config: { milestone: true },
      id: `${lessonId}-title`
    });
    
    // Add all slide content FIRST (always visible educational content)
    const slides = lessonData.slides || [];
    
    // Add all slides content first
    slides.forEach((slide, index) => {
      const blockId = `${lessonId}-${slide.type}-${index}`;
      
      switch (slide.type) {
        case 'concept':
        case 'intro':
          blocks.push({
            type: BLOCK_TYPES.TEXT,
            content: {
              text: `## ${slide.content.title}\n\n${slide.content.explanation || slide.content.description}`,
              markdown: true
            },
            id: blockId
          });
          
          if (slide.content.keyPoints?.length > 0) {
            blocks.push({
              type: BLOCK_TYPES.TEXT,
              content: {
                text: slide.content.keyPoints.map(point => `• ${point}`).join('\n'),
                markdown: true
              },
              id: `${blockId}-keypoints`
            });
          }
          break;
          
        case 'quiz':
          // Handle different quiz data formats
          let correctAnswer = slide.content.correctAnswer;
          let options = slide.content.options || slide.content.choices;
          
          // Quiz processing logic for development debugging
          
          // If options are objects with correct property, find the correct index and extract text
          if (Array.isArray(options) && options.length > 0 && typeof options[0] === 'object' && options[0].hasOwnProperty('correct')) {
            // Find the index of the correct option
            correctAnswer = options.findIndex(option => option.correct === true);
            if (correctAnswer === -1) correctAnswer = 0; // fallback
            
            // Extract text from option objects
            options = options.map(opt => opt.text || opt);
            
            // Processed quiz options for development debugging
          }
          
          // Final quiz block data prepared for rendering

          
          blocks.push({
            type: BLOCK_TYPES.QUIZ,
            content: {
              question: slide.content.question,
              options: options,
              correctAnswer: correctAnswer,
              correctFeedback: slide.content.correctFeedback || slide.content.explanation,
              incorrectFeedback: slide.content.incorrectFeedback || "Not quite right. Try again!"
            },
            config: {
              instantFeedback: false,
              allowRetry: true
            },
            id: blockId
          });
          break;
          
        case 'fill-blank':
          blocks.push({
            type: BLOCK_TYPES.FILL_BLANK,
            content: {
              text: slide.content.sentence || slide.content.text,
              instructions: slide.content.instructions || "Fill in the blanks:"
            },
            config: {
              showHints: true,
              instantFeedback: true
            },
            id: blockId
          });
          break;
          
        case 'progress_checkpoint':
          blocks.push({
            type: BLOCK_TYPES.PROGRESS_CHECKPOINT,
            content: {
              title: slide.content.title || "Progress Check",
              message: slide.content.message || "Great progress so far!",
              progress: slide.content.progress || 50,
              nextSection: slide.content.nextSection || "Continue to next section",
              celebration: slide.content.celebration || "🎉 Well done!"
            },
            config: {
              showCelebration: true,
              autoAdvance: false
            },
            id: blockId
          });
          break;
          
        case 'sandbox':
          blocks.push({
            type: BLOCK_TYPES.SANDBOX,
            content: {
              title: slide.content.title || "Interactive Exercise",
              instructions: slide.content.instructions || "Complete the exercise below:",
              code: slide.content.initialCode || slide.content.code || "// Write your code here",
              language: slide.content.language || 'javascript'
            },
            config: {
              expandable: true,
              showOutput: true
            },
            id: blockId
          });
          break;
          
        case 'example':
          blocks.push({
            type: BLOCK_TYPES.TEXT,
            content: {
              text: `### ${slide.content.title || 'Example'}\n\n${slide.content.example || slide.content.explanation}`,
              markdown: true
            },
            id: blockId
          });
          break;
          
        default:
          // Generic text block for unknown slide types
          blocks.push({
            type: BLOCK_TYPES.TEXT,
            content: {
              text: `### ${slide.content.title || 'Content'}\n\n${slide.content.explanation || slide.content.description || 'Content block'}`,
              markdown: true
            },
            id: blockId
          });
      }
    });
    
    // Add all quiz questions at the END (after all educational content)
    const questions = lessonData.adaptedContent?.assessment?.questions || [];
    questions.forEach((question, index) => {
      const options = question.options;
      let correctAnswer = 0; // default fallback
      let processedOptions = options;
      
      // Process options if they're objects with correct property
      if (Array.isArray(options) && options.length > 0) {
        if (typeof options[0] === 'object' && options[0].hasOwnProperty('correct')) {
          // Find the index of the correct option
          correctAnswer = options.findIndex(option => option.correct === true);
          if (correctAnswer === -1) correctAnswer = 0; // fallback
          
          // Extract text from option objects
          processedOptions = options.map(opt => opt.text || opt);
        }
      }
      
      if (process.env.NODE_ENV === 'development') {
        logger.info('Processing assessment question:', {
          questionIndex: index,
          question: question.question,
          originalOptions: options,
          processedOptions: processedOptions,
          correctAnswer: correctAnswer
        });
      }
      
      blocks.push({
        type: BLOCK_TYPES.QUIZ,
        content: {
          question: question.question,
          options: processedOptions,
          correctAnswer: correctAnswer,
          correctFeedback: question.explanation || "Correct! Well done.",
          incorrectFeedback: "Not quite right. Try again!"
        },
        config: {
          instantFeedback: false,
          allowRetry: true
        },
        id: `${lessonId}-quiz-${index}`
      });
    });

    // Note: Completion blocks will be added dynamically when lesson is truly complete

    return blocks;
  };

  /**
   * Organize content blocks into sections separated by quiz blocks
   * This enables conditional content display based on quiz completion
   * IMPORTANT: Only content after the LAST quiz in a group is hidden
   */
  const organizeBlocksIntoSections = (blocks) => {
    const sections = [];
    let currentSection = [];
    let quizCounter = 0;
    
    // Find all quiz indices first to identify the last quiz
    const quizIndices = blocks.map((block, index) => 
      block.type === BLOCK_TYPES.QUIZ ? index : -1
    ).filter(index => index !== -1);
    
    const lastQuizIndex = quizIndices[quizIndices.length - 1];

    blocks.forEach((block, index) => {
      if (block.type === BLOCK_TYPES.QUIZ) {
        // End current content section (if any) before adding quiz
        if (currentSection.length > 0) {
          sections.push({
            id: `content-${sections.length}`,
            type: 'content',
            blocks: currentSection,
            isVisible: true, // All content is always visible initially
            precedingQuizId: null
          });
          currentSection = [];
        }

        // Add quiz as its own section
        const isLastQuiz = index === lastQuizIndex;
        const isLastInGroup = block.content?.isLastInGroup || false;
        sections.push({
          id: `quiz-${quizCounter}`,
          type: 'quiz',
          blocks: [{ 
            ...block, 
            sectionQuizId: `quiz-${quizCounter}`,
            isLastQuiz: isLastQuiz,
            isLastInGroup: isLastInGroup
          }],
          isVisible: true, // Quizzes are always visible
          precedingQuizId: null,
          isLastQuiz: isLastQuiz,
          isLastInGroup: isLastInGroup
        });
        
        quizCounter++;
      } else if (block.type === BLOCK_TYPES.FILL_BLANK) {
        // Handle fill-blank blocks similarly to quiz blocks if they have isLastInGroup
        const isLastInGroup = block.content?.isLastInGroup || false;
        
        if (isLastInGroup) {
          // End current content section (if any) before adding fill-blank
          if (currentSection.length > 0) {
            sections.push({
              id: `content-${sections.length}`,
              type: 'content',
              blocks: currentSection,
              isVisible: true,
              precedingQuizId: null
            });
            currentSection = [];
          }

          // Add fill-blank as its own section if it's last in group
          sections.push({
            id: `fill-blank-${sections.length}`,
            type: 'fill_blank',
            blocks: [{ 
              ...block, 
              isLastInGroup: true
            }],
            isVisible: true,
            precedingQuizId: null,
            isLastInGroup: true
          });
        } else {
          // Add to current content section
          currentSection.push(block);
        }
      } else {
        // Add to current content section
        currentSection.push(block);
      }
    });

    // Add remaining content as final section
    if (currentSection.length > 0) {
      sections.push({
        id: `content-${sections.length}`,
        type: 'content',
        blocks: currentSection,
        isVisible: true, // Always show content sections initially
        precedingQuizId: null // No quiz dependency for simple lessons
      });
    }

    return sections;
  };

  const createFallbackLesson = (lessonId, difficulty) => {
    return {
      id: lessonId,
      title: `AI Lesson ${lessonId}`,
      description: "Interactive AI learning experience",
      difficulty: difficulty,
      slides: [
        {
          type: 'concept',
          content: {
            title: `Welcome to Lesson ${lessonId}`,
            explanation: "This is an interactive AI lesson designed to help you learn and grow your skills through engaging content and practical examples."
          }
        }
      ]
    };
  };

  // Progress and bookmark management with quiz completion tracking
  const handleBlockComplete = useCallback((blockIndex, completionData) => {
    const newCompleted = new Set([...completedBlocks, blockIndex]);
    setCompletedBlocks(newCompleted);
    
    // Save bookmark at this position
    const bookmark = {
      lessonId,
      blockIndex,
      timestamp: Date.now(),
      scrollPosition: window.pageYOffset
    };
    setLastBookmark(bookmark);
    saveLessonBookmark(bookmark);
    
    // Find the section and block info
    let globalBlockIndex = 0;
    let quizId = null;
    
    for (const section of contentSections) {
      for (const block of section.blocks) {
        if (globalBlockIndex === blockIndex) {
          if (section.type === 'quiz' && block.sectionQuizId) {
            quizId = block.sectionQuizId;
          }
          break;
        }
        globalBlockIndex++;
      }
      if (quizId) break;
    }
    
    // Handle quiz completion - mark quiz as completed regardless of correct/incorrect
    if (quizId && (completionData.type === 'quiz' || completionData.quizAnswered)) {
      const newQuizState = new Map(quizCompletionState);
      newQuizState.set(quizId, true);
      setQuizCompletionState(newQuizState);
      
      // Update visibility of content sections that depend on this quiz
      updateSectionVisibility(newQuizState);
      
      logger.info('Quiz completed:', quizId, 'Answer was:', completionData.correct ? 'correct' : 'incorrect');
    }
    
    // Play success sound and show XP notification for interactive blocks
    if (['quiz', 'fill_blank', 'sandbox'].includes(getBlockTypeFromSections(blockIndex))) {
      if (completionData.correct !== false) {
        playSuccessChime();
        // Show XP notification for successful completions
        showXpNotification(completionData.type || 'interaction');
      } else {
        playErrorSound();
      }
    }
    
    logger.info('Block completed:', blockIndex, completionData);
  }, [completedBlocks, contentSections, quizCompletionState, lessonId]);

  // Helper function to get block type from sections
  const getBlockTypeFromSections = (blockIndex) => {
    let globalIndex = 0;
    for (const section of contentSections) {
      for (const block of section.blocks) {
        if (globalIndex === blockIndex) {
          return block.type;
        }
        globalIndex++;
      }
    }
    return null;
  };

  // Update section visibility based on quiz completion
  const updateSectionVisibility = useCallback((quizState) => {
    setContentSections(prevSections => 
      prevSections.map(section => {
        if (section.type === 'content' && section.precedingQuizId) {
          return {
            ...section,
            isVisible: quizState.get(section.precedingQuizId) || false
          };
        }
        return section; // Quizzes and first content section remain unchanged
      })
    );
  }, []);

  const handleProgressUpdate = useCallback((progressData) => {
    setTotalProgress(progressData.percentage);
    
    // Only complete lesson when all interactive content is done (quiz, sandbox, etc.)
    // Don't count completion/CTA blocks in progress calculation
    const interactiveBlocks = contentBlocks.filter(block => 
      ['quiz', 'sandbox', 'fill_blank'].includes(block.type)
    );
    
    const interactiveCompleted = interactiveBlocks.length === 0 ? 
      progressData.percentage >= 90 : // If no interactive blocks, complete at 90%
      Array.from(completedBlocks).filter(index => 
        interactiveBlocks.some((_, idx) => contentBlocks[index] && interactiveBlocks.includes(contentBlocks[index]))
      ).length >= interactiveBlocks.length;
    
    // Complete lesson when interactive content is done AND user has scrolled through most content
    if (interactiveCompleted && progressData.percentage >= 85 && !isComplete) {
      handleLessonComplete();
    }
  }, [isComplete, contentBlocks, completedBlocks]);

  const handleLessonComplete = async () => {
    if (isComplete) return;
    
    setIsComplete(true);
    
    // Add completion blocks dynamically
    const completionBlocks = [
      {
        type: BLOCK_TYPES.PROGRESS_CHECKPOINT,
        content: {
          title: "Lesson Complete! 🎉",
          description: `Congratulations! You've completed "${lesson?.title || 'this lesson'}".`,
          progress: 100,
          id: `${lessonId}-complete`
        },
        config: {
          milestone: true,
          autoSave: true,
          showProgress: true
        },
        id: `${lessonId}-completion`
      },
      {
        type: BLOCK_TYPES.CALL_TO_ACTION,
        content: {
          title: "Ready for the Next Challenge?",
          description: "Continue your learning journey with the next lesson.",
          buttonText: "Next Lesson →",
          secondaryButtonText: "Back to Lessons",
          action: "next",
          secondaryAction: "lessons"
        },
        config: {
          style: "primary"
        },
        id: `${lessonId}-cta`
      }
    ];
    
    setContentBlocks(prev => [...prev, ...completionBlocks]);
    
    try {
      // Award XP and complete lesson with real data
      const result = await completeLesson(lessonId, {
        score: Math.round(totalProgress),
        xpAward: 50, // Fixed completion bonus
        lessonTitle: lesson?.title || `Lesson ${lessonId}`,
        difficulty: difficulty,
        completionTime: Date.now(),
        blocksCompleted: completedBlocks.size
      });
      
      if (result.success) {
        // Show completion XP notification
        showNotification(`🎯 Lesson Complete! +50 XP bonus!`, 'success');
        
        // Clear bookmark since lesson is complete
        localStorage.removeItem(`lesson_bookmark_${lessonId}`);
        
        // Scroll to completion section smoothly
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }, 500);
      }
      
    } catch (error) {
      logger.error('Error completing lesson:', error);
      showNotification('Lesson completed, but there was an error saving progress.', 'warning');
    }
  };

  // Bookmark functionality
  const saveLessonBookmark = (bookmark) => {
    localStorage.setItem(`lesson_bookmark_${lessonId}`, JSON.stringify(bookmark));
  };

  const loadLessonBookmark = (lessonId) => {
    try {
      const saved = localStorage.getItem(`lesson_bookmark_${lessonId}`);
      if (saved) {
        const bookmark = JSON.parse(saved);
        setLastBookmark(bookmark);
      }
    } catch (error) {
      logger.warn('Error loading bookmark:', error);
    }
  };

  const scrollToBookmark = () => {
    if (lastBookmark?.scrollPosition) {
      window.scrollTo({
        top: lastBookmark.scrollPosition,
        behavior: 'smooth'
      });
      showNotification('Jumped to your last position', 'info');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProgressBar = (progress) => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.min(progress, 100)}%`;
    }
  };

  // Navigation handlers
  const handleExit = () => {
    if (totalProgress > 10) {
      // Save bookmark before exiting if there's significant progress
      if (lastBookmark) {
        saveLessonBookmark(lastBookmark);
      }
      setShowExitModal(true);
    } else {
      navigate('/lessons');
    }
  };

  const confirmExit = () => {
    navigate('/lessons');
  };

  // XP notification system - Quick and catchy
  const showXpNotification = (type) => {
    const xpAmount = 20; // Always 20 XP per question
    // Use a more unique ID to prevent duplicates
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const catchyMessages = [
      "Nice! 🎯", "Great job! 🌟", "Correct! 🎉", "Awesome! ⚡", 
      "Perfect! 💫", "Well done! 🔥", "Yes! 🎊", "Brilliant! ✨"
    ];
    
    const notification = {
      id,
      xp: xpAmount,
      type,
      message: catchyMessages[Math.floor(Math.random() * catchyMessages.length)],
      timestamp: Date.now()
    };
    
    setXpNotifications(prev => [...prev, notification]);
    
    // Auto-remove quickly
    setTimeout(() => {
      setXpNotifications(prev => prev.filter(n => n.id !== id));
    }, 1500);
  };

  // Handle XP notification click/tap dismissal
  const dismissXpNotification = (notificationId) => {
    setXpNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black flex items-center justify-center">
        <OptimizedStarField starCount={220} opacity={0.8} speed={1} size={1.2} />
        <div className="text-center relative z-10">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black flex items-center justify-center">
        <OptimizedStarField starCount={220} opacity={0.8} speed={1} size={1.2} />
        <div className="text-center relative z-10">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl mb-4">Lesson Not Found</h2>
          <p className="text-gray-300 mb-6 max-w-md">{error}</p>
          <button
            onClick={() => navigate('/lessons')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden pwa-safe-top-padding relative">
      <OptimizedStarField starCount={220} opacity={0.8} speed={1} size={1.2} />

      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-30">
        <motion.div 
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ width: 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Enhanced Fixed Header with Better Navigation */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <button
            onClick={handleExit}
            className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-colors shadow-lg backdrop-blur-sm"
            title="Exit lesson"
          >
            ✕
          </button>
          <button
            onClick={() => navigate('/lessons')}
            className="bg-black/70 hover:bg-black/90 rounded-full px-3 py-1 text-white text-sm transition-colors shadow-lg backdrop-blur-sm"
            title="Back to lessons"
          >
            ← Lessons
          </button>
        </div>
        
        <div className="bg-black/70 rounded-full px-3 py-1 text-white text-sm shadow-lg backdrop-blur-sm">
          {Math.round(totalProgress)}% Complete
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPodcastPlayer(!showPodcastPlayer)}
            className={`rounded-full px-3 py-1 text-sm transition-colors shadow-lg backdrop-blur-sm ${
              showPodcastPlayer 
                ? 'bg-purple-600/60 text-purple-100' 
                : 'bg-purple-500/30 hover:bg-purple-500/50 text-purple-200'
            }`}
            title={showPodcastPlayer ? "Hide podcast player" : "Show podcast player"}
          >
            🎙️ Podcast
          </button>
          {lastBookmark && (
            <button
              onClick={scrollToBookmark}
              className="bg-blue-500/30 hover:bg-blue-500/50 rounded-full px-3 py-1 text-blue-200 text-sm transition-colors shadow-lg backdrop-blur-sm"
              title="Jump to last position"
            >
              📖 Resume
            </button>
          )}
          <button
            onClick={scrollToTop}
            className="bg-gray-500/30 hover:bg-gray-500/50 rounded-full px-3 py-1 text-gray-200 text-sm transition-colors shadow-lg backdrop-blur-sm"
            title="Go to top"
          >
            ↑ Top
          </button>
        </div>
      </div>

      {/* Main Content - Section-based with conditional visibility */}
      <div ref={containerRef} className="pt-24 pb-8 relative z-10">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          
          {/* Lesson Header - Title and Description */}
          <div className="text-center mb-12 space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-bold text-white leading-tight"
            >
              {lesson?.title || 'Loading Lesson...'}
            </motion.h1>
              
            {lesson?.description && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              >
                {lesson.description}
              </motion.p>
            )}
            
            {/* Lesson Metadata */}
            {lesson && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center space-x-6 text-sm text-gray-400"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {lesson?.estimatedTimeMinutes || lesson?.estimatedTime || 15} min
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  +{lesson?.xpReward || lesson?.xpAward || 100} XP
                </span>
                {lesson?.difficulty && (
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
                    {lesson.difficulty}
                  </span>
                )}
              </motion.div>
            )}
          </div>
          
          {/* Integrated Podcast Player for AI History Lesson */}
          {showPodcastPlayer && (lessonId === 'history-of-ai' || lessonId === 'welcome-ai-revolution') && (
            <>
              <div className="relative z-20 mb-16">
                <IntegratedPodcastPlayer
                  audioUrl="/The Incredible Story of AI_ From Turing to Today.wav" // Your uploaded AI history audio
                  title={lesson?.title || "The Incredible True Story of Artificial Intelligence"}
                  chapters={[
                    { title: "The Codebreaker Who Started It All", time: 0 },
                    { title: "When the Internet Changed Everything", time: 540 },
                    { title: "The Day AI Became Everyone's Assistant", time: 1080 }
                  ]}
                  className=""
                />
              </div>
              
              {/* Spacer for better separation */}
              <div className="h-8"></div>
            </>
          )}
          
          {contentSections.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>Loading lesson content...</p>
            </div>
          ) : (
            contentSections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: section.isVisible ? 1 : 0.3,
                  y: 0,
                  height: 'auto'
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeInOut"
                }}
                className={section.isVisible ? '' : 'pointer-events-none'}
              >
                {/* Show locked content indicator for hidden sections */}
                {!section.isVisible && section.precedingQuizId && (
                  <div className="mb-4 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
                    <p className="text-gray-500 text-center text-sm">
                      🔒 Complete the quiz above to unlock this content
                    </p>
                  </div>
                )}
                
                {/* Always render content, but make it interactive only when visible */}
                <div className={!section.isVisible ? 'filter blur-sm' : ''}>
                  <ContentBlockRenderer
                    blocks={section.blocks}
                    onBlockComplete={section.isVisible ? handleBlockComplete : () => {}}
                    onProgressUpdate={section.isVisible ? handleProgressUpdate : () => {}}
                    config={{
                      lazyLoading: true,
                      animations: section.isVisible,
                      trackProgress: section.isVisible,
                      preloadOffset: 2,
                      disabled: !section.isVisible,
                      globalBlockOffset: contentSections
                        .slice(0, sectionIndex)
                        .reduce((acc, s) => acc + s.blocks.length, 0)
                    }}
                    className={`space-y-6 ${!section.isVisible ? 'opacity-40' : ''}`}
                  />
                </div>
                
                {/* Show unlock hint only after the LAST quiz section or questions marked as last in group */}
                {((section.type === 'quiz' && (section.isLastQuiz || section.isLastInGroup)) || 
                  (section.type === 'fill_blank' && section.isLastInGroup)) && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-300 text-sm text-center">
                      💡 Answer this {section.type === 'quiz' ? 'quiz' : 'question'} to unlock the next section!
                    </p>
                  </div>
                )}
              </motion.div>
            ))
          )}
          
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-900/50 rounded-lg text-xs text-gray-400">
              <p>Debug Info:</p>
              <p>Sections: {contentSections.length}</p>
              <p>Visible sections: {contentSections.filter(s => s.isVisible).length}</p>
              <p>Quiz completion state: {JSON.stringify(Object.fromEntries(quizCompletionState))}</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-colors"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-sm mx-4 text-center"
          >
            <h3 className="text-xl font-bold text-white mb-4">Exit Lesson?</h3>
            <p className="text-gray-300 mb-6">
              Your progress will be saved. You can resume from where you left off.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Stay
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Exit & Save
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* XP Notifications - Quick, Catchy, and Dismissible */}
      <AnimatePresence>
        {xpNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            transition={{ 
              duration: 0.2,
              exit: { duration: 0.15 }
            }}
            className="fixed top-20 right-4 z-50 cursor-pointer"
            style={{ top: `${80 + xpNotifications.indexOf(notification) * 60}px` }}
            onClick={() => dismissXpNotification(notification.id)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium border border-green-400/30 backdrop-blur-sm transform hover:scale-105 transition-transform">
              <span className="text-lg">{notification.message.split(' ')[1] || '🎉'}</span>
              <div className="flex flex-col items-start">
                <span className="text-xs text-green-100">{notification.message.split(' ')[0]}</span>
                <span className="font-bold text-yellow-200">+{notification.xp} XP</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>


    </div>
  );
};

export default ModernLessonViewer; 