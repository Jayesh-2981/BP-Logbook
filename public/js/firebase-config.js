// ✅ firebase-config.js
import {
  initializeApp,
  getApps,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEEAPVkoMFo_a1TNLNvQj_pKNJrRgO2VI",
  authDomain: "blood-pressure-logbook-39729.firebaseapp.com",
  databaseURL:
    "https://blood-pressure-logbook-39729-default-rtdb.firebaseio.com",
  projectId: "blood-pressure-logbook-39729",
  storageBucket: "blood-pressure-logbook-39729.appspot.com",
  messagingSenderId: "818417072147",
  appId: "1:818417072147:web:09c42d6666a9e8a32f67e6",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

function writeUserData(user) {
  const sanitizedEmail = user.email.replace(/\./g, "_").replace(/@/g, "_at_");
  set(ref(database, `users/${sanitizedEmail}/profile`), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null,
    createdAt: new Date().toISOString(),
  });
}

export { auth, provider, app, database, writeUserData };
