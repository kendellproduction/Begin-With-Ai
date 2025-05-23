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

  // Touch handling refs
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

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
          success: [50, 50, 50],
          bounce: [100, 50, 100]
        };
        window.navigator.vibrate(patterns[type] || patterns.light);
      }
    } catch (error) {
      // Haptic feedback not supported
    }
  };

  // Show creative end message
  const showEndOfLessonsMessage = (direction = 'up') => {
    setShowEndMessage(true);
    triggerHapticFeedback('bounce');
    
    setTimeout(() => {
      setShowEndMessage(false);
    }, 2000);
  };

  // Improved touch handlers with immediate response
  const handleTouchStart = (e) => {
    if (showSearch || showFilters || isTransitioning || showEndMessage) return;
    
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
    
    // Immediate feedback
    triggerHapticFeedback('light');
    
    // Prevent all scrolling immediately
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    if (!touchStartY.current || showSearch || showFilters || isTransitioning || showEndMessage) return;
    
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
    if (!touchStartY.current || showSearch || showFilters || isTransitioning || showEndMessage) {
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
        // End of list - show creative feedback
        showEndOfLessonsMessage(delta < 0 ? 'up' : 'down');
      }
      
      // Reset transition state
      setTimeout(() => setIsTransitioning(false), 300);
    }
    
    // Reset
    touchStartY.current = null;
    isDragging.current = false;
  };

  // Reset currentIndex when filters change, with proper bounds checking
  useEffect(() => {
    setCurrentIndex(0);
    setIsTransitioning(false);
    setShowEndMessage(false);
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
    localStorage.setItem('lessons_explore_tutorial_seen', 'true');
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/lessons');
  };

  // Get filter summary text
  const getFilterSummary = () => {
    const activeFilters = [];
    if (selectedFilters.difficulty) activeFilters.push(selectedFilters.difficulty);
    if (selectedFilters.company) activeFilters.push(selectedFilters.company);
    if (selectedFilters.category) activeFilters.push(selectedFilters.category);
    if (selectedFilters.useCase) activeFilters.push(selectedFilters.useCase);
    if (searchQuery) activeFilters.push(`"${searchQuery}"`);
    
    if (activeFilters.length === 0) return "All Lessons";
    return activeFilters.join(" • ");
  };

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
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
            <h1 className="text-lg font-semibold text-white">Explore</h1>
            <div className="w-10" />
          </div>
        </div>

        {/* No Results Screen */}
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Custom CSS for animated shadows */}
      <style jsx>{`
        @keyframes start-lesson-glow {
          0% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.6), 0 0 60px rgba(139, 92, 246, 0.4), 0 0 90px rgba(236, 72, 153, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1);
          }
          25% {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(236, 72, 153, 0.4), 0 0 90px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.6), 0 0 60px rgba(6, 182, 212, 0.4), 0 0 90px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1);
          }
          75% {
            box-shadow: 0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(34, 197, 94, 0.4), 0 0 90px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1);
          }
          100% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.6), 0 0 60px rgba(139, 92, 246, 0.4), 0 0 90px rgba(236, 72, 153, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1);
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
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl shadow-lg shadow-indigo-500/10" style={{
        paddingTop: 'max(env(safe-area-inset-top), 0px)'
      }}>
        <div className="flex items-center justify-between p-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="button-glow p-2 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Title with Filter Summary */}
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white">Explore</h1>
            <p className="text-xs text-gray-400 max-w-40 truncate">{getFilterSummary()}</p>
          </div>

          {/* Search/Menu Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="button-glow p-2 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Expandable Search */}
        {showSearch && (
          <div className="px-4 pb-4 bg-black/60 backdrop-blur-xl border-t border-white/10">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search lessons, companies, models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="button-glow w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/10"
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
              className="button-glow w-full bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-2xl font-medium border border-white/10 hover:bg-white/20 transition-all duration-300"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {showFilters && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <select
                  value={selectedFilters.difficulty}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="button-glow bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="" className="bg-gray-800">All Levels</option>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff} className="bg-gray-800">{diff}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.company}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, company: e.target.value }))}
                  className="button-glow bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="" className="bg-gray-800">All Companies</option>
                  {companies.map(company => (
                    <option key={company} value={company} className="bg-gray-800">{company}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.category}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="button-glow bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="" className="bg-gray-800">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">{category}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.useCase}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, useCase: e.target.value }))}
                  className="button-glow bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
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
                  setShowSearch(false);
                }}
                className="w-full bg-red-500/20 backdrop-blur-sm text-white px-4 py-3 rounded-2xl font-medium mt-3 border border-red-500/30 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300"
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
            onClick={() => navigate(`/lessons/${currentLesson.id}`)}
            className="start-lesson-shadow w-full bg-white text-black font-bold py-4 rounded-2xl transition-all duration-300 transform active:scale-95 pointer-events-auto border-2 border-white/20"
          >
            Start Lesson
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="absolute z-50 bg-black/60 backdrop-blur-xl rounded-full px-3 py-1 border border-white/20 shadow-lg shadow-indigo-500/20" style={{
          top: `max(calc(env(safe-area-inset-top) + 100px), 120px)`,
          right: '16px'
        }}>
          <span className="text-sm text-white font-medium">
            {currentIndex + 1}/{filteredLessons.length}
          </span>
        </div>

        {/* Navigation Indicators */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3" style={{
          bottom: `max(calc(env(safe-area-inset-bottom) + 16px), 36px)`
        }}>
          {filteredLessons.slice(0, Math.min(7, filteredLessons.length)).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-200 shadow-lg ${
                idx === currentIndex 
                  ? 'w-8 h-3 bg-white rounded-full shadow-white/30' 
                  : 'w-3 h-3 bg-white/40 rounded-full hover:bg-white/60 shadow-white/20'
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

      {/* End of Lessons Creative Message */}
      {showEndMessage && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center">
          <div className="text-center px-6 animate-pulse">
            <div className="text-8xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentIndex === 0 ? "You're at the beginning!" : "You've seen them all!"}
            </h2>
            <p className="text-white/80 text-lg">
              {currentIndex === 0 
                ? "Swipe up to start exploring lessons" 
                : `You've explored all ${filteredLessons.length} lessons in this filter!`
              }
            </p>
          </div>
        </div>
      )}

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="tutorial-shadow bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center max-w-sm">
            <div className="text-6xl mb-6">👆</div>
            <h2 className="text-2xl font-bold text-white mb-4">Swipe to Explore</h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              Swipe up and down to discover amazing AI lessons. Use the search icon to filter by company, difficulty, or topic!
            </p>
            <button
              onClick={closeTutorial}
              className="tutorial-shadow w-full bg-white text-black font-bold py-3 rounded-2xl transition-all duration-300 transform active:scale-95"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsExplore; 