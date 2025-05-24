// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  projectId: "software-design-project-574a6"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    alert("You need to log in to see your analytics");
    return;
  }

  const sellerId = user.uid;
  const ordersSnapshot = await db.collection("orders").get();
  const relevantData = [];

  ordersSnapshot.forEach(doc => {
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

  const in_cart_only = [];
  const cartsSnapshot = await db.collection("carts").get();
  cartsSnapshot.forEach(doc => {
    const cart = doc.data();
    const items = cart.items || [];
    items.forEach(item => {
      if (item.sellerId === sellerId) {
        in_cart_only.push({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        });
      }
    });
  });

  const recommendations = [];
  if (relevantData.length === 0) {
    recommendations.push("Nobody bought anything from your store yet.");
  } else if (relevantData.length < 6) {
    recommendations.push("More than one person bought from your store");
  } else {
    recommendations.push("People love buying your products!");
  }

  if (in_cart_only.length <= 1) {
    recommendations.push("Consider having some of your products on sale to incentivize people to buy your products");
  } else {
    const totalInCart = in_cart_only.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (in_cart_only.length < 6) {
      recommendations.push("People are ready to buy your products. Push the products with highest revenue and not checked out to sales so people can buy them");
    } else {
      recommendations.push("Buyers are interested in most of your products. If you run a clearance sale for a day you might double your revenue");
    }
  }

  const grouped = groupData(relevantData);
  drawCharts(grouped, in_cart_only, recommendations);
});

function groupData(data) {
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const revenueByDate = {};
  const productCount = {};
  const productRevenue = {};
  let totalRevenue = 0;
  let weekRevenue = {};

  data.forEach(({ product_name, price, date, userId, quantity = 1 }) => {
    let ts = (date && typeof date.toDate === 'function') ? date.toDate() : date;
    const dayStr = ts.toISOString().split("T")[0];
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

function drawCharts({ totalRevenue, productCount, productRevenue, revenueByDate }, in_cart_only, recommendations) {
  const sortedDates = Object.keys(revenueByDate).sort();
  const cartProductRevenue = {};
  let totalCartRevenue = 0;

  in_cart_only.forEach(({ name, price, quantity }) => {
    const revenue = price * quantity;
    totalCartRevenue += revenue;
    cartProductRevenue[name] = (cartProductRevenue[name] || 0) + revenue;
  });

  // Charts
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
    options: { plugins: { title: { display: true, text: "Top Selling Products" } } }
  });

  new Chart(document.getElementById("topProductRevenueBar"), {
    type: "bar",
    data: {
      labels: Object.keys(productRevenue),
      datasets: [{
        label: "Revenue",
        data: Object.values(productRevenue),
        backgroundColor: "#f5a623"
      }]
    },
    options: { plugins: { title: { display: true, text: "Revenue of Top Products" } } }
  });

  new Chart(document.getElementById("abandonedCartBar"), {
    type: "bar",
    data: {
      labels: Object.keys(cartProductRevenue),
      datasets: [{
        label: "Potential Revenue",
        data: Object.values(cartProductRevenue),
        backgroundColor: "#ffa39e"
      }]
    },
    options: { plugins: { title: { display: true, text: "Products in Cart Not Checked Out" } } }
  });

  new Chart(document.getElementById("revenueLine"), {
    type: "line",
    data: {
      labels: sortedDates,
      datasets: [
        {
          label: "Revenue from Checked Out Items",
          data: sortedDates.map(date => revenueByDate[date] || 0),
          fill: false,
          borderColor: "green"
        },
        {
          label: "Estimated Cart Revenue",
          data: sortedDates.map(() => 0), 
          fill: false,
          borderColor: "red"
        }
      ]
    },
    options: { plugins: { title: { display: true, text: "Revenue Over Time" } } }
  });

  new Chart(document.getElementById("revenueDonut"), {
    type: "doughnut",
    data: {
      labels: ["Checked Out Revenue", "Cart Revenue"],
      datasets: [{
        data: [totalRevenue, totalCartRevenue],
        backgroundColor: ["#7d6be5", "#fadb14"]
      }]
    },
    options: { plugins: { title: { display: true, text: "Revenue Breakdown" } } }
  });

  const article = document.querySelector("article");


  const revenueSummary = document.createElement("div");
  revenueSummary.style.margin = "1rem 0";
  revenueSummary.style.fontWeight = "bold";
  revenueSummary.innerHTML = `
    <p>Total Revenue Earned: R${totalRevenue.toFixed(2)}</p>
    <p>Total Revenue Sitting in Carts: R${totalCartRevenue.toFixed(2)}</p>
  `;
  article.appendChild(revenueSummary);

  recommendations.forEach(msg => {
    const p = document.createElement("p");
    p.textContent = msg;
    article.appendChild(p);
  });

  const summary = document.createElement("p");
  summary.style.fontWeight = "bold";
  summary.textContent =
    totalRevenue > totalCartRevenue
      ? "Your store is currently performing well."
      : "You have more revenue sitting in carts than what you've earned. Consider a sale!";
  article.appendChild(summary);
}

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const menuDropdown = document.getElementById('menuDropdown');
  const modeToggle = document.getElementById('modeToggle');
  const header = document.querySelector('header');
  let darkMode = false;

  menuDropdown.style.display = 'none';

  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', !isExpanded);
    menuDropdown.style.display = isExpanded ? 'none' : 'block';
  });

  document.addEventListener('click', (event) => {
    if (!menuDropdown.contains(event.target) && event.target !== menuButton) {
      menuDropdown.style.display = 'none';
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });

  document.body.style.backgroundColor = '#FADAD8';
  header.style.backgroundColor = '#FFE5E0';
  modeToggle.textContent = '☀';  
  modeToggle.style.color = 'black';

  modeToggle.addEventListener('click', () => {
    if (!darkMode) {
      document.body.style.backgroundColor = '#231942';
      header.style.backgroundColor = '#E1D9D1';
      modeToggle.style.color = 'white';
    } else {
      document.body.style.backgroundColor = '#FADAD8';
      header.style.backgroundColor = '#FFE5E0';
      modeToggle.style.color = 'black';
    }
    darkMode = !darkMode;
  });
});
