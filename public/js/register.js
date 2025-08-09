// --------------------
// Import Firebase Authentication Functions
// --------------------
import {
  createUserWithEmailAndPassword, // Create new user with email & password
  signInWithPopup, // OAuth sign-in (Google, etc.)
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { auth, provider, writeUserData } from "./firebase-config.js"; // Firebase instances and helper function

// --------------------
// Email/Password Registration Handler
// --------------------
const submit = document.getElementById("submit");

submit.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get and sanitize input values
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Basic validation
  if (!email || !password) {
    alert("⚠️ Please enter both email and password.");
    return;
  }

  // Create new user in Firebase Authentication
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // ✅ Save the new user's profile in Realtime Database
      writeUserData(user);

      alert("✅ User registered successfully!");
      window.location.href = "/blood_pressure_form.html"; // Redirect to BP form
    })
    .catch((error) => {
      alert("❌ Error: " + error.message);
      console.error("Error Code:", error.code);
    });
});

// --------------------
// Google Sign-In Registration/Login Handler
// --------------------
document.getElementById("googleLoginBtn").addEventListener("click", () => {
  // Attempt Google sign-in via popup
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;

      // ✅ Save user profile in Realtime Database
      writeUserData(user);

      alert("✅ Login successful! Welcome " + user.displayName);
      window.location.href = "/home.html"; // Redirect to home page
      console.log("User logged in:", user);
    })
    .catch((error) => {
      console.error("Google Login Error:", error);
      alert("❌ Login failed. Please try again.");
    });
});
