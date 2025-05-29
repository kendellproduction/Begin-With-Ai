import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { 
  adaptiveQuestionnaire, 
  assessmentScoring, 
  resultInterpretation 
} from '../utils/adaptiveQuestionnaire';

const AdaptiveLearningPathQuiz = () => {
  const { user } = useAuth();
  const { awardXP } = useGamification();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionsToShow, setQuestionsToShow] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize quiz with first question
  useEffect(() => {
    const firstQuestion = adaptiveQuestionnaire.questions[0];
    setQuestionsToShow([firstQuestion]);
  }, []);

  // Determine next questions based on adaptive logic
  const determineNextQuestions = (newAnswers) => {
    const remainingQuestions = adaptiveQuestionnaire.questions.filter(question => {
      // Skip if already shown
      if (questionsToShow.some(q => q.id === question.id)) return false;
      
      // Check adaptive condition
      if (question.adaptiveCondition) {
        return question.adaptiveCondition(newAnswers);
      }
      
      // Show required questions
      if (question.required) return true;
      
      // Show questions based on current answers and confidence
      const currentSkillLevel = assessmentScoring.calculateSkillLevel(newAnswers);
      const skillAssessment = assessmentScoring.determineSkillLevel(currentSkillLevel);
      
      // If we have high confidence and enough questions, we can finish early
      if (skillAssessment.isConfident && questionsToShow.length >= 6) {
        return false;
      }
      
      return true;
    });

    return remainingQuestions.slice(0, 3); // Add up to 3 more questions at a time
  };

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // Determine if we need more questions
    const nextQuestions = determineNextQuestions(newAnswers);
    
    if (nextQuestions.length > 0 && questionsToShow.length < adaptiveQuestionnaire.totalQuestions) {
      // Add new questions to the queue
      const updatedQuestions = [...questionsToShow];
      nextQuestions.forEach(q => {
        if (!updatedQuestions.some(existing => existing.id === q.id)) {
          updatedQuestions.push(q);
        }
      });
      setQuestionsToShow(updatedQuestions);
    }

    // Move to next question or finish
    if (currentQuestionIndex < questionsToShow.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Check if we should add more questions or finish
      if (nextQuestions.length === 0 || questionsToShow.length >= adaptiveQuestionnaire.totalQuestions) {
        finishQuiz(newAnswers);
      } else {
        // Wait for new questions to be added, then continue
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 100);
      }
    }
  };

  const finishQuiz = (finalAnswers) => {
    setIsLoading(true);
    
    // Calculate results
    const skillScores = assessmentScoring.calculateSkillLevel(finalAnswers);
    const skillLevel = assessmentScoring.determineSkillLevel(skillScores);
    const recommendations = assessmentScoring.generateRecommendations(finalAnswers, skillLevel);
    const interpretation = resultInterpretation[skillLevel.primary];

    const quizResults = {
      skillLevel: skillLevel.primary,
      confidence: skillLevel.confidence,
      scores: skillLevel.scores,
      recommendations,
      interpretation,
      answersProvided: Object.keys(finalAnswers).length,
      completedAt: new Date().toISOString()
    };

    setResults(quizResults);
    setIsComplete(true);
    setIsLoading(false);

    // Award XP for completing the assessment
    if (user) {
      awardXP(25, 'Completed AI Learning Path Assessment');
    }

    // Save results to localStorage for now (later integrate with Firestore)
    localStorage.setItem('aiAssessmentResults', JSON.stringify(quizResults));
  };

  const handleStartLearning = () => {
    navigate('/learning-path-results', { 
      state: { 
        results, 
        fromQuiz: true 
      } 
    });
  };

  const currentQuestion = questionsToShow[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionsToShow.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Analyzing your responses...</p>
        </div>
      </div>
    );
  }

  if (isComplete && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{results.interpretation.title.split(' ').pop()}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {results.interpretation.title.replace(/🌟|🚀|🎯/, '').trim()}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {results.interpretation.description}
            </p>
          </div>

          {/* Skill Level Breakdown */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your AI Skill Profile</h2>
            
            <div className="space-y-4 mb-6">
              {Object.entries(results.scores).map(([level, score]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-lg font-medium capitalize text-gray-700">{level}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          level === results.skillLevel 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${(score * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round(score * 100)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Your Approach</h3>
              <p className="text-blue-800">{results.interpretation.approach}</p>
            </div>
          </div>

          {/* Personalized Learning Plan */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Personalized Learning Plan</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Study Plan</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Pace:</span> {results.recommendations.studyPlan.lessonsPerWeek} lessons per week
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Completion:</span> {results.recommendations.studyPlan.estimatedCompletion}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Difficulty:</span> {results.recommendations.difficulty}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Focus Areas</h3>
                <ul className="space-y-1">
                  {results.interpretation.focusAreas.map((area, index) => (
                    <li key={index} className="text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {results.recommendations.nextPaths.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Next Paths</h3>
                <div className="flex flex-wrap gap-2">
                  {results.recommendations.nextPaths.map((path, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium"
                    >
                      {path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Your Strengths */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Strengths</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {results.interpretation.strengths.map((strength, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <p className="text-green-800 font-medium">{strength}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              onClick={handleStartLearning}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Your AI Journey 🚀
            </button>
            <p className="mt-4 text-gray-600">
              Ready to begin? We'll start you with Prompt Engineering Mastery!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading your personalized assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {adaptiveQuestionnaire.title}
          </h1>
          <p className="text-lg text-gray-600">
            {adaptiveQuestionnaire.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
              {adaptiveQuestionnaire.categories[currentQuestion.category]}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion.id, {
                  value: currentQuestion.type === 'multiple_choice' 
                    ? (answers[currentQuestion.id]?.value || []).includes(option.value)
                      ? (answers[currentQuestion.id]?.value || []).filter(v => v !== option.value)
                      : [...(answers[currentQuestion.id]?.value || []), option.value]
                    : option.value,
                  text: option.text
                })}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 ${
                  currentQuestion.type === 'multiple_choice'
                    ? (answers[currentQuestion.id]?.value || []).includes(option.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                    : answers[currentQuestion.id]?.value === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    currentQuestion.type === 'multiple_choice'
                      ? (answers[currentQuestion.id]?.value || []).includes(option.value)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                      : answers[currentQuestion.id]?.value === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {((currentQuestion.type === 'multiple_choice' && (answers[currentQuestion.id]?.value || []).includes(option.value)) ||
                      (currentQuestion.type === 'single_choice' && answers[currentQuestion.id]?.value === option.value)) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-900">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {currentQuestion.type === 'multiple_choice' && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  if (answers[currentQuestion.id]?.value?.length > 0) {
                    handleAnswer(currentQuestion.id, answers[currentQuestion.id]);
                  }
                }}
                disabled={!answers[currentQuestion.id]?.value?.length}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Continue
              </button>
            </div>
          )}
        </div>

        {/* Question Counter */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Based on your answers, we'll customize the remaining questions for you
        </div>
      </div>
    </div>
  );
};

export default AdaptiveLearningPathQuiz; 