import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCvdEGVr6QRX5fFF4ma33RGY6Dnlbbc8c4",
    authDomain: "beginai1.firebaseapp.com",
    projectId: "beginai1",
    storageBucket: "beginai1.appspot.com",
    messagingSenderId: "943264382873",
    appId: "1:943264382873:web:4a0de8c0a84c6f39f2dd08",
    measurementId: "G-VMDG2D4EY2"
};

// Initialize Firebase for Node.js environment
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized for Node.js:', app.name);

// Initialize Firestore Database only (no analytics for Node.js)
const db = getFirestore(app);
console.log('Firebase Firestore initialized for Node.js');

export { db }; 