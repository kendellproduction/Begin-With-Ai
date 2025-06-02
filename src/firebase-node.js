const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCvdEGVr6QRX5fFF4ma33RGY6Dnlbbc8c4",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "beginai1.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "beginai1",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "beginai1.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "943264382873",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:943264382873:web:4a0de8c0a84c6f39f2dd08",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-VMDG2D4EY2"
};

// Initialize Firebase for Node.js environment
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database only (no analytics for Node.js)
const db = getFirestore(app);

module.exports = { db }; 