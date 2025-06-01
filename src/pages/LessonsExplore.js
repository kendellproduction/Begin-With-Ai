import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoggedInNavbar from '../components/LoggedInNavbar';
import LessonCard from '../components/LessonCard';
import { AdaptiveLessonService } from '../services/adaptiveLessonService';

const LessonsExplore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: '',
    module: '',
    category: '',
    hasInteractive: ''
  });
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('lessons_explore_tutorial_seen');
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'

  // Adaptive lessons state
  const [adaptiveLessons, setAdaptiveLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Touch handling refs
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  // Load adaptive lessons on component mount
  useEffect(() => {
    loadAdaptiveLessons();
  }, []);

  const loadAdaptiveLessons = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Get user's skill level from assessment or default to intermediate
      const assessmentResults = localStorage.getItem('aiAssessmentResults');
      const skillLevel = assessmentResults ? JSON.parse(assessmentResults).skillLevel : 'intermediate';

      const adaptivePath = await AdaptiveLessonService.getAdaptedLearningPath(
        'prompt-engineering-mastery',
        { skillLevel }
      );
      
      if (adaptivePath && adaptivePath.modules) {
        // Flatten lessons from all modules for explore mode
        const allLessons = adaptivePath.modules.flatMap(module => 
          module.lessons.map(lesson => ({
            ...lesson,
            moduleTitle: module.title,
            moduleId: module.id,
            pathTitle: adaptivePath.title,
            difficulty: lesson.adaptedContent?.difficulty || skillLevel,
            duration: lesson.adaptedContent?.estimatedTime || 15,
            description: lesson.adaptedContent?.content?.introduction || lesson.coreConcept,
            company: 'BeginningWithAI',
            category: 'AI Learning',
            tags: ['AI', 'Prompt Engineering', 'Interactive'],
            hasCodeSandbox: lesson.sandbox?.required || false,
            // Transform for compatibility with existing lesson card
            models: ['xAI Grok', 'GPT-4', 'Claude'],
            useCases: ['Learning', 'Skill Building', 'AI Mastery']
          }))
        );
        setAdaptiveLessons(allLessons);
      } else {
        setError('No lessons found. Please seed the database first.');
      }
    } catch (err) {
      console.error('Failed to load adaptive lessons:', err);
      setError('Failed to load lessons. Please try again or seed the database.');
      setAdaptiveLessons([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Detect mobile vs desktop
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 && 
        ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only prevent scroll on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const preventScroll = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('touchstart', preventScroll);
    };
  }, [isMobile]);

  // Get unique filter options from adaptive lessons
  const getUniqueValues = (field) => {
    const values = new Set();
    adaptiveLessons.forEach(lesson => {
      if (Array.isArray(lesson[field])) {
        lesson[field].forEach(item => values.add(item));
      } else if (lesson[field]) {
        values.add(lesson[field]);
      }
    });
    return Array.from(values).sort();
  };

  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const modules = getUniqueValues('moduleTitle');
  const categories = getUniqueValues('category');

  // Advanced search and filtering
  const getFilteredLessons = () => {
    return adaptiveLessons.filter(lesson => {
      const matchesSearch = searchQuery === '' || 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lesson.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.coreConcept.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty = !selectedFilters.difficulty || lesson.difficulty === selectedFilters.difficulty;
      const matchesModule = !selectedFilters.module || lesson.moduleTitle === selectedFilters.module;
      const matchesCategory = !selectedFilters.category || lesson.category === selectedFilters.category;
      const matchesInteractive = !selectedFilters.hasInteractive || 
        (selectedFilters.hasInteractive === 'yes' && lesson.hasCodeSandbox) ||
        (selectedFilters.hasInteractive === 'no' && !lesson.hasCodeSandbox);

      return matchesSearch && matchesDifficulty && matchesModule && matchesCategory && matchesInteractive;
    });
  };

  const filteredLessons = getFilteredLessons();
  const currentLesson = filteredLessons[currentIndex];

  // Reset currentIndex when filters change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setCurrentIndex(0);
      setIsTransitioning(false);
      setShowEndMessage(false);
    }
  }, [searchQuery, selectedFilters, isMobile]);

  // Ensure currentIndex is within bounds (mobile only)
  useEffect(() => {
    if (isMobile && filteredLessons.length > 0 && currentIndex >= filteredLessons.length) {
      setCurrentIndex(0);
    }
  }, [filteredLessons.length, currentIndex, isMobile]);

  // Only show tutorial on mobile
  useEffect(() => {
    if (!isMobile) {
      setShowTutorial(false);
    }
  }, [isMobile]);

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      const suggestions = new Set();
      adaptiveLessons.forEach(lesson => {
        if (lesson.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(lesson.title);
        }
        lesson.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchQuery.toLowerCase())) {
            suggestions.add(tag);
          }
        });
        if (lesson.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(lesson.moduleTitle);
        }
      });
      setSearchSuggestions(Array.from(suggestions).slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, adaptiveLessons]);

  // Enhanced haptic feedback function (mobile only)
  const triggerHapticFeedback = (type = 'light') => {
    if (!isMobile) return;
    
    try {
      if (window.navigator && window.navigator.vibrate) {
        const patterns = {
          light: [30],
          medium: [50],
          heavy: [100],
          success: [50, 50, 50],
          bounce: [100, 50, 100]
        };
        window.navigator.vibrate(patterns[type] || patterns.light);
      }
    } catch (error) {
      // Haptic feedback not supported
    }
  };

  // Mobile-only functions
  const showEndOfLessonsMessage = (direction = 'up') => {
    if (!isMobile) return;
    
    setShowEndMessage(true);
    triggerHapticFeedback('bounce');
    
    setTimeout(() => {
      setShowEndMessage(false);
    }, 2000);
  };

  // Mobile-only touch handlers
  const handleTouchStart = (e) => {
    if (!isMobile || showSearch || showFilters || isTransitioning || showEndMessage) return;
    
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
    
    triggerHapticFeedback('light');
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !touchStartY.current || showSearch || showFilters || isTransitioning || showEndMessage) return;
    
    touchEndY.current = e.touches[0].clientY;
    isDragging.current = true;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !touchStartY.current || !isDragging.current || showSearch || showFilters || isTransitioning || showEndMessage) {
      touchStartY.current = null;
      touchEndY.current = null;
      isDragging.current = false;
      return;
    }

    const deltaY = touchStartY.current - touchEndY.current;
    const threshold = 80;

    if (Math.abs(deltaY) > threshold) {
      setIsTransitioning(true);
      
      if (deltaY > 0) {
        // Swipe up - next lesson
        if (currentIndex < filteredLessons.length - 1) {
          triggerHapticFeedback('medium');
          setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
            setIsTransitioning(false);
          }, 150);
        } else {
          showEndOfLessonsMessage('up');
          setIsTransitioning(false);
        }
      } else {
        // Swipe down - previous lesson
        if (currentIndex > 0) {
          triggerHapticFeedback('medium');
          setTimeout(() => {
            setCurrentIndex(prev => prev - 1);
            setIsTransitioning(false);
          }, 150);
        } else {
          showEndOfLessonsMessage('down');
          setIsTransitioning(false);
        }
      }
    }

    touchStartY.current = null;
    touchEndY.current = null;
    isDragging.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('lessons_explore_tutorial_seen', 'true');
  };

  const handleBack = () => {
    navigate('/lessons');
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    if (selectedFilters.difficulty) activeFilters.push(selectedFilters.difficulty);
    if (selectedFilters.module) activeFilters.push(selectedFilters.module);
    if (selectedFilters.category) activeFilters.push(selectedFilters.category);
    if (selectedFilters.hasInteractive) activeFilters.push(selectedFilters.hasInteractive === 'yes' ? 'Interactive' : 'Text-only');
    if (searchQuery) activeFilters.push(`"${searchQuery}"`);
    
    return activeFilters.length > 0 ? activeFilters.join(', ') : 'All lessons';
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
        <LoggedInNavbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300">Loading your AI lessons...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment if the database needs to be seeded</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
        <LoggedInNavbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-4">Unable to Load Lessons</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setError('');
                  loadAdaptiveLessons();
                }}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <p className="text-sm text-gray-400">
                💡 If this persists, try using the "Adaptive Database Seeder" tool in the bottom-right corner to populate the database with lessons.
              </p>
              <button
                onClick={() => navigate('/lessons')}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-colors font-medium"
              >
                Back to Lessons Overview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no lessons after loading
  if (!isLoading && adaptiveLessons.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
        <LoggedInNavbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-2xl font-bold mb-4">No Lessons Available</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">
              It looks like the lesson database hasn't been seeded yet. Please use the database seeder to add lessons.
            </p>
            <button
              onClick={() => navigate('/lessons')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Back to Lessons Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render desktop V-shape layout
  if (!isMobile) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-hidden">
        <LoggedInNavbar />
        
        {/* Star Animation Container for Lessons */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(140)].map((_, i) => {
            const screenH = window.innerHeight;
            const screenW = window.innerWidth;
            const initialY = Math.random() * screenH * 1.5 - screenH * 0.25;
            const targetY = Math.random() * screenH * 1.5 - screenH * 0.25;
            const initialX = Math.random() * screenW * 1.5 - screenW * 0.25;
            const targetX = Math.random() * screenW * 1.5 - screenW * 0.25;
            const starDuration = 30 + Math.random() * 25;
            const starSize = Math.random() * 3 + 1;

            return (
              <motion.div
                key={`lessons-star-${i}`}
                className="absolute rounded-full bg-white/50"
                style={{
                  width: starSize,
                  height: starSize,
                }}
                initial={{
                  x: initialX,
                  y: initialY,
                  opacity: 0,
                }}
                animate={{
                  x: targetX,
                  y: targetY,
                  opacity: [0, 0.6, 0.6, 0],
                }}
                transition={{
                  duration: starDuration,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 2,
                  ease: "linear",
                  opacity: {
                    duration: starDuration,
                    ease: "linear",
                    times: [0, 0.1, 0.85, 1],
                    repeat: Infinity,
                    repeatDelay: Math.random() * 5 + 2,
                  }
                }}
              />
            );
          })}
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Desktop Header */}
          <div className="mb-12">
            <button
              onClick={handleBack}
              className="
                mb-6 px-6 py-3 
                bg-white/5 backdrop-blur-sm border border-white/10
                text-white rounded-2xl hover:bg-white/10 
                transition-all duration-300 transform hover:scale-105
                hover:shadow-lg hover:shadow-white/10
                font-medium
              "
            >
              ← Back to Lessons
            </button>
            
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4 leading-tight py-2">
                Explore All Lessons
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Discover adaptive AI lessons tailored to your skill level and interests
              </p>
            </div>
            
            {/* Enhanced Search and Filters */}
            <div className="
              max-w-6xl mx-auto
              bg-white/5 backdrop-blur-xl border border-white/10
              rounded-3xl p-8 shadow-2xl shadow-black/20
            ">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search lessons, concepts, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="
                      w-full pl-12 pr-4 py-4
                      bg-white/5 backdrop-blur-sm border border-white/20
                      text-white placeholder-slate-400
                      rounded-2xl text-lg
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                      focus:border-indigo-400/50
                      transition-all duration-300
                    "
                  />
                </div>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <select
                  value={selectedFilters.difficulty}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="
                    bg-white/5 backdrop-blur-sm border border-white/20
                    text-white px-4 py-3 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    focus:border-indigo-400/50
                    transition-all duration-300 cursor-pointer
                  "
                >
                  <option value="" className="bg-slate-800 text-white">All Levels</option>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff} className="bg-slate-800 text-white capitalize">
                      {diff}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedFilters.module}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, module: e.target.value }))}
                  className="
                    bg-white/5 backdrop-blur-sm border border-white/20
                    text-white px-4 py-3 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    focus:border-indigo-400/50
                    transition-all duration-300 cursor-pointer
                  "
                >
                  <option value="" className="bg-slate-800 text-white">All Modules</option>
                  {modules.map(module => (
                    <option key={module} value={module} className="bg-slate-800 text-white">
                      {module}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedFilters.category}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="
                    bg-white/5 backdrop-blur-sm border border-white/20
                    text-white px-4 py-3 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    focus:border-indigo-400/50
                    transition-all duration-300 cursor-pointer
                  "
                >
                  <option value="" className="bg-slate-800 text-white">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-slate-800 text-white">
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedFilters.hasInteractive}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, hasInteractive: e.target.value }))}
                  className="
                    bg-white/5 backdrop-blur-sm border border-white/20
                    text-white px-4 py-3 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    focus:border-indigo-400/50
                    transition-all duration-300 cursor-pointer
                  "
                >
                  <option value="" className="bg-slate-800 text-white">All Types</option>
                  <option value="yes" className="bg-slate-800 text-white">Interactive</option>
                  <option value="no" className="bg-slate-800 text-white">Theory</option>
                </select>
              </div>

              {/* Results Summary & Clear Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-slate-300 font-medium">
                    <span className="text-indigo-300 font-bold">{filteredLessons.length}</span> of{' '}
                    <span className="text-white">{adaptiveLessons.length}</span> lessons
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-sm">View:</span>
                    <div className="bg-white/5 rounded-lg p-1 border border-white/10">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`
                          px-3 py-1.5 rounded text-xs font-medium transition-all duration-300
                          ${viewMode === 'grid' 
                            ? 'bg-indigo-500/50 text-white shadow-lg' 
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }
                        `}
                      >
                        📊 Grid
                      </button>
                      <button
                        onClick={() => setViewMode('masonry')}
                        className={`
                          px-3 py-1.5 rounded text-xs font-medium transition-all duration-300
                          ${viewMode === 'masonry' 
                            ? 'bg-indigo-500/50 text-white shadow-lg' 
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }
                        `}
                      >
                        🧱 Masonry
                      </button>
                    </div>
                  </div>
                </div>
                
                {(searchQuery || Object.values(selectedFilters).some(filter => filter)) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilters({ difficulty: '', module: '', category: '', hasInteractive: '' });
                    }}
                    className="
                      px-6 py-2 
                      bg-red-500/20 border border-red-400/30
                      text-red-300 rounded-xl font-medium
                      hover:bg-red-500/30 hover:text-red-200
                      transition-all duration-300 transform hover:scale-105
                      shadow-lg shadow-red-500/10 hover:shadow-red-500/20
                    "
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Grid Layout - Wider cards, smaller gaps */}
          <div className="max-w-[1600px] mx-auto">
            {filteredLessons.length > 0 ? (
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6 auto-rows-max'
                  : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 md:gap-5 lg:gap-6 space-y-4 md:space-y-5 lg:space-y-6'
                }
              `}>
                {filteredLessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`
                      transform transition-all duration-500
                      hover:z-10 relative
                      ${viewMode === 'masonry' ? 'break-inside-avoid mb-4 md:mb-5 lg:mb-6' : ''}
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <LessonCard
                      lesson={lesson}
                      onClick={() => navigate(`/lessons/${lesson.id}`)}
                      className="h-full w-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="text-8xl mb-8 animate-bounce">🔍</div>
                  <h3 className="text-3xl font-bold text-white mb-4">No lessons found</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    We couldn't find any lessons matching your criteria. Try adjusting your search or filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilters({ difficulty: '', module: '', category: '', hasInteractive: '' });
                    }}
                    className="
                      px-8 py-4 
                      bg-gradient-to-r from-indigo-500 to-purple-600
                      hover:from-indigo-600 hover:to-purple-700
                      text-white font-semibold rounded-2xl
                      transform hover:scale-105 transition-all duration-300
                      shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                    "
                  >
                    Show All Lessons
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // Mobile layout continues here (existing mobile code)
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col overflow-hidden">
      {/* Star Animation Container for Mobile Lessons */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(100)].map((_, i) => {
          const screenH = window.innerHeight;
          const screenW = window.innerWidth;
          const initialY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const targetY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const initialX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const targetX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const starDuration = 30 + Math.random() * 25;
          const starSize = Math.random() * 2.5 + 0.8;

          return (
            <motion.div
              key={`mobile-lessons-star-${i}`}
              className="absolute rounded-full bg-white/40"
              style={{
                width: starSize,
                height: starSize,
              }}
              initial={{
                x: initialX,
                y: initialY,
                opacity: 0,
              }}
              animate={{
                x: targetX,
                y: targetY,
                opacity: [0, 0.5, 0.5, 0],
              }}
              transition={{
                duration: starDuration,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
                ease: "linear",
                opacity: {
                  duration: starDuration,
                  ease: "linear",
                  times: [0, 0.1, 0.85, 1],
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 2,
                }
              }}
            />
          );
        })}
      </div>
      {/* Custom CSS for animated shadows */}
      <style jsx>{`
        @keyframes start-lesson-glow {
          0% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.8), 0 0 60px rgba(139, 92, 246, 0.6), 0 0 90px rgba(236, 72, 153, 0.4);
          }
          25% {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(236, 72, 153, 0.6), 0 0 90px rgba(6, 182, 212, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.8), 0 0 60px rgba(6, 182, 212, 0.6), 0 0 90px rgba(34, 197, 94, 0.4);
          }
          75% {
            box-shadow: 0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(34, 197, 94, 0.6), 0 0 90px rgba(99, 102, 241, 0.4);
          }
          100% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.8), 0 0 60px rgba(139, 92, 246, 0.6), 0 0 90px rgba(236, 72, 153, 0.4);
          }
        }

        @keyframes tutorial-glow {
          0% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(99, 102, 241, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.4), 0 0 60px rgba(99, 102, 241, 0.3);
          }
          100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(99, 102, 241, 0.2);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .start-lesson-shadow {
          animation: start-lesson-glow 4s ease-in-out infinite;
        }

        .tutorial-shadow {
          animation: tutorial-glow 2s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .button-glow {
          box-shadow: 0 5px 15px rgba(99, 102, 241, 0.2);
          transition: all 0.3s ease;
        }

        .button-glow:hover {
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3), 0 5px 15px rgba(139, 92, 246, 0.2);
        }

        /* Custom scrollbar for mobile */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        /* Smooth gradient borders */
        .gradient-border {
          position: relative;
          background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
          padding: 1px;
          border-radius: 1rem;
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 1px;
          background: inherit;
          border-radius: inherit;
        }
      `}</style>

      {/* Mobile Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 via-black/90 to-black/80 backdrop-blur-xl border-b border-white/10" style={{
        paddingTop: 'max(env(safe-area-inset-top), 0px)'
      }}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="
              p-3 rounded-2xl 
              bg-gradient-to-br from-white/10 to-white/5
              backdrop-blur-xl border border-white/20
              shadow-lg shadow-black/20
              hover:from-white/20 hover:to-white/10
              hover:shadow-xl hover:shadow-indigo-500/30
              transition-all duration-300 transform active:scale-95
            "
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center flex-1 mx-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Explore Lessons
            </h1>
            <p className="text-xs text-slate-400 mt-1 truncate max-w-48 mx-auto">
              {getFilterSummary()}
            </p>
          </div>
          
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setShowSearch(!showSearch);
            }}
            className={`
              p-3 rounded-2xl 
              bg-gradient-to-br from-indigo-500/20 to-purple-500/20
              backdrop-blur-xl border border-indigo-400/30
              shadow-lg shadow-indigo-500/20
              hover:from-indigo-500/30 hover:to-purple-500/30
              hover:shadow-xl hover:shadow-indigo-500/40
              transition-all duration-300 transform active:scale-95
              ${showSearch ? 'ring-2 ring-indigo-400/50' : ''}
            `}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Enhanced Mobile Search Panel */}
        {showSearch && (
          <div className="px-4 pb-6 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-xl border-t border-white/10">
            {/* Search Input */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search lessons, concepts, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-12 pr-4 py-4
                  bg-gradient-to-r from-white/10 to-white/5
                  backdrop-blur-xl border border-white/20
                  text-white placeholder-slate-400
                  rounded-2xl text-base
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                  focus:border-indigo-400/50
                  shadow-lg shadow-black/20
                  transition-all duration-300
                "
              />
              
              {/* Search Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-xl shadow-black/40 z-50">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        triggerHapticFeedback('light');
                        setSearchQuery(suggestion);
                        setSearchSuggestions([]);
                        setShowSearch(false);
                      }}
                      className="
                        w-full text-left px-4 py-3 text-white 
                        hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20
                        transition-all duration-200 border-b border-white/10 last:border-b-0
                        backdrop-blur-sm
                      "
                    >
                      <span className="flex items-center space-x-2">
                        <span className="text-slate-400">🔍</span>
                        <span>{suggestion}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filters Toggle Button */}
            <button
              onClick={() => {
                triggerHapticFeedback('medium');
                setShowFilters(!showFilters);
              }}
              className={`
                w-full py-4 px-6 rounded-2xl font-semibold text-base
                bg-gradient-to-r from-cyan-500/20 to-blue-500/20
                backdrop-blur-xl border border-cyan-400/30
                text-white shadow-lg shadow-cyan-500/20
                hover:from-cyan-500/30 hover:to-blue-500/30
                hover:shadow-xl hover:shadow-cyan-500/30
                transition-all duration-300 transform active:scale-95
                ${showFilters ? 'ring-2 ring-cyan-400/50' : ''}
              `}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{showFilters ? '🔼' : '🔽'}</span>
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </span>
            </button>

            {/* Enhanced Filter Grid */}
            {showFilters && (
              <div className="grid grid-cols-2 gap-3 mt-4 animate-fadeIn">
                <select
                  value={selectedFilters.difficulty}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="
                    bg-gradient-to-r from-white/10 to-white/5
                    backdrop-blur-xl border border-white/20
                    text-white px-3 py-3 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    focus:border-indigo-400/50
                    shadow-lg shadow-black/20
                    transition-all duration-300 cursor-pointer
                  "
                >
                  <option value="" className="bg-slate-800">All Levels</option>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff} className="bg-slate-800 capitalize">{diff}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.module}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, module: e.target.value }))}
                  className="
                    bg-gradient-to-r from-white/10 to-white/5
                    backdrop-blur-xl border border-white/20
                    text-white px-3 py-3 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    focus:border-indigo-400/50
                    shadow-lg shadow-black/20
                    transition-all duration-300 cursor-pointer
                  "
                >
                  <option value="" className="bg-slate-800">All Modules</option>
                  {modules.map(module => (
                    <option key={module} value={module} className="bg-slate-800">{module}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.category}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="
                    bg-gradient-to-r from-white/10 to-white/5
                    backdrop-blur-xl border border-white/20
                    text-white px-3 py-3 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    focus:border-indigo-400/50
                    shadow-lg shadow-black/20
                    transition-all duration-300 cursor-pointer
                  "
                >
                  <option value="" className="bg-slate-800">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-slate-800">{category}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.hasInteractive}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, hasInteractive: e.target.value }))}
                  className="
                    bg-gradient-to-r from-white/10 to-white/5
                    backdrop-blur-xl border border-white/20
                    text-white px-3 py-3 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    focus:border-indigo-400/50
                    shadow-lg shadow-black/20
                    transition-all duration-300 cursor-pointer
                  "
                >
                  <option value="" className="bg-slate-800">All Types</option>
                  <option value="yes" className="bg-slate-800">Interactive</option>
                  <option value="no" className="bg-slate-800">Theory</option>
                </select>
              </div>
            )}

            {/* Clear Filters Button */}
            {(searchQuery || Object.values(selectedFilters).some(filter => filter)) && (
              <button
                onClick={() => {
                  triggerHapticFeedback('medium');
                  setSearchQuery('');
                  setSelectedFilters({ difficulty: '', module: '', category: '', hasInteractive: '' });
                  setShowSearch(false);
                }}
                className="
                  w-full mt-4 py-4 px-6 rounded-2xl font-semibold text-base
                  bg-gradient-to-r from-red-500/20 to-pink-500/20
                  backdrop-blur-xl border border-red-400/30
                  text-red-300 shadow-lg shadow-red-500/20
                  hover:from-red-500/30 hover:to-pink-500/30
                  hover:shadow-xl hover:shadow-red-500/30
                  transition-all duration-300 transform active:scale-95
                "
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🗑️</span>
                  <span>Clear All Filters</span>
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* No Results Mobile Screen */}
      {!currentLesson && (
        <div className="flex-1 flex items-center justify-center p-6" style={{
          paddingTop: `max(calc(env(safe-area-inset-top) + 80px), 100px)`
        }}>
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">🔍</div>
            <h2 className="text-3xl font-bold mb-4">No lessons found</h2>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              We couldn't find any lessons matching your criteria. Try adjusting your search or filters.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilters({ difficulty: '', module: '', category: '', hasInteractive: '' });
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
              >
                Clear All Filters
              </button>
              <button
                onClick={handleBack}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-white/10 hover:shadow-white/20"
              >
                Back to Lessons
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile content continues only if currentLesson exists */}
      {currentLesson && (
        <>
          {/* Full-Screen Lesson Display */}
          <div 
            ref={containerRef}
            className="absolute inset-0 bg-black touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ 
              paddingTop: `max(calc(env(safe-area-inset-top) + 80px), 100px)`,
              paddingBottom: `max(calc(env(safe-area-inset-bottom) + 80px), 100px)`
            }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={currentLesson.imageUrl}
                alt={currentLesson.title}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 pb-24 pointer-events-none">
              {/* Company Badge */}
              <div className="mb-4">
                <span className="inline-block bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20 shadow-lg shadow-white/10">
                  {currentLesson.company}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
                {currentLesson.title}
              </h1>

              {/* Description */}
              <p className="text-white/90 text-lg mb-6 leading-relaxed drop-shadow-md">
                {currentLesson.description}
              </p>

              {/* Meta Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-xl border border-white/20 shadow-lg ${
                  currentLesson.difficulty === 'beginner' ? 'bg-green-500/80 text-white shadow-green-500/20' :
                  currentLesson.difficulty === 'intermediate' ? 'bg-yellow-500/80 text-white shadow-yellow-500/20' :
                  'bg-red-500/80 text-white shadow-red-500/20'
                }`}>
                  {currentLesson.difficulty}
                </span>
                <span className="bg-white/20 backdrop-blur-xl text-white px-3 py-1 rounded-full text-sm border border-white/20 shadow-lg shadow-white/10">
                  {currentLesson.duration}
                </span>
                <span className="bg-indigo-500/80 backdrop-blur-xl text-white px-3 py-1 rounded-full text-sm border border-white/20 shadow-lg shadow-indigo-500/20">
                  {currentLesson.category}
                </span>
              </div>

              {/* Start Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Button clicked! Navigating to:', `/lessons/${currentLesson.id}`);
                  triggerHapticFeedback('success');
                  navigate(`/lessons/${currentLesson.id}`);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Button touched! Navigating to:', `/lessons/${currentLesson.id}`);
                  triggerHapticFeedback('success');
                  navigate(`/lessons/${currentLesson.id}`);
                }}
                className="start-lesson-shadow relative z-20 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-6 rounded-3xl transition-all duration-300 transform active:scale-95 pointer-events-auto border-2 border-white/30 shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/60 text-xl touch-manipulation"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>Start Learning</span>
                </span>
              </button>
            </div>
          </div>

          {/* End of Lessons Creative Message */}
          {showEndMessage && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
              <div className="text-center px-6 animate-pulse bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/30">
                <div className="text-8xl mb-4">
                  {currentIndex === 0 ? "🎯" : "🎉"}
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {currentIndex === 0 ? "Ready to Start?" : "Mission Complete!"}
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  {currentIndex === 0 
                    ? "Swipe up ⬆️ to begin your AI learning journey!" 
                    : `Amazing! You've explored all ${filteredLessons.length} lessons. Try different filters to discover more!`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Tutorial Overlay */}
          {showTutorial && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
              <div className="tutorial-shadow bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/30 text-center max-w-sm">
                <div className="text-6xl mb-6 animate-bounce">📱</div>
                <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome to AI Discovery!
                </h2>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Swipe up ⬆️ and down ⬇️ to discover lessons. Tap the search icon 🔍 to find exactly what you're looking for!
                </p>
                <button
                  onClick={closeTutorial}
                  className="tutorial-shadow w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-indigo-500/30"
                >
                  Let's Explore! 🚀
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LessonsExplore; 