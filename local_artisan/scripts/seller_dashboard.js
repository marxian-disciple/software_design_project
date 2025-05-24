// No need for these when using compat:
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// Use compat-style Firebase setup
// No need for these when using compat:
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";




// onAuthStateChanged, fetch seller products, etc.


// Use compat-style Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  databaseURL: "https://software-design-project-574a6-default-rtdb.firebaseio.com",
  projectId: "software-design-project-574a6",
  storageBucket: "software-design-project-574a6.appspot.com",  // fixed typo here
  messagingSenderId: "831318427358",
  appId: "1:831318427358:web:82ee155cadb5f61e44644f",
  measurementId: "G-8JCE62JJJJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Replace with actual user ID (or use Firebase Auth's currentUser.uid if authenticated)
const sellerUserId = firebase.auth().currentUser.uid;



onAuthStateChanged(auth, (user) => {
  if (user) {
    loadTable("products", "#products-table", (d) => `
      <tr>
        <td>${d.name}</td>
        <td>${d.category}</td>
        <td>${d.description}</td>
        <td>$${d.price}</td>
        <td>${d.quantity}</td>
        <td>${d.weight}</td>
        <td><img src="${d.imageUrl}" width="50"/></td>
      </tr>
    `, user.uid); // filters products where userId == current user's ID
  }
});





