// lib/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  databaseURL: "https://software-design-project-574a6-default-rtdb.firebaseio.com",
  projectId: "software-design-project-574a6",
  storageBucket: "software-design-project-574a6.appspot.com", // fix typo: ".app" → ".appspot.com"
  messagingSenderId: "831318427358",
  appId: "1:831318427358:web:82ee155cadb5f61e44644f",
  measurementId: "G-8JCE62JJJJ"
};

const app = initializeApp(firebaseConfig);

// Only initialize analytics if supported (avoids breaking outside browser context)
isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});

export default app;
