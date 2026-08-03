import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMnqwF7Q3S68PDjtKhYLSCdJUzTHSGgTw",
  authDomain: "verse-ai-cc1c6.firebaseapp.com",
  projectId: "verse-ai-cc1c6",
  storageBucket: "verse-ai-cc1c6.firebasestorage.app",
  messagingSenderId: "2670754048",
  appId: "1:2670754048:web:21808e7908bd8b5eaf1be5",
  measurementId: "G-N6LEMNS4M1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Global functions taaki Admin Panel aur Main Site ise use kar sake
window.db = db;
window.getDocs = getDocs;
window.collection = collection;
window.addDoc = addDoc;

console.log("🔥 Firebase DB Ready for Dynamic Content!");

