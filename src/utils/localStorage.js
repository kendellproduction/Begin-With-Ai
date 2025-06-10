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

/**
 * Save lesson draft to localStorage
 * @param {string} draftId - Unique draft identifier
 * @param {Object} lessonData - The lesson data to save as draft
 * @param {string} pathId - The learning path ID
 * @param {string} moduleId - The module ID
 */
export const saveLessonDraft = (draftId, lessonData, pathId, moduleId) => {
  try {
    const draft = {
      id: draftId,
      lessonData,
      pathId,
      moduleId,
      lastSaved: new Date().toISOString(),
      created: lessonData.created || new Date().toISOString()
    };
    localStorage.setItem(`lesson_draft_${draftId}`, JSON.stringify(draft));
    
    // Update drafts index
    const draftsIndex = getDraftsIndex();
    if (!draftsIndex.find(d => d.id === draftId)) {
      draftsIndex.push({
        id: draftId,
        title: lessonData.title || 'Untitled Lesson',
        pathId,
        moduleId,
        lastSaved: draft.lastSaved,
        created: draft.created
      });
      localStorage.setItem('lesson_drafts_index', JSON.stringify(draftsIndex));
    } else {
      // Update existing draft in index
      const updatedIndex = draftsIndex.map(d => 
        d.id === draftId 
          ? { ...d, title: lessonData.title || 'Untitled Lesson', lastSaved: draft.lastSaved }
          : d
      );
      localStorage.setItem('lesson_drafts_index', JSON.stringify(updatedIndex));
    }
  } catch (error) {
    console.error('Error saving lesson draft:', error);
  }
};

/**
 * Retrieve lesson draft from localStorage
 * @param {string} draftId - The draft ID
 * @returns {Object|null} - The stored draft or null if not found
 */
export const getLessonDraft = (draftId) => {
  try {
    const draft = localStorage.getItem(`lesson_draft_${draftId}`);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('Error retrieving lesson draft:', error);
    return null;
  }
};

/**
 * Get all lesson drafts index
 * @returns {Array} - Array of draft metadata
 */
export const getDraftsIndex = () => {
  try {
    const index = localStorage.getItem('lesson_drafts_index');
    return index ? JSON.parse(index) : [];
  } catch (error) {
    console.error('Error retrieving drafts index:', error);
    return [];
  }
};

/**
 * Delete lesson draft from localStorage
 * @param {string} draftId - The draft ID to delete
 */
export const deleteLessonDraft = (draftId) => {
  try {
    localStorage.removeItem(`lesson_draft_${draftId}`);
    
    // Update drafts index
    const draftsIndex = getDraftsIndex();
    const updatedIndex = draftsIndex.filter(d => d.id !== draftId);
    localStorage.setItem('lesson_drafts_index', JSON.stringify(updatedIndex));
  } catch (error) {
    console.error('Error deleting lesson draft:', error);
  }
};

/**
 * Clear all lesson drafts
 */
export const clearAllLessonDrafts = () => {
  try {
    const draftsIndex = getDraftsIndex();
    draftsIndex.forEach(draft => {
      localStorage.removeItem(`lesson_draft_${draft.id}`);
    });
    localStorage.removeItem('lesson_drafts_index');
  } catch (error) {
    console.error('Error clearing all lesson drafts:', error);
  }
};

/**
 * Generate a unique draft ID
 * @returns {string} - Unique draft identifier
 */
export const generateDraftId = () => {
  return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}; 