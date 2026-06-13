// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvobcbxLBS5OC6RFN0r-M5Z3C17CpyRwA",
  authDomain: "localinsight-1f187.firebaseapp.com",
  projectId: "localinsight-1f187",
  storageBucket: "localinsight-1f187.firebasestorage.app",
  messagingSenderId: "973857346947",
  appId: "1:973857346947:web:f528e1cd5e766fff5f52b6",
  measurementId: "G-X60FYQ712C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);