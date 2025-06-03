import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserStats, awardXP, checkAndAwardBadges } from '../services/firestoreService';
import progressService from '../services/progressService';
import { analytics } from '../utils/monitoring';

const GamificationContext = createContext();

export function useGamification() {
  return useContext(GamificationContext);
}

export function GamificationProvider({ children }) {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    xpToNextLevel: 100,
    completedLessons: 0,
    badges: [],
    badgeCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    loading: true,
    error: null
  });
  const [notifications, setNotifications] = useState([]);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadges, setNewBadges] = useState([]);

  // Load user stats when user changes
  useEffect(() => {
    if (user?.uid) {
      loadUserStats();
    } else {
      // Reset to default stats for non-authenticated users
      setUserStats({
        xp: 0,
        level: 1,
        xpToNextLevel: 100,
        completedLessons: 0,
        badges: [],
        badgeCount: 0,
        currentStreak: 0,
        longestStreak: 0,
        loading: false,
        error: null
      });
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user?.uid) return;

    try {
      setUserStats(prev => ({ ...prev, loading: true, error: null }));
      
      const stats = await getUserStats(user.uid);
      
      if (stats) {
        setUserStats({
          ...stats,
          loading: false,
          error: null
        });
      } else {
        // Initialize new user stats
        setUserStats({
          xp: 0,
          level: 1,
          xpToNextLevel: 100,
          completedLessons: 0,
          badges: [],
          badgeCount: 0,
          currentStreak: 0,
          longestStreak: 0,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
      analytics.apiError('gamification_load_error', error.message);
      setUserStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const completeLesson = async (lessonId, completionData = {}) => {
    if (!user?.uid) {
      // For non-authenticated users, just update local state
      setUserStats(prev => ({
        ...prev,
        completedLessons: prev.completedLessons + 1,
        xp: prev.xp + 10
      }));
      return { success: true, local: true };
    }

    try {
      const startTime = performance.now();
      const result = await progressService.completeLesson(user.uid, lessonId, completionData);
      
      if (result.success && result.firestoreUpdate) {
        const { xp, streak, badges } = result.firestoreUpdate;
        
        // Track lesson completion
        analytics.lessonCompleted(
          lessonId, 
          completionData.lessonTitle || 'Unknown Lesson',
          Math.round((performance.now() - startTime) / 1000)
        );
        
        // Update local state
        setUserStats(prev => ({
          ...prev,
          xp: xp.newXP,
          level: xp.newLevel,
          xpToNextLevel: 100 - (xp.newXP % 100),
          completedLessons: prev.completedLessons + 1,
          currentStreak: streak?.currentStreak || prev.currentStreak,
          longestStreak: streak?.longestStreak || prev.longestStreak
        }));

        // Track XP earned
        analytics.xpEarned(xp.xpAwarded, 'lesson_completion');

        // Show level up notification
        if (xp.leveledUp) {
          analytics.levelUp(xp.newLevel);
          showNotification(`🎉 Level Up! You're now level ${xp.newLevel}!`, 'success');
          setShowLevelUpModal(true);
        }

        // Show XP notification
        showNotification(`+${xp.xpAwarded} XP earned!`, 'xp');

        // Show streak notification
        if (streak?.streakIncreased) {
          analytics.streakAchieved(streak.currentStreak);
          showNotification(`🔥 ${streak.currentStreak} day streak!`, 'streak');
        }

        // Show badge notifications
        if (badges && badges.length > 0) {
          setNewBadges(badges);
          setShowBadgeModal(true);
          badges.forEach(badge => {
            const badgeInfo = getBadgeById(badge.id);
            analytics.badgeEarned(badge.id, badgeInfo.name);
            showNotification(`🏆 New badge: ${badgeInfo.name}!`, 'badge');
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Error completing lesson:', error);
      analytics.apiError('lesson_completion_error', error.message);
      showNotification('Error completing lesson. Please try again.', 'error');
      throw error;
    }
  };

  const awardExperiencePoints = async (amount, reason = 'general') => {
    if (!user?.uid) {
      // For non-authenticated users, just update local state
      setUserStats(prev => ({
        ...prev,
        xp: prev.xp + amount
      }));
      return { success: true, local: true };
    }

    try {
      const result = await progressService.awardExperiencePoints(user.uid, amount, reason);
      
      if (result.xp) {
        setUserStats(prev => ({
          ...prev,
          xp: result.xp.newXP,
          level: result.xp.newLevel,
          xpToNextLevel: 100 - (result.xp.newXP % 100)
        }));

        // Track XP earned
        analytics.xpEarned(amount, reason);

        // Show notifications
        showNotification(`+${amount} XP earned!`, 'xp');
        
        if (result.xp.leveledUp) {
          analytics.levelUp(result.xp.newLevel);
          showNotification(`🎉 Level Up! You're now level ${result.xp.newLevel}!`, 'success');
          setShowLevelUpModal(true);
        }

        if (result.badges && result.badges.length > 0) {
          setNewBadges(result.badges);
          setShowBadgeModal(true);
          result.badges.forEach(badge => {
            const badgeInfo = getBadgeById(badge.id);
            analytics.badgeEarned(badge.id, badgeInfo.name);
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Error awarding XP:', error);
      analytics.apiError('xp_award_error', error.message);
      showNotification('Error awarding XP. Please try again.', 'error');
      throw error;
    }
  };

  const showNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const refreshStats = async () => {
    if (user?.uid) {
      await loadUserStats();
    }
  };

  const syncProgress = async () => {
    if (!user?.uid) return;

    try {
      await progressService.syncProgressToFirestore(user.uid);
      await loadUserStats();
      showNotification('Progress synced successfully!', 'success');
    } catch (error) {
      console.error('Error syncing progress:', error);
      showNotification('Error syncing progress. Please try again.', 'error');
    }
  };

  const getBadgeById = (badgeId) => {
    const badgeDefinitions = {
      'first_lesson': {
        id: 'first_lesson',
        name: 'First Steps',
        description: 'Completed your first lesson',
        icon: '🎯',
        color: 'blue'
      },
      'lesson_streak_3': {
        id: 'lesson_streak_3',
        name: 'Consistent Learner',
        description: 'Maintained a 3-day learning streak',
        icon: '🔥',
        color: 'orange'
      },
      'lesson_streak_7': {
        id: 'lesson_streak_7',
        name: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
        icon: '⚡',
        color: 'yellow'
      },
      'xp_100': {
        id: 'xp_100',
        name: 'XP Collector',
        description: 'Earned 100 XP',
        icon: '💎',
        color: 'purple'
      },
      'xp_500': {
        id: 'xp_500',
        name: 'XP Master',
        description: 'Earned 500 XP',
        icon: '👑',
        color: 'gold'
      },
      'lessons_10': {
        id: 'lessons_10',
        name: 'Dedicated Student',
        description: 'Completed 10 lessons',
        icon: '📚',
        color: 'green'
      }
    };

    return badgeDefinitions[badgeId] || {
      id: badgeId,
      name: 'Unknown Badge',
      description: 'Badge description not found',
      icon: '🏆',
      color: 'gray'
    };
  };

  const value = {
    userStats,
    notifications,
    showLevelUpModal,
    showBadgeModal,
    newBadges,
    completeLesson,
    awardExperiencePoints,
    showNotification,
    dismissNotification,
    refreshStats,
    syncProgress,
    getBadgeById,
    setShowLevelUpModal,
    setShowBadgeModal,
    setUserStats
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
} 