import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { auth, provider, writeUserData } from "./firebase-config.js";

const submit = document.getElementById("submit");

submit.addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      writeUserData(userCredential.user); // ✅ Save user info
      alert("Login successful!");
      window.location.href = "./blood_pressure_form.js";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
      console.error("Login error:", error.code, error.message);
    });
});

document.getElementById("googleLoginBtn").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      writeUserData(result.user); // ✅ Save user info
      alert("Login successful! Welcome " + result.user.displayName);
      window.location.href = "blood_pressure_form.html";
    })
    .catch((error) => {
      console.error("Google Login Error:", error);
      alert("Login failed. Please try again.");
    });
});
