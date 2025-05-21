import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { auth, provider } from "../lib/firebaseConfig.js";
import { initSignupForm, initGoogleButton, showUserProfile } from './../scripts/signup.js';

document.addEventListener('DOMContentLoaded', () => {

    // Email/password signup/login
    initSignupForm(async (email, password) => {
        try {
            // Check if this email is already registered with a different provider (e.g., Google)
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);

            if (signInMethods.includes('google.com') && !signInMethods.includes('password')) {
                alert('This email is already registered using Google Sign-In. Please sign in with Google instead.');
                return;
            }

            try {
                // Try signing in first
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("User signed in:", userCredential.user);
            } catch (signInError) {
                if (signInError.code === 'auth/user-not-found') {
                    // If no user found, create a new one
                    console.log("No user found, creating new account...");
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    console.log("User created:", userCredential.user);
                } else {
                    console.error("Sign-in error:", signInError.message);
                    alert(`Error: ${signInError.message}`);
                }
            }

        } catch (checkError) {
            console.error("Error checking sign-in methods:", checkError.message);
            alert("Something went wrong while verifying your email.");
        }
    });

    // Google Sign-In
    initGoogleButton(async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            alert(`Welcome, ${user.displayName || 'user'}!`);
            showUserProfile(user);
            window.location.href = '../index.html';
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            alert("Google Sign-In failed. Please try again.");
        }
    });

});