export function groupData(data) {
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




// dom 
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

document.getElementById("download").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const main = document.querySelector("main");

  // Optional: Scroll to top so everything is loaded/rendered properly
  window.scrollTo(0, 0);

  // Use html2canvas to capture main section
  html2canvas(main, {
    scale: 2, // Higher scale = higher resolution
    useCORS: true
  }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height] // Match canvas size to avoid clipping
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("analytics-report.pdf");
  });
});
