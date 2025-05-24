import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import lessonsData from '../utils/lessonsData';
import { isLearningPathActive, getCurrentLessonProgress, getLearningPath } from '../utils/learningPathUtils';

const LessonsOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(null);
  const [userLearningPath, setUserLearningPath] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);

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
  }, [location.state, navigate, location.pathname]);

  // Learning paths with curated lessons
  const learningPaths = [
    {
      id: 'beginner',
      title: 'AI Fundamentals',
      description: 'Perfect for newcomers to AI and machine learning',
      icon: '🌟',
      color: 'from-green-500 to-emerald-600',
      shadowColor: 'shadow-green-500/20',
      hoverShadowColor: 'hover:shadow-green-500/40',
      lessons: lessonsData.filter(lesson => 
        lesson.difficulty === 'Beginner' || 
        lesson.category === 'Fundamentals' ||
        lesson.title.includes('Introduction')
      ).slice(0, 4),
      duration: '3-4 hours',
      level: 'Beginner Friendly'
    },
    {
      id: 'companies',
      title: 'AI Companies',
      description: 'Learn about major AI platforms and their technologies',
      icon: '🏢',
      color: 'from-blue-500 to-cyan-600',
      shadowColor: 'shadow-blue-500/20',
      hoverShadowColor: 'hover:shadow-blue-500/40',
      lessons: lessonsData.filter(lesson => 
        ['OpenAI', 'Google', 'Meta', 'Anthropic'].includes(lesson.company)
      ).slice(0, 4),
      duration: '4-5 hours',
      level: 'Intermediate'
    },
    {
      id: 'advanced',
      title: 'Deep Learning',
      description: 'Advanced topics for experienced practitioners',
      icon: '🧠',
      color: 'from-purple-500 to-indigo-600',
      shadowColor: 'shadow-purple-500/20',
      hoverShadowColor: 'hover:shadow-purple-500/40',
      lessons: lessonsData.filter(lesson => 
        lesson.difficulty === 'Advanced' ||
        lesson.category === 'Deep Learning' ||
        lesson.tags.includes('Neural Networks')
      ).slice(0, 4),
      duration: '6+ hours',
      level: 'Advanced'
    }
  ];

  // Quick stats
  const stats = {
    totalLessons: lessonsData.length,
    companies: [...new Set(lessonsData.map(lesson => lesson.company))].length,
    categories: [...new Set(lessonsData.map(lesson => lesson.category))].length,
    avgDuration: Math.round(
      lessonsData.reduce((acc, lesson) => {
        const minutes = parseInt(lesson.duration);
        return acc + minutes;
      }, 0) / lessonsData.length
    )
  };

  // Recently added lessons
  const recentLessons = lessonsData.slice(-3);

  // Popular lessons (mock data - in real app this would come from analytics)
  const popularLessons = lessonsData.filter(lesson => 
    ['Introduction to AI', 'GPT-4 Mastery', 'AI Ethics'].includes(lesson.title)
  );

  const handlePathSelect = (path) => {
    setSelectedPath(path);
    // Navigate to guided experience with selected path
    navigate('/lessons/guided', { state: { learningPath: path } });
  };

  const handleExploreAll = () => {
    // Navigate to swipe mode
    navigate('/lessons/explore');
  };

  const handleQuickStart = (lesson) => {
    navigate(`/lessons/${lesson.id}`);
  };

  const handleCreateLearningPath = () => {
    // Navigate to learning path quiz
    navigate('/learning-path/quiz');
  };

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
            Master artificial intelligence through structured learning paths or discover lessons at your own pace
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="card-glow bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-blue-500/10">
              <div className="text-2xl font-bold text-blue-400">{stats.totalLessons}</div>
              <div className="text-sm text-gray-400">Lessons</div>
            </div>
            <div className="card-glow bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-purple-500/10">
              <div className="text-2xl font-bold text-purple-400">{stats.companies}</div>
              <div className="text-sm text-gray-400">Companies</div>
            </div>
            <div className="card-glow bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-cyan-500/10">
              <div className="text-2xl font-bold text-cyan-400">{stats.categories}</div>
              <div className="text-sm text-gray-400">Categories</div>
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
                    <div className="bg-cyan-500/20 rounded-2xl p-3 text-center border border-cyan-500/30">
                      <div className="text-2xl font-bold text-cyan-400">{learningProgress.progressPercentage}%</div>
                      <div className="text-xs text-gray-300">Progress</div>
                    </div>
                  </div>
                </div>
                
                {/* Progress Visualization */}
                <div className="lg:ml-8 lg:min-w-[300px]">
                  <div className="text-center mb-4">
                    <div className="relative w-32 h-32 mx-auto">
                      {/* Background Circle */}
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="rgba(75, 85, 99, 0.3)"
                          strokeWidth="10"
                          fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="url(#progressGradient)"
                          strokeWidth="10"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 50 * (learningProgress.progressPercentage / 100)} ${2 * Math.PI * 50}`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06d6a0" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Center Text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{learningProgress.progressPercentage}%</div>
                          <div className="text-xs text-gray-400">Complete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {learningProgress.nextLesson && (
                <div className="border-t border-green-500/30 pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <h4 className="text-lg font-semibold mb-3 text-green-400">🚀 Up Next in Your Journey:</h4>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                            <span className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm font-medium">
                              {learningProgress.nextLesson.company}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              learningProgress.nextLesson.difficulty === 'Beginner' ? 'bg-green-600/30 text-green-300' :
                              learningProgress.nextLesson.difficulty === 'Intermediate' ? 'bg-yellow-600/30 text-yellow-300' :
                              'bg-red-600/30 text-red-300'
                            }`}>
                              {learningProgress.nextLesson.difficulty}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">{learningProgress.nextLesson.duration}</span>
                        </div>
                        <h5 className="font-semibold text-white mb-2">{learningProgress.nextLesson.title}</h5>
                        <p className="text-gray-300 text-sm leading-relaxed">{learningProgress.nextLesson.description}</p>
                      </div>
                    </div>
                    <div className="md:ml-6">
                      <button
                        onClick={() => navigate(`/lessons/${learningProgress.nextLesson.id}`)}
                        className="snake-shadow w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg"
                      >
                        Continue Learning 🚀
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {learningProgress.progressPercentage === 100 && (
                <div className="border-t border-green-500/30 pt-6 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h4 className="text-2xl font-bold text-green-400 mb-2">Congratulations!</h4>
                  <p className="text-gray-300 mb-6">You've completed your learning path! Ready for a new challenge?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <button
                      onClick={handleCreateLearningPath}
                      className="snake-shadow bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300"
                    >
                      Create New Path
                    </button>
                    <button
                      onClick={handleExploreAll}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
                    >
                      Explore All Lessons
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Quick Actions - Main Ways to Start */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Choose Your Own Adventure
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
                Browse through all lessons with our TikTok-style discovery interface. Swipe to explore!
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
              className="snake-shadow group relative bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm rounded-3xl p-8 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer hover:scale-105 shadow-emerald-500/20 hover:shadow-emerald-500/40"
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Create My Learning Path</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Take our smart quiz to get a personalized learning journey tailored to your interests and goals.
              </p>
              <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                <span>Get My Path</span>
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
            Or Follow a Structured Path
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
                  <div className="text-4xl mb-4">{path.icon}</div>
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
                    Start Learning Path
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
              Recently Added
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
                      {lesson.company}
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
              Most Popular
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