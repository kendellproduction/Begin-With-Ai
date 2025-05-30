import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import LoggedInNavbar from './LoggedInNavbar';

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

  // Fixed 8-question assessment - clean and predictable
  const questions = [
    {
      id: 'ai-experience',
      category: '🎯 Experience Level',
      question: "How would you describe your experience with AI tools?",
      type: 'single',
      options: [
        { value: 'never', text: "I've never used AI tools like ChatGPT", points: { beginner: 3, intermediate: 0, advanced: 0 } },
        { value: 'few-times', text: "I've tried ChatGPT or similar tools a few times", points: { beginner: 2, intermediate: 1, advanced: 0 } },
        { value: 'regular', text: "I use AI tools regularly (weekly or more)", points: { beginner: 0, intermediate: 3, advanced: 1 } },
        { value: 'advanced', text: "I'm comfortable with multiple AI tools and advanced features", points: { beginner: 0, intermediate: 1, advanced: 3 } }
      ]
    },
    {
      id: 'learning-goal',
      category: '🎓 Learning Goals',
      question: "What's your main goal with AI learning?",
      type: 'single',
      options: [
        { value: 'understand', text: "Understand what AI is and how it works", points: { beginner: 3, intermediate: 1, advanced: 0 } },
        { value: 'practical', text: "Learn practical skills for work or projects", points: { beginner: 1, intermediate: 3, advanced: 1 } },
        { value: 'master', text: "Master advanced AI techniques and workflows", points: { beginner: 0, intermediate: 1, advanced: 3 } },
        { value: 'business', text: "Apply AI to solve business problems", points: { beginner: 0, intermediate: 2, advanced: 2 } }
      ]
    },
    {
      id: 'technical-comfort',
      category: '⚡ Technical Comfort',
      question: "How do you feel about learning new technology?",
      type: 'single',
      options: [
        { value: 'cautious', text: "I prefer simple, step-by-step guidance", points: { beginner: 3, intermediate: 0, advanced: 0 } },
        { value: 'moderate', text: "I'm okay with tech but like clear instructions", points: { beginner: 2, intermediate: 2, advanced: 0 } },
        { value: 'confident', text: "I enjoy learning new tech and figuring things out", points: { beginner: 1, intermediate: 2, advanced: 2 } },
        { value: 'expert', text: "I love diving deep into technical details", points: { beginner: 0, intermediate: 1, advanced: 3 } }
      ]
    },
    {
      id: 'time-commitment',
      category: '⏰ Time Commitment',
      question: "How much time can you dedicate to learning AI per week?",
      type: 'single',
      options: [
        { value: '1-2-hours', text: "1-2 hours (casual learner)", points: { beginner: 2, intermediate: 1, advanced: 0 } },
        { value: '3-5-hours', text: "3-5 hours (steady progress)", points: { beginner: 1, intermediate: 3, advanced: 1 } },
        { value: '6-10-hours', text: "6-10 hours (accelerated learning)", points: { beginner: 0, intermediate: 2, advanced: 2 } },
        { value: '10-plus-hours', text: "10+ hours (intensive study)", points: { beginner: 0, intermediate: 1, advanced: 3 } }
      ]
    },
    {
      id: 'ai-tools-used',
      category: '🛠️ AI Tools',
      question: "Which AI tools have you used? (Select all that apply)",
      type: 'multiple',
      options: [
        { value: 'chatgpt', text: "ChatGPT", points: { beginner: 1, intermediate: 1, advanced: 0 } },
        { value: 'image-ai', text: "Image AI (DALL-E, Midjourney)", points: { beginner: 1, intermediate: 1, advanced: 1 } },
        { value: 'code-ai', text: "Code AI (GitHub Copilot, Claude)", points: { beginner: 0, intermediate: 1, advanced: 2 } },
        { value: 'voice-ai', text: "Voice AI (Whisper, ElevenLabs)", points: { beginner: 0, intermediate: 1, advanced: 2 } },
        { value: 'apis', text: "AI APIs or integrations", points: { beginner: 0, intermediate: 0, advanced: 3 } },
        { value: 'none', text: "None of these", points: { beginner: 2, intermediate: 0, advanced: 0 } }
      ]
    },
    {
      id: 'learning-style',
      category: '📚 Learning Style',
      question: "How do you prefer to learn new skills?",
      type: 'single',
      options: [
        { value: 'theory-first', text: "Start with theory and concepts", points: { beginner: 2, intermediate: 1, advanced: 1 } },
        { value: 'hands-on', text: "Jump right into hands-on practice", points: { beginner: 1, intermediate: 3, advanced: 2 } },
        { value: 'examples', text: "Learn through examples and case studies", points: { beginner: 2, intermediate: 2, advanced: 1 } },
        { value: 'project-based', text: "Build real projects while learning", points: { beginner: 0, intermediate: 2, advanced: 3 } }
      ]
    },
    {
      id: 'work-context',
      category: '💼 Work Context',
      question: "How do you plan to use AI in your work or studies?",
      type: 'multiple',
      options: [
        { value: 'writing', text: "Writing and content creation", points: { beginner: 2, intermediate: 2, advanced: 1 } },
        { value: 'research', text: "Research and information gathering", points: { beginner: 2, intermediate: 2, advanced: 1 } },
        { value: 'automation', text: "Automate repetitive tasks", points: { beginner: 1, intermediate: 2, advanced: 2 } },
        { value: 'analysis', text: "Data analysis and insights", points: { beginner: 0, intermediate: 2, advanced: 3 } },
        { value: 'creative', text: "Creative projects and design", points: { beginner: 1, intermediate: 2, advanced: 2 } },
        { value: 'unsure', text: "I'm not sure yet", points: { beginner: 2, intermediate: 1, advanced: 0 } }
      ]
    },
    {
      id: 'challenge-level',
      category: '🎯 Challenge Preference',
      question: "What level of challenge do you prefer when learning?",
      type: 'single',
      options: [
        { value: 'gentle', text: "Gentle progression with lots of support", points: { beginner: 3, intermediate: 0, advanced: 0 } },
        { value: 'moderate', text: "Moderate challenge with clear guidance", points: { beginner: 1, intermediate: 3, advanced: 1 } },
        { value: 'challenging', text: "Challenging but achievable goals", points: { beginner: 0, intermediate: 2, advanced: 2 } },
        { value: 'intense', text: "Push me to my limits", points: { beginner: 0, intermediate: 0, advanced: 3 } }
      ]
    }
  ];

  const totalQuestions = questions.length;
  const completedAnswers = Object.keys(answers).length;
  const progress = (completedAnswers / totalQuestions) * 100;
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
    const timeCommitment = answers['time-commitment'];
    const learningStyle = answers['learning-style'];
    
    const recommendations = {
      beginner: {
        title: "🌟 AI Foundations Explorer",
        description: "Perfect for someone starting their AI journey! You'll learn the fundamentals with plenty of support and clear explanations.",
        approach: "We'll start with the basics and build your confidence step by step.",
        focusAreas: [
          "Understanding what AI really is",
          "Getting comfortable with AI tools",
          "Building practical prompting skills",
          "Exploring real-world applications"
        ],
        startingPath: "AI Foundations",
        difficulty: "Gentle learning curve",
        estimatedTime: timeCommitment === '1-2-hours' ? "4-6 weeks" : 
                      timeCommitment === '3-5-hours' ? "2-3 weeks" : "1-2 weeks"
      },
      intermediate: {
        title: "🚀 AI Skills Accelerator", 
        description: "Great for building practical AI skills! You'll learn techniques that make a real difference in your work and projects.",
        approach: "We'll focus on hands-on learning with real examples and practical applications.",
        focusAreas: [
          "Advanced prompting techniques",
          "Multi-tool AI workflows",
          "Problem-solving with AI",
          "Professional AI applications"
        ],
        startingPath: "Prompt Engineering Mastery",
        difficulty: "Balanced challenge and support",
        estimatedTime: timeCommitment === '1-2-hours' ? "6-8 weeks" : 
                      timeCommitment === '3-5-hours' ? "3-4 weeks" : "2-3 weeks"
      },
      advanced: {
        title: "🎯 AI Mastery Program",
        description: "Perfect for pushing your AI expertise to the next level! You'll master advanced techniques and cutting-edge applications.",
        approach: "We'll dive deep into advanced concepts with challenging, real-world projects.",
        focusAreas: [
          "Advanced AI architectures",
          "API integrations and automation",
          "Custom AI workflows",
          "Emerging AI technologies"
        ],
        startingPath: "Advanced AI Engineering",
        difficulty: "High challenge, high reward",
        estimatedTime: timeCommitment === '1-2-hours' ? "8-12 weeks" : 
                      timeCommitment === '3-5-hours' ? "4-6 weeks" : "3-4 weeks"
      }
    };

    return recommendations[skillLevel];
  };

  const finishQuiz = (finalAnswers) => {
    setIsLoading(true);
    
    // Calculate results
    const quizResults = calculateResults(finalAnswers);
    quizResults.completedAt = new Date().toISOString();
    quizResults.answersProvided = Object.keys(finalAnswers).length;

    setResults(quizResults);
    setIsComplete(true);
    setIsLoading(false);

    // Award XP for completing assessment - with proper error handling
    if (user && awardXP && typeof awardXP === 'function') {
      try {
        awardXP(50, 'Completed AI Learning Path Assessment');
      } catch (error) {
        console.log('XP award not available:', error);
      }
    }

    // Save to localStorage
    localStorage.setItem('aiAssessmentResults', JSON.stringify(quizResults));
  };

  const handleStartLearning = () => {
    // Save learning path to localStorage
    const learningPath = {
      pathId: 'prompt-engineering-mastery',
      pathTitle: results.recommendations.title,
      skillLevel: results.skillLevel,
      startedAt: new Date().toISOString(),
      isActive: true
    };
    
    localStorage.setItem('activeLearningPath', JSON.stringify(learningPath));
    
    // Navigate to lessons
    navigate('/lessons', { 
      state: { 
        fromQuiz: true,
        skillLevel: results.skillLevel,
        recommendations: results.recommendations
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <LoggedInNavbar />
        <div className="flex items-center justify-center min-h-[70vh]">
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

  if (isComplete && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <LoggedInNavbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-6 animate-bounce">
              {results.skillLevel === 'beginner' ? '🌟' : 
               results.skillLevel === 'intermediate' ? '🚀' : '🎯'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {results.recommendations.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {results.recommendations.description}
            </p>
          </div>

          {/* Confidence Score */}
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-green-500/30 text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Assessment Confidence</h2>
            <div className="text-5xl font-bold text-green-300 mb-2">{results.confidence}%</div>
            <p className="text-green-200">
              We're {results.confidence}% confident this is the perfect starting point for you!
            </p>
          </div>

          {/* Skill Breakdown */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your AI Skill Profile</h2>
            
            <div className="space-y-6">
              {Object.entries(results.scores).map(([level, score]) => (
                <div key={level} className="flex items-center">
                  <div className="w-20 text-right mr-4">
                    <span className="text-lg font-medium capitalize text-slate-300">{level}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-slate-700 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`h-4 rounded-full transition-all duration-1000 ${
                          level === results.skillLevel 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                            : 'bg-slate-500'
                        }`}
                        style={{ 
                          width: `${score}%`,
                          animationDelay: `${Object.keys(results.scores).indexOf(level) * 200}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-left">
                    <span className="text-lg font-bold text-white">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Plan */}
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-indigo-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">Your Personalized Learning Plan</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-indigo-300 mb-4">Learning Approach</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {results.recommendations.approach}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Difficulty Level:</span>
                    <span className="text-white font-medium">{results.recommendations.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Estimated Duration:</span>
                    <span className="text-white font-medium">{results.recommendations.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Starting Path:</span>
                    <span className="text-white font-medium">{results.recommendations.startingPath}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-4">Your Focus Areas</h3>
                <ul className="space-y-3">
                  {results.recommendations.focusAreas.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-slate-300">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              onClick={handleStartLearning}
              className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl text-white font-bold text-xl shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
              <span className="relative flex items-center gap-3">
                Start Your AI Journey
                <span className="text-2xl">🚀</span>
              </span>
            </button>
            <p className="mt-6 text-slate-400 text-lg">
              Ready to transform your skills? Let's begin with your personalized path!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <LoggedInNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Learning Path Finder
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Help us create the perfect learning experience for you! This quick assessment will customize your AI journey.
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-300 font-medium">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-blue-400 font-bold">
              {Math.round(progress)}% Complete
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-500/30">
              {currentQuestion.category}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentQuestion.type === 'multiple' 
                ? selectedAnswers.includes(option.value)
                : answers[currentQuestion.id] === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full text-left p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:border-blue-400/50 hover:bg-blue-500/5'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-white/40'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-lg text-white">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Button for Multiple Choice */}
          {currentQuestion.type === 'multiple' && (
            <div className="mt-8 text-center">
              <button
                onClick={handleMultipleChoiceContinue}
                disabled={selectedAnswers.length === 0}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Finish Assessment' : 'Continue'}
              </button>
              <p className="mt-3 text-slate-400 text-sm">
                {selectedAnswers.length === 0 ? 'Select at least one option to continue' : 
                 selectedAnswers.length === 1 ? '1 option selected' : 
                 `${selectedAnswers.length} options selected`}
              </p>
            </div>
          )}
        </div>

        {/* Question Counter */}
        <div className="text-center mt-6">
          <p className="text-slate-400">
            Your answers help us customize the perfect learning experience for you
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveLearningPathQuiz; 