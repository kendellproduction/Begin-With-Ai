/**
 * Utility functions for managing code and progress in localStorage
 */

/**
 * Save user code to localStorage
 * @param {string} lessonId - The ID of the lesson
 * @param {string} code - The code to save
 */
export const saveCodeToLocalStorage = (lessonId, code) => {
  try {
    localStorage.setItem(`lesson_${lessonId}_code`, code);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Retrieve user code from localStorage
 * @param {string} lessonId - The ID of the lesson
 * @returns {string|null} - The stored code or null if not found
 */
export const getCodeFromLocalStorage = (lessonId) => {
  try {
    return localStorage.getItem(`lesson_${lessonId}_code`);
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return null;
  }
};

/**
 * Save user progress to localStorage
 * @param {string} userId - The user ID
 * @param {Object} progress - The progress data to save
 */
export const saveProgressToLocalStorage = (userId, progress) => {
  try {
    localStorage.setItem(`user_${userId}_progress`, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
  }
};

/**
 * Retrieve user progress from localStorage
 * @param {string} userId - The user ID
 * @returns {Object|null} - The stored progress or null if not found
 */
export const getProgressFromLocalStorage = (userId) => {
  try {
    const progress = localStorage.getItem(`user_${userId}_progress`);
    return progress ? JSON.parse(progress) : null;
  } catch (error) {
    console.error('Error retrieving progress from localStorage:', error);
    return null;
  }
};

/**
 * Clear all data related to a lesson from localStorage
 * @param {string} lessonId - The ID of the lesson
 */
export const clearLessonData = (lessonId) => {
  try {
    localStorage.removeItem(`lesson_${lessonId}_code`);
  } catch (error) {
    console.error('Error clearing lesson data from localStorage:', error);
  }
}; 