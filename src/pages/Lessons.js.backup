import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import LessonCard from '../components/LessonCard';
import lessonsData from '../utils/lessonsData';

const Lessons = () => {
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
    return !localStorage.getItem('lessons_tutorial_seen');
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Touch handling refs
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  // Clear filters when coming from home page
  useEffect(() => {
    if (location.state?.resetFilters) {
      setSearchQuery('');
      setSelectedFilters({
        difficulty: '',
        company: '',
        category: '',
        useCase: ''
      });
      setCurrentIndex(0);
      // Clear the state to prevent repeated resets
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Prevent default scroll behavior on mobile
  useEffect(() => {
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
  }, []);

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

  // Desktop filtering logic (for backward compatibility)
  const activeFilter = selectedFilters.difficulty || 'All';
  const repeatedLessons = [...filteredLessons, ...filteredLessons, ...filteredLessons];
  
  const getVisibleCards = () => {
    const total = repeatedLessons.length;
    if (total === 0) return [];
    let arr = [];
    for (let i = -3; i <= 3; i++) {
      let idx = (currentIndex + i + total) % total;
      arr.push(repeatedLessons[idx]);
    }
    return arr;
  };

  const visibleCards = getVisibleCards();
  const currentLesson = filteredLessons[currentIndex];

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

  // Enhanced haptic feedback function
  const triggerHapticFeedback = (type = 'light') => {
    try {
      if (window.navigator && window.navigator.vibrate) {
        const patterns = {
          light: [30],
          medium: [50],
          heavy: [100],
          success: [50, 50, 50]
        };
        window.navigator.vibrate(patterns[type] || patterns.light);
      }
      
      // iOS haptic feedback (if available)
      if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
        // iOS haptic feedback would go here if implemented
      }
    } catch (error) {
      // Haptic feedback not supported
    }
  };

  // Improved touch handlers with immediate response
  const handleTouchStart = (e) => {
    if (showSearch || showFilters || isTransitioning) return;
    
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
    
    // Immediate feedback
    triggerHapticFeedback('light');
    
    // Prevent all scrolling immediately
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    if (!touchStartY.current || showSearch || showFilters || isTransitioning) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = Math.abs(currentY - touchStartY.current);
    
    // More immediate drag detection
    if (deltaY > 5) {
      isDragging.current = true;
    }
    
    // Always prevent default to stop page movement
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    if (!touchStartY.current || showSearch || showFilters || isTransitioning) {
      touchStartY.current = null;
      isDragging.current = false;
      return;
    }
    
    // Prevent any default behavior
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
        // Swipe down: previous
        setCurrentIndex(prev => prev - 1);
        triggerHapticFeedback('medium');
      } else if (delta < 0 && currentIndex < filteredLessons.length - 1) {
        // Swipe up: next
        setCurrentIndex(prev => prev + 1);
        triggerHapticFeedback('medium');
      } else {
        // End of list feedback
        triggerHapticFeedback('heavy');
      }
      
      // Reset transition state
      setTimeout(() => setIsTransitioning(false), 300);
    }
    
    // Reset
    touchStartY.current = null;
    isDragging.current = false;
  };

  // Desktop carousel functions
  const scrollToNext = () => {
    if (currentIndex < filteredLessons.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  const scrollToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Reset currentIndex when filters change, with proper bounds checking
  useEffect(() => {
    setCurrentIndex(0);
    setIsTransitioning(false); // Reset transition state when filters change
  }, [searchQuery, selectedFilters]);

  // Ensure currentIndex is within bounds
  useEffect(() => {
    if (filteredLessons.length > 0 && currentIndex >= filteredLessons.length) {
      setCurrentIndex(0);
    }
  }, [filteredLessons.length, currentIndex]);

  // Tutorial overlay functions
  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('lessons_tutorial_seen', 'true');
  };

  // Handle back navigation
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <LoggedInNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No lessons found</h2>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilters({ difficulty: '', company: '', category: '', useCase: '' });
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Desktop V-Formation Carousel (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col">
        <LoggedInNavbar />
        
        {/* Desktop Search & Filter */}
        <main className="container mx-auto px-4 py-4 flex flex-col z-20">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 text-white px-6 py-3 rounded-3xl w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
              {difficulties.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilters(prev => ({ ...prev, difficulty: prev.difficulty === filter ? '' : filter }))}
                  className={`px-6 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300
                    ${selectedFilters.difficulty === filter
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* Desktop Carousel */}
        <div className="relative w-full flex-col items-center justify-center -mt-8 z-30 pointer-events-auto" style={{ minHeight: '540px' }}>
          {/* Nav Buttons */}
          <button
            onClick={scrollToPrev}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-40 bg-gray-800/80 hover:bg-gray-700 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollToNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-40 bg-gray-800/80 hover:bg-gray-700 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards */}
          <div className="relative flex justify-center items-center w-full h-[520px] select-none">
            {[...Array(10)].map((_, bgIdx) => (
              <div
                key={`bg-${bgIdx}`}
                className="absolute left-1/2 top-1/2 transition-all duration-500 w-[400px] h-[500px] bg-gray-800 rounded-3xl shadow-2xl"
                style={{ 
                  transform: `translate(-50%, -50%) translateX(${(bgIdx - 5) * 25}px)`,
                  zIndex: 5 - Math.abs(bgIdx - 5),
                  opacity: 0.3
                }}
              />
            ))}
            
            {visibleCards.map((lesson, idx) => (
              <div
                key={lesson.id + '-' + idx}
                className={`absolute left-1/2 top-1/2 transition-all duration-500 w-[400px] max-w-[90vw] h-[500px] rounded-3xl overflow-hidden
                  ${idx === 3 ? 'z-30 scale-100' : 
                    idx === 2 || idx === 4 ? 'z-20 scale-95' :
                    idx === 1 || idx === 5 ? 'z-10 scale-90' :
                    'z-5 scale-85'}`}
                style={{ 
                  transform: `translate(-50%, -50%) translateX(${(idx - 3) * 120}px)`,
                  transition: 'all 0.5s ease-out',
                  filter: idx === 0 || idx === 6 ? 'blur(8px)' : 'none'
                }}
              >
                <LessonCard lesson={lesson} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Premium Experience */}
      <div className="md:hidden relative h-screen w-full overflow-hidden bg-black" style={{ 
        paddingTop: 'max(env(safe-area-inset-top), 20px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 20px)'
      }}>
        {/* Mobile Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl" style={{
          paddingTop: 'max(env(safe-area-inset-top), 0px)'
        }}>
          <div className="flex items-center justify-between p-4">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Title with Filter Indicator */}
            <h1 className="text-lg font-semibold text-white">
              Lessons
              {(searchQuery || Object.values(selectedFilters).some(filter => filter)) && (
                <span className="text-sm text-white/60 ml-2">
                  ({filteredLessons.length})
                </span>
              )}
            </h1>

            {/* Search/Menu Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Expandable Search */}
          {showSearch && (
            <div className="px-4 pb-4 bg-black/60 backdrop-blur-xl">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search lessons, companies, models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                
                {searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setSearchSuggestions([]);
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
                className="w-full bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-2xl font-medium"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
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
                    setSearchQuery('');
                    setSelectedFilters({ difficulty: '', company: '', category: '', useCase: '' });
                  }}
                  className="w-full bg-red-500/20 backdrop-blur-sm text-white px-4 py-3 rounded-2xl font-medium mt-3 border border-red-500/30"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

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
              <span className="inline-block bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20">
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
              <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-xl border border-white/20 ${
                currentLesson.difficulty === 'Beginner' ? 'bg-green-500/80 text-white' :
                currentLesson.difficulty === 'Intermediate' ? 'bg-yellow-500/80 text-white' :
                'bg-red-500/80 text-white'
              }`}>
                {currentLesson.difficulty}
              </span>
              <span className="bg-white/20 backdrop-blur-xl text-white px-3 py-1 rounded-full text-sm border border-white/20">
                {currentLesson.duration}
              </span>
              <span className="bg-indigo-500/80 backdrop-blur-xl text-white px-3 py-1 rounded-full text-sm border border-white/20">
                {currentLesson.category}
              </span>
            </div>

            {/* Start Button */}
            <button
              onClick={() => navigate(`/lessons/${currentLesson.id}`)}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-2xl pointer-events-auto"
            >
              Start Lesson
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="absolute z-50 bg-black/60 backdrop-blur-xl rounded-full px-3 py-1 border border-white/20" style={{
            top: `max(calc(env(safe-area-inset-top) + 100px), 120px)`,
            right: '16px'
          }}>
            <span className="text-sm text-white font-medium">
              {currentIndex + 1}/{filteredLessons.length}
            </span>
          </div>

          {/* Redesigned Navigation Indicators */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3" style={{
            bottom: `max(calc(env(safe-area-inset-bottom) + 16px), 36px)`
          }}>
            {filteredLessons.slice(0, Math.min(7, filteredLessons.length)).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-200 ${
                  idx === currentIndex 
                    ? 'w-8 h-3 bg-white rounded-full' 
                    : 'w-3 h-3 bg-white/40 rounded-full hover:bg-white/60'
                }`}
              />
            ))}
            {filteredLessons.length > 7 && (
              <span className="text-white/60 text-sm ml-2">
                +{filteredLessons.length - 7}
              </span>
            )}
          </div>
        </div>

        {/* Tutorial Overlay */}
        {showTutorial && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center max-w-sm">
              <div className="text-6xl mb-6">👆</div>
              <h2 className="text-2xl font-bold text-white mb-4">Swipe to Explore</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Swipe up and down to discover amazing AI lessons. Each lesson is crafted to help you master AI technologies.
              </p>
              <button
                onClick={closeTutorial}
                className="w-full bg-white text-black font-bold py-3 rounded-2xl transition-all duration-300 transform active:scale-95"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;
