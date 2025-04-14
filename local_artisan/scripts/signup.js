import app from "../lib/firebaseConfig.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Initialize Auth and Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.getElementById("google").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Signup.js script loaded");

    console.log("Signed up with Google:", user);

    // Optionally, send user data to backend (if you need to)
    await fetch("/signup/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      })
    });

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
