import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import LoggedInNavbar from './LoggedInNavbar';
import OptimizedStarField from './OptimizedStarField';

const AdaptiveLearningPathQuiz = () => {
  const { user } = useAuth();
  const { awardXP } = useGamification();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [allowRetake, setAllowRetake] = useState(false);

  // Motivational AI quotes that rotate on each page load
  const aiQuotes = [
    {
      quote: "The best way to predict the future is to create it.",
      author: "Peter Drucker"
    },
    {
      quote: "AI is not about replacing humans; it's about augmenting human intelligence.",
      author: "Fei-Fei Li"
    },
    {
      quote: "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.",
      author: "Edsger W. Dijkstra"
    },
    {
      quote: "Success in creating AI would be the biggest event in human history.",
      author: "Stephen Hawking"
    },
    {
      quote: "AI will probably most likely lead to the end of the world, but in the meantime, there'll be great companies.",
      author: "Sam Altman"
    },
    {
      quote: "The real question is not whether machines think but whether men do.",
      author: "B.F. Skinner"
    },
    {
      quote: "We're at the beginning of a golden age of AI. Recent progress has been dramatic and will accelerate.",
      author: "Jeff Bezos"
    },
    {
      quote: "The development of full artificial intelligence could spell the end of the human race... but also the beginning of something incredible.",
      author: "Stephen Hawking"
    },
    {
      quote: "AI doesn't have to be evil to destroy humanity – if AI has a goal and humanity just happens to come in the way, it will destroy humanity as a matter of course.",
      author: "Elon Musk"
    },
    {
      quote: "The future belongs to those who understand that AI is not about the technology, but about using it to solve real problems.",
      author: "Andrew Ng"
    }
  ];

  // Set a random quote on component mount
  useEffect(() => {
    const randomQuote = aiQuotes[Math.floor(Math.random() * aiQuotes.length)];
    setMotivationalQuote(randomQuote);
  }, []);

  // Enhanced 12-question assessment with more thoughtful questions
  const questions = [
    // Welcome & Introduction Slide
    {
      id: 'welcome-slide',
      category: '👋 Welcome to BeginningWithAi',
      question: "Let's create your personalized AI learning path!",
      type: 'info-slide',
      content: {
        title: "Welcome to Your AI Journey",
        description: "This quick assessment will help us create a learning experience that's perfect for you.",
        features: [
          {
            icon: "🎯",
            title: "Personalized Path",
            description: "Get lessons tailored to your experience level"
          },
          {
            icon: "📚",
            title: "Interactive Learning",
            description: "Hands-on lessons with real examples"
          },
          {
            icon: "⚡",
            title: "Quick Start",
            description: "Just a few questions to get started"
          }
        ]
      }
    },
    
    // Core Experience Questions
    {
      id: 'ai-experience',
      category: '🎯 Your AI Experience',
      question: "How would you describe your current experience with AI tools?",
      type: 'single',
      helpText: "This helps us understand where to start your journey",
      options: [
        { 
          value: 'never', 
          text: "I've never used AI tools like ChatGPT or similar", 
          points: { beginner: 3, intermediate: 0, advanced: 0 },
          description: "Perfect! We'll start with the fundamentals"
        },
        { 
          value: 'few-times', 
          text: "I've tried ChatGPT or similar tools a few times", 
          points: { beginner: 2, intermediate: 1, advanced: 0 },
          description: "Great! We'll build on your initial experience"
        },
        { 
          value: 'regular', 
          text: "I use AI tools regularly (weekly or more)", 
          points: { beginner: 0, intermediate: 3, advanced: 1 },
          description: "Excellent! We'll focus on advanced techniques"
        },
        { 
          value: 'advanced', 
          text: "I'm comfortable with multiple AI tools and advanced features", 
          points: { beginner: 0, intermediate: 1, advanced: 3 },
          description: "Amazing! We'll challenge you with expert content"
        }
      ]
    },
    
    {
      id: 'motivation',
      category: '🚀 Your Motivation',
      question: "What's driving your interest in learning AI right now?",
      type: 'single',
      helpText: "Understanding your motivation helps us tailor the content tone and pace",
      options: [
        { 
          value: 'curiosity', 
          text: "Pure curiosity - AI fascinates me", 
          points: { beginner: 2, intermediate: 2, advanced: 1 },
          description: "We'll feed that curiosity with engaging content"
        },
        { 
          value: 'career', 
          text: "Career advancement or job requirements", 
          points: { beginner: 1, intermediate: 3, advanced: 2 },
          description: "We'll focus on practical, job-relevant skills"
        },
        { 
          value: 'productivity', 
          text: "I want to be more productive in my daily work", 
          points: { beginner: 2, intermediate: 2, advanced: 1 },
          description: "We'll emphasize productivity tools and workflows"
        },
        { 
          value: 'future-ready', 
          text: "Staying ahead of technological change", 
          points: { beginner: 1, intermediate: 2, advanced: 3 },
          description: "We'll cover cutting-edge developments and trends"
        },
        { 
          value: 'problem-solving', 
          text: "I have specific problems I want AI to help solve", 
          points: { beginner: 0, intermediate: 2, advanced: 3 },
          description: "We'll focus on solution-oriented applications"
        }
      ]
    },

    {
      id: 'comfort-with-change',
      category: '🌟 Your Learning Comfort Zone',
      question: "How do you typically feel when encountering new technology?",
      type: 'single',
      helpText: "This helps us adjust the pace and support level",
      options: [
        { 
          value: 'excited', 
          text: "Excited and eager to dive in", 
          points: { beginner: 0, intermediate: 2, advanced: 3 },
          description: "We'll give you challenging, fast-paced content"
        },
        { 
          value: 'cautiously-optimistic', 
          text: "Cautiously optimistic with proper guidance", 
          points: { beginner: 1, intermediate: 3, advanced: 1 },
          description: "We'll provide clear guidance with steady progression"
        },
        { 
          value: 'need-time', 
          text: "I need time to understand before moving forward", 
          points: { beginner: 3, intermediate: 1, advanced: 0 },
          description: "We'll take it slow with plenty of explanation"
        },
        { 
          value: 'overwhelmed', 
          text: "Often feel overwhelmed but push through anyway", 
          points: { beginner: 2, intermediate: 0, advanced: 0 },
          description: "We'll provide extra support and encouragement"
        }
      ]
    },



    // App Overview Slide
    {
      id: 'app-features-slide',
      category: '✨ What You\'ll Experience',
      question: "Here's what makes BeginningWithAi special:",
      type: 'info-slide',
      content: {
        title: "Your Learning Experience Features",
        description: "These features work together to create an engaging, effective learning experience:",
        features: [
          {
            icon: "🎮",
            title: "Gamified Learning",
            description: "Earn XP, unlock badges, and maintain learning streaks to stay motivated"
          },
          {
            icon: "🤖",
            title: "AI-Powered Feedback",
            description: "Get instant, personalized feedback on your code and progress from AI mentors"
          },
          {
            icon: "🔄",
            title: "Adaptive Content",
            description: "Content automatically adjusts to your pace and comprehension level"
          },
          {
            icon: "💼",
            title: "Real-World Projects",
            description: "Build portfolio-worthy projects that demonstrate practical AI skills"
          }
        ]
      }
    },

    {
      id: 'technical-comfort',
      category: '⚡ Technical Comfort Level',
      question: "How comfortable are you with learning technical concepts?",
      type: 'single',
      helpText: "This affects how we present technical information",
      options: [
        { 
          value: 'avoid', 
          text: "I usually avoid technical details", 
          points: { beginner: 3, intermediate: 0, advanced: 0 },
          description: "We'll focus on concepts with minimal technical jargon"
        },
        { 
          value: 'basic', 
          text: "I can handle basic technical concepts with good explanations", 
          points: { beginner: 2, intermediate: 2, advanced: 0 },
          description: "We'll provide clear technical explanations"
        },
        { 
          value: 'comfortable', 
          text: "I'm comfortable with technical concepts and enjoy learning them", 
          points: { beginner: 1, intermediate: 2, advanced: 2 },
          description: "We'll include detailed technical content"
        },
        { 
          value: 'expert', 
          text: "I love diving deep into technical details and specifications", 
          points: { beginner: 0, intermediate: 1, advanced: 3 },
          description: "We'll provide in-depth technical analysis"
        }
      ]
    },



    {
      id: 'ai-tools-used',
      category: '🛠️ AI Tools Experience',
      question: "Which AI tools have you used? (Select all that apply)",
      type: 'multiple',
      helpText: "This helps us avoid repeating what you already know",
      options: [
        { 
          value: 'chatgpt', 
          text: "ChatGPT or other text AI", 
          points: { beginner: 1, intermediate: 1, advanced: 0 },
          description: "Basic conversational AI experience"
        },
        { 
          value: 'image-ai', 
          text: "Image AI (DALL-E, Midjourney, Stable Diffusion)", 
          points: { beginner: 1, intermediate: 1, advanced: 1 },
          description: "Creative AI tools experience"
        },
        { 
          value: 'code-ai', 
          text: "Code AI (GitHub Copilot, Claude, Cursor)", 
          points: { beginner: 0, intermediate: 1, advanced: 2 },
          description: "Programming assistance tools"
        },
        { 
          value: 'voice-ai', 
          text: "Voice AI (Whisper, ElevenLabs, Voice assistants)", 
          points: { beginner: 0, intermediate: 1, advanced: 2 },
          description: "Audio AI applications"
        },
        { 
          value: 'business-ai', 
          text: "Business AI tools (analytics, automation platforms)", 
          points: { beginner: 0, intermediate: 2, advanced: 2 },
          description: "Enterprise AI solutions"
        },
        { 
          value: 'apis', 
          text: "AI APIs or custom integrations", 
          points: { beginner: 0, intermediate: 0, advanced: 3 },
          description: "Advanced technical implementation"
        },
        { 
          value: 'none', 
          text: "None of these", 
          points: { beginner: 2, intermediate: 0, advanced: 0 },
          description: "Fresh start - we'll cover everything"
        }
      ]
    },

    {
      id: 'learning-style',
      category: '📚 Your Learning Style',
      question: "How do you prefer to absorb and retain new information?",
      type: 'single',
      helpText: "We'll match your preferred learning approach",
      options: [
        { 
          value: 'theory-first', 
          text: "Theory first - I need to understand the 'why' before the 'how'", 
          points: { beginner: 2, intermediate: 1, advanced: 1 },
          description: "Concept-driven lessons with strong foundations"
        },
        { 
          value: 'hands-on', 
          text: "Hands-on immediately - I learn by doing", 
          points: { beginner: 1, intermediate: 3, advanced: 2 },
          description: "Interactive exercises from the start"
        },
        { 
          value: 'examples', 
          text: "Real examples and case studies", 
          points: { beginner: 2, intermediate: 2, advanced: 1 },
          description: "Practical examples and use cases"
        },
        { 
          value: 'project-based', 
          text: "Building complete projects while learning", 
          points: { beginner: 0, intermediate: 2, advanced: 3 },
          description: "End-to-end project development"
        },
        { 
          value: 'mixed', 
          text: "A mix of everything - variety keeps me engaged", 
          points: { beginner: 1, intermediate: 2, advanced: 1 },
          description: "Varied approaches for maximum engagement"
        }
      ]
    },

    {
      id: 'work-context',
      category: '💼 Your Application Context',
      question: "Where do you plan to apply your AI knowledge? (Select all that apply)",
      type: 'multiple',
      helpText: "This helps us include relevant examples and use cases",
      options: [
        { 
          value: 'writing', 
          text: "Writing and content creation", 
          points: { beginner: 2, intermediate: 2, advanced: 1 },
          description: "Content generation and editing tools"
        },
        { 
          value: 'research', 
          text: "Research and information gathering", 
          points: { beginner: 2, intermediate: 2, advanced: 1 },
          description: "Information synthesis and analysis"
        },
        { 
          value: 'automation', 
          text: "Automating repetitive tasks", 
          points: { beginner: 1, intermediate: 2, advanced: 2 },
          description: "Workflow optimization and automation"
        },
        { 
          value: 'analysis', 
          text: "Data analysis and business insights", 
          points: { beginner: 0, intermediate: 2, advanced: 3 },
          description: "Advanced analytics and reporting"
        },
        { 
          value: 'creative', 
          text: "Creative projects and design", 
          points: { beginner: 1, intermediate: 2, advanced: 2 },
          description: "Creative AI applications"
        },
        { 
          value: 'education', 
          text: "Education and training", 
          points: { beginner: 1, intermediate: 2, advanced: 1 },
          description: "Educational technology and personalized learning"
        },
        { 
          value: 'personal', 
          text: "Personal productivity and organization", 
          points: { beginner: 2, intermediate: 1, advanced: 0 },
          description: "Personal AI assistants and tools"
        },
        { 
          value: 'unsure', 
          text: "I'm exploring possibilities", 
          points: { beginner: 2, intermediate: 1, advanced: 0 },
          description: "We'll help you discover applications"
        }
      ]
    },

    {
      id: 'challenge-level',
      category: '🎯 Your Challenge Preference',
      question: "What level of intellectual challenge motivates you most?",
      type: 'single',
      helpText: "This determines the complexity and pace of your lessons",
      options: [
        { 
          value: 'gentle', 
          text: "Gentle progression with lots of support and encouragement", 
          points: { beginner: 3, intermediate: 0, advanced: 0 },
          description: "Supportive, confidence-building approach"
        },
        { 
          value: 'moderate', 
          text: "Moderate challenge with clear guidance and milestones", 
          points: { beginner: 1, intermediate: 3, advanced: 1 },
          description: "Balanced challenge with structured support"
        },
        { 
          value: 'challenging', 
          text: "Challenging but achievable goals that push my limits", 
          points: { beginner: 0, intermediate: 2, advanced: 2 },
          description: "Stimulating challenges with growth mindset"
        },
        { 
          value: 'intense', 
          text: "Push me to my intellectual limits - I thrive under pressure", 
          points: { beginner: 0, intermediate: 0, advanced: 3 },
          description: "Maximum challenge for rapid advancement"
        }
      ]
    },


  ];

  const totalQuestions = questions.length;
  // Count only actual questions (not info slides) for progress calculation
  const actualQuestions = questions.filter(q => q.type !== 'info-slide');
  const completedAnswers = Object.keys(answers).length;
  const progress = actualQuestions.length > 0 ? (completedAnswers / actualQuestions.length) * 100 : 0;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (questionId, selectedValue) => {
    const newAnswers = { ...answers, [questionId]: selectedValue };
    setAnswers(newAnswers);

    // For multiple choice, handle array of selections
    if (currentQuestion.type === 'multiple') {
      setSelectedAnswers(prev => {
        if (prev.includes(selectedValue)) {
          return prev.filter(val => val !== selectedValue);
        } else {
          return [...prev, selectedValue];
        }
      });
    } else {
      // For single choice, move to next question immediately
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswers([]); // Reset for next question
        } else {
          finishQuiz(newAnswers);
        }
      }, 300); // Small delay for visual feedback
    }
  };

  const handleInfoSlideNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleMultipleChoiceContinue = () => {
    const newAnswers = { 
      ...answers, 
      [currentQuestion.id]: selectedAnswers.length > 0 ? selectedAnswers : ['none'] 
    };
    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswers([]);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    const scores = { beginner: 0, intermediate: 0, advanced: 0 };
    let totalWeight = 0;

    // Calculate weighted scores
    questions.forEach(question => {
      const answer = finalAnswers[question.id];
      if (!answer) return;

      const weight = question.id === 'ai-experience' ? 3 : 1; // Give more weight to experience
      totalWeight += weight;

      if (Array.isArray(answer)) {
        // Multiple choice - sum all selected options
        answer.forEach(value => {
          const option = question.options.find(opt => opt.value === value);
          if (option) {
            scores.beginner += (option.points.beginner || 0) * weight;
            scores.intermediate += (option.points.intermediate || 0) * weight;
            scores.advanced += (option.points.advanced || 0) * weight;
          }
        });
      } else {
        // Single choice
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          scores.beginner += (option.points.beginner || 0) * weight;
          scores.intermediate += (option.points.intermediate || 0) * weight;
          scores.advanced += (option.points.advanced || 0) * weight;
        }
      }
    });

    // Normalize scores
    const maxScore = Math.max(scores.beginner, scores.intermediate, scores.advanced);
    const skillLevel = maxScore === scores.beginner ? 'beginner' : 
                     maxScore === scores.intermediate ? 'intermediate' : 'advanced';

    // Calculate confidence based on score spread
    const scoreValues = Object.values(scores);
    const avgScore = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
    const variance = scoreValues.reduce((acc, score) => acc + Math.pow(score - avgScore, 2), 0) / scoreValues.length;
    const confidence = Math.min(0.95, 0.5 + (Math.sqrt(variance) / avgScore));

    return {
      skillLevel,
      confidence: Math.round(confidence * 100),
      scores: {
        beginner: Math.round((scores.beginner / totalWeight) * 100),
        intermediate: Math.round((scores.intermediate / totalWeight) * 100),
        advanced: Math.round((scores.advanced / totalWeight) * 100)
      },
      recommendations: generateRecommendations(skillLevel, finalAnswers)
    };
  };

  const generateRecommendations = (skillLevel, answers) => {
    const motivation = answers['motivation'];
    const challengeLevel = answers['challenge-level'];
    const workContext = answers['work-context'] || [];
    const learningStyle = answers['learning-style'];
    const comfortLevel = answers['comfort-with-change'];

    // Personalized approach based on comfort level
    let approachTone = "supportive guidance";
    if (comfortLevel === 'overwhelmed' || comfortLevel === 'need-time') {
      approachTone = "gentle, patient guidance with time to truly understand each concept";
    } else if (comfortLevel === 'excited') {
      approachTone = "energetic, challenging content that matches your enthusiasm";
    } else if (comfortLevel === 'cautiously-optimistic') {
      approachTone = "structured, confidence-building progression";
    }

    // Personalized focus areas based on work context
    let contextualFocus = [];
    if (Array.isArray(workContext)) {
      if (workContext.includes('writing')) contextualFocus.push("Content creation and writing enhancement");
      if (workContext.includes('research')) contextualFocus.push("Research acceleration and information synthesis");
      if (workContext.includes('automation')) contextualFocus.push("Workflow automation and efficiency tools");
      if (workContext.includes('analysis')) contextualFocus.push("Data analysis and business intelligence");
      if (workContext.includes('creative')) contextualFocus.push("Creative AI applications and artistic tools");
      if (workContext.includes('education')) contextualFocus.push("Educational technology and learning enhancement");
      if (workContext.includes('personal')) contextualFocus.push("Personal productivity optimization");
    }

    const recommendations = {
      beginner: {
        title: "🌟 AI Foundations Journey",
        description: "Perfect for building your AI confidence! We'll guide you step-by-step through the exciting world of AI, making sure you feel supported every step of the way.",
        approach: `We believe everyone can master AI, and we'll prove it to you. With ${approachTone}, you'll discover that AI isn't just for tech experts – it's for curious minds like yours who want to do more, create more, and achieve more.`,
        focusAreas: [
          "AI fundamentals that actually make sense",
          "Practical prompt writing you'll use daily",
          "Essential AI tools that boost your capabilities",
          "Real-world applications you can implement immediately",
          ...(contextualFocus.length > 0 ? contextualFocus.slice(0, 2) : [])
        ],
        startingPath: "AI Foundations",
        difficulty: challengeLevel === 'gentle' ? "Gentle and encouraging" : "Steady with plenty of support",
        estimatedTime: "Perfect pacing for your learning style"
      },
      intermediate: {
        title: "🚀 AI Skills Accelerator", 
        description: "Excellent! You're ready to unlock AI's true potential. We'll take your existing knowledge and transform it into practical skills that make a real difference in everything you do.",
        approach: `You've shown you can learn, and now we'll show you how to excel. With ${approachTone}, you'll develop the kind of AI skills that don't just impress others – they transform how you work, create, and solve problems.`,
        focusAreas: [
          "Advanced prompting that gets incredible results",
          "Multi-tool workflows that save hours of work",
          "Strategic AI thinking that solves real problems",
          "Professional techniques that set you apart",
          ...(contextualFocus.length > 0 ? contextualFocus.slice(0, 3) : [])
        ],
        startingPath: "Prompt Engineering Mastery",
        difficulty: challengeLevel === 'challenging' ? "Stimulating and growth-focused" : 
                   challengeLevel === 'moderate' ? "Perfectly balanced challenge" : "Steady advancement with clear wins",
        estimatedTime: "Optimized for meaningful progress"
      },
      advanced: {
        title: "🎯 AI Mastery Program",
        description: "Outstanding! You're ready to become an AI leader. We'll help you develop the advanced skills that don't just use AI – they shape its future and yours.",
        approach: `You're here because you know AI will define the future, and you want to be part of creating it. With ${approachTone}, you'll master the cutting-edge techniques that separate AI users from AI innovators.`,
        focusAreas: [
          "Advanced AI architectures and system design",
          "Custom automation that scales with your ambitions",
          "Emerging technologies that give you a competitive edge",
          "Leadership strategies for AI transformation",
          ...(contextualFocus.length > 0 ? contextualFocus : [])
        ],
        startingPath: "Advanced AI Engineering",
        difficulty: challengeLevel === 'intense' ? "Maximum challenge for maximum growth" : 
                   challengeLevel === 'challenging' ? "Expert-level with strategic guidance" : "Advanced yet achievable",
        estimatedTime: "Designed for deep mastery"
      }
    };

    return recommendations[skillLevel];
  };

  const finishQuiz = async (finalAnswers) => {
    setIsLoading(true);
    
    // Calculate results
    const quizResults = calculateResults(finalAnswers);
    quizResults.completedAt = new Date().toISOString();
    quizResults.answersProvided = Object.keys(finalAnswers).length;

    setResults(quizResults);
    setIsComplete(true);

    // Award XP for completing assessment - with proper error handling
    if (user && awardXP && typeof awardXP === 'function') {
      try {
        awardXP(50, 'Completed AI Learning Path Assessment');
      } catch (error) {
        // XP award not available
      }
    }

    // Save comprehensive quiz completion state
    const quizCompletionState = {
      completed: true,
      results: quizResults,
      completedAt: new Date().toISOString(),
      userId: user?.uid || 'anonymous'
    };
    
    // Create and save learning path
    const learningPath = {
      pathId: 'prompt-engineering-mastery',
      pathTitle: quizResults.recommendations.title,
      skillLevel: quizResults.skillLevel,
      startedAt: new Date().toISOString(),
      isActive: false, // Will be activated when they start first lesson
      nextLessonIndex: 0,
      completedLessons: [],
      quizResults: quizResults
    };
    
    // Save to localStorage for immediate UI updates
    localStorage.setItem('aiAssessmentResults', JSON.stringify(quizResults));
    localStorage.setItem('quizCompleted', JSON.stringify(quizCompletionState));
    localStorage.setItem('activeLearningPath', JSON.stringify(learningPath));
    
    // Clear welcome lesson redirect flags since user has completed assessment
    localStorage.removeItem('shouldShowWelcomeLesson');
    localStorage.removeItem('isFirstTimeUser');

    // Save to database if user is authenticated
    if (user?.uid) {
      try {
        const { doc, setDoc, updateDoc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        const userData = {
          quizCompleted: quizCompletionState,
          aiAssessmentResults: quizResults,
          activeLearningPath: learningPath,
          lastQuizCompletedAt: new Date(),
          lastActivityAt: new Date(),
          // Mark onboarding as completed when quiz is finished
          onboardingCompleted: true,
          hasCompletedFirstLesson: true,
          isFirstTimeUser: false
        };

        if (userDoc.exists()) {
          await updateDoc(userDocRef, userData);
        } else {
          await setDoc(userDocRef, {
            ...userData,
            createdAt: new Date(),
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          });
        }
        
        // Quiz completion saved to database
      } catch (error) {
        console.error('Error saving quiz completion to database:', error);
        // Continue anyway - localStorage is our backup
      }
    }

    setIsLoading(false);
  };

  const handleStartLearning = () => {
    // Navigate to lessons page to begin their journey
    navigate('/lessons', { 
      state: { 
        fromQuiz: true,
        skillLevel: results.skillLevel,
        recommendations: results.recommendations,
        startFirstLesson: true
      } 
    });
  };

  const handleStartFirstLesson = async () => {
    // Activate the learning path
    const learningPath = JSON.parse(localStorage.getItem('activeLearningPath'));
    if (learningPath) {
      learningPath.isActive = true;
      localStorage.setItem('activeLearningPath', JSON.stringify(learningPath));
      localStorage.setItem('learningPathActive', 'true');
    }

    // Get the first lesson from the adaptive service
    try {
      const adaptivePath = await import('../services/adaptiveLessonService').then(module => 
        module.AdaptiveLessonService.getAdaptedLearningPath(
          'prompt-engineering-mastery',
          { skillLevel: results.skillLevel }
        )
      );
      
      if (adaptivePath && adaptivePath.modules && adaptivePath.modules[0]?.lessons[0]) {
        const firstLesson = adaptivePath.modules[0].lessons[0];
        navigate(`/lessons/${firstLesson.id}`, { 
          state: { 
            pathId: 'prompt-engineering-mastery',
            moduleId: adaptivePath.modules[0].id,
            difficulty: results.skillLevel,
            fromQuiz: true
          } 
        });
      } else {
        // Fallback to lessons overview
        navigate('/lessons');
      }
    } catch (error) {
      console.error('Error getting first lesson:', error);
      navigate('/lessons');
    }
  };

  const handleRetakeQuiz = () => {
    // Clear all quiz-related localStorage data
    localStorage.removeItem('quizCompleted');
    localStorage.removeItem('aiAssessmentResults');
    localStorage.removeItem('activeLearningPath');
    localStorage.removeItem('learningPathActive');
    
    // Reset component state
    setResults(null);
    setIsComplete(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
  };

  // Check if user has already completed the quiz
  useEffect(() => {
    const checkQuizCompletion = async () => {
      // First check localStorage for immediate loading
      const localQuizCompleted = localStorage.getItem('quizCompleted');
      if (localQuizCompleted) {
        const completionState = JSON.parse(localQuizCompleted);
        if (completionState.completed && completionState.results) {
          setResults(completionState.results);
          setIsComplete(true);
        }
      }

      // If user is authenticated, also check database
      if (user?.uid) {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../firebase');
          
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            if (userData.quizCompleted && userData.aiAssessmentResults) {
              // Database has quiz completion - use this as source of truth
              setResults(userData.aiAssessmentResults);
              setIsComplete(true);
              
              // Sync to localStorage for faster future loads
              localStorage.setItem('quizCompleted', JSON.stringify(userData.quizCompleted));
              localStorage.setItem('aiAssessmentResults', JSON.stringify(userData.aiAssessmentResults));
              if (userData.activeLearningPath) {
                localStorage.setItem('activeLearningPath', JSON.stringify(userData.activeLearningPath));
              }
            }
          }
        } catch (error) {
          console.error('Error checking quiz completion from database:', error);
        }
      }
    };

    checkQuizCompletion();
  }, [user]);

  // Redirect if user tries to access quiz multiple times
  useEffect(() => {
    const quizCompleted = localStorage.getItem('quizCompleted');
    if (quizCompleted && !isComplete) {
      const completionState = JSON.parse(quizCompleted);
      if (completionState.completed) {
        // Show completed state instead of redirecting
        setResults(completionState.results);
        setIsComplete(true);
      }
    }
  }, [isComplete]);

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white overflow-hidden">
        <LoggedInNavbar />
        
        <OptimizedStarField starCount={80} opacity={0.5} speed={0.8} size={1} />
        
        <div className="relative z-10 flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-400/30 mx-auto mb-6"></div>
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-400 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <p className="text-xl text-blue-200 mb-2">Analyzing your responses...</p>
            <p className="text-slate-400">Creating your personalized learning path ✨</p>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete && !allowRetake) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white overflow-hidden">
        <LoggedInNavbar />

        <OptimizedStarField starCount={150} opacity={0.5} speed={0.8} size={1} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Check if this is a return visit */}
          {localStorage.getItem('quizCompleted') && (
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-blue-300 mb-1">Welcome Back! 👋</h3>
                  <p className="text-blue-200">You've already completed your AI assessment. Here are your results:</p>
                </div>
                <button
                  onClick={() => setAllowRetake(true)}
                  className="px-4 py-2 bg-blue-600/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all duration-300 text-sm"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">
              {results.skillLevel === 'beginner' ? '🌟' : 
               results.skillLevel === 'intermediate' ? '🚀' : '🎯'}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Perfect! Your Learning Path is Ready
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We've created a personalized course of lessons designed specifically for your experience level and goals.
            </p>
          </div>

          {/* Results Content */}
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Personal Recommendation Section */}
            <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/30">
                <h2 className="text-2xl font-bold text-amber-300 mb-6 flex items-center gap-2">
                  👨‍🏫 Here's What We Recommend For You
                </h2>
                <div className="space-y-6 text-amber-100">
                  <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20">
                    <h3 className="text-xl font-bold text-amber-200 mb-3">
                      🎯 We recommend you start with: <span className="text-white">{results.recommendations.title}</span>
                    </h3>
                    <p className="text-lg leading-relaxed">
                      {results.skillLevel === 'beginner' && (
                        <>
                          You're at the perfect starting point! Since you're new to AI tools, we want to make sure you build a rock-solid foundation. 
                          You'll start with simple, practical exercises that build your confidence. No overwhelming technical jargon - just clear, 
                          step-by-step guidance that gets you using AI effectively from day one.
                        </>
                      )}
                      {results.skillLevel === 'intermediate' && (
                        <>
                          You already have some AI experience, which is fantastic! We can see you're ready to take your skills to the next level. 
                          You'll learn advanced techniques that will make you stand out in your field. We'll focus on practical, hands-on projects 
                          that you can immediately apply to your work or personal projects.
                        </>
                      )}
                      {results.skillLevel === 'advanced' && (
                        <>
                          You're clearly comfortable with AI tools - impressive! We're going to challenge you with cutting-edge techniques and 
                          complex projects. You'll master advanced workflows, learn to integrate multiple AI systems, and develop skills 
                          that put you in the top 1% of AI users.
                        </>
                      )}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20">
                      <h3 className="font-bold text-amber-200 mb-4 text-lg">📚 What You'll Learn:</h3>
                      <ul className="space-y-3 text-base">
                        {results.skillLevel === 'beginner' && (
                          <>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>How to write prompts that get amazing results every time</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>The fundamentals of different AI tools and when to use each one</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>Practical applications you can use immediately in your daily life</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>How to avoid common mistakes that waste time and money</span>
                            </li>
                          </>
                        )}
                        {results.skillLevel === 'intermediate' && (
                          <>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>Advanced prompting techniques that professionals use</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>How to chain multiple AI tools together for powerful workflows</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>Problem-solving frameworks using AI that save hours of work</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>Industry-specific applications that give you a competitive edge</span>
                            </li>
                          </>
                        )}
                        {results.skillLevel === 'advanced' && (
                          <>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>Master-level prompt engineering techniques and strategies</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>Building custom AI workflows and automations</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>Advanced AI tool integrations and optimization techniques</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-green-400 mt-1">✓</span>
                              <span>Professional-grade AI applications and best practices</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20">
                      <h3 className="font-bold text-amber-200 mb-4 text-lg">🚀 What You'll Be Able To Do:</h3>
                      <ul className="space-y-3 text-base">
                        {results.skillLevel === 'beginner' && (
                          <>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Generate professional content that impresses your colleagues</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Automate routine tasks that currently take hours</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Make better decisions with AI-powered research and analysis</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Feel confident using AI in any situation</span>
                            </li>
                          </>
                        )}
                        {results.skillLevel === 'intermediate' && (
                          <>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Create complex workflows that solve real business problems</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Lead AI initiatives at your company or organization</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Build impressive projects that showcase your expertise</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Command higher salaries and better opportunities</span>
                            </li>
                          </>
                        )}
                        {results.skillLevel === 'advanced' && (
                          <>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Master prompt engineering at a professional level</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Create sophisticated AI-powered solutions for complex problems</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Become the go-to AI expert in your field or organization</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-blue-400 mt-1">⭐</span>
                              <span>Build and optimize advanced AI workflows that save significant time</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* How Your Learning Path Works */}
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-indigo-500/30">
            <h2 className="text-xl font-bold text-white mb-4 text-center">🗺️ How Your Learning Path Works</h2>
            
            <div className="bg-indigo-500/10 rounded-xl p-4 mb-4 border border-indigo-500/20">
              <p className="text-indigo-200 text-sm leading-relaxed text-center">
                <strong>We've created a customized sequence of lessons just for you.</strong> Each lesson builds on the previous one, 
                guiding you step-by-step from your current skill level to mastery.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3 flex items-center justify-center text-lg">
                  🎯
                </div>
                <h3 className="text-sm font-semibold text-green-300 mb-2">1. Start Lesson 1</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  We take you directly to your first lesson - no browsing needed.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-lg">
                  📝
                </div>
                <h3 className="text-sm font-semibold text-blue-300 mb-2">2. Complete & Practice</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Work through coding exercises and quizzes to master each concept.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center text-lg">
                  ➡️
                </div>
                <h3 className="text-sm font-semibold text-purple-300 mb-2">3. Auto-Progress</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  When you finish, we automatically guide you to the next lesson in your path.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto mb-3 flex items-center justify-center text-lg">
                  🏆
                </div>
                <h3 className="text-sm font-semibold text-pink-300 mb-2">4. Track Progress</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  See your progress on a visual map showing completed and upcoming lessons.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
              <p className="text-slate-300 text-xs text-center">
                💡 <strong>No guesswork:</strong> Your learning path is carefully designed so each lesson prepares you perfectly for the next one. 
                You'll never feel lost or wonder what to learn next!
              </p>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button
                onClick={handleStartFirstLesson}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl text-white font-bold text-lg shadow-xl hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                <span className="relative flex items-center gap-2">
                  🎯 Start First Lesson
                </span>
              </button>
              
              <button
                onClick={handleStartLearning}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                <span className="relative flex items-center gap-2">
                  🗺️ View Learning Map
                </span>
              </button>
            </div>
            
            <p className="text-green-200 text-sm max-w-lg mx-auto">
              🌟 Your personalized learning path is ready! Each lesson builds on the last, guiding you step-by-step to AI mastery.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white overflow-hidden">
      <LoggedInNavbar />

      <OptimizedStarField starCount={200} opacity={0.8} speed={0.8} size={1} />
      
      {/* Main content wrapper */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Personalize Your Learning
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-xl mx-auto">
            A few quick questions to create your perfect AI learning path
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400 text-sm">
              {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-blue-400 font-medium text-sm">
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full">
              {currentQuestion.category}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Help Text */}
          {currentQuestion.helpText && (
            <p className="text-slate-300 text-sm mb-6 bg-slate-800/30 p-3 rounded-lg">
              💡 {currentQuestion.helpText}
            </p>
          )}

          {/* Info Slide Content */}
          {currentQuestion.type === 'info-slide' && currentQuestion.content && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {currentQuestion.content.title}
                </h3>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  {currentQuestion.content.description}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {currentQuestion.content.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-blue-600/10 backdrop-blur-xl rounded-xl p-4 border border-blue-500/20 text-center"
                  >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={handleInfoSlideNext}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Let's Get Started! 🚀
                </button>
              </div>
            </div>
          )}

          {/* Regular Question Options */}
          {currentQuestion.type !== 'info-slide' && (
            <>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = currentQuestion.type === 'multiple' 
                    ? selectedAnswers.includes(option.value)
                    : answers[currentQuestion.id] === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(currentQuestion.id, option.value)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/20 bg-white/5 hover:border-blue-400/50 hover:bg-blue-500/5'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-white/40'
                        }`}>
                          {isSelected && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-base text-white block mb-1">{option.text}</span>
                          {option.description && (
                            <span className="text-xs text-slate-400 italic">{option.description}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Continue Button for Multiple Choice */}
              {currentQuestion.type === 'multiple' && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleMultipleChoiceContinue}
                    disabled={selectedAnswers.length === 0}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {currentQuestionIndex === totalQuestions - 1 ? 'Finish Assessment' : 'Continue'}
                  </button>
                  <p className="mt-2 text-slate-400 text-xs">
                    {selectedAnswers.length === 0 ? 'Select at least one option to continue' : 
                     selectedAnswers.length === 1 ? '1 option selected' : 
                     `${selectedAnswers.length} options selected`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Question Counter */}
        <div className="text-center mt-4">
          <p className="text-slate-500 text-xs">
            Your answers help us create the perfect learning path for you
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveLearningPathQuiz; 