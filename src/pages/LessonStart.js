import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { motion } from 'framer-motion';

const LessonStart = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate');
  const [showDetails, setShowDetails] = useState(false);

  // Get lesson info from navigation state
  const lessonInfo = location.state || {
    lessonTitle: 'AI Lesson',
    lessonIcon: '🤖',
    isCompleted: false,
    isCurrent: true,
    isNext: false,
    fromLearningPath: true
  };

  const difficulties = [
    {
      id: 'beginner',
      title: 'Beginner',
      icon: '🌱',
      description: 'Perfect for AI newcomers',
      details: 'Start from the basics with simple explanations, step-by-step guidance, and fundamental concepts.',
      duration: '15-20 min',
      features: ['Basic concepts', 'Guided examples', 'Simple exercises'],
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-400/20 to-emerald-500/20',
      borderColor: 'border-green-400/50'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      icon: '🎯',
      description: 'Ideal for expanding knowledge',
      details: 'Build on existing knowledge with practical applications, real-world examples, and deeper insights.',
      duration: '20-30 min',
      features: ['Practical applications', 'Real examples', 'Interactive challenges'],
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-400/20 to-cyan-500/20',
      borderColor: 'border-blue-400/50'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      icon: '🚀',
      description: 'For experienced practitioners',
      details: 'Dive deep into complex topics, advanced techniques, and cutting-edge developments in AI.',
      duration: '30-45 min',
      features: ['Complex concepts', 'Advanced techniques', 'Research insights'],
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-400/20 to-pink-500/20',
      borderColor: 'border-purple-400/50'
    },
    {
      id: 'expert',
      title: 'Expert',
      icon: '⚡',
      description: 'Master-level deep dive',
      details: 'Explore the most advanced concepts, latest research, and expert-level implementation strategies.',
      duration: '45-60 min',
      features: ['Cutting-edge research', 'Expert strategies', 'Advanced projects'],
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-400/20 to-red-500/20',
      borderColor: 'border-orange-400/50'
    }
  ];

  const handleStartLesson = () => {
    // Navigate to the actual lesson page with selected difficulty
    navigate(`/lessons/${lessonId}`, {
      state: {
        difficulty: selectedDifficulty,
        fromLearningPath: lessonInfo.fromLearningPath,
        ...lessonInfo
      }
    });
  };

  const handleGoBack = () => {
    if (lessonInfo.fromLearningPath) {
      navigate('/lessons');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <LoggedInNavbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="text-8xl mb-6">{lessonInfo.lessonIcon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {lessonInfo.lessonTitle}
            </h1>
            <p className="text-xl text-indigo-200 mb-6">
              Choose your learning difficulty to get started
            </p>
            
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-600/50">
              {lessonInfo.isCompleted && (
                <>
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-300 font-medium">Completed</span>
                </>
              )}
              {lessonInfo.isCurrent && (
                <>
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-300 font-medium">Current Lesson</span>
                </>
              )}
              {lessonInfo.isNext && (
                <>
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-orange-300 font-medium">Next Available</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Difficulty Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-indigo-200">
              Select Your Difficulty Level
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {difficulties.map((difficulty) => (
                <motion.div
                  key={difficulty.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300
                    ${selectedDifficulty === difficulty.id 
                      ? `bg-gradient-to-br ${difficulty.bgColor} ${difficulty.borderColor} shadow-lg shadow-blue-500/30`
                      : 'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/70'
                    }
                  `}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                >
                  {selectedDifficulty === difficulty.id && (
                    <motion.div
                      layoutId="difficulty-selection"
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border-2 border-blue-400/50"
                    />
                  )}
                  
                  <div className="relative z-10 text-center">
                    <div className="text-4xl mb-3">{difficulty.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{difficulty.title}</h3>
                    <p className="text-sm text-slate-300 mb-3">{difficulty.description}</p>
                    <div className="text-xs text-slate-400 mb-3">{difficulty.duration}</div>
                    
                    {/* Features */}
                    <div className="space-y-1">
                      {difficulty.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-slate-300">
                          <div className="w-1 h-1 bg-slate-400 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Selected Difficulty Details */}
          {selectedDifficulty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              {(() => {
                const selected = difficulties.find(d => d.id === selectedDifficulty);
                return (
                  <div className={`bg-gradient-to-br ${selected.bgColor} backdrop-blur-sm rounded-3xl p-8 border ${selected.borderColor}`}>
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-6xl">{selected.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-4">{selected.title} Level</h3>
                    <p className="text-center text-slate-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                      {selected.details}
                    </p>
                    <div className="flex justify-center items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="text-xl">⏱️</div>
                        <span>{selected.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xl">🎯</div>
                        <span>{selected.features.length} Focus Areas</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleStartLesson}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-400/40 text-lg"
            >
              🚀 Start Learning
            </button>
            <button
              onClick={handleGoBack}
              className="px-6 py-4 bg-slate-700/80 hover:bg-slate-600/80 text-white font-semibold rounded-2xl transition-all duration-300 border border-slate-500/50 hover:border-slate-400/60 backdrop-blur-sm text-lg"
            >
              ← Go Back
            </button>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold mb-4 text-indigo-200">💡 Learning Tips</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                <div className="flex items-start space-x-2">
                  <div className="text-lg">📚</div>
                  <div>
                    <div className="font-medium mb-1">Take Notes</div>
                    <div>Jot down key concepts as you learn</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="text-lg">🎯</div>
                  <div>
                    <div className="font-medium mb-1">Practice</div>
                    <div>Apply what you learn immediately</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="text-lg">🤝</div>
                  <div>
                    <div className="font-medium mb-1">Ask Questions</div>
                    <div>Use our community for help</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LessonStart; 