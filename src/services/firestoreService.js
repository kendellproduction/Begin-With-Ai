import { doc, setDoc, serverTimestamp, getDoc, collection, getDocs, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth'; // Import updateProfile from Firebase Auth
import { db, auth } from '../firebase'; // Adjust path as necessary, ensure auth is exported from firebase.js
import logger from '../utils/logger';

/**
 * Creates or updates a user's profile in Firestore and Firebase Auth.
 * This function should be called after a user signs up or logs in, or when profile data is updated.
 * @param {object} userAuth - The user object from Firebase Authentication (userCredential.user or auth.currentUser).
 * @param {object} additionalData - Data to merge into the user profile. Can include displayName, photoURL for Auth, and other fields for Firestore.
 * @returns {Promise<void>} A promise that resolves when the profile is set.
 */
export const upsertUserProfile = async (userAuth, additionalData = {}) => {
  if (!userAuth || !userAuth.uid) {
    logger.error('User authentication object or UID is missing.');
    throw new Error('User authentication object or UID is missing.');
  }

  const userRef = doc(db, 'users', userAuth.uid);
  const currentAuthUser = auth.currentUser; // Get current auth user for updateProfile

  // Prepare data for Firebase Auth update (only if fields are present in additionalData)
  const authUpdateData = {};
  if (additionalData.displayName !== undefined) {
    authUpdateData.displayName = additionalData.displayName;
  }
  if (additionalData.photoURL !== undefined) {
    authUpdateData.photoURL = additionalData.photoURL;
  }

  // Update Firebase Auth profile if there's data to update
  if (currentAuthUser && Object.keys(authUpdateData).length > 0) {
    try {
      await updateProfile(currentAuthUser, authUpdateData);
      logger.info('Firebase Auth profile updated successfully.');
    } catch (error) {
      logger.error('Error updating Firebase Auth profile:', error);
      // Decide if you want to throw or just log. For now, logging.
    }
  }

  // Prepare data for Firestore, excluding fields already handled by Auth if they were the only ones passed
  // Or, if you want to store displayName/photoURL in Firestore as well, include them.
  // For simplicity, let's ensure they are stored in Firestore too for easier access.
  const firestoreData = {
    uid: userAuth.uid,
    email: userAuth.email, // Email usually doesn't change this way, but good to have
    displayName: additionalData.displayName !== undefined ? additionalData.displayName : userAuth.displayName,
    photoURL: additionalData.photoURL !== undefined ? additionalData.photoURL : userAuth.photoURL,
    lastLoginAt: serverTimestamp(), // Always update last login on any upsert that might follow a login
  };

  // Initialize fields only if the document doesn't exist
  const docSnap = await getDoc(userRef);
  let initialFields = {};
  if (!docSnap.exists()) {
    initialFields = {
      createdAt: serverTimestamp(),
      xp: 0,
      streaks: {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null
      },
      badges: [],
      currentLearningPathId: null,
      currentLessonModuleId: null,
      currentLessonId: null,
      subscriptionTier: 'free',
      subscriptionValidUntil: null,
      stripeCustomerId: null,
      role: 'user',
      preferences: {
        theme: 'system',
        notifications: true
      },
      // Initialize other custom fields from additionalData if it's the first time
      bio: additionalData.bio || '',
      location: additionalData.location || '',
      website: additionalData.website || '',
      twitter: additionalData.twitter || '',
      linkedin: additionalData.linkedin || ''
    };
  }

  // Merge all data: base Firestore data, initial fields (if new), and the rest of additionalData
  const finalFirestoreData = {
    ...firestoreData,
    ...initialFields,
    ...additionalData, // This will overwrite initialFields if provided, and also firestoreData for displayName/photoURL if they were in additionalData
  };

  try {
    await setDoc(userRef, finalFirestoreData, { merge: true });
    logger.info(`User profile for ${userAuth.uid} upserted to Firestore successfully.`);
  } catch (error) {
    logger.error('Error upserting user profile to Firestore:', error);
    throw error;
  }
};

/**
 * Fetches a user's profile document from Firestore.
 * @param {string} uid - The user's UID.
 * @returns {Promise<object|null>} A promise that resolves with the user data object if found, or null otherwise.
 */
export const getUserProfile = async (uid) => {
  if (!uid) {
    logger.error('UID is required to fetch user profile.');
    return null;
  }
  const userRef = doc(db, 'users', uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      logger.info(`User profile data for ${uid} fetched successfully.`);
      return docSnap.data();
    } else {
      logger.warn(`No profile document found for user ${uid}. This might be a new user before first upsert completes or an error.`);
      return null; // Or throw an error, or return a default profile structure
    }
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    throw error; // Re-throw for further handling
  }
};

/**
 * Fetches all learning paths from Firestore.
 * Assumes paths are ordered by a field like 'order' or 'createdAt' if specific ordering is needed.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of learning path objects.
 */
export const getLearningPaths = async () => {
  const pathsCollectionRef = collection(db, 'learningPaths');
  // Example: Order by a field if you add one, e.g., orderBy('title') or orderBy('createdAt')
  // const q = query(pathsCollectionRef, orderBy('title')); 
  try {
    const querySnapshot = await getDocs(pathsCollectionRef); // Or getDocs(q) if using a query
    const paths = [];
    querySnapshot.forEach((doc) => {
      paths.push({ id: doc.id, ...doc.data() });
    });
    logger.info('Learning paths fetched successfully:', paths);
    return paths;
  } catch (error) {
    logger.error('Error fetching learning paths:', error);
    throw error;
  }
};

/**
 * Deletes a user's profile document from Firestore.
 * @param {string} uid - The user's UID.
 * @returns {Promise<void>} A promise that resolves when the user's Firestore data is deleted.
 */
export const deleteUserFirestoreData = async (uid) => {
  if (!uid) {
    logger.error('UID is required to delete user Firestore data.');
    throw new Error('UID is required to delete user Firestore data.');
  }
  const userRef = doc(db, 'users', uid);
  try {
    await deleteDoc(userRef);
    logger.info(`Firestore data for user ${uid} deleted successfully.`);
    // If you have other collections keyed by UID (e.g., user_lessons, user_activity),
    // you would need to delete those documents here as well. This might involve
    // querying for those documents and deleting them in a batch or individually.
    // For now, this only deletes the main user document.
  } catch (error) {
    logger.error(`Error deleting Firestore data for user ${uid}:`, error);
    throw error; // Re-throw for further handling
  }
};

/**
 * Fetches a specific learning path by its ID.
 * @param {string} pathId - The ID of the learning path.
 * @returns {Promise<object|null>} Learning path data or null if not found.
 */
export const getLearningPathById = async (pathId) => {
  if (!pathId) {
    logger.error('pathId is required to fetch a learning path.');
    return null;
  }
  const pathRef = doc(db, 'learningPaths', pathId);
  try {
    const docSnap = await getDoc(pathRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    logger.warn(`Learning path with ID ${pathId} not found.`);
    return null;
  } catch (error) {
    logger.error(`Error fetching learning path ${pathId}:`, error);
    throw error;
  }
};

/**
 * Fetches all modules for a specific learning path, ordered by 'order' field.
 * @param {string} pathId - The ID of the learning path.
 * @returns {Promise<Array<object>>} Array of module objects.
 */
export const getModulesForPath = async (pathId) => {
  if (!pathId) {
    logger.error('pathId is required to fetch modules.');
    return [];
  }
  const modulesCollectionRef = collection(db, 'learningPaths', pathId, 'modules');
  const q = query(modulesCollectionRef, orderBy('order', 'asc')); // Assuming an 'order' field
  try {
    const querySnapshot = await getDocs(q);
    const modules = [];
    querySnapshot.forEach((doc) => {
      modules.push({ id: doc.id, ...doc.data() });
    });
    return modules;
  } catch (error) {
    logger.error(`Error fetching modules for path ${pathId}:`, error);
    throw error;
  }
};

/**
 * Fetches all lessons for a specific module within a learning path, ordered by 'order' field.
 * @param {string} pathId - The ID of the learning path.
 * @param {string} moduleId - The ID of the module.
 * @returns {Promise<Array<object>>} Array of lesson objects.
 */
export const getLessonsForModule = async (pathId, moduleId) => {
  if (!pathId || !moduleId) {
    logger.error('pathId and moduleId are required to fetch lessons.');
    return [];
  }
  const lessonsCollectionRef = collection(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons');
  const q = query(lessonsCollectionRef, orderBy('order', 'asc')); // Assuming an 'order' field
  try {
    const querySnapshot = await getDocs(q);
    const lessons = [];
    querySnapshot.forEach((doc) => {
      lessons.push({ id: doc.id, ...doc.data() });
    });
    return lessons;
  } catch (error) {
    logger.error(`Error fetching lessons for module ${moduleId} in path ${pathId}:`, error);
    throw error;
  }
};

/**
 * Fetches a specific lesson by its IDs.
 * @param {string} pathId - The ID of the learning path.
 * @param {string} moduleId - The ID of the module.
 * @param {string} lessonId - The ID of the lesson.
 * @returns {Promise<object|null>} Lesson data or null if not found.
 */
export const getLessonById = async (pathId, moduleId, lessonId) => {
  if (!pathId || !moduleId || !lessonId) {
    logger.error('pathId, moduleId, and lessonId are required to fetch a lesson.');
    return null;
  }
  const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', lessonId);
  try {
    const docSnap = await getDoc(lessonRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    logger.warn(`Lesson with ID ${lessonId} in module ${moduleId}, path ${pathId} not found.`);
    return null;
  } catch (error) {
    logger.error(`Error fetching lesson ${lessonId}:`, error);
    throw error;
  }
};

// We can add more functions here to interact with other collections:
// e.g., getLessonsForModule, updateUserProgress, etc. 

/**
 * Records or updates user progress for a specific lesson.
 * @param {string} userId - The user's UID.
 * @param {string} lessonId - The lesson ID.
 * @param {string} lessonModuleId - The module ID.
 * @param {string} learningPathId - The learning path ID.
 * @param {object} progressData - Progress data including status, score, userInputs, etc.
 * @returns {Promise<void>}
 */
export const updateUserProgress = async (userId, lessonId, lessonModuleId, learningPathId, progressData) => {
  if (!userId || !lessonId) {
    logger.error('userId and lessonId are required to update progress.');
    throw new Error('userId and lessonId are required to update progress.');
  }

  const progressRef = doc(db, 'userProgress', `${userId}_${lessonId}`);
  
  const progressDoc = {
    userId,
    lessonId,
    lessonModuleId,
    learningPathId,
    status: progressData.status || 'in_progress',
    score: progressData.score || null,
    userInputs: progressData.userInputs || [],
    notes: progressData.notes || '',
    updatedAt: serverTimestamp(),
    ...progressData
  };

  // If completing a lesson, set completedAt timestamp
  if (progressData.status === 'completed') {
    progressDoc.completedAt = serverTimestamp();
  }

  try {
    await setDoc(progressRef, progressDoc, { merge: true });
    logger.info(`Progress updated for user ${userId}, lesson ${lessonId}`);
  } catch (error) {
    logger.error('Error updating user progress:', error);
    throw error;
  }
};

/**
 * Fetches user progress for a specific lesson.
 * @param {string} userId - The user's UID.
 * @param {string} lessonId - The lesson ID.
 * @returns {Promise<object|null>} Progress data or null if not found.
 */
export const getUserProgressForLesson = async (userId, lessonId) => {
  if (!userId || !lessonId) {
    logger.error('userId and lessonId are required to fetch progress.');
    return null;
  }

  const progressRef = doc(db, 'userProgress', `${userId}_${lessonId}`);
  
  try {
    const docSnap = await getDoc(progressRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    logger.error(`Error fetching progress for lesson ${lessonId}:`, error);
    throw error;
  }
};

/**
 * Fetches all user progress for a specific learning path.
 * @param {string} userId - The user's UID.
 * @param {string} learningPathId - The learning path ID.
 * @returns {Promise<Array<object>>} Array of progress objects.
 */
export const getUserProgressForPath = async (userId, learningPathId) => {
  if (!userId || !learningPathId) {
    logger.error('userId and learningPathId are required to fetch path progress.');
    return [];
  }

  const progressCollectionRef = collection(db, 'userProgress');
  const q = query(
    progressCollectionRef, 
    where('userId', '==', userId),
    where('learningPathId', '==', learningPathId)
  );

  try {
    const querySnapshot = await getDocs(q);
    const progressList = [];
    querySnapshot.forEach((doc) => {
      progressList.push({ id: doc.id, ...doc.data() });
    });
    return progressList;
  } catch (error) {
    logger.error(`Error fetching path progress for ${learningPathId}:`, error);
    throw error;
  }
};

/**
 * Awards XP to a user and updates their profile.
 * @param {string} userId - The user's UID.
 * @param {number} xpAmount - Amount of XP to award.
 * @param {string} reason - Reason for XP award (e.g., 'lesson_completion').
 * @returns {Promise<object>} Updated user stats including new level if applicable.
 */
export const awardXP = async (userId, xpAmount, reason = 'lesson_completion') => {
  if (!userId || !xpAmount) {
    logger.error('userId and xpAmount are required to award XP.');
    throw new Error('userId and xpAmount are required to award XP.');
  }

  const userRef = doc(db, 'users', userId);
  
  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error(`User ${userId} not found.`);
    }

    const userData = userDoc.data();
    const currentXP = userData.xp || 0;
    const newXP = currentXP + xpAmount;
    
    // Calculate level based on XP (100 XP per level for simplicity)
    const newLevel = Math.floor(newXP / 100) + 1;
    const currentLevel = Math.floor(currentXP / 100) + 1;
    const leveledUp = newLevel > currentLevel;

    // Update user profile
    await setDoc(userRef, {
      xp: newXP,
      level: newLevel,
      lastXPAward: {
        amount: xpAmount,
        reason,
        timestamp: serverTimestamp()
      }
    }, { merge: true });

    logger.info(`Awarded ${xpAmount} XP to user ${userId}. New total: ${newXP}`);

    return {
      newXP,
      newLevel,
      leveledUp,
      xpAwarded: xpAmount
    };
  } catch (error) {
    logger.error('Error awarding XP:', error);
    throw error;
  }
};

/**
 * Updates user's streak information.
 * @param {string} userId - The user's UID.
 * @returns {Promise<object>} Updated streak information.
 */
export const updateUserStreak = async (userId) => {
  if (!userId) {
    logger.error('userId is required to update streak.');
    throw new Error('userId is required to update streak.');
  }

  const userRef = doc(db, 'users', userId);
  
  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error(`User ${userId} not found.`);
    }

    const userData = userDoc.data();
    const streaks = userData.streaks || { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
    
    const today = new Date().toDateString();
    const lastActivity = streaks.lastActivityDate ? new Date(streaks.lastActivityDate.toDate()).toDateString() : null;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    let newCurrentStreak = streaks.currentStreak;
    
    if (lastActivity === today) {
      // Already counted today, no change
      return streaks;
    } else if (lastActivity === yesterday) {
      // Consecutive day, increment streak
      newCurrentStreak = streaks.currentStreak + 1;
    } else {
      // Streak broken or first activity, reset to 1
      newCurrentStreak = 1;
    }

    const newLongestStreak = Math.max(streaks.longestStreak, newCurrentStreak);
    
    const updatedStreaks = {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: serverTimestamp()
    };

    await setDoc(userRef, { streaks: updatedStreaks }, { merge: true });
    
    logger.info(`Updated streak for user ${userId}: ${newCurrentStreak} days`);
    
    return {
      ...updatedStreaks,
      streakIncreased: newCurrentStreak > streaks.currentStreak
    };
  } catch (error) {
    logger.error('Error updating user streak:', error);
    throw error;
  }
};

/**
 * Checks and awards badges to a user based on their progress.
 * @param {string} userId - The user's UID.
 * @returns {Promise<Array<object>>} Array of newly awarded badges.
 */
export const checkAndAwardBadges = async (userId) => {
  if (!userId) {
    logger.error('userId is required to check badges.');
    return [];
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error(`User ${userId} not found.`);
    }

    const userData = userDoc.data();
    const currentBadges = userData.badges || [];
    const newBadges = [];

    // Define badge criteria
    const badgeCriteria = [
      {
        id: 'first_lesson',
        name: 'First Steps',
        description: 'Completed your first lesson',
        check: async () => {
          const progressQuery = query(
            collection(db, 'userProgress'),
            where('userId', '==', userId),
            where('status', '==', 'completed')
          );
          const snapshot = await getDocs(progressQuery);
          return snapshot.size >= 1;
        }
      },
      {
        id: 'lesson_streak_3',
        name: 'Consistent Learner',
        description: 'Maintained a 3-day learning streak',
        check: () => (userData.streaks?.currentStreak || 0) >= 3
      },
      {
        id: 'lesson_streak_7',
        name: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
        check: () => (userData.streaks?.currentStreak || 0) >= 7
      },
      {
        id: 'xp_100',
        name: 'XP Collector',
        description: 'Earned 100 XP',
        check: () => (userData.xp || 0) >= 100
      },
      {
        id: 'xp_500',
        name: 'XP Master',
        description: 'Earned 500 XP',
        check: () => (userData.xp || 0) >= 500
      },
      {
        id: 'lessons_10',
        name: 'Dedicated Student',
        description: 'Completed 10 lessons',
        check: async () => {
          const progressQuery = query(
            collection(db, 'userProgress'),
            where('userId', '==', userId),
            where('status', '==', 'completed')
          );
          const snapshot = await getDocs(progressQuery);
          return snapshot.size >= 10;
        }
      }
    ];

    // Check each badge
    for (const badge of badgeCriteria) {
      if (!currentBadges.includes(badge.id)) {
        const earned = typeof badge.check === 'function' ? await badge.check() : badge.check;
        if (earned) {
          newBadges.push(badge);
          currentBadges.push(badge.id);
        }
      }
    }

    // Update user badges if any new ones were earned
    if (newBadges.length > 0) {
      await setDoc(doc(db, 'users', userId), { badges: currentBadges }, { merge: true });
      logger.info(`Awarded ${newBadges.length} new badges to user ${userId}`);
    }

    return newBadges;
  } catch (error) {
    logger.error('Error checking and awarding badges:', error);
    throw error;
  }
};

/**
 * Completes a lesson for a user, updating progress, awarding XP, updating streaks, and checking badges.
 * @param {string} userId - The user's UID.
 * @param {string} lessonId - The lesson ID.
 * @param {string} lessonModuleId - The module ID.
 * @param {string} learningPathId - The learning path ID.
 * @param {object} completionData - Additional completion data (score, userInputs, etc.).
 * @returns {Promise<object>} Completion results including XP, level changes, badges, etc.
 */
export const completeLesson = async (userId, lessonId, lessonModuleId, learningPathId, completionData = {}) => {
  if (!userId || !lessonId) {
    logger.error('userId and lessonId are required to complete lesson.');
    throw new Error('userId and lessonId are required to complete lesson.');
  }

  try {
    // 1. Update lesson progress
    await updateUserProgress(userId, lessonId, lessonModuleId, learningPathId, {
      status: 'completed',
      score: completionData.score || 100,
      userInputs: completionData.userInputs || [],
      notes: completionData.notes || ''
    });

    // 2. Award XP (default 10 XP per lesson, can be customized)
    const xpAmount = completionData.xpAward || 10;
    const xpResult = await awardXP(userId, xpAmount, 'lesson_completion');

    // 3. Update streak
    const streakResult = await updateUserStreak(userId);

    // 4. Check and award badges
    const newBadges = await checkAndAwardBadges(userId);

    // 5. Update user's current lesson tracking
    await setDoc(doc(db, 'users', userId), {
      currentLessonId: lessonId,
      currentLessonModuleId: lessonModuleId,
      currentLearningPathId: learningPathId,
      lastActivityAt: serverTimestamp()
    }, { merge: true });

    logger.info(`Lesson ${lessonId} completed for user ${userId}`);

    return {
      lessonCompleted: true,
      xp: xpResult,
      streak: streakResult,
      badges: newBadges,
      completedAt: new Date()
    };
  } catch (error) {
    logger.error('Error completing lesson:', error);
    throw error;
  }
};

/**
 * Gets comprehensive user statistics including progress, XP, streaks, and badges.
 * @param {string} userId - The user's UID.
 * @returns {Promise<object>} User statistics object.
 */
export const getUserStats = async (userId) => {
  if (!userId) {
    logger.error('userId is required to get user stats.');
    return null;
  }

  try {
    // Get user profile
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error(`User ${userId} not found.`);
    }

    const userData = userDoc.data();

    // Get completed lessons count
    const progressQuery = query(
      collection(db, 'userProgress'),
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );
    const progressSnapshot = await getDocs(progressQuery);
    const completedLessons = progressSnapshot.size;

    // Calculate level and XP to next level
    const currentXP = userData.xp || 0;
    const currentLevel = Math.floor(currentXP / 100) + 1;
    const xpToNextLevel = 100 - (currentXP % 100);

    return {
      userId,
      xp: currentXP,
      level: currentLevel,
      xpToNextLevel,
      completedLessons,
      badges: userData.badges || [],
      badgeCount: (userData.badges || []).length,
      streaks: userData.streaks || { currentStreak: 0, longestStreak: 0 },
      currentStreak: userData.streaks?.currentStreak || 0,
      longestStreak: userData.streaks?.longestStreak || 0,
      currentLearningPathId: userData.currentLearningPathId,
      currentLessonModuleId: userData.currentLessonModuleId,
      currentLessonId: userData.currentLessonId,
      lastActivityAt: userData.lastActivityAt,
      createdAt: userData.createdAt
    };
  } catch (error) {
    logger.error('Error getting user stats:', error);
    throw error;
  }
};

/**
 * Syncs localStorage progress data to Firestore for a user.
 * @param {string} userId - The user's UID.
 * @returns {Promise<void>}
 */
export const syncLocalProgressToFirestore = async (userId) => {
  if (!userId) {
    logger.error('userId is required to sync progress.');
    return;
  }

  try {
    // Get learning path from localStorage
    const localPath = localStorage.getItem('userLearningPath');
    if (!localPath) {
      logger.info('No local learning path found to sync.');
      return;
    }

    const pathData = JSON.parse(localPath);
    const completedLessons = pathData.completedLessons || [];

    // Sync each completed lesson
    for (const lessonId of completedLessons) {
      const lesson = pathData.lessons?.find(l => l.id === lessonId);
      if (lesson) {
        await updateUserProgress(userId, lessonId, null, null, {
          status: 'completed',
          score: 100,
          syncedFromLocal: true
        });
      }
    }

    // Update user's current position
    if (pathData.nextLessonIndex !== undefined && pathData.lessons) {
      const currentLesson = pathData.lessons[pathData.nextLessonIndex];
      if (currentLesson) {
        await setDoc(doc(db, 'users', userId), {
          currentLessonId: currentLesson.id,
          currentLearningPathId: pathData.pathId || 'local_path'
        }, { merge: true });
      }
    }

    logger.info(`Synced ${completedLessons.length} lessons from localStorage to Firestore`);
  } catch (error) {
    logger.error('Error syncing local progress to Firestore:', error);
    throw error;
  }
}; 

/**
 * Searches for a lesson by ID across all learning paths and modules
 * This is useful for lesson viewers to find lessons published through the admin panel
 * @param {string} lessonId - The ID of the lesson to find
 * @returns {Promise<object|null>} Lesson data with path and module info, or null if not found
 */
export const findLessonAcrossAllPaths = async (lessonId) => {
  if (!lessonId) {
    logger.error('lessonId is required to search for a lesson.');
    return null;
  }

  try {
    // Get all learning paths
    const pathsRef = collection(db, 'learningPaths');
    const pathsSnapshot = await getDocs(pathsRef);

    for (const pathDoc of pathsSnapshot.docs) {
      const pathId = pathDoc.id;
      
      // Get all modules in this path
      const modulesRef = collection(db, 'learningPaths', pathId, 'modules');
      const modulesSnapshot = await getDocs(modulesRef);

      for (const moduleDoc of modulesSnapshot.docs) {
        const moduleId = moduleDoc.id;
        
        // Search for the lesson in this module
        const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', lessonId);
        const lessonDoc = await getDoc(lessonRef);
        
        if (lessonDoc.exists()) {
          const lessonData = lessonDoc.data();
          logger.info(`Found lesson ${lessonId} in path ${pathId}, module ${moduleId}`);
          
          return {
            id: lessonDoc.id,
            pathId,
            moduleId,
            pathTitle: pathDoc.data().title,
            moduleTitle: moduleDoc.data().title,
            ...lessonData
          };
        }
      }
    }

    logger.warn(`Lesson ${lessonId} not found in any learning path`);
    return null;

  } catch (error) {
    logger.error(`Error searching for lesson ${lessonId}:`, error);
    throw error;
  }
}; 