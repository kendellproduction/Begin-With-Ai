/**
 * Navigation utilities for handling post-authentication routing
 */

/**
 * Determines where to redirect a user after successful authentication
 * @param {function} navigate - React Router navigate function
 * @param {boolean} replace - Whether to replace the current history entry
 */
export const navigateAfterAuth = (navigate, replace = true) => {
  // Minimal change: after successful authentication, send users to Lessons
  navigate('/lessons', { replace });
};

/**
 * Checks if a user has completed the initial questionnaire
 * @returns {boolean} True if the user has completed the questionnaire
 */
export const hasCompletedQuestionnaire = () => {
  const quizCompleted = localStorage.getItem('quizCompleted');
  const aiAssessmentResults = localStorage.getItem('aiAssessmentResults');
  const activeLearningPath = localStorage.getItem('activeLearningPath');
  
  // Check if quiz is marked as completed
  if (quizCompleted) {
    try {
      const completionState = JSON.parse(quizCompleted);
      if (completionState.completed) return true;
    } catch (e) {
      console.warn('Invalid quizCompleted data in localStorage');
    }
  }
  
  // Check if we have assessment results or active learning path
  return !!(aiAssessmentResults || activeLearningPath);
}; 