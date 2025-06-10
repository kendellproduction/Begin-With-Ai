import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AICodeFeedbackService } from '../services/aiCodeFeedbackService';
import { sanitizeCode } from '../utils/sanitization';

const AICodeFeedback = ({ 
  code, 
  language = 'javascript', 
  lessonContext = {},
  onFeedbackReceived,
  autoAnalyze = false,
  className = ''
}) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [detailedAnalysis, setDetailedAnalysis] = useState(null);
  const [remainingRequests, setRemainingRequests] = useState(null);

  // Auto-analyze when code changes (debounced)
  useEffect(() => {
    if (!autoAnalyze || !code || code.length < 10) return;

    const timeoutId = setTimeout(() => {
      handleAnalyzeCode();
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeoutId);
  }, [code, autoAnalyze]);

  const handleAnalyzeCode = async () => {
    if (!user || !code.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const result = await AICodeFeedbackService.analyzeCode(
        user.uid,
        code,
        language,
        {
          lessonGoal: lessonContext.goal,
          expectedOutput: lessonContext.expectedOutput,
          difficulty: lessonContext.difficulty || 'intermediate'
        }
      );

      if (result.success) {
        setFeedback(result.feedback);
        setRemainingRequests(result.remainingRequests);
        
        if (onFeedbackReceived) {
          onFeedbackReceived(result.feedback);
        }
      } else {
        setError(result.error || 'Failed to analyze code');
      }

    } catch (err) {
      setError('Something went wrong while analyzing your code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetDetailedAnalysis = async () => {
    if (!user || !code.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const result = await AICodeFeedbackService.getDetailedAnalysis(
        user.uid,
        code,
        language
      );

      if (result.success) {
        setDetailedAnalysis(result.analysis);
        setShowDetailedAnalysis(true);
      } else {
        setError(result.error || 'Failed to get detailed analysis');
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFeedbackTypeIcon = (type) => {
    switch (type) {
      case 'positive':
        return '🎉';
      case 'constructive':
        return '💡';
      case 'error':
        return '⚠️';
      default:
        return '📝';
    }
  };

  const getFeedbackTypeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'border-green-500 bg-green-50';
      case 'constructive':
        return 'border-blue-500 bg-blue-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'text-green-600';
    if (numScore >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!user) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-600 text-center">
          Please log in to get AI feedback on your code
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={handleAnalyzeCode}
            disabled={!code.trim() || isAnalyzing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing...</span>
              </span>
            ) : (
              '🤖 Get AI Feedback'
            )}
          </button>

          {feedback && (
            <button
              onClick={handleGetDetailedAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
            >
              📊 Detailed Analysis
            </button>
          )}
        </div>

        {remainingRequests !== null && (
          <span className="text-sm text-gray-500">
            {remainingRequests} feedback requests remaining
          </span>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Main Feedback Display */}
      {feedback && (
        <div className={`p-6 border-2 rounded-lg ${getFeedbackTypeColor(feedback.type)}`}>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{getFeedbackTypeIcon(feedback.type)}</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Code Feedback
              </h3>
              <p className="text-gray-700 mb-4">{feedback.overall}</p>

              {/* Code Quality Scores */}
              {feedback.codeQuality && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {Object.entries(feedback.codeQuality).map(([metric, score]) => (
                    <div key={metric} className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-600 capitalize">
                        {metric}
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                        {score}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths */}
              {feedback.strengths && feedback.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ What you did well:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="text-green-700 text-sm">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {feedback.improvements && feedback.improvements.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Areas for improvement:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="text-blue-700 text-sm">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specific Suggestions */}
              {feedback.suggestions && feedback.suggestions.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-purple-800 mb-2">🔧 Specific suggestions:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-purple-700 text-sm">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Encouragement */}
              {feedback.encouragement && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    🌟 {feedback.encouragement}
                  </p>
                </div>
              )}

              {/* Next Steps */}
              {feedback.nextSteps && feedback.nextSteps.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">🎯 Next steps:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {feedback.nextSteps.map((step, index) => (
                      <li key={index} className="text-gray-700 text-sm">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analysis Modal */}
      {showDetailedAnalysis && detailedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  📊 Detailed Code Analysis
                </h2>
                <button
                  onClick={() => setShowDetailedAnalysis(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Complexity Analysis */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">🧮 Complexity Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div>Lines of Code: {detailedAnalysis.complexity?.linesOfCode}</div>
                    <div>Cyclomatic Complexity: {detailedAnalysis.complexity?.cyclomaticComplexity}</div>
                    <div className="capitalize">
                      Complexity Level: {detailedAnalysis.complexity?.complexityLevel}
                    </div>
                  </div>
                </div>

                {/* Patterns Detected */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">🔍 Patterns Detected</h3>
                  <div className="space-y-1">
                    {detailedAnalysis.patterns?.length > 0 ? (
                      detailedAnalysis.patterns.map((pattern, index) => (
                        <div key={index} className="text-sm text-blue-700 capitalize">
                          {pattern.replace(/_/g, ' ')}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No specific patterns detected</div>
                    )}
                  </div>
                </div>

                {/* Performance Analysis */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">⚡ Performance</h3>
                  <div className="text-sm">
                    <div className="mb-2">Score: {detailedAnalysis.performance?.score}/10</div>
                    {detailedAnalysis.performance?.issues?.length > 0 && (
                      <div>
                        <div className="font-medium mb-1">Issues:</div>
                        <ul className="list-disc list-inside space-y-1 text-yellow-700">
                          {detailedAnalysis.performance.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Analysis */}
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">🔒 Security</h3>
                  <div className="text-sm">
                    <div className="mb-2 capitalize">
                      Risk Level: {detailedAnalysis.security?.riskLevel}
                    </div>
                    {detailedAnalysis.security?.vulnerabilities?.length > 0 && (
                      <div>
                        <div className="font-medium mb-1">Vulnerabilities:</div>
                        <ul className="list-disc list-inside space-y-1 text-red-700">
                          {detailedAnalysis.security.vulnerabilities.map((vuln, index) => (
                            <li key={index}>{vuln}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Best Practices */}
                <div className="p-4 bg-green-50 rounded-lg lg:col-span-2">
                  <h3 className="font-medium text-gray-800 mb-3">✅ Best Practices</h3>
                  <div className="text-sm">
                    <div className="mb-2">Score: {detailedAnalysis.bestPractices?.score}/10</div>
                    {detailedAnalysis.bestPractices?.violations?.length > 0 && (
                      <div>
                        <div className="font-medium mb-1">Violations:</div>
                        <ul className="list-disc list-inside space-y-1 text-orange-700">
                          {detailedAnalysis.bestPractices.violations.map((violation, index) => (
                            <li key={index}>{violation}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowDetailedAnalysis(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Close Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICodeFeedback; 