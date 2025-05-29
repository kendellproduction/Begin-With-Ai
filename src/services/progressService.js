import { 
  completeLesson as firestoreCompleteLesson,
  getUserStats,
  getUserProgressForLesson,
  getUserProgressForPath,
  syncLocalProgressToFirestore,
  awardXP,
  updateUserStreak,
  checkAndAwardBadges
} from './firestoreService';
import { 
  markLessonComplete as localMarkLessonComplete,
  getCurrentLessonProgress,
  getLearningPath,
  isLearningPathActive
} from '../utils/learningPathUtils';

/**
 * Comprehensive lesson completion that handles both local and Firestore updates
 * @param {string} userId - The user's UID
 * @param {string} lessonId - The lesson ID
 * @param {object} completionData - Additional completion data
 * @returns {Promise<object>} Completion results
 */
export const completeLesson = async (userId, lessonId, completionData = {}) => {
  try {
    let result = { success: false };

    // 1. Update local storage first (for immediate UI feedback)
    if (isLearningPathActive()) {
      const localResult = localMarkLessonComplete(lessonId);
      result.localUpdate = localResult;
    }

    // 2. Update Firestore if user is authenticated
    if (userId) {
      const firestoreResult = await firestoreCompleteLesson(
        userId, 
        lessonId, 
        completionData.moduleId || null,
        completionData.pathId || null,
        completionData
      );
      result.firestoreUpdate = firestoreResult;
      result.success = true;
    }

    return result;
  } catch (error) {
    console.error('Error in completeLesson:', error);
    throw error;
  }
};

/**
 * Gets user progress combining local and Firestore data
 * @param {string} userId - The user's UID (optional)
 * @returns {Promise<object>} Combined progress data
 */
export const getUserProgress = async (userId = null) => {
  try {
    let progress = {
      local: null,
      firestore: null,
      combined: null
    };

    // Get local progress
    if (isLearningPathActive()) {
      progress.local = getCurrentLessonProgress();
    }

    // Get Firestore progress if user is authenticated
    if (userId) {
      progress.firestore = await getUserStats(userId);
    }

    // Combine the data, prioritizing Firestore when available
    progress.combined = {
      ...progress.local,
      ...progress.firestore,
      hasLocalData: !!progress.local,
      hasFirestoreData: !!progress.firestore
    };

    return progress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

/**
 * Syncs all local progress to Firestore
 * @param {string} userId - The user's UID
 * @returns {Promise<object>} Sync results
 */
export const syncProgressToFirestore = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required for syncing progress');
  }

  try {
    await syncLocalProgressToFirestore(userId);
    
    // Get updated stats after sync
    const updatedStats = await getUserStats(userId);
    
    return {
      success: true,
      syncedAt: new Date(),
      updatedStats
    };
  } catch (error) {
    console.error('Error syncing progress to Firestore:', error);
    throw error;
  }
};

/**
 * Awards XP and handles all related updates (level, badges, streaks)
 * @param {string} userId - The user's UID
 * @param {number} xpAmount - Amount of XP to award
 * @param {string} reason - Reason for XP award
 * @returns {Promise<object>} Award results
 */
export const awardExperiencePoints = async (userId, xpAmount, reason = 'general') => {
  if (!userId) {
    throw new Error('User ID is required for awarding XP');
  }

  try {
    // Award XP
    const xpResult = await awardXP(userId, xpAmount, reason);
    
    // Update streak if it's a lesson completion
    let streakResult = null;
    if (reason === 'lesson_completion') {
      streakResult = await updateUserStreak(userId);
    }
    
    // Check for new badges
    const newBadges = await checkAndAwardBadges(userId);
    
    return {
      xp: xpResult,
      streak: streakResult,
      badges: newBadges,
      awardedAt: new Date()
    };
  } catch (error) {
    console.error('Error awarding experience points:', error);
    throw error;
  }
};

/**
 * Gets lesson progress for a specific lesson
 * @param {string} userId - The user's UID
 * @param {string} lessonId - The lesson ID
 * @returns {Promise<object>} Lesson progress data
 */
export const getLessonProgress = async (userId, lessonId) => {
  try {
    let progress = {
      firestore: null,
      local: null,
      status: 'not_started'
    };

    // Check Firestore progress
    if (userId) {
      progress.firestore = await getUserProgressForLesson(userId, lessonId);
      if (progress.firestore) {
        progress.status = progress.firestore.status;
      }
    }

    // Check local progress
    const localPath = getLearningPath();
    if (localPath && localPath.completedLessons) {
      progress.local = {
        completed: localPath.completedLessons.includes(lessonId),
        isCurrent: localPath.lessons && localPath.lessons[localPath.nextLessonIndex]?.id === lessonId
      };
      
      if (progress.local.completed) {
        progress.status = 'completed';
      } else if (progress.local.isCurrent) {
        progress.status = 'in_progress';
      }
    }

    return progress;
  } catch (error) {
    console.error('Error getting lesson progress:', error);
    throw error;
  }
};

/**
 * Gets learning path progress
 * @param {string} userId - The user's UID
 * @param {string} pathId - The learning path ID
 * @returns {Promise<object>} Path progress data
 */
export const getPathProgress = async (userId, pathId) => {
  try {
    let progress = {
      firestore: null,
      local: null,
      combined: null
    };

    // Get Firestore progress
    if (userId && pathId) {
      progress.firestore = await getUserProgressForPath(userId, pathId);
    }

    // Get local progress
    if (isLearningPathActive()) {
      progress.local = getCurrentLessonProgress();
    }

    // Combine progress data
    if (progress.firestore && progress.firestore.length > 0) {
      const completedCount = progress.firestore.filter(p => p.status === 'completed').length;
      const totalLessons = progress.firestore.length;
      
      progress.combined = {
        completedLessons: completedCount,
        totalLessons,
        progressPercentage: Math.round((completedCount / totalLessons) * 100),
        source: 'firestore'
      };
    } else if (progress.local) {
      progress.combined = {
        ...progress.local,
        source: 'local'
      };
    }

    return progress;
  } catch (error) {
    console.error('Error getting path progress:', error);
    throw error;
  }
};

/**
 * Initializes progress tracking for a new user
 * @param {string} userId - The user's UID
 * @returns {Promise<object>} Initialization results
 */
export const initializeUserProgress = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required for initializing progress');
  }

  try {
    // Sync any existing local progress
    await syncProgressToFirestore(userId);
    
    // Get initial stats
    const stats = await getUserStats(userId);
    
    return {
      initialized: true,
      stats,
      initializedAt: new Date()
    };
  } catch (error) {
    console.error('Error initializing user progress:', error);
    throw error;
  }
};

/**
 * Resets user progress (for testing or user request)
 * @param {string} userId - The user's UID
 * @returns {Promise<object>} Reset results
 */
export const resetUserProgress = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required for resetting progress');
  }

  try {
    // Clear local storage
    localStorage.removeItem('userLearningPath');
    localStorage.removeItem('learningPathCompleted');
    localStorage.removeItem('learningPathActive');
    
    // Note: For Firestore reset, you'd need to implement deletion functions
    // This is a placeholder for now
    console.log(`Progress reset requested for user ${userId}`);
    
    return {
      reset: true,
      resetAt: new Date(),
      message: 'Local progress cleared. Firestore reset requires additional implementation.'
    };
  } catch (error) {
    console.error('Error resetting user progress:', error);
    throw error;
  }
};

export default {
  completeLesson,
  getUserProgress,
  syncProgressToFirestore,
  awardExperiencePoints,
  getLessonProgress,
  getPathProgress,
  initializeUserProgress,
  resetUserProgress
}; 