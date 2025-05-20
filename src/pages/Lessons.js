import React, { useState, useRef } from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import LessonCard from '../components/LessonCard';
import lessonsData from '../utils/lessonsData';

const filterOptions = ["All", "Beginner", "Intermediate", "Advanced"];

const Lessons = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Infinite loop effect (so the V always has cards)
  const repeatedLessons = [...lessonsData, ...lessonsData, ...lessonsData];
  const filteredLessons = repeatedLessons.filter(lesson => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || lesson.difficulty === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Show 7 cards: center, 3 left, 3 right
  const getVisibleCards = () => {
    const total = filteredLessons.length;
    if (total === 0) return [];
    let arr = [];
    for (let i = -3; i <= 3; i++) {
      let idx = (currentIndex + i + total) % total;
      arr.push(filteredLessons[idx]);
    }
    return arr;
  };

  const visibleCards = getVisibleCards();

  // Desktop carousel next/prev
  const scrollToNext = () => setCurrentIndex((prev) => (prev + 1) % filteredLessons.length);
  const scrollToPrev = () => setCurrentIndex((prev) => (prev - 1 + filteredLessons.length) % filteredLessons.length);

  // --- Mobile swipe support ---
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    touchEndY.current = e.changedTouches[0].clientY;
    const delta = touchEndY.current - touchStartY.current;
    if (delta > 50) {
      // Swipe down: previous
      scrollToPrev();
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(30); // Haptic
    } else if (delta < -50) {
      // Swipe up: next
      scrollToNext();
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(30); // Haptic
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <LoggedInNavbar />

      {/* Search & Filter */}
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
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300
                  ${activeFilter === filter
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Desktop V-Formation Carousel */}
      <div className="hidden md:flex relative w-full flex-col items-center justify-center -mt-8 z-30 pointer-events-auto" style={{ minHeight: '540px' }}>
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

        {/* Cards - Horizontal Stack */}
        <div className="relative flex justify-center items-center w-full h-[520px] select-none">
          {/* Background Cards */}
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
          
          {/* Main Cards */}
          {visibleCards.map((lesson, idx) => (
            <div
              key={lesson.id + '-' + idx}
              className={`
                absolute left-1/2 top-1/2 transition-all duration-500
                w-[400px] max-w-[90vw] h-[500px]
                ${idx === 3 ? 'z-30 scale-100' : 
                  idx === 2 || idx === 4 ? 'z-20 scale-95' :
                  idx === 1 || idx === 5 ? 'z-10 scale-90' :
                  'z-5 scale-85'}
                rounded-3xl overflow-hidden
              `}
              style={{ 
                transform: `translate(-50%, -50%) translateX(${(idx - 3) * 120}px)`,
                transition: 'all 0.5s ease-out',
                filter: idx === 0 || idx === 6 ? 'blur(8px)' : 'none',
                boxShadow: idx === 3 ? 
                  `0 25px 50px -12px rgba(0, 0, 0, 0.5),
                    0 0 0 4px ${lesson.difficulty === 'Beginner' ? 'rgba(34, 197, 94, 0.5)' : 
                               lesson.difficulty === 'Intermediate' ? 'rgba(234, 179, 8, 0.5)' : 
                               'rgba(239, 68, 68, 0.5)'},
                    0 0 30px ${lesson.difficulty === 'Beginner' ? 'rgba(34, 197, 94, 0.3)' : 
                               lesson.difficulty === 'Intermediate' ? 'rgba(234, 179, 8, 0.3)' : 
                               'rgba(239, 68, 68, 0.3)'}` : 
                   idx === 2 || idx === 4 ?
                   `0 20px 25px -5px rgba(0, 0, 0, 0.3),
                    0 0 15px ${lesson.difficulty === 'Beginner' ? 'rgba(34, 197, 94, 0.2)' : 
                               lesson.difficulty === 'Intermediate' ? 'rgba(234, 179, 8, 0.2)' : 
                               'rgba(239, 68, 68, 0.2)'}` :
                   idx === 1 || idx === 5 ?
                   `0 15px 20px -5px rgba(0, 0, 0, 0.2),
                    0 0 10px ${lesson.difficulty === 'Beginner' ? 'rgba(34, 197, 94, 0.15)' : 
                               lesson.difficulty === 'Intermediate' ? 'rgba(234, 179, 8, 0.15)' : 
                               'rgba(239, 68, 68, 0.15)'}` :
                   `0 10px 15px -5px rgba(0, 0, 0, 0.15),
                    0 0 5px ${lesson.difficulty === 'Beginner' ? 'rgba(34, 197, 94, 0.1)' : 
                               lesson.difficulty === 'Intermediate' ? 'rgba(234, 179, 8, 0.1)' : 
                               'rgba(239, 68, 68, 0.1)'}`
              }}
            >
              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile - Vertical swipe */}
      <div 
        className="md:hidden flex flex-col items-center justify-center w-full relative h-[800px] select-none z-30"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {visibleCards.map((lesson, idx) => (
            <div
              key={`${lesson.id}-${idx}`}
              className={`
                absolute left-1/2 top-1/2 transition-all duration-500
                w-[340px] max-w-[90vw] h-[500px]
                ${idx === 2 ? 'z-30 scale-100 opacity-100' : 
                  idx === 1 || idx === 3 ? 'z-20 scale-95 opacity-85' :
                  'z-10 scale-90 opacity-70'}
              `}
              style={{ 
                transform: `translate(-50%, -50%) translateY(${(idx - 2) * 100}px)`,
                transition: 'all 0.5s ease-out'
              }}
            >
              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lessons;
