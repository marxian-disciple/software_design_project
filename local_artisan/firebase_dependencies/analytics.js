// Firebase config and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  projectId: "software-design-project-574a6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const dashboardContainer = document.getElementById('dashboard-container');
const loadingIndicator = document.getElementById('loading-indicator');
const statsContainer = document.getElementById('stats-container');
const userNameElement = document.getElementById('user-name');
const userEmailElement = document.getElementById('user-email');

// Initialize dashboard
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../html/login.html";
    return;
  }

  try {
    loadingIndicator.style.display = 'block';
    dashboardContainer.style.display = 'none';
    
    // Display user info
    userNameElement.textContent = user.displayName || 'Seller';
    userEmailElement.textContent = user.email;
    
    // Fetch seller's orders
    const orders = await fetchSellerOrders(user.uid);
    
    // Process data and render charts
    const analyticsData = processOrderData(orders);
    renderDashboard(analyticsData);
    
    loadingIndicator.style.display = 'none';
    dashboardContainer.style.display = 'block';
  } catch (error) {
    console.error("Dashboard error:", error);
    loadingIndicator.textContent = "Error loading dashboard. Please refresh.";
  }
});

// Fetch orders for the current seller
async function fetchSellerOrders(sellerId) {
  const ordersQuery = query(
    collection(db, "orders"),
    where("sellerId", "==", sellerId)
  );
  
  const querySnapshot = await getDocs(ordersQuery);
  const orders = [];
  
  querySnapshot.forEach((doc) => {
    orders.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  return orders;
}

// Process order data for analytics
function processOrderData(orders) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const data = {
    totalOrders: orders.length,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenueByDate: {},
    productStats: {},
    deliveryStats: { pickup: 0, delivery: 0 }
  };
  
  orders.forEach(order => {
    // Process order status
    if (order.status === "Pending") data.pendingOrders++;
    if (order.status === "Completed") data.completedOrders++;
    
    // Process delivery option
    if (order.deliveryOption === "Pickup") data.deliveryStats.pickup++;
    if (order.deliveryOption === "Delivery") data.deliveryStats.delivery++;
    
    // Process date
    const orderDate = order.createdAt?.toDate?.() || new Date();
    const dateKey = orderDate.toISOString().split('T')[0];
    
    // Process items
    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const productId = item.productId;
        const productName = item.name || `Product ${productId?.substring(0, 5)}` || "Unknown";
        
        // Update total revenue
        data.totalRevenue += price * quantity;
        
        // Update revenue by date
        data.revenueByDate[dateKey] = (data.revenueByDate[dateKey] || 0) + (price * quantity);
        
        // Update product stats
        if (!data.productStats[productId]) {
          data.productStats[productId] = {
            name: productName,
            image: item.image || '',
            totalSold: 0,
            totalRevenue: 0,
            price: price
          };
        }
        data.productStats[productId].totalSold += quantity;
        data.productStats[productId].totalRevenue += price * quantity;
      });
    }
  });
  
  return data;
}

// Render dashboard with charts and stats
function renderDashboard(data) {
  // Update quick stats
  document.getElementById('total-orders').textContent = data.totalOrders;
  document.getElementById('total-revenue').textContent = `$${data.totalRevenue.toFixed(2)}`;
  document.getElementById('pending-orders').textContent = data.pendingOrders;
  document.getElementById('completed-orders').textContent = data.completedOrders;
  
  // Render charts
  renderRevenueChart(data);
  renderProductChart(data);
  renderPerformanceChart(data);
  renderDeliveryChart(data);
  
  // Render top products table
  renderTopProducts(data.productStats);
}

// Chart rendering functions
function renderRevenueChart(data) {
  const ctx = document.getElementById('revenueDonut').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Revenue'],
      datasets: [{
        data: [data.totalRevenue],
        backgroundColor: ['#7d6be5'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: "Total Revenue", font: { size: 18 } },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `$${context.raw.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

function renderProductChart(data) {
  const productStats = Object.values(data.productStats);
  productStats.sort((a, b) => b.totalSold - a.totalSold);
  const topProducts = productStats.slice(0, 5);
  
  const ctx = document.getElementById('topProductsBar').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: topProducts.map(p => p.name),
      datasets: [{
        label: 'Quantity Sold',
        data: topProducts.map(p => p.totalSold),
        backgroundColor: '#69c0ff'
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

function renderPerformanceChart(data) {
  const dateKeys = Object.keys(data.revenueByDate).sort();
  const revenueData = dateKeys.map(date => data.revenueByDate[date]);
  
  const ctx = document.getElementById('performanceLine').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dateKeys,
      datasets: [{
        label: "Revenue",
        data: revenueData,
        fill: false,
        borderColor: "#ff6f61",
        tension: 0.2
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: "Revenue Trend", font: { size: 18 } }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      }
    }
  });
}

function renderDeliveryChart(data) {
  const ctx = document.getElementById('deliveryPie').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Pickup', 'Delivery'],
      datasets: [{
        data: [data.deliveryStats.pickup, data.deliveryStats.delivery],
        backgroundColor: ['#4CAF50', '#FF9800']
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: "Delivery Methods", font: { size: 18 } }
      }
    }
  });
}

function renderTopProducts(productStats) {
  const productArray = Object.values(productStats);
  productArray.sort((a, b) => b.totalRevenue - a.totalRevenue);
  
  const tableBody = document.getElementById('top-products-table').querySelector('tbody');
  tableBody.innerHTML = '';
  
  productArray.slice(0, 5).forEach(product => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-thumb">` : ''}
        ${product.name}
      </td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.totalSold}</td>
      <td>$${product.totalRevenue.toFixed(2)}</td>
    `;
    
    tableBody.appendChild(row);
  });
}