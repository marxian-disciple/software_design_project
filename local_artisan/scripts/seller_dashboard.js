// Firebase setup via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get("id");

const target = document.getElementById("Product1");
if (!target) {
  console.warn("Element with id 'Product1' not found.");
  return;
}

if (!docId) {
  target.textContent = "No ID provided in URL";
  return;
}

try {
  const docRef = doc(db, "Inventory", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    target.textContent = data.name || docSnap.id;
  } else {
    target.textContent = "Product not found";
  }
} catch (error) {
  console.error("Error fetching document:", error);
  target.textContent = "Error loading product";
}


