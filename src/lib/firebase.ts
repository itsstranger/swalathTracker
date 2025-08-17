// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace this with your actual Firebase config object from the Firebase console
const firebaseConfig = {
  "projectId": "swalath-tracker-phkwt",
  "appId": "1:504782932765:web:50e736fc54cb682e0f2ff4",
  "storageBucket": "swalath-tracker-phkwt.appspot.com",
  "apiKey": "AIzaSyDfFodL8jPI9nlR1l2LCWz5D5lVZmBr8N4",
  "authDomain": "swalath-tracker-phkwt.firebaseapp.com",
  "messagingSenderId": "504782932765",
  "measurementId": "G-81Q1113B00"
};

// Initialize Firebase.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
