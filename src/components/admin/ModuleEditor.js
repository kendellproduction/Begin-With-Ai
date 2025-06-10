import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const ModuleEditor = ({ module, pathId, onSave }) => {
  const [editedModule, setEditedModule] = useState({
    title: '',
    description: '',
    unlockCriteria: {},
    ...module
  });

  useEffect(() => {
    if (module) {
      setEditedModule({ ...module });
    }
  }, [module]);

  const handleSave = () => {
    onSave(editedModule);
  };

  const moveLessonOrder = (lessonIndex, direction) => {
    if (!editedModule.lessons) return;
    
    const newLessons = [...editedModule.lessons];
    const newIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    
    if (newIndex >= 0 && newIndex < newLessons.length) {
      [newLessons[lessonIndex], newLessons[newIndex]] = [newLessons[newIndex], newLessons[lessonIndex]];
      setEditedModule({ ...editedModule, lessons: newLessons });
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Details */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">Module Details</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={editedModule.title}
              onChange={(e) => setEditedModule({ ...editedModule, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={editedModule.description}
              onChange={(e) => setEditedModule({ ...editedModule, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
            />
          </div>
        </div>
      </div>

      {/* Lesson Order Management */}
      {editedModule.lessons && editedModule.lessons.length > 0 && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-white mb-4">Lesson Order</h4>
          
          <div className="space-y-2">
            {editedModule.lessons.map((lesson, index) => (
              <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                <div>
                  <span className="text-white font-medium">{index + 1}. {lesson.title}</span>
                  <p className="text-gray-400 text-sm">{lesson.lessonType} • {lesson.estimatedTimeMinutes || 15} min</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveLessonOrder(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-white disabled:opacity-50"
                  >
                    <FiArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveLessonOrder(index, 'down')}
                    disabled={index === editedModule.lessons.length - 1}
                    className="text-gray-400 hover:text-white disabled:opacity-50"
                  >
                    <FiArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <FiSave className="mr-2 h-4 w-4" />
          Save Module
        </button>
      </div>
    </div>
  );
};

export default ModuleEditor; 