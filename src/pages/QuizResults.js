import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';

const QuizResults = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <LoggedInNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Quiz Results Coming Soon
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Detailed quiz results and progress tracking for lesson {lessonId} will be available soon.
            This will help you understand your strengths and areas for improvement.
          </p>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 max-w-md mx-auto">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-4">Results & Analytics</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Soon you'll be able to see detailed breakdowns of your quiz performance, 
              track improvement over time, and get personalized recommendations.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/lessons/${lessonId}`)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                Back to Lesson
              </button>
              <button
                onClick={() => navigate('/lessons')}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                Browse All Lessons
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizResults; 