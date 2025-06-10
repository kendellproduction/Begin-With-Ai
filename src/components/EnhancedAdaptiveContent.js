import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdaptiveLessonService } from '../services/adaptiveLessonService';
import { AutoQuizService } from '../services/autoQuizService';
import { sanitizeText } from '../utils/sanitization';
import AICodeFeedback from './AICodeFeedback';
import SmartHintSystem from './SmartHintSystem';

const EnhancedAdaptiveContent = ({ 
  lessonId,
  initialDifficulty = 'intermediate',
  userPerformanceHistory = [],
  onContentAdapted,
  onProgressUpdate,
  className = ''
}) => {
  const { user } = useAuth();
  const [currentContent, setCurrentContent] = useState(null);
  const [adaptedDifficulty, setAdaptedDifficulty] = useState(initialDifficulty);
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptationHistory, setAdaptationHistory] = useState([]);
  const [userPerformance, setUserPerformance] = useState({
    scores: [],
    timeSpent: [],
    hintsUsed: 0,
    attempts: 0,
    struggling: false
  });
  const [adaptiveQuiz, setAdaptiveQuiz] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [contentMetrics, setContentMetrics] = useState({
    engagement: 0,
    comprehension: 0,
    retention: 0
  });

  // Load initial content
  useEffect(() => {
    if (lessonId && user) {
      loadAdaptiveContent();
    }
  }, [lessonId, user]);

  // Monitor performance and adapt content
  useEffect(() => {
    if (userPerformance.scores.length > 0) {
      analyzePerformanceAndAdapt();
    }
  }, [userPerformance]);

  const loadAdaptiveContent = async () => {
    setIsAdapting(true);
    
    try {
      // Get adapted content based on user skill level
      const adaptedLesson = await AdaptiveLessonService.getAdaptedLesson(
        'prompt-engineering', // This would be dynamic based on path
        'module-1', // This would be dynamic based on module
        lessonId,
        adaptedDifficulty
      );

      if (adaptedLesson) {
        setCurrentContent(adaptedLesson);
        
        // Generate adaptive quiz for this content
        const quizResult = await AutoQuizService.generateAdaptiveQuiz(
          user.uid,
          { skillLevel: adaptedDifficulty },
          {
            title: adaptedLesson.title || 'Lesson',
            content: adaptedLesson.adaptedContent?.content?.mainContent || '',
            objectives: adaptedLesson.objectives || [],
            difficulty: adaptedDifficulty
          }
        );

        if (quizResult.success) {
          setAdaptiveQuiz(quizResult.quiz);
        }
      }

    } catch (error) {
      console.error('Error loading adaptive content:', error);
    } finally {
      setIsAdapting(false);
    }
  };

  const analyzePerformanceAndAdapt = async () => {
    if (!currentContent || userPerformance.scores.length < 2) return;

    const recentScores = userPerformance.scores.slice(-3);
    const averageScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const isConsistentlyHigh = recentScores.every(score => score >= 90);
    const isConsistentlyLow = recentScores.every(score => score < 60);
    const isStruggling = userPerformance.hintsUsed > 3 || userPerformance.attempts > 5;

    let newDifficulty = adaptedDifficulty;
    let shouldAdapt = false;

    // Determine if difficulty should change
    if (isConsistentlyHigh && !isStruggling && adaptedDifficulty !== 'advanced') {
      newDifficulty = adaptedDifficulty === 'beginner' ? 'intermediate' : 'advanced';
      shouldAdapt = true;
    } else if (isConsistentlyLow || isStruggling) {
      newDifficulty = adaptedDifficulty === 'advanced' ? 'intermediate' : 'beginner';
      shouldAdapt = true;
    }

    if (shouldAdapt) {
      await adaptContent(newDifficulty, {
        reason: isConsistentlyHigh ? 'excelling' : 'struggling',
        previousScore: averageScore,
        hintsUsed: userPerformance.hintsUsed,
        attempts: userPerformance.attempts
      });
    }

    // Update content metrics
    updateContentMetrics(averageScore, isStruggling);
  };

  const adaptContent = async (newDifficulty, adaptationReason) => {
    setIsAdapting(true);

    try {
      // Record adaptation
      const adaptation = {
        timestamp: new Date().toISOString(),
        fromDifficulty: adaptedDifficulty,
        toDifficulty: newDifficulty,
        reason: adaptationReason.reason,
        metrics: adaptationReason
      };

      setAdaptationHistory(prev => [...prev, adaptation]);
      setAdaptedDifficulty(newDifficulty);

      // Load new content at adapted difficulty
      const adaptedLesson = await AdaptiveLessonService.getAdaptedLesson(
        'prompt-engineering',
        'module-1',
        lessonId,
        newDifficulty
      );

      if (adaptedLesson) {
        setCurrentContent(adaptedLesson);

        // Generate new adaptive quiz
        const quizResult = await AutoQuizService.generateAdaptiveQuiz(
          user.uid,
          { skillLevel: newDifficulty },
          {
            title: adaptedLesson.title || 'Lesson',
            content: adaptedLesson.adaptedContent?.content?.mainContent || '',
            objectives: adaptedLesson.objectives || [],
            difficulty: newDifficulty
          }
        );

        if (quizResult.success) {
          setAdaptiveQuiz(quizResult.quiz);
        }

        // Notify parent component
        if (onContentAdapted) {
          onContentAdapted(adaptation);
        }
      }

    } catch (error) {
      console.error('Error adapting content:', error);
    } finally {
      setIsAdapting(false);
    }
  };

  const updateContentMetrics = (averageScore, isStruggling) => {
    setContentMetrics(prev => ({
      engagement: Math.min(100, prev.engagement + (isStruggling ? -5 : 5)),
      comprehension: Math.round(averageScore),
      retention: Math.min(100, prev.retention + (averageScore >= 80 ? 3 : -2))
    }));
  };

  const handleQuizSubmission = async (quizAnswers) => {
    if (!adaptiveQuiz) return;

    try {
      const result = AutoQuizService.gradeQuiz(adaptiveQuiz, quizAnswers);
      
      if (result.success) {
        // Update performance tracking
        setUserPerformance(prev => ({
          ...prev,
          scores: [...prev.scores, result.score.percentage],
          attempts: prev.attempts + 1
        }));

        // Update progress
        if (onProgressUpdate) {
          onProgressUpdate({
            lessonId,
            score: result.score.percentage,
            difficulty: adaptedDifficulty,
            adaptations: adaptationHistory.length
          });
        }

        setShowQuiz(false);
        return result;
      }

    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleCodeFeedback = (feedback) => {
    // Analyze code feedback to update performance
    const codeScore = feedback.codeQuality ? 
      Object.values(feedback.codeQuality).reduce((sum, score) => {
        const numScore = parseInt(score) || 0;
        return sum + numScore;
      }, 0) / Object.keys(feedback.codeQuality).length * 10 : 70;

    setUserPerformance(prev => ({
      ...prev,
      scores: [...prev.scores, codeScore],
      attempts: prev.attempts + 1
    }));
  };

  const handleHintUsed = (hint) => {
    setUserPerformance(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      struggling: prev.hintsUsed >= 2
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getMetricColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!user) {
    return (
      <div className={`p-6 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-600 text-center">
          Please log in to access adaptive learning content
        </p>
      </div>
    );
  }

  if (isAdapting) {
    return (
      <div className={`p-6 bg-white rounded-lg border ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700">Adapting content to your learning style...</span>
        </div>
      </div>
    );
  }

  if (!currentContent) {
    return (
      <div className={`p-6 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-600 text-center">
          Unable to load adaptive content. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Adaptation Status */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🧠</span>
            <div>
              <h3 className="font-medium text-gray-800">Adaptive Learning Active</h3>
              <p className="text-sm text-gray-600">Content automatically adjusts to your performance</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium capitalize ${getDifficultyColor(adaptedDifficulty)}`}>
            {adaptedDifficulty}
          </div>
        </div>

        {/* Learning Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getMetricColor(contentMetrics.engagement)}`}>
              {contentMetrics.engagement}%
            </div>
            <div className="text-xs text-gray-600">Engagement</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getMetricColor(contentMetrics.comprehension)}`}>
              {contentMetrics.comprehension}%
            </div>
            <div className="text-xs text-gray-600">Comprehension</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getMetricColor(contentMetrics.retention)}`}>
              {contentMetrics.retention}%
            </div>
            <div className="text-xs text-gray-600">Retention</div>
          </div>
        </div>
      </div>

      {/* Adaptation History */}
      {adaptationHistory.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">
            📈 Recent Adaptations ({adaptationHistory.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {adaptationHistory.slice(-3).reverse().map((adaptation, index) => (
              <div key={index} className="text-sm bg-white rounded p-2 border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="capitalize">
                    {adaptation.reason}: {adaptation.fromDifficulty} → {adaptation.toDifficulty}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(adaptation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Lesson Content */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">📚</span>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {sanitizeText(currentContent.title || 'Adaptive Lesson')}
            </h2>
            <p className="text-sm text-gray-600">
              Customized for your {adaptedDifficulty} level
            </p>
          </div>
        </div>

        {/* Lesson Content */}
        {currentContent.adaptedContent?.content && (
          <div className="space-y-4">
            {/* Introduction */}
            {currentContent.adaptedContent.content.introduction && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Introduction</h3>
                <p className="text-gray-700">
                  {sanitizeText(currentContent.adaptedContent.content.introduction)}
                </p>
              </div>
            )}

            {/* Main Content */}
            {currentContent.adaptedContent.content.mainContent && (
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  {sanitizeText(currentContent.adaptedContent.content.mainContent)}
                </div>
              </div>
            )}

            {/* Key Points */}
            {currentContent.adaptedContent.content.keyPoints && 
             currentContent.adaptedContent.content.keyPoints.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">💡 Key Points</h3>
                <ul className="list-disc list-inside space-y-1">
                  {currentContent.adaptedContent.content.keyPoints.map((point, index) => (
                    <li key={index} className="text-yellow-700 text-sm">
                      {sanitizeText(point)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Examples */}
            {currentContent.adaptedContent.content.examples && 
             currentContent.adaptedContent.content.examples.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">📝 Examples</h3>
                {currentContent.adaptedContent.content.examples.map((example, index) => (
                  <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <code className="text-sm text-green-800 font-mono">
                      {sanitizeText(example)}
                    </code>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Interactive Sandbox */}
        {currentContent.adaptedContent?.sandbox && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium text-gray-800">🧪 Interactive Practice</h3>
            
            {/* Code Editor placeholder - would integrate with actual code editor */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-4">
                {sanitizeText(currentContent.adaptedContent.sandbox.instructions || 'Practice coding here')}
              </p>
              
              <textarea
                className="w-full h-32 p-3 border rounded-lg font-mono text-sm"
                placeholder="// Write your code here..."
                onChange={(e) => {
                  // This would integrate with a proper code editor
                  // For now, just track interaction
                  setUserPerformance(prev => ({
                    ...prev,
                    attempts: prev.attempts + 1
                  }));
                }}
              />

              {/* AI Code Feedback */}
              <AICodeFeedback 
                code={'// sample code'}
                language="javascript"
                lessonContext={{
                  goal: currentContent.adaptedContent.sandbox.instructions,
                  difficulty: adaptedDifficulty
                }}
                onFeedbackReceived={handleCodeFeedback}
                className="mt-4"
              />
            </div>

            {/* Smart Hint System */}
            <SmartHintSystem
              lessonId={lessonId}
              currentStep="practice"
              userCode={'// sample code'}
              timeSpent={userPerformance.attempts * 30} // Rough estimate
              attempts={userPerformance.attempts}
              onHintUsed={handleHintUsed}
              className="mt-4"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          {adaptiveQuiz && (
            <button
              onClick={() => setShowQuiz(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              📝 Take Adaptive Quiz
            </button>
          )}
          
          <button
            onClick={() => adaptContent(adaptedDifficulty, { reason: 'manual_refresh' })}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            🔄 Refresh Content
          </button>
        </div>
      </div>

      {/* Adaptive Quiz Modal */}
      {showQuiz && adaptiveQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  📝 {adaptiveQuiz.title}
                </h2>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-6">{adaptiveQuiz.description}</p>

              {/* Quiz Questions */}
              <div className="space-y-6">
                {adaptiveQuiz.questions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      {question.id}. {question.question}
                    </h3>
                    
                    {question.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name={`question_${question.id}`}
                              value={optionIndex}
                              className="text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === 'true_false' && (
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            name={`question_${question.id}`}
                            value="0"
                            className="text-blue-600"
                          />
                          <span className="text-sm text-gray-700">True</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            name={`question_${question.id}`}
                            value="1"
                            className="text-blue-600"
                          />
                          <span className="text-sm text-gray-700">False</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setShowQuiz(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Collect answers and submit
                    const answers = {};
                    adaptiveQuiz.questions.forEach(q => {
                      const selected = document.querySelector(`input[name="question_${q.id}"]:checked`);
                      if (selected) {
                        answers[`question_${q.id}`] = selected.value;
                      }
                    });
                    handleQuizSubmission(answers);
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAdaptiveContent; 