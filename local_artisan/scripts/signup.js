import app from "../lib/firebaseConfig.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

// Initialize Auth and Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.getElementsByClassName("google-btn")[0].addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Signup.js script loaded");

    console.log("Signed up with Google:", user);

    alert(`Welcome, ${user.displayName}!`);
    // Redirect if needed
    
    localStorage.setItem("userName", user.displayName);
    localStorage.setItem("userPhoto", user.photoURL);
    
    // Redirect to seller dashboard
    window.location.href = "../html/seller_dashboard.html";
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    alert("Failed to sign in with Google.");
  }
});