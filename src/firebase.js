import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD_WzoInIedpfuzbo-rbKaZ4diXzbGs2Kg",
  authDomain: "cloudsafe-8caa4.firebaseapp.com",
  projectId: "cloudsafe-8caa4",
  storageBucket: "cloudsafe-8caa4.firebasestorage.app",
  messagingSenderId: "195983405840",
  appId: "1:195983405840:web:0d10e32c8b3d43e805eb95",
  measurementId: "G-G07K8K0VZS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// optional
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;