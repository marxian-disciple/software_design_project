import { auth, provider } from '../lib/firebaseConfig.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.querySelector('.google-btn');

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                alert(`Welcome, ${user.displayName}!`);

                // Update the profile picture in the header (e.g., the login icon)
                const loginIcon = document.querySelector(".login-icon");
                if (loginIcon && user.photoURL) {
                    loginIcon.innerHTML = `
                        <img src="${user.photoURL}" alt="Profile" style="
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            object-fit: cover;
                        ">
                    `;
                }

                // Redirect to home or landing page after successful login
                window.location.href = 'index.html'; // Or your desired landing page
            } catch (error) {
                console.error("Google Sign-In Error:", error);
                alert("Google Sign-In failed. Please try again.");
            }
        });
    } else {
        console.warn('Google button not found in the DOM.');
    }
});
