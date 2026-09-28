// assets/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Remplace ces valeurs par celles de ta console Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAOBcdCdNAaPbjK3AryLhkUjORsH3Z0FA0",
  authDomain: "mon-portfolio-finance.firebaseapp.com",
  projectId: "mon-portfolio-finance",
  storageBucket: "mon-portfolio-finance.firebasestorage.app",
  messagingSenderId: "816253516121",
  appId: "1:816253516121:web:18414e6af1e70ae10e7448"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
