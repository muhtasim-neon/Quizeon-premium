
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDwb6_c9kPqPnmV8tn3z2bndEukNOb_HM8",
  authDomain: "quizeon-fe0da.firebaseapp.com",
  projectId: "quizeon-fe0da",
  storageBucket: "quizeon-fe0da.firebasestorage.app",
  messagingSenderId: "1005269341745",
  appId: "1:1005269341745:web:1faa0978eb6d663ef7e710",
  measurementId: "G-Z8T1VC5Y11"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
