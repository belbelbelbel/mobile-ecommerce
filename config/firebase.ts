// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFUUkb0GvaSjuRC7In26zaG6cx22HgF3E",
  authDomain: "lazio-mobile-app.firebaseapp.com",
  projectId: "lazio-mobile-app",
  storageBucket: "lazio-mobile-app.firebasestorage.app",
  messagingSenderId: "878000534403",
  appId: "1:878000534403:web:2946400d0f3da3b7a37cb6",
  measurementId: "G-P2LC08MRVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;