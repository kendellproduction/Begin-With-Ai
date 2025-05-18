import React from 'react';
import { Link } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';

// Mock lesson data with background images
const lessons = [
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the fundamentals of artificial intelligence and machine learning",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 2,
    title: "AI Ethics",
    description: "Understanding the ethical implications and responsible use of AI",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 3,
    title: "GPT-4 Mastery",
    description: "Advanced techniques for working with OpenAI's GPT-4 model",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 4,
    title: "Gemini Pro",
    description: "Harness the power of Google's latest AI model",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 5,
    title: "AI Tools Overview",
    description: "Comprehensive guide to the most popular AI tools and platforms",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

const LessonCard = ({ lesson }) => (
  <Link
    to={`/lessons/${lesson.id}`}
    className="relative flex-shrink-0 w-full md:w-[350px] h-[80vh] md:h-[500px] rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
  >
    <img
      src={lesson.image}
      alt={lesson.title}
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
    <div className="relative h-full p-8 flex flex-col justify-between text-white">
      <div>
        <span className="inline-block px-4 py-2 text-sm font-medium bg-indigo-600 rounded-full mb-4">
          {lesson.difficulty}
        </span>
        <h3 className="text-3xl font-bold mb-4">{lesson.title}</h3>
        <p className="text-lg text-gray-300">{lesson.description}</p>
      </div>
      <div className="flex items-center text-lg text-white font-medium">
        <span>Start Learning →</span>
      </div>
    </div>
  </Link>
);

const LessonsPage = () => {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <LoggedInNavbar />
      <main className="px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Lessons</h1>
          <p className="text-xl text-gray-300">Scroll to discover our comprehensive AI learning paths</p>
        </div>

        {/* Desktop View - Horizontal Scroll */}
        <div className="hidden md:block">
          <div className="flex space-x-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="snap-start">
                <LessonCard lesson={lesson} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View - Vertical Scroll */}
        <div className="md:hidden h-[calc(100vh-12rem)] overflow-y-auto scroll-smooth snap-y snap-mandatory">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="snap-start mb-6">
              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LessonsPage; 