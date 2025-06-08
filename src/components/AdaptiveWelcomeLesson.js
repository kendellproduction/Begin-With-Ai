import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoggedInNavbar from './LoggedInNavbar';
import { adaptiveWelcomeLessons } from '../lessons/adaptiveWelcomeLessons';

const AdaptiveWelcomeLesson = () => {
  const { user } = useAuth();
  const { awardXP } = useGamification();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [comfortLevel, setComfortLevel] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [adaptivePath, setAdaptivePath] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showLessonContent, setShowLessonContent] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Comfort level assessment (first step)
  const comfortLevels = [
    {
      id: 'confident',
      title: 'Confident & Ready',
      emoji: '🚀',
      description: 'I\'m excited about AI and ready to dive in!',
      details: 'You feel confident about learning new technology and want to explore AI\'s potential.',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-400/20 to-emerald-500/20',
      borderColor: 'border-green-400/50'
    },
    {
      id: 'curious',
      title: 'Curious but Cautious',
      emoji: '🤔',
      description: 'I\'m interested but want to take it step by step',
      details: 'You\'re curious about AI but prefer a gentle, guided approach to learning.',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-400/20 to-cyan-500/20',
      borderColor: 'border-blue-400/50'
    },
    {
      id: 'nervous',
      title: 'Nervous but Willing',
      emoji: '😅',
      description: 'I\'m a bit overwhelmed but want to learn',
      details: 'You feel nervous about AI but are motivated to understand it with lots of support.',
      color: 'from-orange-400 to-amber-500',
      bgColor: 'from-orange-400/20 to-amber-500/20',
      borderColor: 'border-orange-400/50'
    }
  ];

  // Shortened learning path questions (adapted from the existing quiz)
  const learningPathQuestions = [
    {
      id: 'experience',
      question: "What's your experience with AI tools?",
      options: [
        { text: "Complete beginner", value: 'beginner', points: { beginner: 3, intermediate: 0, advanced: 0 } },
        { text: "Tried a few times", value: 'some', points: { beginner: 2, intermediate: 1, advanced: 0 } },
        { text: "Use them regularly", value: 'regular', points: { beginner: 0, intermediate: 3, advanced: 1 } },
        { text: "Pretty experienced", value: 'experienced', points: { beginner: 0, intermediate: 1, advanced: 3 } }
      ]
    },
    {
      id: 'goals',
      question: "What do you want to achieve with AI?",
      options: [
        { text: "Understand the basics", value: 'understand', points: { beginner: 3, intermediate: 1, advanced: 0 } },
        { text: "Use AI for work/projects", value: 'practical', points: { beginner: 1, intermediate: 3, advanced: 1 } },
        { text: "Master advanced techniques", value: 'master', points: { beginner: 0, intermediate: 1, advanced: 3 } },
        { text: "I'm not sure yet", value: 'unsure', points: { beginner: 2, intermediate: 1, advanced: 0 } }
      ]
    }
  ];

  const totalSteps = 1 + 1 + learningPathQuestions.length; // Comfort + Lesson Content + Questions (now 2)
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Handle comfort level selection
  const handleComfortLevelSelect = (level) => {
    setComfortLevel(level);
    // Get the corresponding lesson content
    const lesson = adaptiveWelcomeLessons[level.id];
    setSelectedLesson(lesson);
    setShowLessonContent(true);
    setCurrentStep(1);
  };

  // Handle learning path question answers
  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeAssessment();
    }
  };

  // Calculate adaptive path based on comfort level and answers
  const completeAssessment = () => {
    const scores = { beginner: 0, intermediate: 0, advanced: 0 };
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = learningPathQuestions.find(q => q.id === questionId);
      const option = question?.options.find(opt => opt.value === answer);
      if (option) {
        scores.beginner += option.points.beginner;
        scores.intermediate += option.points.intermediate;
        scores.advanced += option.points.advanced;
      }
    });

    if (comfortLevel.id === 'confident') {
      scores.intermediate += 2;
      scores.advanced += 1;
    } else if (comfortLevel.id === 'nervous') {
      scores.beginner += 3;
    } else {
      scores.beginner += 1;
      scores.intermediate += 1;
    }

    const maxScore = Math.max(scores.beginner, scores.intermediate, scores.advanced);
    let skillLevel = 'beginner';
    if (scores.advanced === maxScore) skillLevel = 'advanced';
    else if (scores.intermediate === maxScore) skillLevel = 'intermediate';

    const path = createAdaptivePath(skillLevel, comfortLevel, answers);
    setAdaptivePath(path);
    setShowResults(true);
    setIsComplete(true);
  };

  // Create adaptive learning path
  const createAdaptivePath = (skillLevel, comfort, answers) => {
    const basePath = {
      id: `adaptive-welcome-${Date.now()}`,
      title: `Your AI Learning Journey`,
      skillLevel,
      comfortLevel: comfort.id,
      totalLessons: skillLevel === 'beginner' ? 8 : skillLevel === 'intermediate' ? 12 : 16,
      description: getPathDescription(skillLevel, comfort, answers)
    };

    return basePath;
  };

  // Get personalized path description
  const getPathDescription = (skillLevel, comfort, answers) => {
    const comfortMessages = {
      confident: "You're ready to dive in! We'll challenge you with exciting AI concepts and practical applications.",
      curious: "Perfect! We'll guide you step-by-step through AI fundamentals with clear explanations and examples.",
      nervous: "Don't worry! We'll start gently with the basics and build your confidence along the way."
    };

    const skillMessages = {
      beginner: "Starting with AI fundamentals and building a strong foundation.",
      intermediate: "Exploring practical AI applications and real-world use cases.",
      advanced: "Diving deep into sophisticated AI techniques and cutting-edge developments."
    };

    return `${comfortMessages[comfort.id]} ${skillMessages[skillLevel]}`;
  };

  // Handle start learning
  const handleStartLearning = () => {
    localStorage.setItem('adaptiveWelcomePath', JSON.stringify(adaptivePath));
    localStorage.setItem('welcomeLessonCompleted', 'true');
    
    // Award XP only if the function is available
    if (awardXP && typeof awardXP === 'function') {
      awardXP(50, 'Welcome lesson completed!');
    }
    
    navigate('/lessons');
  };

  // Render comfort level selection
  const renderComfortLevelSelection = () => (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-yellow-500 bg-clip-text text-transparent mb-6">
          Welcome to Your AI Journey! 🚀
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Let's start by understanding how you feel about learning AI
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {comfortLevels.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${level.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${level.borderColor} cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation`}
            onClick={() => handleComfortLevelSelect(level)}
          >
            <div className="text-5xl sm:text-6xl mb-4">{level.emoji}</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{level.title}</h3>
            <p className="text-slate-200 mb-4 text-sm sm:text-base">{level.description}</p>
            <p className="text-xs sm:text-sm text-slate-300">{level.details}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Handle continuing from lesson content to learning path questions
  const handleContinueFromLesson = () => {
    setShowLessonContent(false);
    setCurrentStep(2); // Move to learning path questions
  };

  // Render adaptive lesson content
  const renderAdaptiveLessonContent = () => {
    if (!selectedLesson) return null;
    
    const difficulty = comfortLevel.id === 'confident' ? 'advanced' : 
                      comfortLevel.id === 'curious' ? 'intermediate' : 'beginner';
    const content = selectedLesson.content[difficulty];
    
    return (
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">{comfortLevel.emoji}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{selectedLesson.title}</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {selectedLesson.coreConcept}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8 text-left"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-200 mb-6 leading-relaxed">
              {content.introduction}
            </p>
            <p className="text-base text-slate-300 mb-8 leading-relaxed">
              {content.mainContent.welcomeMessage}
            </p>
            
                         {/* Expectations Grid */}
             <div className="grid md:grid-cols-2 gap-6 mb-8">
               {content.mainContent.expectations.map((expectation, index) => (
                 <motion.div
                   key={expectation.title}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.5 + index * 0.1 }}
                   className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20 backdrop-blur-sm"
                 >
                   <div className="flex items-start mb-4">
                     <div className="bg-white/10 rounded-full p-3 mr-4 flex-shrink-0">
                       <span className="text-xl">{expectation.icon}</span>
                     </div>
                     <div>
                       <h4 className="text-lg font-semibold text-white mb-2">{expectation.title}</h4>
                       <p className="text-sm text-slate-300 leading-relaxed">{expectation.description}</p>
                     </div>
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={handleContinueFromLesson}
          className="bg-gradient-to-r from-blue-500 to-yellow-500 hover:from-blue-400 hover:to-yellow-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-400/40"
        >
          Continue to Personalization 🎯
        </motion.button>
      </div>
    );
  };

  // Render learning path questions
  const renderLearningPathQuestion = () => {
    const question = learningPathQuestions[currentStep - 2]; // Adjust for lesson content step
    
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold text-white mb-4">{question.question}</h2>
          <p className="text-slate-300">
            Question {currentStep - 1} of {learningPathQuestions.length}
          </p>
        </motion.div>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAnswer(question.id, option.value)}
              className="w-full p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 text-left text-white hover:bg-slate-700/50 hover:border-slate-500/70 transition-all duration-300"
            >
              {option.text}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => (
    <div className="max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <div className="text-8xl mb-6">🎉</div>
        <h2 className="text-4xl font-bold text-white mb-4">Your Personalized AI Path is Ready!</h2>
        <p className="text-xl text-slate-300 mb-8">
          Based on your responses, we've created a learning journey that's perfect for you
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="text-6xl">{comfortLevel.emoji}</div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">{adaptivePath?.title}</h3>
        <p className="text-slate-200 mb-6 leading-relaxed">{adaptivePath?.description}</p>
        
        <div className="grid md:grid-cols-2 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl mb-2">📚</div>
            <div className="text-white font-semibold">{adaptivePath?.totalLessons} Lessons</div>
            <div className="text-slate-300 text-sm">Curated for you</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-white font-semibold">{adaptivePath?.skillLevel}</div>
            <div className="text-slate-300 text-sm">Skill level</div>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={handleStartLearning}
        className="bg-gradient-to-r from-blue-500 to-yellow-500 hover:from-blue-400 hover:to-yellow-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-400/40 text-lg"
      >
        🚀 Start My AI Journey
      </motion.button>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white overflow-hidden">
      <LoggedInNavbar />

      {/* Star Animation Container */}
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
              key={`welcome-star-${i}`}
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
      <div className="fixed top-0 left-0 right-0 h-2 bg-gray-800 z-20">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-400 to-yellow-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="min-h-screen flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {!isComplete && currentStep === 0 && renderComfortLevelSelection()}
              {!isComplete && currentStep === 1 && showLessonContent && renderAdaptiveLessonContent()}
              {!isComplete && currentStep >= 2 && renderLearningPathQuestion()}
              {isComplete && showResults && renderResults()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdaptiveWelcomeLesson; 