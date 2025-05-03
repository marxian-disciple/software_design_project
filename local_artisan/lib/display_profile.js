import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Function to check auth and update UI
export function checkUserAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Update login icon with profile picture
      const loginIcon = document.querySelector(".login-icon");
      if (loginIcon && user.photoURL) {
        loginIcon.innerHTML = `
          <img src="${user.photoURL}" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
        `;
      }

      // Optionally show a welcome message if element exists
      const welcomeText = document.getElementById("welcome");
      if (welcomeText) {
        welcomeText.textContent = `Welcome, ${user.displayName}`;
      }

      callback(null, user);
    } else {
      callback("User not logged in", null);
    }
  });
}
