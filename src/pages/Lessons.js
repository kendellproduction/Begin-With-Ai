import React from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';

const lessons = [
  {
    id: 1,
    title: "Introduction to AI",
    description: "Learn the fundamental concepts of artificial intelligence and its real-world applications."
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    description: "Explore the core principles of machine learning and how it powers modern AI systems."
  },
  {
    id: 3,
    title: "Neural Networks",
    description: "Dive into the architecture and functioning of neural networks, the building blocks of deep learning."
  }
];

const Lessons = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoggedInNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Learning Path</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-3">{lesson.title}</h2>
              <p className="text-gray-600">{lesson.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Lessons; 