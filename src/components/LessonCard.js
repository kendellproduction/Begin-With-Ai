import React from 'react';
import { useNavigate } from 'react-router-dom';

const LessonCard = ({ lesson }) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[500px] bg-[#1a1a1a] rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30 group transform hover:-translate-y-1 shadow-2xl shadow-black/50 flex flex-col">
      {/* Card Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={lesson.imageUrl}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent" />
      </div>

      {/* Card Content */}
      <div className="relative flex flex-col h-full p-8 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">{lesson.title}</h3>
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
        
        <p className="text-gray-300 mb-8 line-clamp-3 drop-shadow-md text-lg">{lesson.description}</p>

        {/* Start Lesson Button */}
        <div className="mt-auto flex justify-center">
          <button
            onClick={() => navigate(`/lessons/${lesson.id}`)}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/20"
          >
            Start Lesson
          </button>
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
