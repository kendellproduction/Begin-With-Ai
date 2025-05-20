import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lessonsData from '../utils/lessonsData';
import LoggedInNavbar from '../components/LoggedInNavbar';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = lessonsData.find(l => l.id === parseInt(lessonId));

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <button
            onClick={() => navigate('/lessons')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LoggedInNavbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <span className={`px-4 py-2 rounded-2xl text-sm font-medium shadow-lg ${
              lesson.difficulty === 'Beginner' 
                ? 'bg-green-900/80 text-green-400 shadow-green-500/20 backdrop-blur-sm'
                : lesson.difficulty === 'Intermediate'
                ? 'bg-yellow-900/80 text-yellow-400 shadow-yellow-500/20 backdrop-blur-sm'
                : 'bg-red-900/80 text-red-400 shadow-red-500/20 backdrop-blur-sm'
            }`}>
              {lesson.difficulty}
            </span>
          </div>
          <p className="text-xl text-gray-300">{lesson.description}</p>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Audio Section */}
          <section className="bg-gray-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Listen to the Lesson</h2>
            <audio 
              controls 
              src={lesson.audioUrl} 
              className="w-full rounded-lg bg-gray-700/50 backdrop-blur-sm"
            />
          </section>

          {/* Sandbox Section */}
          <section className="bg-gray-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Interactive Sandbox</h2>
            <iframe 
              src={lesson.sandboxUrl} 
              title={`${lesson.title} sandbox`} 
              className="w-full h-[600px] rounded-lg border border-gray-700 bg-gray-700/50 backdrop-blur-sm"
            />
          </section>

          {/* Quiz Section */}
          <section className="bg-gray-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Test Your Knowledge</h2>
            <p className="text-gray-300 mb-6">
              Ready to test what you've learned? Take the quiz to reinforce your understanding.
            </p>
            <button
              onClick={() => navigate(`/lesson/${lesson.id}/quiz`)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              Start Quiz
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LessonDetail; 