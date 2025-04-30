import { db, auth, storage } from '../lib/firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Initialize Google provider
const provider = new GoogleAuthProvider();

// Select the Google login button
const g_button = document.querySelector('.google-btn');

g_button.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const uid = user.uid;

        window.location.href = "../html/seller_registration.html";
    } catch (err) {
        console.error("Login error:", err);
        alert('Failed to log in with Google.');
    }
});