import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { firstTimeUserWelcomeLesson } from '../lessons/firstTimeUserLesson';
import { NewUserOnboardingService } from '../services/newUserOnboardingService';

const WelcomeLessonViewer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { awardXP, awardBadge } = useGamification();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const lesson = firstTimeUserWelcomeLesson;
  const content = lesson.content.beginner;

  // Welcome lesson sections
  const sections = [
    {
      id: 'welcome',
      type: 'welcome',
      title: 'Welcome to BeginningWithAI!',
      content: content.introduction
    },
    {
      id: 'what-to-expect',
      type: 'expectations',
      title: 'What to Expect',
      content: content.mainContent.expectations
    },
    {
      id: 'app-features',
      type: 'features',
      title: 'How We Help You Learn',
      content: content.mainContent.appFeatures
    },
    {
      id: 'confidence-check',
      type: 'interactive',
      title: 'How Are You Feeling?',
      content: content.interactiveElements[0]
    },
    {
      id: 'goals',
      type: 'interactive',
      title: 'What Would You Like to Learn?',
      content: content.interactiveElements[1]
    },
    {
      id: 'encouragement',
      type: 'encouragement',
      title: 'Remember This',
      content: content.mainContent.encouragement
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Quick Check-In',
      content: lesson.assessment.beginner
    }
  ];

  const handleResponse = (sectionId, response) => {
    setUserResponses(prev => ({
      ...prev,
      [sectionId]: response
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      completeLesson();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const completeLesson = async () => {
    setIsComplete(true);
    setShowCelebration(true);

    try {
      // Award XP and badge
      if (awardXP) {
        awardXP(lesson.progressTracking.xpRewards.completion, 'Completed Welcome Lesson');
      }
      
      if (awardBadge) {
        awardBadge('welcome-to-ai', 'Welcome to AI', 'Completed your first lesson!');
      }

      // Mark onboarding as completed
      if (user?.uid) {
        await NewUserOnboardingService.completeOnboarding(user.uid);
      }

      // Wait for celebration, then redirect
      setTimeout(() => {
        navigate(lesson.completionActions.redirect);
      }, 3000);

    } catch (error) {
      console.error('Error completing welcome lesson:', error);
      // Still redirect even if there's an error
      setTimeout(() => {
        navigate(lesson.completionActions.redirect);
      }, 2000);
    }
  };

  const renderSection = (section) => {
    switch (section.type) {
      case 'welcome':
        return <WelcomeSection content={section.content} onNext={handleNext} />;
      
      case 'expectations':
        return <ExpectationsSection content={section.content} onNext={handleNext} onBack={handleBack} />;
      
      case 'features':
        return <FeaturesSection content={section.content} onNext={handleNext} onBack={handleBack} />;
      
      case 'interactive':
        return (
          <InteractiveSection 
            section={section}
            userResponse={userResponses[section.id]}
            onResponse={(response) => handleResponse(section.id, response)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 'encouragement':
        return <EncouragementSection content={section.content} onNext={handleNext} onBack={handleBack} />;
      
      case 'quiz':
        return (
          <QuizSection 
            questions={section.content}
            userResponses={userResponses.quiz || {}}
            onResponse={(questionIndex, response) => {
              const quizResponses = userResponses.quiz || {};
              quizResponses[questionIndex] = response;
              handleResponse('quiz', quizResponses);
            }}
            onComplete={completeLesson}
            onBack={handleBack}
          />
        );
      
      default:
        return <div>Unknown section type</div>;
    }
  };

  if (showCelebration) {
    return <CelebrationScreen lesson={lesson} />;
  }

  const currentSectionData = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 text-gray-800">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 z-20">
        <motion.div 
          className="h-full bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Progress Counter */}
      <div className="fixed top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-600 z-20">
        {currentSection + 1} of {sections.length}
      </div>

      {/* Main Content */}
      <div className="pt-12 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="min-h-[80vh] flex flex-col justify-center"
            >
              {renderSection(currentSectionData)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Individual section components
const WelcomeSection = ({ content, onNext }) => (
  <div className="text-center space-y-6">
    <motion.div
      className="text-6xl mb-6"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      👋
    </motion.div>
    
    <h1 className="text-4xl font-bold text-gray-800 mb-6">
      Welcome to BeginningWithAI!
    </h1>
    
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <p className="text-lg text-gray-700 leading-relaxed">
        {content}
      </p>
    </div>
    
    <motion.button
      onClick={onNext}
      className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Let's Begin! ✨
    </motion.button>
  </div>
);

const ExpectationsSection = ({ content, onNext, onBack }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
      What to Expect on Your Journey
    </h2>
    
    <div className="grid gap-4">
      {content.map((expectation, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl">{expectation.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-800">{expectation.title}</h3>
              <p className="text-gray-600">{expectation.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
    
    <div className="flex gap-4 justify-center pt-6">
      <button
        onClick={onBack}
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
      >
        ← Back
      </button>
      <motion.button
        onClick={onNext}
        className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
      >
        This Sounds Great! →
      </motion.button>
    </div>
  </div>
);

const FeaturesSection = ({ content, onNext, onBack }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
      How We Make Learning Easy
    </h2>
    
    <div className="grid gap-4">
      {content.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
        >
          <h3 className="font-semibold text-gray-800 mb-2">{feature.feature}</h3>
          <p className="text-gray-600 mb-2">{feature.description}</p>
          <p className="text-sm text-blue-600 font-medium">→ {feature.benefit}</p>
        </motion.div>
      ))}
    </div>
    
    <div className="flex gap-4 justify-center pt-6">
      <button
        onClick={onBack}
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
      >
        ← Back
      </button>
      <motion.button
        onClick={onNext}
        className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
      >
        I'm Ready to Learn! →
      </motion.button>
    </div>
  </div>
);

const InteractiveSection = ({ section, userResponse, onResponse, onNext, onBack }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
      {section.title}
    </h2>
    
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <p className="text-lg text-gray-700 mb-6 text-center">
        {section.content.question}
      </p>
      
      <div className="space-y-3">
        {section.content.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => onResponse(option)}
            className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
              userResponse?.text === option.text
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {option.text}
          </motion.button>
        ))}
      </div>
      
      {userResponse?.response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
        >
          <p className="text-green-800">{userResponse.response}</p>
        </motion.div>
      )}
    </div>
    
    <div className="flex gap-4 justify-center pt-6">
      <button
        onClick={onBack}
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
      >
        ← Back
      </button>
      {userResponse && (
        <motion.button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Continue →
        </motion.button>
      )}
    </div>
  </div>
);

const EncouragementSection = ({ content, onNext, onBack }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="text-4xl mb-4">💪</div>
      <h2 className="text-3xl font-bold text-gray-800">
        You've Got This!
      </h2>
    </div>
    
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
      <div className="space-y-4">
        {content.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="text-orange-500">✨</div>
            <p className="text-gray-700 font-medium">{message}</p>
          </motion.div>
        ))}
      </div>
    </div>
    
    <div className="flex gap-4 justify-center pt-6">
      <button
        onClick={onBack}
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
      >
        ← Back
      </button>
      <motion.button
        onClick={onNext}
        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
      >
        I'm Feeling Confident! →
      </motion.button>
    </div>
  </div>
);

const QuizSection = ({ questions, userResponses, onResponse, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentQuestion];
  const userAnswer = userResponses[currentQuestion];

  const handleAnswer = (option) => {
    const isCorrect = option === question.correct;
    onResponse(currentQuestion, { answer: option, isCorrect });
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowResult(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Quick Check-In
        </h2>
        <p className="text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <p className="text-lg text-gray-700 mb-6 text-center">
          {question.question}
        </p>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => !showResult && handleAnswer(option)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                showResult
                  ? option === question.correct
                    ? 'bg-green-500 text-white'
                    : option === userAnswer?.answer
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
              whileHover={!showResult ? { scale: 1.02 } : {}}
            >
              {option}
            </motion.button>
          ))}
        </div>
        
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-xl ${
              userAnswer?.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <p className={userAnswer?.isCorrect ? 'text-green-800' : 'text-blue-800'}>
              {question.explanation}
            </p>
          </motion.div>
        )}
      </div>
      
      <div className="flex gap-4 justify-center pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        {showResult && (
          <motion.button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Complete Lesson! 🎉'}
          </motion.button>
        )}
      </div>
    </div>
  );
};

const CelebrationScreen = ({ lesson }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center text-center">
    {/* Celebration particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
            y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 50,
            rotate: 0,
          }}
          animate={{
            y: -50,
            rotate: 360,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
          }}
        >
          {['🎉', '✨', '🌟', '🎊'][Math.floor(Math.random() * 4)]}
        </motion.div>
      ))}
    </div>
    
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-md mx-auto p-8 relative z-10"
    >
      <motion.div
        className="text-8xl mb-6"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎉
      </motion.div>
      
      <h1 className="text-4xl font-bold text-white mb-4">
        {lesson.completionActions.message.split('!')[0]}!
      </h1>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="text-2xl text-yellow-200 mb-6 font-bold"
      >
        +{lesson.progressTracking.xpRewards.completion + lesson.progressTracking.xpRewards.bonus} XP
      </motion.div>

      <div className="text-white/90 space-y-2 mb-6">
        {lesson.completionActions.nextSteps.map((step, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.3 }}
            className="text-sm"
          >
            {step}
          </motion.p>
        ))}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="text-white/80 text-sm"
      >
        Redirecting you to your dashboard...
      </motion.p>
    </motion.div>
  </div>
);

export default WelcomeLessonViewer; 