import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

// Add better error handling for development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Firebase Debug Info:');
  console.log('- API Key:', firebaseConfig.apiKey ? '✅ LOADED' : '❌ MISSING');
  console.log('- Auth Domain:', firebaseConfig.authDomain ? '✅ LOADED' : '❌ MISSING');
  console.log('- Project ID:', firebaseConfig.projectId ? '✅ LOADED' : '❌ MISSING');
  console.log('- Storage Bucket:', firebaseConfig.storageBucket ? '✅ LOADED' : '❌ MISSING');
  console.log('- Messaging Sender ID:', firebaseConfig.messagingSenderId ? '✅ LOADED' : '❌ MISSING');
  console.log('- App ID:', firebaseConfig.appId ? '✅ LOADED' : '❌ MISSING');
  
  // Helpful development message
  if (!firebaseConfig.authDomain || firebaseConfig.authDomain.includes('your_')) {
    console.warn('⚠️  Firebase not configured! Please check FIREBASE_SETUP_GUIDE.md');
  }
  
  // Check if any required fields are missing
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  if (missingFields.length > 0) {
    console.error('🚨 Missing Firebase configuration fields:', missingFields);
  } else {
    console.log('✅ All required Firebase fields are loaded');
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
  // Only initialize analytics if we have the required configuration
  if (firebaseConfig.measurementId && process.env.NODE_ENV === 'production') {
    analytics = getAnalytics(app);
    console.log('✅ Firebase Analytics initialized successfully');
  } else if (process.env.NODE_ENV === 'development') {
    // In development, we can still initialize but with warnings
    if (firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
      console.log('🔧 Firebase Analytics initialized for development');
    } else {
      console.warn('⚠️ Firebase Analytics measurement ID not found - analytics disabled');
    }
  }
} catch (error) {
  console.warn('⚠️ Firebase Analytics initialization failed:', error.message);
  console.warn('Analytics will be disabled but app will continue to work');
  analytics = null;
}

// Initialize Firestore Database
const db = getFirestore(app);

// Production ready - no global window object exposure in production
if (process.env.NODE_ENV === 'development') {
  // Only expose for development/testing purposes
  window.db = db;
  window.doc = doc;
  window.setDoc = setDoc;
  console.log("🔧 Firebase utilities available on window object for development");
}

export { auth, googleProvider, analytics, db }; 