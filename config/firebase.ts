import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAFUUkb0GvaSjuRC7In26zaG6cx22HgF3E",
  authDomain: "lazio-mobile-app.firebaseapp.com",
  projectId: "lazio-mobile-app",
  storageBucket: "lazio-mobile-app.appspot.com",
  messagingSenderId: "878000534403",
  appId: "1:878000534403:web:2946400d0f3da3b7a37cb6",
  measurementId: "G-P2LC08MRVQ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
