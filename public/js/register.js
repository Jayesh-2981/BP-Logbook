import {
  createUserWithEmailAndPassword,
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

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      writeUserData(user); // ✅ Save user info
      alert("User registered successfully!");
      window.location.href = "/blood_pressure_form.html"; // ✅ Fixed path
    })
    .catch((error) => {
      alert("Error: " + error.message);
      console.error("Error Code:", error.code);
    });
});

document.getElementById("googleLoginBtn").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      writeUserData(user); // ✅ Save user info
      alert("Login successful! Welcome " + user.displayName);
      window.location.href = "/blood_pressure_form.html";
    })
    .catch((error) => {
      console.error("Google Login Error:", error);
      alert("Login failed. Please try again.");
    });
});
