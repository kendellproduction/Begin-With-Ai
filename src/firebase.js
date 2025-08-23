import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add Firebase Storage import

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
auth.useDeviceLanguage();

// Development-only Firebase configuration validation
if (process.env.NODE_ENV === 'development') {
  // Check if any required fields are missing - only for development debugging
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    // Only log in development - removed console statements for production
  }
}

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Initialize Analytics with proper error handling
let analytics = null;
try {
  // Initialize if we have the required configuration
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  // Silent fail in production, warn in development
  if (process.env.NODE_ENV === 'development') {
    // Analytics initialization failed - removed console statements for production
  }
  analytics = null;
}

// Initialize Firestore Database
const db = getFirestore(app);

// Initialize Firebase Storage
// Normalize storage bucket if misconfigured (e.g., ".firebasestorage.app" -> ".appspot.com")
let storage;
try {
  const rawBucket = firebaseConfig.storageBucket;
  const normalizedBucket = rawBucket && rawBucket.endsWith('.firebasestorage.app')
    ? rawBucket.replace('.firebasestorage.app', '.appspot.com')
    : rawBucket;
  const bucketUrl = normalizedBucket
    ? (normalizedBucket.startsWith('gs://') ? normalizedBucket : `gs://${normalizedBucket}`)
    : undefined;
  storage = bucketUrl ? getStorage(app, bucketUrl) : getStorage(app);
} catch (e) {
  storage = getStorage(app);
}

// Development-only utility exposure for testing
if (process.env.NODE_ENV === 'development') {
  window.db = db;
  window.doc = doc;
  window.setDoc = setDoc;
  window.auth = auth;
  window.firebaseAuth = auth;
  window.storage = storage; // Add storage to development window object
}

export { auth, googleProvider, analytics, db, storage }; // Add storage to exports 