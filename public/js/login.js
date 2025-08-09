// --------------------
// Import Firebase Authentication Functions
// --------------------
import {
  signInWithEmailAndPassword, // Email/password sign-in method
  signInWithPopup, // OAuth sign-in (Google, etc.)
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { auth, provider, writeUserData } from "./firebase-config.js"; // Firebase auth instance, Google provider, and helper to save user profile

// --------------------
// Email/Password Login Handler
// --------------------
const submit = document.getElementById("submit");

submit.addEventListener("click", function (event) {
  event.preventDefault(); // Stop form from refreshing the page

  // Get and sanitize form inputs
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Basic validation
  if (!email || !password) {
    alert("⚠️ Please enter both email and password.");
    return;
  }

  // Attempt login with email & password
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // ✅ Save user profile in database
      writeUserData(userCredential.user);

      alert("✅ Login successful!");
      window.location.href = "/home.html"; // Redirect to home after login
      console.log("User logged in:", userCredential.user);
    })
    .catch((error) => {
      alert("❌ Login failed: " + error.message);
      console.error("Login error:", error.code, error.message);
    });
});

// --------------------
// Google Sign-In Handler
// --------------------
document.getElementById("googleLoginBtn").addEventListener("click", () => {
  // Attempt login via Google popup
  signInWithPopup(auth, provider)
    .then((result) => {
      // ✅ Save user profile in database
      writeUserData(result.user);

      alert("✅ Login successful! Welcome " + result.user.displayName);
      window.location.href = "/blood_pressure_form.html"; // Redirect to BP form after Google login
    })
    .catch((error) => {
      console.error("Google Login Error:", error);
      alert("❌ Google login failed. Please try again.");
    });
});
