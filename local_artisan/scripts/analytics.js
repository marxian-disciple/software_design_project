const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  projectId: "software-design-project-574a6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();  // Requires firebase-auth-compat.js script in HTML

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    console.warn("User not logged in");
    return;
  }

  const sellerId = user.uid;
  const snapshot = await db.collection("orders").get();

  const relevantData = [];
  snapshot.forEach(doc => {
    const order = doc.data();
    const items = order.items || [];

    items.forEach(item => {
      if (item.sellerId === sellerId) {
        relevantData.push({
          product_name: item.name,
          price: item.price,
          date: order.createdAt,
          quantity: item.quantity,
          userId: sellerId,
          status: order.status
        });
      }
    });
  });

  console.log("Relevant order items for seller:", relevantData);

  const grouped = groupData(relevantData);
  drawCharts(grouped);
});

function groupData(data) {
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  const revenueByDate = {};
  const productCount = {};
  const productRevenue = {};
  let totalRevenue = 0;
  let weekRevenue = {};

  data.forEach(({ product_name, price, date, userId, quantity = 1 }) => {
    let ts;
    if (date && typeof date.toDate === 'function') {
      ts = date.toDate();
    } else if (date instanceof Date) {
      ts = date;
    } else {
      console.warn("Invalid timestamp:", date);
      return;
    }

    const dayStr = ts.toISOString().split("T")[0]; // e.g., "2025-05-21"

    const itemRevenue = price * quantity;
    totalRevenue += itemRevenue;
    productCount[product_name] = (productCount[product_name] || 0) + quantity;
    productRevenue[product_name] = (productRevenue[product_name] || 0) + itemRevenue;
    revenueByDate[dayStr] = (revenueByDate[dayStr] || 0) + itemRevenue;

    if (ts >= weekStart) {
      weekRevenue[userId] = (weekRevenue[userId] || 0) + itemRevenue;
    }
  });

  return { totalRevenue, productCount, productRevenue, revenueByDate, weekRevenue };
}

function drawCharts({ totalRevenue, productCount, productRevenue, revenueByDate }) {
  const sortedDates = Object.keys(revenueByDate).sort();

  new Chart(document.getElementById("revenueDonut"), {
    type: "doughnut",
    data: {
      labels: ["Revenue"],
      datasets: [{
        data: [totalRevenue],
        backgroundColor: ["#7d6be5"],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: "Total Revenue", font: { size: 18 } }
      }
    }
  });

  new Chart(document.getElementById("performanceLine"), {
    type: "line",
    data: {
      labels: sortedDates,
      datasets: [{
        label: "Revenue",
        data: sortedDates.map(date => revenueByDate[date]),
        fill: false,
        borderColor: "#ff6f61",
        tension: 0.2
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: "Store Performance", font: { size: 18 } }
      }
    }
  });

  new Chart(document.getElementById("topProductsBar"), {
    type: "bar",
    data: {
      labels: Object.keys(productCount),
      datasets: [{
        label: "Quantity Sold",
        data: Object.values(productCount),
        backgroundColor: "#69c0ff"
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: "Top Selling Products", font: { size: 18 } }
      },
      indexAxis: 'x'
    }
  });
}

// Menu dropdown toggle logic
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const menuDropdown = document.getElementById('menuDropdown');

  menuDropdown.style.display = 'none';

  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    menuDropdown.style.display = isExpanded ? 'none' : 'block';
  });

  document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
      menuDropdown.style.display = 'none';
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
});