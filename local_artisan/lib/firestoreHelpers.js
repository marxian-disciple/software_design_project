// firestoreHelpers.js

import db from "firebaseConfig.js"; 
export function loadTable(collection, tableSelector, mapRow) { 
  return db.collection(collection).get().then(snapshot => {
    const tbody = document.querySelector(`${tableSelector} tbody`);
    if (!tbody) return; 
    tbody.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      tbody.innerHTML += mapRow(data); 
    });
  }).catch(err => {
    console.error(`Failed to load ${collection}:`, err); // also needs coverage
  });
}
