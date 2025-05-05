// No need for these when using compat:
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// Use compat-style Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  databaseURL: "https://software-design-project-574a6-default-rtdb.firebaseio.com",
  projectId: "software-design-project-574a6",
  storageBucket: "software-design-project-574a6.appspot.com",  // fixed typo here
  messagingSenderId: "831318427358",
  appId: "1:831318427358:web:82ee155cadb5f61e44644f",
  measurementId: "G-8JCE62JJJJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().enableNetwork();

const db = firebase.firestore();

// Helper to load a table
function loadTable(collection, tableSelector, mapRow) {
  db.collection(collection).get().then(snapshot => {
    const tbody = document.querySelector(`${tableSelector} tbody`);
    tbody.innerHTML = ""; // clear existing content
    snapshot.forEach(doc => {
      const d = doc.data();
      tbody.innerHTML += mapRow(d);
    });
  }).catch(error => {
    console.error(`Error loading ${collection}:`, error);
  });
}

// Inventory
loadTable("Inventory", "#inventory-table", d => `
  <tr>
    <td>${d.ProductID}</td>
    <td>${d.Name}</td>
    <td>$${d.Price}</td>
    <td>${d.Stock}</td>
  </tr>
`);

// Orders
loadTable("Orders", "#orders-table", d => `
  <tr>
    <td>${d.OrderID}</td>
    <td>${d.Product}</td>
    <td>${d.Customer}</td>
    <td>${d.Status}</td>
    <td>$${d.Amount}</td>
  </tr>
`);

// Revenue
loadTable("Revenue", "#revenue-table", d => `
  <tr>
    <td>${d.Month}</td>
    <td>${d.Sales}</td>
    <td>$${d.Earnings}</td>
  </tr>
`);

// Top-Selling Products
loadTable("Top-Selling Products", "#top-selling-table", d => `
  <tr>
    <td>${d.ProductID}</td>
    <td>${d.Name}</td>
    <td>$${d.Price}</td>
    <td>${d.Stock}</td>
  </tr>
`);


document.getElementById("add-products-link").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default anchor behavior
  window.location.href = "../html/add_product.html"; // Navigate to the page
});
