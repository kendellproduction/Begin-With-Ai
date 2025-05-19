import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import LessonCard from '../components/LessonCard';

// Sample lesson data
const lessons = [
  {
    id: 1,
    title: "Introduction to AI",
    description: "Master the fundamentals of artificial intelligence and machine learning. Learn about neural networks, deep learning, and how AI is transforming industries.",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 2,
    title: "AI Ethics",
    description: "Explore the ethical implications of AI development and deployment. Understand bias, privacy concerns, and responsible AI practices.",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 3,
    title: "GPT-4 Mastery",
    description: "Learn advanced techniques for working with OpenAI's GPT-4 model. Master prompt engineering, fine-tuning, and real-world applications.",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 4,
    title: "Gemini Pro",
    description: "Harness the power of Google's latest AI model. Learn to integrate Gemini Pro into your applications and leverage its advanced capabilities.",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 5,
    title: "AI Tools Overview",
    description: "Discover and master the most popular AI tools and platforms. Learn to choose the right tools for your needs and integrate them effectively.",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <LoggedInNavbar />
      <main className="container mx-auto px-4 py-4 flex-1 flex flex-col">
        {/* Search and Filter Section - Updated Layout */}
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

        {/* Desktop View - Horizontal Scroll */}
        <div className="relative flex-1">
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
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory h-full px-16 py-2"
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
        <div className="md:hidden mt-4">
          <div className="flex flex-col gap-6 overflow-y-auto scroll-smooth snap-y snap-mandatory items-center">
            {visibleCards.map((lesson, index) => (
              <div key={`${lesson.id}-${index}`} className="snap-start w-full">
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