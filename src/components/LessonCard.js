import React from 'react';
import { Link } from 'react-router-dom';

const LessonCard = ({ lesson }) => {
  return (
    <div className="relative h-full bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30 group transform hover:-translate-y-1 shadow-2xl shadow-black/50">
      {/* Card Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={lesson.image}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col h-[calc(100%-16rem)] relative bg-gradient-to-b from-gray-800/95 to-gray-900/95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">{lesson.title}</h3>
          <span className={`px-3 py-1 rounded-2xl text-sm font-medium shadow-lg ${
            lesson.difficulty === 'Beginner' 
              ? 'bg-green-500/20 text-green-400 shadow-green-500/20'
              : lesson.difficulty === 'Intermediate'
              ? 'bg-yellow-500/20 text-yellow-400 shadow-yellow-500/20'
              : 'bg-red-500/20 text-red-400 shadow-red-500/20'
          }`}>
            {lesson.difficulty}
          </span>
        </div>
        <p className="text-gray-400 mb-6 line-clamp-3 flex-grow drop-shadow-md">{lesson.description}</p>
        <Link
          to={`/lessons/${lesson.id}`}
          className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 shadow-lg shadow-indigo-900/50"
        >
          Start Lesson
        </Link>
      </div>

      {/* Ambient Light Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Edge Highlights */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none">
        <div className="absolute inset-0 border border-white/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
      </div>

      {/* Bottom Shadow */}
      <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/20 blur-xl rounded-full" />
    </div>
  );
};

export default LessonCard; 