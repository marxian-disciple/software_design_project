
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { isSupported, getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";


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


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});


export { db, auth, provider, storage };
