import { doc, setDoc, serverTimestamp, getDoc, collection, getDocs } from 'firebase/firestore';
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

// We can add more functions here to interact with other collections:
// e.g., getLessonsForModule, updateUserProgress, etc. 