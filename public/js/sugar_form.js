// --------------------
// Import Firebase SDK Functions
// --------------------
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  ref,
  push, // Push new child records to the database
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { auth, database } from "./firebase-config.js"; // Firebase Auth & Database instances

// --------------------
// Utility Functions
// --------------------

/**
 * Convert an email to a Firebase-safe path string.
 * Example: john.doe@gmail.com → john_doe_at_gmail_com
 */
function sanitizeEmail(email) {
  return email.replace(/\./g, "_").replace(/@/g, "_at_");
}

/**
 * Restrict input to numeric values only, with an optional maximum value.
 * @param {HTMLElement} inputElement - The input field to validate.
 * @param {number} maxValue - The maximum allowed numeric value.
 */
function validateNumericInput(inputElement, maxValue = 999) {
  // Filter input in real-time
  inputElement.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric
    if (value.length > 3) value = value.substring(0, 3); // Max 3 digits

    const numValue = parseInt(value) || 0;
    if (numValue > maxValue) value = maxValue.toString(); // Limit to maxValue

    e.target.value = value;
  });

  // Prevent non-numeric keypresses
  inputElement.addEventListener("keypress", (e) => {
    const allowedKeys = [8, 9, 27, 13, 46]; // Backspace, Tab, Esc, Enter, Delete
    const isNumeric =
      (e.keyCode >= 48 && e.keyCode <= 57) || // Top row numbers
      (e.keyCode >= 96 && e.keyCode <= 105); // Numpad numbers
    if (!isNumeric && !allowedKeys.includes(e.keyCode)) {
      e.preventDefault();
    }
  });

  // Prevent pasting non-numeric content
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

// --------------------
// Auth State Listener
// --------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    const form = document.getElementById("sugarForm");
    const sugarInput = document.getElementById("sugarLevel");

    // ✅ Apply numeric validation to sugar level field
    validateNumericInput(sugarInput);

    // --------------------
    // Form Submission Handler
    // --------------------
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form values
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const sugarLevel = document.getElementById("sugarLevel").value;
      const note = document.getElementById("note").value;

      // Validate sugar level (1–3 digit number)
      if (!/^\d{1,3}$/.test(sugarLevel)) {
        alert("❌ Sugar level must be 1-3 digit numbers only.");
        return;
      }

      // Prepare record object
      const sugarData = {
        date,
        time,
        sugarLevel: parseInt(sugarLevel),
        note,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };

      // Firebase-safe user path
      const sanitizedEmail = sanitizeEmail(user.email);

      // Push record to Firebase
      try {
        await push(
          ref(database, `users/${sanitizedEmail}/sugar_records`),
          sugarData
        );
        alert("✅ Sugar data submitted successfully!");
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
      } catch (error) {
        console.error("❌ Error submitting data:", error);
        alert("⚠️ Failed to submit sugar data.");
      }
    });
  } else {
    // Redirect if not logged in
    alert("⚠️ You must be logged in to submit sugar data.");
    window.location.href = "login.html";
  }
});
