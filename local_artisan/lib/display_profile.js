import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Function to check auth and update UI
export function checkUserAuth() {
  onAuthStateChanged(auth, (user) => {
    const userCredentialsSection = document.querySelector(".user_credentials");
    
    if (user) {
      // If the user is logged in, update the section
      userCredentialsSection.innerHTML = `
        <div class="user-profile">
          <img src="${user.photoURL}" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
          <span>Welcome, ${user.displayName}</span>
        </div>
      `;
    } else {
      // If the user is not logged in, display the default content
      userCredentialsSection.innerHTML = `
        <a href="view_cart.html" class="cart">
          <i class="fas fa-shopping-cart"></i>
        </a>
        <a href="signup.html" class="login-icon">
          <i class="fas fa-user"></i>
        </a>
        <img src="../images/side.png" class="side_right" alt="Right Decoration" width="150" height="100"> 
      `;
    }
  });
}
