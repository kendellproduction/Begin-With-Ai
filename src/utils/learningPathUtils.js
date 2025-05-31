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

// Test utility to simulate lesson completion (for development/testing)
export const simulateLessonCompletion = (lessonId) => {
  const path = getLearningPath() || createDefaultLearningPath();
  
  // Ensure we have a completedLessons array
  if (!path.completedLessons) {
    path.completedLessons = [];
  }
  
  // Add lesson to completed if not already there
  if (!path.completedLessons.includes(lessonId)) {
    path.completedLessons.push(lessonId);
  }
  
  // Update nextLessonIndex to the highest completed lesson + 1
  const maxCompletedIndex = Math.max(...path.completedLessons.map(id => 
    path.lessons ? path.lessons.findIndex(l => l.id === id) : -1
  ));
  
  if (maxCompletedIndex >= 0) {
    path.nextLessonIndex = maxCompletedIndex + 1;
  }
  
  // Update localStorage
  localStorage.setItem('userLearningPath', JSON.stringify(path));
  
  return path;
};

// Helper to create a default learning path for testing
const createDefaultLearningPath = () => {
  return {
    pathTitle: "AI Prompt Engineering Mastery",
    lessons: [
      { id: 1, title: "AI Basics" },
      { id: 2, title: "Understanding AI" },
      { id: 3, title: "Prompt Engineering" },
      { id: 4, title: "Advanced Prompts" },
      { id: 5, title: "AI Ethics" },
      { id: 6, title: "Real Projects" },
      { id: 7, title: "Industry Apps" },
      { id: 8, title: "AI Trends" },
      { id: 9, title: "Advanced Tools" },
      { id: 10, title: "Mastery" }
    ],
    nextLessonIndex: 0,
    completedLessons: [],
    totalLessons: 10
  };
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