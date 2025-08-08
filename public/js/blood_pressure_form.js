import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { auth, database } from "./firebase-config.js";

function sanitizeEmail(email) {
  return email.replace(/\./g, "_").replace(/@/g, "_at_");
}

let isLoggingOut = false;

onAuthStateChanged(auth, (user) => {
  if (user) {
    const form = document.getElementById("blood_pressure_form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const datetime = document.getElementById("datetime").value;
      const bpHigh = document.getElementById("bpHigh").value;
      const bpLow = document.getElementById("bpLow").value;
      const note = document.getElementById("note").value;

      const bpData = {
        datetime,
        bpHigh,
        bpLow,
        note,
        userId: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
      };

      const sanitizedEmail = sanitizeEmail(user.email);

      try {
        await push(ref(database, `users/${sanitizedEmail}/bp_records`), bpData);
        alert("✅ Blood pressure data submitted successfully!");
        form.reset();
      } catch (error) {
        console.error("❌ Error submitting data:", error);
        alert("Failed to submit data.");
      }
    });
  } else {
    if (!isLoggingOut) {
      alert("⚠️ You must be logged in to submit blood pressure data.");
    }
  }
});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    isLoggingOut = true;
    signOut(auth)
      .then(() => {
        alert("You have been logged out.");
        window.location.href = "login.html";
      })
      .catch((error) => {
        console.error("Logout error:", error);
        alert("Failed to log out.");
        isLoggingOut = false;
      });
  });
}
