// Learning Path Utilities
export const getLearningPath = () => {
  const pathData = localStorage.getItem('userLearningPath');
  return pathData ? JSON.parse(pathData) : null;
};

export const isLearningPathActive = () => {
  return localStorage.getItem('learningPathActive') === 'true';
};

export const getCurrentLessonProgress = () => {
  const path = getLearningPath();
  if (!path) return null;
  
  return {
    currentIndex: path.nextLessonIndex || 0,
    totalLessons: path.lessons.length,
    completedLessons: path.nextLessonIndex || 0,
    nextLesson: path.lessons[path.nextLessonIndex] || null,
    progressPercentage: Math.round(((path.nextLessonIndex || 0) / path.lessons.length) * 100)
  };
};

export const getNextLessonInPath = () => {
  const path = getLearningPath();
  if (!path || !path.lessons) return null;
  
  const nextIndex = path.nextLessonIndex || 0;
  return nextIndex < path.lessons.length ? path.lessons[nextIndex] : null;
};

export const markLessonComplete = (lessonId) => {
  const path = getLearningPath();
  if (!path || !path.lessons) return false;
  
  // Find the lesson in the path
  const lessonIndex = path.lessons.findIndex(lesson => lesson.id === lessonId);
  
  if (lessonIndex !== -1 && lessonIndex === path.nextLessonIndex) {
    // Mark lesson as complete and move to next
    path.nextLessonIndex = lessonIndex + 1;
    path.completedLessons = path.completedLessons || [];
    path.completedLessons.push(lessonId);
    
    // Update localStorage
    localStorage.setItem('userLearningPath', JSON.stringify(path));
    
    // Check if path is completed
    if (path.nextLessonIndex >= path.lessons.length) {
      localStorage.setItem('learningPathCompleted', 'true');
      return { completed: true, isPathComplete: true };
    }
    
    return { completed: true, isPathComplete: false, nextLesson: path.lessons[path.nextLessonIndex] };
  }
  
  return { completed: false };
};

export const resetLearningPath = () => {
  localStorage.removeItem('userLearningPath');
  localStorage.removeItem('learningPathActive');
  localStorage.removeItem('learningPathCompleted');
};

export const isLessonInUserPath = (lessonId) => {
  const path = getLearningPath();
  if (!path || !path.lessons) return false;
  
  return path.lessons.some(lesson => lesson.id === lessonId);
};

export const getLessonPositionInPath = (lessonId) => {
  const path = getLearningPath();
  if (!path || !path.lessons) return null;
  
  const index = path.lessons.findIndex(lesson => lesson.id === lessonId);
  return index !== -1 ? {
    position: index + 1,
    total: path.lessons.length,
    isNext: index === path.nextLessonIndex,
    isCompleted: index < (path.nextLessonIndex || 0),
    isLocked: index > (path.nextLessonIndex || 0)
  } : null;
}; 