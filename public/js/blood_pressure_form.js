// Import required Firebase functions from Firebase JS SDK v12
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { auth, database } from "./firebase-config.js"; // Import initialized Firebase Auth & Database instances

/**
 * Sanitize email address to make it safe for use as a Firebase Database key
 * - Replaces "." with "_"
 * - Replaces "@" with "_at_"
 */
function sanitizeEmail(email) {
  return email.replace(/\./g, "_").replace(/@/g, "_at_");
}

/**
 * Restrict and validate numeric input for fields like blood pressure
 * - Only allows digits (0–9)
 * - Limits length to 1–3 digits
 * - Enforces a maximum value (default: 999)
 * - Prevents non-numeric paste
 */
function validateNumericInput(inputElement, maxValue = 999) {
  // Handle user typing
  inputElement.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric chars
    if (value.length > 3) value = value.substring(0, 3); // Limit to 3 digits

    const numValue = parseInt(value) || 0;
    if (numValue > maxValue) value = maxValue.toString(); // Enforce max value

    e.target.value = value;
  });

  // Prevent non-numeric keypress
  inputElement.addEventListener("keypress", (e) => {
    const allowedKeys = [8, 9, 27, 13, 46]; // Backspace, Tab, Esc, Enter, Delete
    const isNumeric =
      (e.keyCode >= 48 && e.keyCode <= 57) || // Numbers on top row
      (e.keyCode >= 96 && e.keyCode <= 105); // Numpad numbers
    if (!isNumeric && !allowedKeys.includes(e.keyCode)) {
      e.preventDefault();
    }
  });

  // Prevent non-numeric paste
  inputElement.addEventListener("paste", (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    const numericOnly = paste.replace(/[^0-9]/g, "").substring(0, 3);
    const numValue = parseInt(numericOnly) || 0;
    if (numValue <= maxValue) {
      e.target.value = numericOnly;
    }
  });
}

// Listen for Firebase Authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in — get form and input elements
    const form = document.getElementById("blood_pressure_form");
    const bpHighInput = document.getElementById("bpHigh");
    const bpLowInput = document.getElementById("bpLow");

    // Apply numeric-only validation to BP fields
    validateNumericInput(bpHighInput);
    validateNumericInput(bpLowInput);

    // Handle form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Stop page reload

      // Get form values
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const bpHigh = document.getElementById("bpHigh").value;
      const bpLow = document.getElementById("bpLow").value;
      const note = document.getElementById("note").value;

      // Validate BP values (must be 1–3 digit numbers)
      if (!/^\d{1,3}$/.test(bpHigh) || !/^\d{1,3}$/.test(bpLow)) {
        alert("❌ Blood pressure values must be 1-3 digit numbers only.");
        return;
      }

      // Prepare BP record object
      const bpData = {
        date,
        time,
        bpHigh: parseInt(bpHigh),
        bpLow: parseInt(bpLow),
        note,
        userId: user.uid, // Store user ID
        createdAt: new Date().toISOString(), // Timestamp
      };

      // Sanitize email for use as database key
      const sanitizedEmail = sanitizeEmail(user.email);

      try {
        // Push BP record to Firebase Realtime Database under user's node
        await push(ref(database, `users/${sanitizedEmail}/bp_records`), bpData);
        alert("✅ Blood pressure data submitted successfully!");

        // Redirect to home after short delay
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
      } catch (error) {
        console.error("❌ Error submitting data:", error);
        alert("Failed to submit data.");
      }
    });
  } else {
    // User is NOT logged in — block form and redirect
    alert("⚠️ You must be logged in to submit blood pressure data.");
    window.location.href = "login.html";
  }
});
