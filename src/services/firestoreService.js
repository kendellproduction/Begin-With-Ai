import { doc, setDoc, serverTimestamp, getDoc, collection, getDocs, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth'; // Import updateProfile from Firebase Auth
import { db, auth } from '../firebase'; // Adjust path as necessary, ensure auth is exported from firebase.js

/**
 * Creates or updates a user's profile in Firestore and Firebase Auth.
 * This function should be called after a user signs up or logs in, or when profile data is updated.
 * @param {object} userAuth - The user object from Firebase Authentication (userCredential.user or auth.currentUser).
 * @param {object} additionalData - Data to merge into the user profile. Can include displayName, photoURL for Auth, and other fields for Firestore.
 * @returns {Promise<void>} A promise that resolves when the profile is set.
 */
export const upsertUserProfile = async (userAuth, additionalData = {}) => {
  if (!userAuth || !userAuth.uid) {
    console.error('User authentication object or UID is missing.');
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
      console.log('Firebase Auth profile updated successfully.');
    } catch (error) {
      console.error('Error updating Firebase Auth profile:', error);
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
    console.log(`User profile for ${userAuth.uid} upserted to Firestore successfully.`);
  } catch (error) {
    console.error('Error upserting user profile to Firestore:', error);
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
    console.error('UID is required to fetch user profile.');
    return null;
  }
  const userRef = doc(db, 'users', uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log(`User profile data for ${uid} fetched successfully.`);
      return docSnap.data();
    } else {
      console.warn(`No profile document found for user ${uid}. This might be a new user before first upsert completes or an error.`);
      return null; // Or throw an error, or return a default profile structure
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
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
    console.log('Learning paths fetched successfully:', paths);
    return paths;
  } catch (error) {
    console.error('Error fetching learning paths:', error);
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
    console.error('UID is required to delete user Firestore data.');
    throw new Error('UID is required to delete user Firestore data.');
  }
  const userRef = doc(db, 'users', uid);
  try {
    await deleteDoc(userRef);
    console.log(`Firestore data for user ${uid} deleted successfully.`);
    // If you have other collections keyed by UID (e.g., user_lessons, user_activity),
    // you would need to delete those documents here as well. This might involve
    // querying for those documents and deleting them in a batch or individually.
    // For now, this only deletes the main user document.
  } catch (error) {
    console.error(`Error deleting Firestore data for user ${uid}:`, error);
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
    console.error('pathId is required to fetch a learning path.');
    return null;
  }
  const pathRef = doc(db, 'learningPaths', pathId);
  try {
    const docSnap = await getDoc(pathRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    console.warn(`Learning path with ID ${pathId} not found.`);
    return null;
  } catch (error) {
    console.error(`Error fetching learning path ${pathId}:`, error);
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
    console.error('pathId is required to fetch modules.');
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
    console.error(`Error fetching modules for path ${pathId}:`, error);
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
    console.error('pathId and moduleId are required to fetch lessons.');
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
    console.error(`Error fetching lessons for module ${moduleId} in path ${pathId}:`, error);
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
    console.error('pathId, moduleId, and lessonId are required to fetch a lesson.');
    return null;
  }
  const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', lessonId);
  try {
    const docSnap = await getDoc(lessonRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    console.warn(`Lesson with ID ${lessonId} in module ${moduleId}, path ${pathId} not found.`);
    return null;
  } catch (error) {
    console.error(`Error fetching lesson ${lessonId}:`, error);
    throw error;
  }
};

// We can add more functions here to interact with other collections:
// e.g., getLessonsForModule, updateUserProgress, etc. 