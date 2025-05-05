import { getAuth, signInWithPopup, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth, provider } from "../lib/firebaseConfig.js"; // Import only auth and provider

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.login-form'); 
    const googleBtn = document.querySelector('.google-btn');

    // 🔹 Email/Password Signup
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPass = document.getElementById('confirm_pass').value;

            if (password !== confirmPass) {
                alert("Passwords do not match!");
                const passField = document.getElementById('password');
                const confirmField = document.getElementById('confirm_pass');
                passField.value = '';
                confirmField.value = '';
                passField.style.border = '2px solid red';
                confirmField.style.border = '2px solid red';
            
                setTimeout(() => {
                    passField.style.border = '';
                    confirmField.style.border = '';
                }, 2000);
            
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, username, password);
                alert(`Account created for ${userCredential.user.email}`);
                window.location.href = "../index.html";
            } catch (error) {
                alert(`Signup failed: ${error.message}`);
            }
        });
    }

    // 🔹 Google Sign-Up
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                alert(`Welcome, ${user.displayName}!`);

                const loginIcon = document.querySelector(".login-icon");
                if (loginIcon && user.photoURL) {
                    loginIcon.innerHTML = `
                        <img src="${user.photoURL}" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                    `;
                }

                window.location.href = '../index.html';

            } catch (error) {
                console.error("Google Sign-In Error:", error);
                alert("Google Sign-In failed. Please try again.");
            }
        });
    } else {
        console.warn('Google button not found in the DOM.');
    }
});
