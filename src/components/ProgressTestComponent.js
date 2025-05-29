import React, { useState, useEffect } from 'react';
import { useProgressTracking } from '../hooks/useProgressTracking';
import { useGamification } from '../contexts/GamificationContext';

const ProgressTestComponent = () => {
  const {
    completeLesson,
    awardXP,
    userStats,
    loading,
    error,
    isAuthenticated
  } = useProgressTracking();
  
  const { showNotification } = useGamification();
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (message, type = 'info') => {
    const result = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      addTestResult(`Completing lesson: ${lessonId}`, 'info');
      const result = await completeLesson(lessonId, {
        score: 95,
        xpAward: 15,
        notes: 'Test completion'
      });
      
      if (result.success) {
        addTestResult(`✅ Lesson completed successfully!`, 'success');
        if (result.firestoreUpdate) {
          const { xp, streak, badges } = result.firestoreUpdate;
          addTestResult(`+${xp.xpAwarded} XP awarded (Total: ${xp.newXP})`, 'xp');
          if (xp.leveledUp) {
            addTestResult(`🎉 Level up! Now level ${xp.newLevel}`, 'success');
          }
          if (streak?.streakIncreased) {
            addTestResult(`🔥 Streak: ${streak.currentStreak} days`, 'streak');
          }
          if (badges?.length > 0) {
            addTestResult(`🏆 ${badges.length} new badge(s) earned!`, 'badge');
          }
        }
      }
    } catch (err) {
      addTestResult(`❌ Error: ${err.message}`, 'error');
    }
  };

  const handleAwardXP = async (amount) => {
    try {
      addTestResult(`Awarding ${amount} XP...`, 'info');
      const result = await awardXP(amount, 'test_action');
      
      if (result.success) {
        addTestResult(`✅ ${amount} XP awarded!`, 'success');
      }
    } catch (err) {
      addTestResult(`❌ Error awarding XP: ${err.message}`, 'error');
    }
  };

  const handleShowNotification = (message, type) => {
    showNotification(message, type);
    addTestResult(`Notification shown: ${message}`, 'info');
  };

  const getResultStyle = (type) => {
    const baseStyle = "text-xs p-2 rounded mb-1";
    switch (type) {
      case 'success': return `${baseStyle} bg-green-600/20 text-green-300 border border-green-500/30`;
      case 'error': return `${baseStyle} bg-red-600/20 text-red-300 border border-red-500/30`;
      case 'xp': return `${baseStyle} bg-purple-600/20 text-purple-300 border border-purple-500/30`;
      case 'streak': return `${baseStyle} bg-orange-600/20 text-orange-300 border border-orange-500/30`;
      case 'badge': return `${baseStyle} bg-yellow-600/20 text-yellow-300 border border-yellow-500/30`;
      default: return `${baseStyle} bg-gray-600/20 text-gray-300 border border-gray-500/30`;
    }
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-sm z-40">
      <h3 className="text-white font-bold mb-3">🧪 Progress Testing</h3>
      
      {/* User Stats Display */}
      <div className="bg-gray-700 rounded p-3 mb-3 text-xs">
        <div className="text-white font-semibold mb-2">Current Stats:</div>
        <div className="text-gray-300 space-y-1">
          <div>XP: {userStats.xp || 0}</div>
          <div>Level: {userStats.level || 1}</div>
          <div>Completed: {userStats.completedLessons || 0}</div>
          <div>Streak: {userStats.currentStreak || 0} days</div>
          <div>Badges: {userStats.badgeCount || 0}</div>
          <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
        </div>
      </div>

      {/* Test Actions */}
      <div className="space-y-2 mb-3">
        <button
          onClick={() => handleCompleteLesson('what-is-ai')}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          Complete Test Lesson
        </button>
        
        <button
          onClick={() => handleAwardXP(25)}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          Award 25 XP
        </button>
        
        <button
          onClick={() => handleShowNotification('Test notification! 🎉', 'success')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          Test Notification
        </button>
      </div>

      {/* Test Results */}
      <div className="max-h-40 overflow-y-auto">
        <div className="text-white font-semibold text-xs mb-2">Recent Results:</div>
        {testResults.map(result => (
          <div key={result.id} className={getResultStyle(result.type)}>
            <div className="font-mono">{result.timestamp}</div>
            <div>{result.message}</div>
          </div>
        ))}
        {testResults.length === 0 && (
          <div className="text-gray-400 text-xs">No test results yet...</div>
        )}
      </div>

      {error && (
        <div className="text-red-300 text-xs mt-2 p-2 bg-red-600/20 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default ProgressTestComponent; 