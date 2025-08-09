// --------------------
// Import Firebase Core & Services
// --------------------
import {
  initializeApp,
  getApps, // Used to check if Firebase is already initialized
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider, // For Google Sign-In
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getDatabase,
  ref, // Creates database reference paths
  set, // Writes data to the database
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// --------------------
// Firebase Project Configuration
// --------------------
// This object contains credentials & identifiers for your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyCEEAPVkoMFo_a1TNLNvQj_pKNJrRgO2VI",
  authDomain: "blood-pressure-logbook-39729.firebaseapp.com",
  databaseURL: "https://blood-pressure-logbook-39729-default-rtdb.firebaseio.com",
  projectId: "blood-pressure-logbook-39729",
  storageBucket: "blood-pressure-logbook-39729.appspot.com",
  messagingSenderId: "818417072147",
  appId: "1:818417072147:web:09c42d6666a9e8a32f67e6",
};

// --------------------
// Initialize Firebase App
// --------------------
// Prevents multiple initializations in case the script runs more than once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// --------------------
// Initialize Firebase Services
// --------------------
const auth = getAuth(app); // Firebase Authentication instance
const provider = new GoogleAuthProvider(); // Google Sign-In provider
const database = getDatabase(app); // Firebase Realtime Database instance

// --------------------
// Helper Function: Save User Profile in Database
// --------------------
/**
 * Stores the user's profile information in the Realtime Database
 * under `users/{sanitizedEmail}/profile`
 *
 * @param {Object} user - Firebase user object from authentication
 */
function writeUserData(user) {
  // Replace "." and "@" to make email safe as a database key
  const sanitizedEmail = user.email.replace(/\./g, "_").replace(/@/g, "_at_");

  // Write user profile data to the database
  set(ref(database, `users/${sanitizedEmail}/profile`), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null, // If Google profile has a name
    createdAt: new Date().toISOString(), // Timestamp for profile creation
  });
}

// --------------------
// Export Firebase Instances & Functions
// --------------------
export { auth, provider, app, database, writeUserData };
