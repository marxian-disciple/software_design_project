import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Manually initialize Firebase app here (replace config with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  databaseURL: "https://software-design-project-574a6-default-rtdb.firebaseio.com",
  projectId: "software-design-project-574a6",
  storageBucket: "software-design-project-574a6.firebasestorage.app",
  messagingSenderId: "831318427358",
  appId: "1:831318427358:web:82ee155cadb5f61e44644f",
  measurementId: "G-8JCE62JJJJ"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ordersSection = document.getElementById("orders-list");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    ordersSection.innerHTML = "<p>You must be logged in to view your orders.</p>";
    return;
  }

  try {
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const userOrders = [];

    ordersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.buyerId === user.uid) {
        userOrders.push(data);
      }
    });

    if (userOrders.length === 0) {
      ordersSection.innerHTML = "<p>You have no past orders.</p>";
      return;
    }

    ordersSection.innerHTML = ""; // clear "Loading..." message

    userOrders.forEach(order => {
      const article = document.createElement("article");
      article.className = "order";

      const date = order.createdAt?.toDate?.().toLocaleString?.() || "Unknown";
      const total = order.total || "Unknown";
      const status = order.status || "Paid";

      article.innerHTML = `
        <header>
          <h3>Order on ${date}</h3>
          <p>Status: ${status} | Total: R${total}</p>
        </header>
        <ul>
          ${order.items.map(item => `
            <li>
              <img src="${item.image}" alt="${item.name}" width="80" height="80" />
              <p><strong>${item.name}</strong> — ${item.quantity} × R${item.price}</p>
            </li>
          `).join("")}
        </ul>
      `;

      ordersSection.appendChild(article);
    });

  } catch (error) {
    console.error("Failed to fetch orders:", error);
    ordersSection.innerHTML = "<p>Error loading orders. Please try again later.</p>";
  }
});
