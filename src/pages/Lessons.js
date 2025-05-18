import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';

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

const LessonCard = ({ lesson }) => (
  <Link
    to={`/lessons/${lesson.id}`}
    className="group relative flex-shrink-0 min-w-[320px] w-[320px] h-[460px] rounded-[2rem] overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:z-10 bg-gray-800"
  >
    <img
      src={lesson.image}
      alt={lesson.title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
    <div className="relative h-full p-8 flex flex-col justify-center text-white">
      <div className="text-center">
        <span className="inline-block px-4 py-2 text-sm font-medium bg-indigo-600 rounded-full mb-4 shadow-lg">
          {lesson.difficulty}
        </span>
        <h3 className="text-2xl font-bold mb-3">{lesson.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-3">{lesson.description}</p>
      </div>
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <span className="text-sm text-white font-medium group-hover:translate-x-2 transition-transform duration-300">
          Start Learning →
        </span>
      </div>
    </div>
  </Link>
);

const Lessons = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const scrollContainerRef = useRef(null);

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

  // Infinite auto-scroll logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollInterval;
    let isHovered = false;

    const startScrolling = () => {
      if (isHovered) return;
      scrollInterval = setInterval(() => {
        container.scrollLeft += 1;
        // Reset scroll position when reaching the end
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
      }, 20);
    };

    const stopScrolling = () => {
      clearInterval(scrollInterval);
    };

    const handleMouseEnter = () => {
      isHovered = true;
      stopScrolling();
    };

    const handleMouseLeave = () => {
      isHovered = false;
      startScrolling();
    };

    // Start auto-scrolling
    startScrolling();

    // Add event listeners
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      stopScrolling();
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LoggedInNavbar />
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full max-w-md"
          />

          <div className="flex gap-2 overflow-x-auto mt-4 pb-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${activeFilter === filter
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop View - Horizontal Scroll */}
        <div className="hidden md:block">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 items-stretch gap-0 cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredLessons.map((lesson, index) => (
              <div key={index} className="snap-start">
                <LessonCard lesson={lesson} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View - Vertical Scroll */}
        <div className="md:hidden">
          <div className="flex flex-col overflow-y-auto scroll-smooth snap-y snap-mandatory items-stretch gap-0">
            {filteredLessons.map((lesson, index) => (
              <div key={index} className="snap-start">
                <LessonCard lesson={lesson} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Lessons; 