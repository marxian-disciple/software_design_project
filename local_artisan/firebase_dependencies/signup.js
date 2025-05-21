import { createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth, provider } from "../lib/firebaseConfig.js";

import { initSignupForm, initGoogleButton, showUserProfile } from './../scripts/signup.js';

document.addEventListener('DOMContentLoaded', () => {
    initSignupForm(async (username, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, username, password);
            alert(`Account created for ${userCredential.user.email}`);
            window.location.href = "../index.html";
        } catch (error) {
            alert(`Signup failed: ${error.message}`);
        }
    });

    initGoogleButton(async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            alert(`Welcome, ${user.displayName}!`);
            showUserProfile(user);
            window.location.href = '../index.html';
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            alert("Google Sign-In failed. Please try again.");
        }
    });
});
