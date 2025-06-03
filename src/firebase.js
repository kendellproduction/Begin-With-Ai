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
  console.log('Firebase Config:', {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
  });
  
  // Helpful development message
  if (!firebaseConfig.authDomain || firebaseConfig.authDomain.includes('your_')) {
    console.warn('⚠️  Firebase not configured! Please check FIREBASE_SETUP_GUIDE.md');
  }
}

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Firestore Database
const db = getFirestore(app);

// TEMPORARY - REMOVE AFTER DATA POPULATION
// window.db = db;
// window.doc = doc;
// window.setDoc = setDoc;
// console.log("Firebase db, doc, setDoc are now temporarily on the window object for data seeding.");
// END TEMPORARY

export { auth, googleProvider, analytics, db }; 