// js/home.js
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);
let isLoggingOut = false;

// Handle logout button click
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  isLoggingOut = true;

  signOut(auth)
    .then(() => {
      alert("Logout successful!");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    })
    .catch((error) => {
      alert("Error logging out. Please try again.");
      isLoggingOut = false;
    });
});

// Check authentication state for redirect purposes
onAuthStateChanged(auth, (user) => {
  if (!user && !window.location.href.includes("login.html") && !isLoggingOut) {
    window.location.href = "login.html";
  }
});
