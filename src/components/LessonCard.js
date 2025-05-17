import React from 'react';
import { Link } from 'react-router-dom';

const LessonCard = ({ lesson }) => {
  return (
    <Link to={`/lessons/${lesson.id}`} className="group relative">
      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200">
        <img
          src={lesson.imageUrl}
          alt={lesson.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {lesson.isPremium && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Premium
            </span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
          {lesson.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {lesson.description}
        </p>
      </div>
    </Link>
  );
};

export default LessonCard; 