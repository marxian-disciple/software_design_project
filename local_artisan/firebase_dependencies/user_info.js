// profileMain.js
import { auth, db } from "../lib/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  renderProfiles,
  renderNotLoggedIn,
  renderError,
  initCloseButton
} from "./scripts/user_info.js";

const body = document.querySelector("body");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    renderNotLoggedIn(body);
    return;
  }

  try {
    const snapshot = await getDocs(collection(db, "admin"));
    renderProfiles(body, snapshot.docs, user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    renderError(body);
  }
});

initCloseButton(() => {
  window.location.href = "./../index.html";
});
