import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';

const LearningPathResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [personalizedPath, setPersonalizedPath] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Get path from navigation state or localStorage
    const path = location.state?.personalizedPath || JSON.parse(localStorage.getItem('userLearningPath') || 'null');
    
    if (!path) {
      navigate('/learning-path/adaptive-quiz');
      return;
    }
    
    setPersonalizedPath(path);
    
    // Trigger animation after component mounts
    setTimeout(() => setShowAnimation(true), 500);
  }, [location.state, navigate]);

  const handleStartPath = () => {
    if (personalizedPath && personalizedPath.lessons.length > 0) {
      // Mark path as active and navigate to first lesson
      localStorage.setItem('learningPathActive', 'true');
      navigate(`/lessons/${personalizedPath.lessons[0].id}`);
    }
  };

  const handleRetakePath = () => {
    navigate('/learning-path/adaptive-quiz');
  };

  const handleExploreLessons = () => {
    navigate('/lessons');
  };

  if (!personalizedPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Creating your personalized path...</p>
        </div>
      </div>
    );
  }

  const { lessons, userProfile, estimatedDuration, pathTitle } = personalizedPath;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <LoggedInNavbar />
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes path-reveal {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes lesson-cascade {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes start-button-glow {
          0% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.6), 0 0 60px rgba(139, 92, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.7), 0 0 80px rgba(236, 72, 153, 0.5);
          }
          100% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.6), 0 0 60px rgba(139, 92, 246, 0.4);
          }
        }

        .path-container {
          animation: path-reveal 0.8s ease-out;
        }

        .lesson-item {
          animation: lesson-cascade 0.6s ease-out;
        }

        .start-button {
          animation: start-button-glow 3s ease-in-out infinite;
        }

        ${showAnimation ? lessons.map((_, index) => `
          .lesson-item:nth-child(${index + 1}) {
            animation-delay: ${index * 0.1}s;
          }
        `).join('') : ''}
      `}</style>

      <main className="container mx-auto px-4 py-8">
        <div className="path-container max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🎯</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Your Path is Ready!
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We've created a personalized learning journey just for you. Here's your roadmap to AI mastery!
            </p>
          </div>

          {/* Path Overview */}
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-indigo-500/30 mb-12 shadow-lg shadow-indigo-500/20">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-2xl font-bold text-indigo-400 mb-2">{pathTitle}</h3>
                <p className="text-gray-300">Your Learning Path</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-400 mb-2">{lessons.length} Lessons</h3>
                <p className="text-gray-300">Carefully Selected</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">{Math.floor(estimatedDuration / 60)}h {estimatedDuration % 60}m</h3>
                <p className="text-gray-300">Estimated Time</p>
              </div>
            </div>
          </div>

          {/* Learning Path Visualization */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Your Learning Journey</h2>
            <div className="space-y-6">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="lesson-item relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300"
                >
                  {/* Step Number */}
                  <div className="absolute -left-4 top-6 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Connection Line */}
                  {index < lessons.length - 1 && (
                    <div className="absolute -left-2 top-14 w-4 h-12 border-l-2 border-dashed border-indigo-400/50"></div>
                  )}
                  
                  <div className="ml-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <span className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm font-medium">
                          {lesson.company}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          lesson.difficulty === 'Beginner' ? 'bg-green-600/30 text-green-300' :
                          lesson.difficulty === 'Intermediate' ? 'bg-yellow-600/30 text-yellow-300' :
                          'bg-red-600/30 text-red-300'
                        }`}>
                          {lesson.difficulty}
                        </span>
                        <span className="text-sm text-gray-400">{lesson.duration}</span>
                      </div>
                      
                      {index === 0 && (
                        <span className="px-3 py-1 bg-green-600/30 text-green-300 rounded-full text-sm font-medium">
                          Start Here! 🚀
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{lesson.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {lesson.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Profile Summary */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-12 shadow-lg shadow-purple-500/10">
            <h3 className="text-2xl font-bold mb-6">Path Customized For You</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-3">Your Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {userProfile.interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm">
                      {interest.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-3">Your Goals</h4>
                <div className="flex flex-wrap gap-2">
                  {userProfile.goals.map((goal) => (
                    <span key={goal} className="px-3 py-1 bg-cyan-600/30 text-cyan-300 rounded-full text-sm">
                      {goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <button
              onClick={handleStartPath}
              className="start-button w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 text-lg mb-4"
            >
              🚀 Start My Learning Path
            </button>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={handleRetakePath}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20"
              >
                🔄 Retake Quiz
              </button>
              <button
                onClick={handleExploreLessons}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20"
              >
                🔍 Explore All Lessons
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-12 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm rounded-3xl p-6 border border-emerald-500/30">
            <h3 className="text-xl font-bold mb-4 text-emerald-400">💡 Tips for Success</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Complete lessons in order for the best learning experience</li>
              <li>• Take notes and practice the concepts as you go</li>
              <li>• Don't rush - understanding is more important than speed</li>
              <li>• You can always come back to review previous lessons</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningPathResults; 