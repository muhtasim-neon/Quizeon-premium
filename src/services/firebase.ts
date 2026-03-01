
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDwb6_c9kPqPnmV8tn3z2bndEukNOb_HM8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "quizeon-fe0da.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "quizeon-fe0da",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "quizeon-fe0da.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1005269341745",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1005269341745:web:1faa0978eb6d663ef7e710",
  measurementId: import.meta.env.VITE_MEASUREMENT_ID || "G-Z8T1VC5Y11"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Firebase Analytics failed to initialize:", e);
  }
}
export { analytics };
