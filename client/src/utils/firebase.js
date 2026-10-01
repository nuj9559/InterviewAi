
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY || "AIzaSyAbyxzvKl5dn47G6WsTg0H1HiHSnj-rt8o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo2-47937.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo2-47937",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo2-47937.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "438587106232",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:438587106232:web:45e556229de8e05bf0254d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export { auth, provider };