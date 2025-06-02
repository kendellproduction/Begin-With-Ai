import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCvdEGVr6QRX5fFF4ma33RGY6Dnlbbc8c4",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "beginai1.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "beginai1",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "beginai1.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "943264382873",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:943264382873:web:4a0de8c0a84c6f39f2dd08",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-VMDG2D4EY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
auth.useDeviceLanguage();

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