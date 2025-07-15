import React, { useState } from 'react';
import { AdaptiveLessonService } from '../services/adaptiveLessonService';
import logger from '../utils/logger';

const AdaptiveDatabaseSeeder = () => {
  const [seedingStatus, setSeedingStatus] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingResults, setSeedingResults] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true);

  const handleSeedAdaptiveLessons = async () => {
    setIsSeeding(true);
    setSeedingStatus('Seeding adaptive lesson data...');
    setSeedingResults(null);

    try {
      const result = await AdaptiveLessonService.seedAdaptiveLessons();
      setSeedingResults(result);
      setSeedingStatus('✅ Adaptive lessons seeded successfully!');
    } catch (error) {
      console.error('Seeding error:', error);
      setSeedingStatus(`❌ Error: ${error.message}`);
      setSeedingResults({ success: false, error: error.message });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleTestAdaptiveLesson = async () => {
    setIsSeeding(true);
    setSeedingStatus('Testing adaptive lesson retrieval...');
    
    try {
      const lesson = await AdaptiveLessonService.getAdaptedLesson(
        'prompt-engineering-mastery',
        'ai-foundations', 
        'welcome-ai-revolution',
        'beginner'
      );
      
      logger.log('Test lesson retrieved:', lesson);
      setSeedingStatus('✅ Adaptive lesson test successful! Check console for details.');
      setSeedingResults({ success: true, lesson: lesson.title });
    } catch (error) {
      console.error('Test error:', error);
      setSeedingStatus(`❌ Test failed: ${error.message}`);
      setSeedingResults({ success: false, error: error.message });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleTestLearningPath = async () => {
    setIsSeeding(true);
    setSeedingStatus('Testing adaptive learning path...');
    
    try {
      const path = await AdaptiveLessonService.getAdaptedLearningPath(
        'prompt-engineering-mastery',
        { skillLevel: 'intermediate' }
      );
      
      logger.log('Test learning path retrieved:', path);
      setSeedingStatus(`✅ Learning path test successful! Found ${path.totalLessons} lessons across ${path.modules.length} modules.`);
      setSeedingResults({ 
        success: true, 
        pathTitle: path.title,
        totalLessons: path.totalLessons,
        modules: path.modules.length 
      });
    } catch (error) {
      console.error('Path test error:', error);
      setSeedingStatus(`❌ Path test failed: ${error.message}`);
      setSeedingResults({ success: false, error: error.message });
    } finally {
      setIsSeeding(false);
    }
  };

  // Only show in development or if explicitly enabled
  if (process.env.NODE_ENV === 'production' && !localStorage.getItem('enableDevTools')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {isMinimized ? (
        // Minimized state - just a small button
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
          title="Open Database Seeder"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4V7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 3v18l-4-4V7a4 4 0 00-4-4z" />
          </svg>
        </button>
      ) : (
        // Expanded state - full seeder panel
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              🎯 Database Seeder
            </h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded"
              title="Minimize"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            <button
              onClick={handleSeedAdaptiveLessons}
              disabled={isSeeding}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-sm font-medium transition-all duration-300"
            >
              {isSeeding ? 'Seeding...' : 'Seed Adaptive Lessons'}
            </button>
            
            <button
              onClick={handleTestAdaptiveLesson}
              disabled={isSeeding}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium transition-all duration-300"
            >
              {isSeeding ? 'Testing...' : 'Test Single Lesson'}
            </button>
            
            <button
              onClick={handleTestLearningPath}
              disabled={isSeeding}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium transition-all duration-300"
            >
              {isSeeding ? 'Testing...' : 'Test Learning Path'}
            </button>
          </div>

          {seedingStatus && (
            <div className={`p-3 rounded-lg text-sm mb-3 ${
              seedingStatus.includes('✅') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : seedingStatus.includes('❌')
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {seedingStatus}
            </div>
          )}

          {seedingResults && seedingResults.success && (
            <div className="bg-gray-50 p-3 rounded-lg text-xs">
              <div className="font-medium text-gray-900 mb-1">Results:</div>
              <div className="text-gray-600">
                {seedingResults.lesson && <div>Lesson: {seedingResults.lesson}</div>}
                {seedingResults.pathTitle && <div>Path: {seedingResults.pathTitle}</div>}
                {seedingResults.totalLessons && <div>Lessons: {seedingResults.totalLessons}</div>}
                {seedingResults.modules && <div>Modules: {seedingResults.modules}</div>}
                {seedingResults.message && <div>{seedingResults.message}</div>}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-2 text-center">
            Development tool - One-time setup
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveDatabaseSeeder; 