// firebaseService.js
const firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  projectId: "software-design-project-574a6",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function fetchData() {
  const snapshot = await db.collection("analysis").get();
  return snapshot.docs.map(doc => doc.data());
}
module.exports = { fetchData };

