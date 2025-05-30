import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdaptiveLessonService } from '../services/adaptiveLessonService';

const LearningPathMap = ({ userLearningPath, learningProgress, className = "" }) => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLearningPath();
  }, [userLearningPath]);

  const loadLearningPath = async () => {
    try {
      setIsLoading(true);
      
      // Get skill level from quiz results
      const quizResults = localStorage.getItem('aiAssessmentResults');
      const skillLevel = quizResults ? JSON.parse(quizResults).skillLevel : 'intermediate';

      const adaptivePath = await AdaptiveLessonService.getAdaptedLearningPath(
        'prompt-engineering-mastery',
        { skillLevel }
      );
      
      if (adaptivePath && adaptivePath.modules) {
        // Flatten lessons from all modules
        const allLessons = adaptivePath.modules.flatMap((module, moduleIndex) => 
          module.lessons.map((lesson, lessonIndex) => ({
            ...lesson,
            moduleTitle: module.title,
            moduleId: module.id,
            globalIndex: moduleIndex * 100 + lessonIndex, // For positioning
            moduleIndex,
            lessonIndex
          }))
        );
        
        setLessons(allLessons);
        
        // Set current position based on progress
        const currentIndex = learningProgress?.nextLessonIndex || 0;
        setCurrentPosition(currentIndex);
      }
    } catch (error) {
      console.error('Error loading learning path:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLessonStatus = (index) => {
    const completedLessons = learningProgress?.completedLessons || 0;
    const currentIndex = learningProgress?.nextLessonIndex || 0;
    
    if (index < completedLessons) return 'completed';
    if (index === currentIndex) return 'current';
    if (index === currentIndex + 1) return 'next';
    if (index > currentIndex + 1) return 'locked';
    return 'available';
  };

  const getLessonIcon = (lesson, status) => {
    const icons = {
      completed: '✅',
      current: '🎯',
      next: '⭐',
      available: '📖',
      locked: '🔒'
    };
    return icons[status] || '📖';
  };

  const getLessonColors = (status) => {
    const colors = {
      completed: {
        bg: 'bg-green-500/20 border-green-400',
        text: 'text-green-300',
        glow: 'shadow-green-500/30'
      },
      current: {
        bg: 'bg-blue-500/20 border-blue-400 ring-2 ring-blue-400/50',
        text: 'text-blue-300',
        glow: 'shadow-blue-500/40 animate-pulse'
      },
      next: {
        bg: 'bg-yellow-500/20 border-yellow-400',
        text: 'text-yellow-300',
        glow: 'shadow-yellow-500/30'
      },
      available: {
        bg: 'bg-slate-600/20 border-slate-400',
        text: 'text-slate-300',
        glow: 'shadow-slate-500/20'
      },
      locked: {
        bg: 'bg-gray-700/20 border-gray-600',
        text: 'text-gray-500',
        glow: 'shadow-gray-600/10'
      }
    };
    return colors[status] || colors.available;
  };

  const handleLessonClick = (lesson, index) => {
    const status = getLessonStatus(index);
    
    if (status === 'locked') {
      return; // Can't access locked lessons
    }
    
    if (status === 'current' || status === 'next' || status === 'available') {
      navigate(`/lessons/${lesson.id}`, {
        state: {
          pathId: 'prompt-engineering-mastery',
          moduleId: lesson.moduleId,
          fromLearningPath: true
        }
      });
    }
  };

  // Create a path layout - Mario World style with connected nodes
  const createPathLayout = () => {
    const pathPoints = [];
    const rows = 4;
    const lessonsPerRow = Math.ceil(lessons.length / rows);
    
    lessons.forEach((lesson, index) => {
      const row = Math.floor(index / lessonsPerRow);
      const col = index % lessonsPerRow;
      
      // Zigzag pattern like Mario World
      const x = row % 2 === 0 ? col : lessonsPerRow - 1 - col;
      const y = row;
      
      pathPoints.push({
        lesson,
        index,
        x: (x / (lessonsPerRow - 1)) * 100, // Percentage position
        y: (y / (rows - 1)) * 100,
        status: getLessonStatus(index)
      });
    });
    
    return pathPoints;
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🗺️</div>
          <p className="text-slate-400">No learning path found. Complete the quiz to get started!</p>
        </div>
      </div>
    );
  }

  const pathPoints = createPathLayout();

  return (
    <div className={`${className}`}>
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">🗺️ Your Learning Journey</h2>
          <p className="text-slate-300">
            Progress: {learningProgress?.completedLessons || 0} of {lessons.length} lessons completed
          </p>
          <div className="w-full bg-slate-700 rounded-full h-3 mt-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${((learningProgress?.completedLessons || 0) / lessons.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Mario World Style Map */}
        <div className="relative h-96 bg-gradient-to-b from-blue-900/20 to-green-900/20 rounded-2xl overflow-hidden border border-white/10">
          {/* Background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 text-6xl">🏔️</div>
            <div className="absolute top-12 right-12 text-4xl">☁️</div>
            <div className="absolute bottom-8 left-16 text-3xl">🌳</div>
            <div className="absolute bottom-12 right-8 text-5xl">🏰</div>
            <div className="absolute top-1/2 left-1/3 text-2xl">⭐</div>
          </div>

          {/* Path connections */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {pathPoints.slice(0, -1).map((point, index) => {
              const nextPoint = pathPoints[index + 1];
              if (!nextPoint) return null;
              
              const x1 = (point.x / 100) * 100 + '%';
              const y1 = (point.y / 100) * 100 + '%';
              const x2 = (nextPoint.x / 100) * 100 + '%';
              const y2 = (nextPoint.y / 100) * 100 + '%';
              
              const isCompleted = point.status === 'completed';
              
              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isCompleted ? '#10b981' : '#475569'}
                  strokeWidth="3"
                  strokeDasharray={isCompleted ? '0' : '8,4'}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {/* Lesson nodes */}
          {pathPoints.map((point, index) => {
            const colors = getLessonColors(point.status);
            const icon = getLessonIcon(point.lesson, point.status);
            const isClickable = !['locked'].includes(point.status);
            
            return (
              <div
                key={point.lesson.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`
                }}
                onClick={() => handleLessonClick(point.lesson, index)}
              >
                {/* Lesson node */}
                <div
                  className={`
                    w-16 h-16 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 hover:scale-110 shadow-lg
                    ${colors.bg} ${colors.glow}
                    ${isClickable ? 'hover:shadow-xl' : ''}
                  `}
                >
                  <span className="text-2xl">{icon}</span>
                </div>

                {/* Lesson info tooltip */}
                <div className={`
                  absolute top-full mt-2 left-1/2 transform -translate-x-1/2
                  bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 min-w-48 
                  border border-white/20 shadow-xl z-20
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${isClickable ? 'group-hover:opacity-100' : ''}
                `}>
                  <h4 className={`font-semibold text-sm mb-1 ${colors.text}`}>
                    {point.lesson.title}
                  </h4>
                  <p className="text-xs text-slate-400 mb-2">
                    {point.lesson.moduleTitle}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Lesson {index + 1}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {point.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span className="text-green-300">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="text-blue-300">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="text-yellow-300">Next</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <span className="text-gray-500">Locked</span>
          </div>
        </div>

        {/* Next lesson CTA */}
        {pathPoints.find(p => p.status === 'current' || p.status === 'next') && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                const nextLesson = pathPoints.find(p => p.status === 'current' || p.status === 'next');
                if (nextLesson) {
                  handleLessonClick(nextLesson.lesson, nextLesson.index);
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Continue Learning Journey 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPathMap; 