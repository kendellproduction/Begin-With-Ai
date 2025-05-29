import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { AdaptiveLessonService } from '../services/adaptiveLessonService';
import { isLearningPathActive, getCurrentLessonProgress, getLearningPath } from '../utils/learningPathUtils';

const LessonsOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(null);
  const [userLearningPath, setUserLearningPath] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const [adaptiveLessons, setAdaptiveLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Clear any previous state
  useEffect(() => {
    if (location.state?.resetFilters) {
      // State cleared, we're coming fresh from home
      navigate(location.pathname, { replace: true });
    }
    
    // Check if user has an active learning path
    if (isLearningPathActive()) {
      const pathData = getLearningPath();
      const progress = getCurrentLessonProgress();
      setUserLearningPath(pathData);
      setLearningProgress(progress);
    }

    // Load adaptive lessons
    loadAdaptiveLessons();
  }, [location.state, navigate, location.pathname]);

  const loadAdaptiveLessons = async () => {
    setIsLoading(true);
    try {
      // Get the adaptive learning path
      const adaptivePath = await AdaptiveLessonService.getAdaptedLearningPath(
        'prompt-engineering-mastery',
        { skillLevel: 'intermediate' }
      );
      
      if (adaptivePath && adaptivePath.modules) {
        // Flatten lessons from all modules
        const allLessons = adaptivePath.modules.flatMap(module => 
          module.lessons.map(lesson => ({
            ...lesson,
            moduleTitle: module.title,
            pathTitle: adaptivePath.title,
            difficulty: lesson.adaptedContent?.difficulty || 'Intermediate',
            duration: `${lesson.adaptedContent?.estimatedTime || 15} min`,
            company: 'BeginningWithAI',
            category: 'AI Learning',
            description: lesson.adaptedContent?.content?.introduction || lesson.coreConcept,
            tags: ['AI', 'Prompt Engineering', 'Interactive'],
            hasCodeSandbox: lesson.sandbox?.required || false
          }))
        );
        setAdaptiveLessons(allLessons);
      }
    } catch (error) {
      console.error('Failed to load adaptive lessons:', error);
      // Fallback to empty array if loading fails
      setAdaptiveLessons([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Learning paths with real adaptive lessons
  const learningPaths = [
    {
      id: 'prompt-engineering',
      title: 'Prompt Engineering Mastery',
      description: 'Master the art of communicating with AI - adaptive to your skill level',
      icon: '🎯',
      color: 'from-blue-500 to-purple-600',
      shadowColor: 'shadow-blue-500/20',
      hoverShadowColor: 'hover:shadow-blue-500/40',
      lessons: adaptiveLessons.slice(0, 4),
      duration: '6-8 hours',
      level: 'Adaptive',
      isAdaptive: true
    },
    {
      id: 'ai-foundations',
      title: 'AI Foundations',
      description: 'Understanding AI fundamentals and core concepts',
      icon: '🌟',
      color: 'from-green-500 to-emerald-600',
      shadowColor: 'shadow-green-500/20',
      hoverShadowColor: 'hover:shadow-green-500/40',
      lessons: adaptiveLessons.filter(lesson => lesson.moduleId === 'ai-foundations').slice(0, 3),
      duration: '3-4 hours',
      level: 'Beginner Friendly'
    },
    {
      id: 'creative-ai',
      title: 'Creative AI Applications',
      description: 'Use AI for images, video, and voice generation',
      icon: '🎨',
      color: 'from-purple-500 to-pink-600',
      shadowColor: 'shadow-purple-500/20',
      hoverShadowColor: 'hover:shadow-purple-500/40',
      lessons: adaptiveLessons.filter(lesson => lesson.moduleId === 'creative-applications').slice(0, 3),
      duration: '4-5 hours',
      level: 'Intermediate'
    }
  ];

  // Quick stats
  const stats = {
    totalLessons: adaptiveLessons.length,
    companies: 1, // BeginningWithAI
    categories: 4, // Number of modules
    avgDuration: Math.round(
      adaptiveLessons.reduce((acc, lesson) => {
        const minutes = parseInt(lesson.duration) || 15;
        return acc + minutes;
      }, 0) / (adaptiveLessons.length || 1)
    )
  };

  // Recently added lessons (latest 3)
  const recentLessons = adaptiveLessons.slice(-3);

  // Popular lessons (first 3 from the adaptive path)
  const popularLessons = adaptiveLessons.slice(0, 3);

  const handlePathSelect = (path) => {
    setSelectedPath(path);
    if (path.isAdaptive) {
      // Navigate to adaptive quiz for skill assessment
      navigate('/learning-path/adaptive-quiz');
    } else {
      // Navigate to specific module lessons
      navigate('/lessons/explore', { state: { moduleFilter: path.id } });
    }
  };

  const handleExploreAll = () => {
    // Navigate to swipe mode
    navigate('/lessons/explore');
  };

  const handleQuickStart = (lesson) => {
    navigate(`/lessons/${lesson.id}`, { 
      state: { 
        pathId: 'prompt-engineering-mastery',
        moduleId: lesson.moduleId 
      } 
    });
  };

  const handleCreateLearningPath = () => {
    // Navigate to adaptive learning path quiz
    navigate('/learning-path/adaptive-quiz');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <LoggedInNavbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300">Loading your AI learning experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <LoggedInNavbar />
      
      {/* Custom CSS for animated shadows */}
      <style jsx>{`
        @keyframes snake-glow {
          0% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(236, 72, 153, 0.2);
          }
          25% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(236, 72, 153, 0.3), 0 0 60px rgba(59, 130, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(34, 197, 94, 0.2);
          }
          75% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(34, 197, 94, 0.3), 0 0 60px rgba(99, 102, 241, 0.2);
          }
          100% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(236, 72, 153, 0.2);
          }
        }

        @keyframes explore-glow {
          0% {
            box-shadow: 0 0 25px rgba(99, 102, 241, 0.5), 0 0 50px rgba(139, 92, 246, 0.4), 0 0 75px rgba(236, 72, 153, 0.3);
          }
          33% {
            box-shadow: 0 0 25px rgba(139, 92, 246, 0.5), 0 0 50px rgba(236, 72, 153, 0.4), 0 0 75px rgba(6, 182, 212, 0.3);
          }
          66% {
            box-shadow: 0 0 25px rgba(236, 72, 153, 0.5), 0 0 50px rgba(6, 182, 212, 0.4), 0 0 75px rgba(99, 102, 241, 0.3);
          }
          100% {
            box-shadow: 0 0 25px rgba(99, 102, 241, 0.5), 0 0 50px rgba(139, 92, 246, 0.4), 0 0 75px rgba(236, 72, 153, 0.3);
          }
        }

        .snake-shadow {
          animation: snake-glow 3s ease-in-out infinite;
        }

        .explore-shadow {
          animation: explore-glow 4s ease-in-out infinite;
        }

        .card-glow {
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1), 0 5px 15px rgba(139, 92, 246, 0.1);
          transition: all 0.3s ease;
        }

        .card-glow:hover {
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.2), 0 10px 30px rgba(139, 92, 246, 0.2);
        }
      `}</style>
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Your AI Learning Journey
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Master artificial intelligence through our adaptive learning system that adjusts to your skill level
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="card-glow bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-blue-500/10">
              <div className="text-2xl font-bold text-blue-400">{stats.totalLessons}</div>
              <div className="text-sm text-gray-400">Lessons</div>
            </div>
            <div className="card-glow bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-purple-500/10">
              <div className="text-2xl font-bold text-purple-400">{stats.categories}</div>
              <div className="text-sm text-gray-400">Modules</div>
            </div>
            <div className="card-glow bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-cyan-500/10">
              <div className="text-2xl font-bold text-cyan-400">Adaptive</div>
              <div className="text-sm text-gray-400">Difficulty</div>
            </div>
            <div className="card-glow bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-green-500/10">
              <div className="text-2xl font-bold text-green-400">{stats.avgDuration}</div>
              <div className="text-sm text-gray-400">Avg Min</div>
            </div>
          </div>
        </div>

        {/* User's Learning Path Progress */}
        {userLearningPath && learningProgress && (
          <section className="mb-16">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-green-500/30 shadow-lg shadow-green-500/20">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="flex-1 mb-6 lg:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-2 flex items-center">
                    🎯 Your Learning Journey
                  </h2>
                  <h3 className="text-xl font-semibold mb-3">{userLearningPath.pathTitle}</h3>
                  
                  {/* Analytics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-green-500/20 rounded-2xl p-3 text-center border border-green-500/30">
                      <div className="text-2xl font-bold text-green-400">{learningProgress.completedLessons}</div>
                      <div className="text-xs text-gray-300">Completed</div>
                    </div>
                    <div className="bg-blue-500/20 rounded-2xl p-3 text-center border border-blue-500/30">
                      <div className="text-2xl font-bold text-blue-400">{learningProgress.totalLessons - learningProgress.completedLessons}</div>
                      <div className="text-xs text-gray-300">Remaining</div>
                    </div>
                    <div className="bg-purple-500/20 rounded-2xl p-3 text-center border border-purple-500/30">
                      <div className="text-2xl font-bold text-purple-400">{Math.floor(userLearningPath.estimatedDuration / 60)}h</div>
                      <div className="text-xs text-gray-300">Total Time</div>
                    </div>
                    <div className="bg-yellow-500/20 rounded-2xl p-3 text-center border border-yellow-500/30">
                      <div className="text-2xl font-bold text-yellow-400">{Math.round((learningProgress.completedLessons / learningProgress.totalLessons) * 100)}%</div>
                      <div className="text-xs text-gray-300">Progress</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-green-900/30 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(learningProgress.completedLessons / learningProgress.totalLessons) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="lg:ml-8">
                  <button
                    onClick={() => navigate('/lessons/continue')}
                    className="snake-shadow bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                  >
                    Continue Learning 🚀
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Start Your AI Adventure
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Explore All */}
            <div
              onClick={handleExploreAll}
              className="explore-shadow group relative bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 cursor-pointer hover:scale-105 shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3">Explore All Lessons</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Browse through our adaptive lessons with our discovery interface. Each lesson adjusts to your skill level!
              </p>
              <div className="flex items-center space-x-2 text-indigo-400 font-medium">
                <span>Start Exploring</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Create My Learning Path */}
            <div
              onClick={handleCreateLearningPath}
              className="snake-shadow group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 cursor-pointer hover:scale-105 shadow-purple-500/20 hover:shadow-purple-500/40"
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Get My Learning Path</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Take our adaptive assessment to get a personalized learning path that matches your experience and goals.
              </p>
              <div className="flex items-center space-x-2 text-purple-400 font-medium">
                <span>Take Assessment</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Paths */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Choose Your Learning Focus
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                onClick={() => handlePathSelect(path)}
                className={`group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer hover:scale-105 card-glow ${path.shadowColor} ${path.hoverShadowColor} flex flex-col h-full`}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{path.icon}</div>
                    {path.isAdaptive && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                        ADAPTIVE
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{path.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed flex-1">{path.description}</p>
                  
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-blue-400 font-medium">{path.level}</span>
                    <span className="text-sm text-gray-400">{path.duration}</span>
                  </div>
                  
                  <div className="space-y-2 mb-6 flex-1">
                    {path.lessons.slice(0, 3).map((lesson) => (
                      <div key={lesson.id} className="flex items-center space-x-3 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span>{lesson.title}</span>
                      </div>
                    ))}
                    {path.lessons.length > 3 && (
                      <div className="text-sm text-gray-400 ml-5">
                        +{path.lessons.length - 3} more lessons
                      </div>
                    )}
                  </div>
                  
                  <button className="snake-shadow w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-2xl transition-all duration-300 group-hover:bg-white/15 mt-auto">
                    {path.isAdaptive ? 'Start Assessment' : 'Explore Lessons'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Added & Popular */}
        <section className="grid md:grid-cols-2 gap-16">
          {/* Recently Added */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-2xl mr-3">✨</span>
              Latest Lessons
            </h3>
            <div className="space-y-4">
              {recentLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => handleQuickStart(lesson)}
                  className="card-glow group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer hover:scale-105 shadow-blue-500/10 hover:shadow-blue-500/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm font-medium">
                      {lesson.moduleTitle}
                    </span>
                    <span className="text-sm text-gray-400">{lesson.duration}</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {lesson.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-2xl mr-3">🔥</span>
              Featured Lessons
            </h3>
            <div className="space-y-4">
              {popularLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => handleQuickStart(lesson)}
                  className="card-glow group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer hover:scale-105 shadow-purple-500/10 hover:shadow-purple-500/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      lesson.difficulty === 'Beginner' ? 'bg-green-600/30 text-green-300' :
                      lesson.difficulty === 'Intermediate' ? 'bg-yellow-600/30 text-yellow-300' :
                      'bg-red-600/30 text-red-300'
                    }`}>
                      {lesson.difficulty}
                    </span>
                    <span className="text-sm text-gray-400">{lesson.duration}</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {lesson.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LessonsOverview; 