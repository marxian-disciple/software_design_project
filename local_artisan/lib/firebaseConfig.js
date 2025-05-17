// Firebase NPM imports (use these in local dev + tests)
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { isSupported, getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  databaseURL: "https://software-design-project-574a6-default-rtdb.firebaseio.com",
  projectId: "software-design-project-574a6",
  storageBucket: "software-design-project-574a6.firebasestorage.app",
  messagingSenderId: "831318427358",
  appId: "1:831318427358:web:82ee155cadb5f61e44644f",
  measurementId: "G-8JCE62JJJJ"
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Auth Provider
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

// Only initialize analytics if supported (avoids breaking outside browser context)
isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});

// Export Firebase instances
export { db, provider, auth, storage };