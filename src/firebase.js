import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCvdEGVr6QRX5fFF4ma33RGY6Dnlbbc8c4",
    authDomain: "beginai1.firebaseapp.com",
    projectId: "beginai1",
    storageBucket: "beginai1.appspot.com",
    messagingSenderId: "943264382873",
    appId: "1:943264382873:web:4a0de8c0a84c6f39f2dd08",
    measurementId: "G-VMDG2D4EY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app.name);

// Initialize Auth
const auth = getAuth(app);
auth.useDeviceLanguage();
console.log('Firebase auth initialized');

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
console.log('Google provider initialized');

// Initialize Analytics
const analytics = getAnalytics(app);
console.log('Firebase analytics initialized');

// Initialize Firestore Database
const db = getFirestore(app);
console.log('Firebase Firestore initialized');

// TEMPORARY - REMOVE AFTER DATA POPULATION
window.db = db;
window.doc = doc;
window.setDoc = setDoc;
console.log("Firebase db, doc, setDoc are now temporarily on the window object for data seeding.");
// END TEMPORARY

export { auth, googleProvider, analytics, db }; 