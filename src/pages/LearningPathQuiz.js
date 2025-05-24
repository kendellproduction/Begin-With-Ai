import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import lessonsData from '../utils/lessonsData';

const LearningPathQuiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    interests: [],
    skillLevel: '',
    goals: [],
    timeCommitment: '',
    preferredCompanies: [],
    learningStyle: ''
  });

  const questions = [
    {
      id: 'interests',
      title: 'What AI topics interest you most?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { id: 'language-models', label: 'Language Models & ChatGPT', icon: '💬', description: 'Text generation, conversations, writing assistance' },
        { id: 'computer-vision', label: 'Computer Vision', icon: '👁️', description: 'Image recognition, object detection, visual AI' },
        { id: 'data-analysis', label: 'Data Analysis & Insights', icon: '📊', description: 'Pattern recognition, business intelligence' },
        { id: 'automation', label: 'Automation & Workflows', icon: '🤖', description: 'Process automation, AI agents, productivity' },
        { id: 'creative-ai', label: 'Creative AI', icon: '🎨', description: 'Art generation, music, creative applications' },
        { id: 'ethics', label: 'AI Ethics & Policy', icon: '⚖️', description: 'Responsible AI, bias, governance' }
      ]
    },
    {
      id: 'skillLevel',
      title: 'What\'s your current AI knowledge level?',
      subtitle: 'Be honest - this helps us recommend the right starting point',
      type: 'single',
      options: [
        { id: 'complete-beginner', label: 'Complete Beginner', icon: '🌱', description: 'New to AI, want to start from basics' },
        { id: 'some-exposure', label: 'Some Exposure', icon: '📚', description: 'Used ChatGPT or heard about AI, want to learn more' },
        { id: 'intermediate', label: 'Intermediate', icon: '⚡', description: 'Understand basics, ready for practical applications' },
        { id: 'advanced', label: 'Advanced', icon: '🚀', description: 'Strong foundation, want to deepen expertise' }
      ]
    },
    {
      id: 'goals',
      title: 'What do you want to achieve?',
      subtitle: 'Select your primary goals',
      type: 'multiple',
      options: [
        { id: 'career-advancement', label: 'Career Advancement', icon: '📈', description: 'Boost my career with AI skills' },
        { id: 'business-applications', label: 'Business Applications', icon: '💼', description: 'Apply AI to solve business problems' },
        { id: 'personal-projects', label: 'Personal Projects', icon: '🛠️', description: 'Build cool AI projects for fun' },
        { id: 'academic-research', label: 'Academic Research', icon: '🔬', description: 'Understand AI for research purposes' },
        { id: 'stay-current', label: 'Stay Current', icon: '📡', description: 'Keep up with AI developments' },
        { id: 'teaching-others', label: 'Teaching Others', icon: '👥', description: 'Learn to teach AI concepts' }
      ]
    },
    {
      id: 'timeCommitment',
      title: 'How much time can you dedicate?',
      subtitle: 'This helps us pace your learning journey',
      type: 'single',
      options: [
        { id: 'casual', label: 'Casual Learner', icon: '☕', description: '15-30 minutes per week' },
        { id: 'regular', label: 'Regular Learner', icon: '📅', description: '1-2 hours per week' },
        { id: 'intensive', label: 'Intensive Learner', icon: '🔥', description: '3-5 hours per week' },
        { id: 'immersive', label: 'Immersive Learner', icon: '🎯', description: '5+ hours per week' }
      ]
    },
    {
      id: 'preferredCompanies',
      title: 'Which AI companies interest you most?',
      subtitle: 'We\'ll prioritize lessons from these companies',
      type: 'multiple',
      options: [
        { id: 'OpenAI', label: 'OpenAI', icon: '🧠', description: 'ChatGPT, GPT-4, DALL-E' },
        { id: 'Google', label: 'Google', icon: '🔍', description: 'Bard, Gemini, Google AI tools' },
        { id: 'Meta', label: 'Meta', icon: '👤', description: 'Llama, Meta AI research' },
        { id: 'Anthropic', label: 'Anthropic', icon: '🤝', description: 'Claude, constitutional AI' },
        { id: 'Multi-Platform', label: 'Multi-Platform', icon: '🌐', description: 'Cross-platform AI tools' },
        { id: 'no-preference', label: 'No Preference', icon: '🎲', description: 'Show me everything!' }
      ]
    },
    {
      id: 'learningStyle',
      title: 'How do you learn best?',
      subtitle: 'We\'ll customize your experience accordingly',
      type: 'single',
      options: [
        { id: 'hands-on', label: 'Hands-on Practice', icon: '⚡', description: 'Jump into projects and learn by doing' },
        { id: 'theory-first', label: 'Theory First', icon: '📖', description: 'Understand concepts before applying' },
        { id: 'mixed', label: 'Mixed Approach', icon: '🔄', description: 'Balance theory and practice' },
        { id: 'project-based', label: 'Project-Based', icon: '🚀', description: 'Work towards specific outcomes' }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];

  const handleAnswerSelect = (optionId) => {
    const newAnswers = { ...answers };
    
    if (currentQuestion.type === 'multiple') {
      if (newAnswers[currentQuestion.id].includes(optionId)) {
        newAnswers[currentQuestion.id] = newAnswers[currentQuestion.id].filter(id => id !== optionId);
      } else {
        newAnswers[currentQuestion.id] = [...newAnswers[currentQuestion.id], optionId];
      }
    } else {
      newAnswers[currentQuestion.id] = optionId;
    }
    
    setAnswers(newAnswers);
  };

  const isAnswerSelected = (optionId) => {
    if (currentQuestion.type === 'multiple') {
      return answers[currentQuestion.id].includes(optionId);
    }
    return answers[currentQuestion.id] === optionId;
  };

  const canProceed = () => {
    if (currentQuestion.type === 'multiple') {
      return answers[currentQuestion.id].length > 0;
    }
    return answers[currentQuestion.id] !== '';
  };

  const generatePersonalizedPath = () => {
    const { interests, skillLevel, goals, timeCommitment, preferredCompanies, learningStyle } = answers;
    
    // Filter lessons based on preferences
    let recommendedLessons = [...lessonsData];
    
    // Filter by preferred companies (if not "no preference")
    if (preferredCompanies.length > 0 && !preferredCompanies.includes('no-preference')) {
      recommendedLessons = recommendedLessons.filter(lesson => 
        preferredCompanies.includes(lesson.company)
      );
    }
    
    // Score lessons based on interests
    recommendedLessons = recommendedLessons.map(lesson => {
      let score = 0;
      
      // Interest-based scoring
      if (interests.includes('language-models') && lesson.useCases.includes('Text Generation')) score += 3;
      if (interests.includes('computer-vision') && lesson.useCases.includes('Image Processing')) score += 3;
      if (interests.includes('data-analysis') && lesson.useCases.includes('Data Analysis')) score += 3;
      if (interests.includes('automation') && lesson.useCases.includes('Automation')) score += 3;
      if (interests.includes('creative-ai') && lesson.useCases.includes('Creative Applications')) score += 3;
      if (interests.includes('ethics') && lesson.category === 'Ethics & Policy') score += 3;
      
      // Skill level alignment
      const skillMapping = {
        'complete-beginner': 'Beginner',
        'some-exposure': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
      };
      
      if (lesson.difficulty === skillMapping[skillLevel]) score += 2;
      if (lesson.difficulty === 'Beginner' && skillLevel === 'complete-beginner') score += 1;
      
      // Goal-based scoring
      if (goals.includes('career-advancement') && lesson.tags.includes('Professional Development')) score += 1;
      if (goals.includes('business-applications') && lesson.tags.includes('Business Applications')) score += 1;
      if (goals.includes('personal-projects') && lesson.tags.includes('Project-Based')) score += 1;
      
      return { ...lesson, score };
    });
    
    // Sort by score and create progressive path
    recommendedLessons.sort((a, b) => b.score - a.score);
    
    // Create a balanced path with difficulty progression
    const beginnerLessons = recommendedLessons.filter(l => l.difficulty === 'Beginner').slice(0, 3);
    const intermediateLessons = recommendedLessons.filter(l => l.difficulty === 'Intermediate').slice(0, 3);
    const advancedLessons = recommendedLessons.filter(l => l.difficulty === 'Advanced').slice(0, 2);
    
    let personalizedPath = [];
    
    // Start with beginner lessons unless user is advanced
    if (skillLevel !== 'advanced') {
      personalizedPath = [...beginnerLessons];
    }
    
    if (skillLevel === 'intermediate' || skillLevel === 'advanced') {
      personalizedPath = [...personalizedPath, ...intermediateLessons];
    }
    
    if (skillLevel === 'advanced') {
      personalizedPath = [...personalizedPath, ...advancedLessons];
    } else {
      // Add some intermediate and advanced for progression
      personalizedPath = [...personalizedPath, ...intermediateLessons.slice(0, 2), ...advancedLessons.slice(0, 1)];
    }
    
    // Remove duplicates and limit to reasonable path length
    const uniquePath = personalizedPath.filter((lesson, index, self) => 
      index === self.findIndex(l => l.id === lesson.id)
    ).slice(0, 8);
    
    return {
      lessons: uniquePath,
      userProfile: answers,
      estimatedDuration: uniquePath.reduce((total, lesson) => total + parseInt(lesson.duration), 0),
      pathTitle: generatePathTitle(answers),
      nextLessonIndex: 0
    };
  };

  const generatePathTitle = (answers) => {
    const { interests, skillLevel, goals } = answers;
    
    if (interests.includes('language-models')) return 'AI Language Master Path';
    if (interests.includes('computer-vision')) return 'AI Vision Expert Path';
    if (interests.includes('data-analysis')) return 'AI Data Analyst Path';
    if (interests.includes('automation')) return 'AI Automation Specialist Path';
    if (interests.includes('creative-ai')) return 'Creative AI Artist Path';
    if (goals.includes('career-advancement')) return 'AI Career Accelerator Path';
    if (goals.includes('business-applications')) return 'AI Business Leader Path';
    
    return 'Personalized AI Learning Path';
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate and save personalized path
      const personalizedPath = generatePersonalizedPath();
      localStorage.setItem('userLearningPath', JSON.stringify(personalizedPath));
      localStorage.setItem('learningPathCompleted', 'false');
      
      // Navigate to path results
      navigate('/learning-path/results', { state: { personalizedPath } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/lessons');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <LoggedInNavbar />
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes question-enter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes option-glow {
          0% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
          }
          100% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
          }
        }

        .question-container {
          animation: question-enter 0.5s ease-out;
        }

        .selected-option {
          animation: option-glow 2s ease-in-out infinite;
        }
      `}</style>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Question {currentStep + 1} of {questions.length}</span>
            <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 shadow-lg shadow-gray-700/50">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 shadow-lg shadow-indigo-500/30"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="question-container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              {currentQuestion.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={`group relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border transition-all duration-300 cursor-pointer hover:scale-105 ${
                  isAnswerSelected(option.id)
                    ? 'border-indigo-400 bg-indigo-500/20 selected-option'
                    : 'border-white/10 hover:border-white/30 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{option.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{option.label}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {option.description}
                  </p>
                  
                  {isAnswerSelected(option.id) && (
                    <div className="absolute top-4 right-4 text-indigo-400">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg ${
                canProceed()
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-gray-600/20'
              }`}
            >
              <span>{currentStep === questions.length - 1 ? 'Create My Path' : 'Next'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningPathQuiz; 