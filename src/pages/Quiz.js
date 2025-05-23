import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';

const Quiz = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <LoggedInNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Quiz Feature Coming Soon
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Interactive quizzes for lesson {lessonId} are currently under development. 
            This feature will help you test and reinforce your learning.
          </p>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 max-w-md mx-auto">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold mb-4">Stay Tuned!</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We're working on an engaging quiz system that will make learning even more interactive and fun.
            </p>
            
            <button
              onClick={() => navigate('/lessons')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz; 