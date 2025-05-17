import React from 'react';
import LessonCard from './LessonCard';

const LessonCategory = ({ category }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {category.lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default LessonCategory; 