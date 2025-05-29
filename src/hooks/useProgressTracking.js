import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import progressService from '../services/progressService';

/**
 * Custom hook for progress tracking and gamification integration
 */
export const useProgressTracking = () => {
  const { user } = useAuth();
  const { completeLesson: gamificationCompleteLesson, userStats, refreshStats } = useGamification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Complete a lesson with full progress tracking and gamification
   */
  const completeLesson = useCallback(async (lessonId, completionData = {}) => {
    if (!lessonId) {
      throw new Error('Lesson ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      // Use the gamification context's completeLesson method which handles everything
      const result = await gamificationCompleteLesson(lessonId, completionData);
      
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Error completing lesson:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [gamificationCompleteLesson]);

  /**
   * Get progress for a specific lesson
   */
  const getLessonProgress = useCallback(async (lessonId) => {
    if (!lessonId) return null;

    try {
      const progress = await progressService.getLessonProgress(user?.uid, lessonId);
      return progress;
    } catch (err) {
      console.error('Error getting lesson progress:', err);
      return null;
    }
  }, [user?.uid]);

  /**
   * Get progress for a learning path
   */
  const getPathProgress = useCallback(async (pathId) => {
    if (!pathId) return null;

    try {
      const progress = await progressService.getPathProgress(user?.uid, pathId);
      return progress;
    } catch (err) {
      console.error('Error getting path progress:', err);
      return null;
    }
  }, [user?.uid]);

  /**
   * Sync local progress to Firestore
   */
  const syncProgress = useCallback(async () => {
    if (!user?.uid) {
      throw new Error('User must be authenticated to sync progress');
    }

    setLoading(true);
    setError(null);

    try {
      await progressService.syncProgressToFirestore(user.uid);
      await refreshStats(); // Refresh gamification stats
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Error syncing progress:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [user?.uid, refreshStats]);

  /**
   * Award XP for custom actions
   */
  const awardXP = useCallback(async (amount, reason = 'custom_action') => {
    if (!user?.uid) {
      // For non-authenticated users, just return success
      return { success: true, local: true };
    }

    try {
      const result = await progressService.awardExperiencePoints(user.uid, amount, reason);
      await refreshStats(); // Refresh gamification stats
      return result;
    } catch (err) {
      console.error('Error awarding XP:', err);
      throw err;
    }
  }, [user?.uid, refreshStats]);

  /**
   * Get comprehensive user progress
   */
  const getUserProgress = useCallback(async () => {
    try {
      const progress = await progressService.getUserProgress(user?.uid);
      return progress;
    } catch (err) {
      console.error('Error getting user progress:', err);
      return null;
    }
  }, [user?.uid]);

  /**
   * Initialize progress tracking for new users
   */
  const initializeProgress = useCallback(async () => {
    if (!user?.uid) {
      throw new Error('User must be authenticated to initialize progress');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await progressService.initializeUserProgress(user.uid);
      await refreshStats(); // Refresh gamification stats
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Error initializing progress:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [user?.uid, refreshStats]);

  /**
   * Check if a lesson is completed
   */
  const isLessonCompleted = useCallback(async (lessonId) => {
    try {
      const progress = await getLessonProgress(lessonId);
      return progress?.status === 'completed' || progress?.local?.completed || false;
    } catch (err) {
      console.error('Error checking lesson completion:', err);
      return false;
    }
  }, [getLessonProgress]);

  /**
   * Get lesson completion percentage for a path
   */
  const getPathCompletionPercentage = useCallback(async (pathId) => {
    try {
      const progress = await getPathProgress(pathId);
      return progress?.combined?.progressPercentage || 0;
    } catch (err) {
      console.error('Error getting path completion percentage:', err);
      return 0;
    }
  }, [getPathProgress]);

  return {
    // Core functions
    completeLesson,
    getLessonProgress,
    getPathProgress,
    syncProgress,
    awardXP,
    getUserProgress,
    initializeProgress,
    
    // Utility functions
    isLessonCompleted,
    getPathCompletionPercentage,
    
    // State
    loading,
    error,
    userStats,
    isAuthenticated: !!user?.uid,
    
    // Helpers
    clearError: () => setError(null)
  };
};

export default useProgressTracking; 