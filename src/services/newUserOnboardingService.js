import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * New User Onboarding Service
 * Handles auto-enrollment of new users into the welcome lesson
 */

export class NewUserOnboardingService {
  /**
   * Check if a user is new and needs onboarding
   * @param {string} userId - Firebase user ID
   * @returns {boolean} - True if user needs onboarding
   */
  static async isNewUser(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return true; // Brand new user
      }
      
      const userData = userDoc.data();
      
      // Check if user has completed onboarding or has any lesson progress
      const hasProgress = userData.learningProgress?.totalLessonsCompleted > 0;
      const hasCompletedOnboarding = userData.onboardingCompleted || userData.hasCompletedFirstLesson;
      
      return !hasCompletedOnboarding && !hasProgress;
      
    } catch (error) {
      console.error('Error checking if user is new:', error);
      return true; // Err on the side of showing onboarding
    }
  }
  
  /**
   * Auto-enroll a new user into the welcome lesson
   * @param {string} userId - Firebase user ID
   * @param {object} userAuth - Firebase auth user object
   */
  static async enrollNewUser(userId, userAuth) {
    try {
      // Create/update user document with onboarding data
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      const onboardingData = {
        onboardingStarted: true,
        onboardingStartedAt: new Date(),
        currentOnboardingLesson: 'first-time-welcome',
        isFirstTimeUser: true,
        joinedDate: new Date(),
        lastActivity: new Date(),
        // User profile information
        displayName: userAuth.displayName || userAuth.email?.split('@')[0] || 'New Learner',
        email: userAuth.email,
        photoURL: userAuth.photoURL,
        // Learning path setup
        activeLearningPath: {
          pathId: 'onboarding-path',
          pathTitle: 'Welcome & Onboarding',
          startedAt: new Date(),
          isActive: true,
          nextLessonIndex: 0,
          completedLessons: [],
          currentLessonId: 'first-time-welcome'
        },
        // Progress tracking
        learningProgress: {
          totalLessonsCompleted: 0,
          totalXPEarned: 0,
          currentStreak: 0,
          longestStreak: 0,
          badges: [],
          level: 1
        }
      };
      
      if (userDoc.exists()) {
        // Update existing user with onboarding data
        await updateDoc(userRef, onboardingData);
      } else {
        // Create new user document
        await setDoc(userRef, {
          ...onboardingData,
          createdAt: new Date(),
          uid: userId
        });
      }
      
      // Store onboarding state in localStorage for immediate UI updates
      localStorage.setItem('isFirstTimeUser', 'true');
      localStorage.setItem('shouldShowWelcomeLesson', 'true');
      localStorage.setItem('activeLearningPath', JSON.stringify(onboardingData.activeLearningPath));
      
      return { success: true, lesson: 'first-time-welcome' };
      
    } catch (error) {
      console.error('Error enrolling new user:', error);
      throw error;
    }
  }
  
  /**
   * Mark onboarding as completed
   * @param {string} userId - Firebase user ID
   */
  static async completeOnboarding(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
        hasCompletedFirstLesson: true,
        isFirstTimeUser: false
      });
      
      // Clear localStorage flags
      localStorage.removeItem('isFirstTimeUser');
      localStorage.removeItem('shouldShowWelcomeLesson');
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }
  
  /**
   * Get the appropriate redirect path for a user after login
   * @param {string} userId - Firebase user ID
   * @returns {string} - Path to redirect to
   */
  static async getPostLoginRedirect(userId) {
    try {
      const isNew = await this.isNewUser(userId);
      
      if (isNew) {
        // New user should see updated adaptive quiz
        return '/learning-path/adaptive-quiz';
      } else {
        // Existing user goes to homepage
        return '/home';
      }
      
    } catch (error) {
      console.error('Error determining post-login redirect:', error);
      return '/home'; // Default fallback
    }
  }
  
  /**
   * Check if user should see welcome lesson based on localStorage
   * @returns {boolean}
   */
  static shouldShowWelcomeLesson() {
    return localStorage.getItem('shouldShowWelcomeLesson') === 'true';
  }
  
  /**
   * Check if user is flagged as first time user
   * @returns {boolean}
   */
  static isFirstTimeUserLocal() {
    return localStorage.getItem('isFirstTimeUser') === 'true';
  }
} 