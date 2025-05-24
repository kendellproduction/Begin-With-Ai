import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import LessonCard from '../components/LessonCard';
import lessonsData from '../utils/lessonsData';

const LessonsExplore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: '',
    company: '',
    category: '',
    useCase: ''
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

  // Touch handling refs
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

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

  // Get unique filter options from data
  const getUniqueValues = (field) => {
    const values = new Set();
    lessonsData.forEach(lesson => {
      if (Array.isArray(lesson[field])) {
        lesson[field].forEach(item => values.add(item));
      } else if (lesson[field]) {
        values.add(lesson[field]);
      }
    });
    return Array.from(values).sort();
  };

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const companies = getUniqueValues('company');
  const categories = getUniqueValues('category');
  const useCases = getUniqueValues('useCases');

  // Advanced search and filtering
  const getFilteredLessons = () => {
    return lessonsData.filter(lesson => {
      const matchesSearch = searchQuery === '' || 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lesson.models.some(model => model.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lesson.useCases.some(useCase => useCase.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDifficulty = !selectedFilters.difficulty || lesson.difficulty === selectedFilters.difficulty;
      const matchesCompany = !selectedFilters.company || lesson.company === selectedFilters.company;
      const matchesCategory = !selectedFilters.category || lesson.category === selectedFilters.category;
      const matchesUseCase = !selectedFilters.useCase || lesson.useCases.includes(selectedFilters.useCase);

      return matchesSearch && matchesDifficulty && matchesCompany && matchesCategory && matchesUseCase;
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
      lessonsData.forEach(lesson => {
        if (lesson.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(lesson.title);
        }
        lesson.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchQuery.toLowerCase())) {
            suggestions.add(tag);
          }
        });
        lesson.models.forEach(model => {
          if (model.toLowerCase().includes(searchQuery.toLowerCase())) {
            suggestions.add(model);
          }
        });
        if (lesson.company.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(lesson.company);
        }
      });
      setSearchSuggestions(Array.from(suggestions).slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

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
    
    const currentY = e.touches[0].clientY;
    const deltaY = Math.abs(currentY - touchStartY.current);
    
    if (deltaY > 5) {
      isDragging.current = true;
    }
    
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !touchStartY.current || showSearch || showFilters || isTransitioning || showEndMessage) {
      touchStartY.current = null;
      isDragging.current = false;
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDragging.current) {
      touchStartY.current = null;
      return;
    }
    
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchEndY - touchStartY.current;
    
    // Lower threshold for easier swiping
    if (Math.abs(delta) > 50) {
      setIsTransitioning(true);
      
      if (delta > 0 && currentIndex > 0) {
        // Swipe down: previous lesson
        triggerHapticFeedback('medium');
        setTimeout(() => {
          setCurrentIndex(currentIndex - 1);
          setIsTransitioning(false);
        }, 150);
      } else if (delta < 0 && currentIndex < filteredLessons.length - 1) {
        // Swipe up: next lesson
        triggerHapticFeedback('medium');
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setIsTransitioning(false);
        }, 150);
      } else {
        // At boundaries
        setTimeout(() => {
          setIsTransitioning(false);
        }, 150);
        showEndOfLessonsMessage(delta < 0 ? 'up' : 'down');
      }
    } else {
      setIsTransitioning(false);
    }
    
    touchStartY.current = null;
    isDragging.current = false;
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('lessons_explore_tutorial_seen', 'true');
  };

  const handleBack = () => {
    navigate('/lessons');
  };

  const getFilterSummary = () => {
    const activeFilters = Object.values(selectedFilters).filter(Boolean);
    if (searchQuery && activeFilters.length > 0) {
      return `"${searchQuery}" + ${activeFilters.length} filter${activeFilters.length > 1 ? 's' : ''}`;
    } else if (searchQuery) {
      return `"${searchQuery}"`;
    } else if (activeFilters.length > 0) {
      return `${activeFilters.length} filter${activeFilters.length > 1 ? 's' : ''} active`;
    }
    return 'All lessons';
  };

  // Render desktop V-shape layout
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-900">
        <LoggedInNavbar />
        
        <div className="container mx-auto px-4 py-8">
          {/* Desktop Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Lessons
            </button>
            
            <h1 className="text-4xl font-bold text-white mb-6">Explore All Lessons</h1>
            
            {/* Desktop Search and Filters */}
            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search lessons, companies, models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="text-white text-sm flex items-center">
                  Showing {filteredLessons.length} of {lessonsData.length} lessons
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select
                  value={selectedFilters.difficulty}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Levels</option>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.company}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, company: e.target.value }))}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Companies</option>
                  {companies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.category}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.useCase}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, useCase: e.target.value }))}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Use Cases</option>
                  {useCases.map(useCase => (
                    <option key={useCase} value={useCase}>{useCase}</option>
                  ))}
                </select>
              </div>
              
              {(searchQuery || Object.values(selectedFilters).some(filter => filter)) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilters({ difficulty: '', company: '', category: '', useCase: '' });
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Desktop V-Shape Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onClick={() => navigate(`/lessons/${lesson.id}`)}
              />
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No lessons found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mobile layout continues here (existing mobile code)
  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
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

        .start-lesson-shadow {
          animation: start-lesson-glow 4s ease-in-out infinite;
        }

        .tutorial-shadow {
          animation: tutorial-glow 2s ease-in-out infinite;
        }

        .button-glow {
          box-shadow: 0 5px 15px rgba(99, 102, 241, 0.2);
          transition: all 0.3s ease;
        }

        .button-glow:hover {
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3), 0 5px 15px rgba(139, 92, 246, 0.2);
        }
      `}</style>

      {/* Mobile Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl" style={{
        paddingTop: 'max(env(safe-area-inset-top), 0px)'
      }}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white">Explore</h1>
            <p className="text-xs text-gray-400 max-w-40 truncate">{getFilterSummary()}</p>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Mobile Search Panel */}
        {showSearch && (
          <div className="px-4 pb-4 bg-black/60 backdrop-blur-xl border-t border-white/10">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search lessons, companies, models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/10"
              />
              
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-lg shadow-indigo-500/10">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setSearchSuggestions([]);
                        setShowSearch(false);
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white/10 backdrop-blur-sm text-white px-4 py-4 rounded-2xl font-medium border border-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20 text-lg"
            >
              {showFilters ? '🔼 Hide Filters' : '🔽 Show Filters'}
            </button>

            {showFilters && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <select
                  value={selectedFilters.difficulty}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="" className="bg-gray-800">All Levels</option>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff} className="bg-gray-800">{diff}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.company}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, company: e.target.value }))}
                  className="bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="" className="bg-gray-800">All Companies</option>
                  {companies.map(company => (
                    <option key={company} value={company} className="bg-gray-800">{company}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.category}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="" className="bg-gray-800">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">{category}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.useCase}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, useCase: e.target.value }))}
                  className="bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="" className="bg-gray-800">All Use Cases</option>
                  {useCases.map(useCase => (
                    <option key={useCase} value={useCase} className="bg-gray-800">{useCase}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear Filters Button */}
            {(searchQuery || Object.values(selectedFilters).some(filter => filter)) && (
              <button
                onClick={() => {
                  triggerHapticFeedback('medium');
                  setSearchQuery('');
                  setSelectedFilters({ difficulty: '', company: '', category: '', useCase: '' });
                  setShowSearch(false);
                }}
                className="w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm text-white px-4 py-4 rounded-2xl font-medium mt-4 border border-red-500/30 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 text-lg hover:from-red-500/30 hover:to-pink-500/30"
              >
                🗑️ Clear All Filters
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
                  setSelectedFilters({ difficulty: '', company: '', category: '', useCase: '' });
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
                  currentLesson.difficulty === 'Beginner' ? 'bg-green-500/80 text-white shadow-green-500/20' :
                  currentLesson.difficulty === 'Intermediate' ? 'bg-yellow-500/80 text-white shadow-yellow-500/20' :
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