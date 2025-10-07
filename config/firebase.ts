import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration (Updated to match Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAFUUkb0GvaSjuRC7In26zaG6cx22HgF3E",
  authDomain: "lazio-mobile-app.firebaseapp.com",
  projectId: "lazio-mobile-app",
  storageBucket: "lazio-mobile-app.firebasestorage.app",
  messagingSenderId: "878000534403",
  appId: "1:878000534403:web:2946400d0f3da3b7a37cb6",
  measurementId: "G-P2LC08MRVQ"
};

// Debug: Log configuration
console.log("🔥 Firebase Config:", firebaseConfig);

// Initialize Firebase App
let app;
try {
  if (getApps().length === 0) {
    console.log("🔥 Initializing Firebase app...");
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase app initialized successfully");
  } else {
    console.log("🔥 Using existing Firebase app");
    app = getApp();
  }
} catch (error) {
  console.error("❌ Firebase app initialization failed:", error);
  throw error;
}

// Initialize Firebase Auth
let auth;
try {
  console.log("🔥 Initializing Firebase Auth...");
  auth = getAuth(app);
  console.log("✅ Firebase Auth initialized successfully");
  console.log("🔥 Auth instance:", auth);
} catch (error) {
  console.error("❌ Firebase Auth initialization failed:", error);
  throw error;
}

// Initialize Firestore
let firestore;
try {
  console.log("🔥 Initializing Firestore...");
  firestore = getFirestore(app);
  console.log("✅ Firestore initialized successfully");
} catch (error) {
  console.error("❌ Firestore initialization failed:", error);
  throw error;
}

// Initialize Storage
let storage;
try {
  console.log("🔥 Initializing Storage...");
  storage = getStorage(app);
  console.log("✅ Storage initialized successfully");
} catch (error) {
  console.error("❌ Storage initialization failed:", error);
  throw error;
}

export { auth, firestore, storage };
export default app;
