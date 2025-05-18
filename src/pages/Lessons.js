import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import LessonCard from '../components/LessonCard';

// Sample lesson data
const lessons = [
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the fundamentals of artificial intelligence and machine learning",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 2,
    title: "AI Ethics",
    description: "Understanding the ethical implications and responsible use of AI",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 3,
    title: "GPT-4 Mastery",
    description: "Advanced techniques for working with OpenAI's GPT-4 model",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 4,
    title: "Gemini Pro",
    description: "Harness the power of Google's latest AI model",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 5,
    title: "AI Tools Overview",
    description: "Comprehensive guide to the most popular AI tools and platforms",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  }
];

const filterOptions = ["All", "Beginner", "Intermediate", "Advanced"];

const Lessons = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Create repeated lessons array for infinite scroll effect
  const repeatedLessons = [...lessons, ...lessons, ...lessons];

  // Filter lessons based on search and active filter
  const filteredLessons = repeatedLessons.filter(lesson => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || lesson.difficulty === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Get visible cards with wrapping
  const getVisibleCards = () => {
    const totalCards = filteredLessons.length;
    if (totalCards === 0) return [];

    // Get 5 cards centered around currentIndex
    const cards = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + totalCards) % totalCards;
      cards.push(filteredLessons[index]);
    }
    return cards;
  };

  const scrollToNext = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = 320; // Reduced card width
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    setCurrentIndex((prev) => (prev + 1) % filteredLessons.length);
  };

  const scrollToPrev = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = 320; // Reduced card width
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
    
    setCurrentIndex((prev) => (prev - 1 + filteredLessons.length) % filteredLessons.length);
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = 320; // Reduced card width
    const gap = 24;
    const scrollPosition = container.scrollLeft;
    const newIndex = Math.round(scrollPosition / (cardWidth + gap));
    
    setCurrentIndex(newIndex % filteredLessons.length);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleCards = getVisibleCards();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LoggedInNavbar />
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 text-white px-6 py-3 rounded-3xl w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex gap-2 overflow-x-auto mt-4 pb-2">
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

        {/* Desktop View - Horizontal Scroll */}
        <div className="relative h-[calc(100vh-16rem)]">
          {/* Navigation Buttons */}
          <button
            onClick={scrollToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory h-full px-16 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {visibleCards.map((lesson, index) => (
              <div
                key={lesson.id + index}
                className="flex-none w-[320px] snap-center"
              >
                <LessonCard lesson={lesson} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View - Vertical Scroll */}
        <div className="md:hidden">
          <div className="flex flex-col gap-8 overflow-y-auto scroll-smooth snap-y snap-mandatory items-center">
            {visibleCards.map((lesson, index) => (
              <div key={`${lesson.id}-${index}`} className="snap-start">
                <LessonCard 
                  lesson={lesson} 
                  isBlurred={index === 0 || index === 4}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Lessons; 