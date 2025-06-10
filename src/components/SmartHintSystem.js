import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SmartHintService } from '../services/smartHintService';

const SmartHintSystem = ({ 
  lessonId,
  currentStep,
  userCode = '',
  errorMessage = '',
  expectedOutput = '',
  timeSpent = 0,
  attempts = 0,
  onHintUsed,
  className = ''
}) => {
  const { user } = useAuth();
  const [currentHint, setCurrentHint] = useState(null);
  const [hintHistory, setHintHistory] = useState([]);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [error, setError] = useState('');
  const [showProgressiveHints, setShowProgressiveHints] = useState(false);
  const [progressiveHints, setProgressiveHints] = useState([]);
  const [remainingRequests, setRemainingRequests] = useState(null);
  const [hintLevel, setHintLevel] = useState(1);

  // Track time spent and attempts automatically
  useEffect(() => {
    // This could be enhanced to track actual time spent and attempts
    // For now, we'll use the props passed in
  }, [timeSpent, attempts]);

  const getSmartHint = async () => {
    if (!user || isLoadingHint) return;

    setIsLoadingHint(true);
    setError('');

    try {
      const context = {
        lessonId,
        currentStep,
        userCode,
        errorMessage,
        expectedOutput,
        timeSpent,
        attempts,
        difficulty: 'intermediate', // This could come from lesson data
        previousHints: hintHistory.map(h => h.message)
      };

      const result = await SmartHintService.getSmartHint(user.uid, context);

      if (result.success) {
        const newHint = { ...result.hint, id: Date.now() };
        setCurrentHint(newHint);
        setHintHistory(prev => [...prev, newHint]);
        setRemainingRequests(result.remainingRequests);
        setHintLevel(prev => Math.min(prev + 1, 3));

        if (onHintUsed) {
          onHintUsed(newHint);
        }
      } else {
        setError(result.error || 'Failed to get hint');
      }

    } catch (err) {
      setError('Something went wrong while getting a hint. Please try again.');
    } finally {
      setIsLoadingHint(false);
    }
  };

  const getProgressiveHints = async () => {
    if (!user || isLoadingHint) return;

    setIsLoadingHint(true);
    setError('');

    try {
      const result = await SmartHintService.getProgressiveHints(
        user.uid, 
        lessonId, 
        currentStep
      );

      if (result.success) {
        setProgressiveHints(result.hints);
        setShowProgressiveHints(true);
      } else {
        setError(result.error || 'Failed to get progressive hints');
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoadingHint(false);
    }
  };

  const clearHints = () => {
    setCurrentHint(null);
    setHintHistory([]);
    setHintLevel(1);
    setShowProgressiveHints(false);
    setProgressiveHints([]);
    setError('');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'gentle':
        return 'border-green-500 bg-green-50';
      case 'specific':
        return 'border-blue-500 bg-blue-50';
      case 'detailed':
        return 'border-orange-500 bg-orange-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'gentle':
        return '🌟';
      case 'specific':
        return '🎯';
      case 'detailed':
        return '🔍';
      default:
        return '💡';
    }
  };

  const getHintTypeIcon = (type) => {
    switch (type) {
      case 'syntax':
        return '📝';
      case 'logic':
        return '🧠';
      case 'function':
        return '⚙️';
      case 'reference':
        return '📚';
      case 'type':
        return '🔤';
      case 'async':
        return '⏰';
      case 'scope':
        return '🎯';
      case 'array':
        return '📊';
      case 'object':
        return '🏗️';
      default:
        return '💡';
    }
  };

  const shouldShowHintButton = () => {
    // Show hint button if user has been struggling
    return timeSpent > 300 || attempts > 3 || errorMessage; // 5 minutes or 3+ attempts or has error
  };

  if (!user) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-600 text-center">
          Please log in to get smart hints
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hint Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {shouldShowHintButton() && (
            <button
              onClick={getSmartHint}
              disabled={isLoadingHint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              {isLoadingHint ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Getting hint...</span>
                </>
              ) : (
                <>
                  <span>💡</span>
                  <span>Get Smart Hint</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={getProgressiveHints}
            disabled={isLoadingHint}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🎯</span>
            <span>Step-by-Step Hints</span>
          </button>

          {(currentHint || hintHistory.length > 0) && (
            <button
              onClick={clearHints}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Clear Hints
            </button>
          )}
        </div>

        {remainingRequests !== null && (
          <span className="text-sm text-gray-500">
            {remainingRequests} hints remaining
          </span>
        )}
      </div>

      {/* Struggle Indicator */}
      {(timeSpent > 600 || attempts > 5) && !currentHint && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">🤔</span>
            <div>
              <p className="text-yellow-800 font-medium">Need some help?</p>
              <p className="text-yellow-700 text-sm">
                It looks like you've been working on this for a while. Consider getting a hint to help you move forward!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Current Hint Display */}
      {currentHint && (
        <div className={`p-6 border-2 rounded-lg ${getDifficultyColor(currentHint.difficulty)}`}>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">
              {getDifficultyIcon(currentHint.difficulty)}
            </span>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getHintTypeIcon(currentHint.type)}</span>
                <h3 className="text-lg font-semibold text-gray-800">
                  {currentHint.title}
                </h3>
                <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 capitalize">
                  {currentHint.difficulty}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4">
                {currentHint.message}
              </p>

              {currentHint.example && (
                <div className="p-3 bg-white rounded-lg mb-4 border">
                  <h4 className="font-medium text-gray-800 mb-2">Example:</h4>
                  <code className="text-sm text-gray-700 font-mono">
                    {currentHint.example}
                  </code>
                </div>
              )}

              {currentHint.actionable && (
                <div className="flex items-center space-x-2 text-sm text-green-700">
                  <span>✅</span>
                  <span>This hint provides actionable steps you can take right now!</span>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Hint #{hintLevel}</span>
                <span>Source: {currentHint.source}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progressive Hints Modal */}
      {showProgressiveHints && progressiveHints.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  🎯 Step-by-Step Hints
                </h2>
                <button
                  onClick={() => setShowProgressiveHints(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {progressiveHints.map((hint, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {hint.level}
                      </div>
                      <h3 className="font-medium text-gray-800">
                        {hint.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 text-sm ml-11">
                      {hint.message}
                    </p>
                    {hint.actionable && (
                      <div className="ml-11 mt-2 flex items-center space-x-2 text-xs text-green-700">
                        <span>✅</span>
                        <span>Actionable step</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowProgressiveHints(false)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hint History */}
      {hintHistory.length > 1 && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-3">
            📜 Previous Hints ({hintHistory.length - 1})
          </h4>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {hintHistory.slice(0, -1).reverse().map((hint, index) => (
              <div key={hint.id} className="p-3 bg-white rounded border text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <span>{getHintTypeIcon(hint.type)}</span>
                  <span className="font-medium text-gray-700">{hint.title}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {hint.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 text-xs">
                  {hint.message.substring(0, 100)}
                  {hint.message.length > 100 && '...'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Tips */}
      {!currentHint && hintHistory.length === 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 Smart Hint Tips</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Hints become available when you've been working for a while</li>
            <li>• Each hint gets more specific to help you progress</li>
            <li>• Try solving it yourself first - learning happens through struggle!</li>
            <li>• Use hints when you're truly stuck, not just for shortcuts</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmartHintSystem; 