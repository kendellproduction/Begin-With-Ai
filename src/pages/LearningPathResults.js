import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import OptimizedStarField from '../components/OptimizedStarField';

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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white overflow-hidden">
      <LoggedInNavbar />
      
      {/* Optimized Star Field */}
      <OptimizedStarField starCount={220} opacity={0.8} speed={1} size={1.2} />
      
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

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="path-container max-w-4xl mx-auto text-center">
          <h1>Your Personalized AI Learning Path</h1>
          
          {/* Personalized Welcome */}
          <section>
            <h2>Welcome, {user?.displayName || 'Learner'}!</h2>
            <p>Based on your responses, we've created a path that matches your {results.skillLevel} skill level and focuses on {results.learningProfile.goals.join(', ')}.</p>
          </section>
          
          {/* Why This Path Fits You */}
          <section>
            <h2>Why This Path is Perfect for You</h2>
            <ul>
              {results.recommendations.map(rec => <li key={rec}>{rec}</li>)}
            </ul>
          </section>
          
          {/* Detailed Path Breakdown */}
          <section>
            <h2>Your Learning Journey</h2>
            {/* Existing lessons list */}
          </section>
          
          {/* Customized Tips */}
          <section>
            <h2>Personalized Learning Tips</h2>
            <ul>
              <li>Based on your {results.learningProfile.pace} pace, aim for {results.estimatedCompletion} daily.</li>
              {/* Add more based on profile */}
            </ul>
          </section>
          
          {/* Progress Setup */}
          <section>
            <h2>Get Ready to Track Your Progress</h2>
            <p>We'll track your XP, streaks, and badges as you learn.</p>
          </section>
          
          {/* Action Buttons */}
          <div>
            <button onClick={handleStartPath}>Start Learning</button>
            <button onClick={handleRetakeQuiz}>Retake Assessment</button>
            <button onClick={handleExploreLessons}>Explore All Lessons</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningPathResults; 