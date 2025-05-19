import React from 'react';
import { Link } from 'react-router-dom';

const LessonCard = ({ lesson }) => {
  return (
    <div className="relative h-[500px] bg-[#1a1a1a] rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30 group transform hover:-translate-y-1 shadow-2xl shadow-black/50">
      {/* Card Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={lesson.image}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent" />
      </div>

      {/* Card Content */}
      <div className="relative h-full p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">{lesson.title}</h3>
            <span className={`px-4 py-2 rounded-2xl text-sm font-medium shadow-lg ${
              lesson.difficulty === 'Beginner' 
                ? 'bg-green-500/20 text-green-400 shadow-green-500/20'
                : lesson.difficulty === 'Intermediate'
                ? 'bg-yellow-500/20 text-yellow-400 shadow-yellow-500/20'
                : 'bg-red-500/20 text-red-400 shadow-red-500/20'
            }`}>
              {lesson.difficulty}
            </span>
          </div>
          <p className="text-gray-300 mb-8 line-clamp-3 drop-shadow-md text-lg">{lesson.description}</p>
        </div>

        {/* Start Lesson Button with HomePage-style effects */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <Link
            to={`/lessons/${lesson.id}`}
            className="relative block bg-gray-800/80 backdrop-blur-sm text-white text-lg font-bold px-8 py-4 rounded-3xl border border-gray-700/50 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-700/80 hover:border-indigo-500/50"
          >
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-300">
              Start Lesson
            </span>
          </Link>
        </div>
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