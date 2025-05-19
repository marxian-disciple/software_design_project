
const firebaseConfig = {
  apiKey: "AIzaSyClkdKaYMnvNRPWbHLviEv_2Rzo5MLV5Uc",
  authDomain: "software-design-project-574a6.firebaseapp.com",
  projectId: "software-design-project-574a6",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function fetchData() {
  const snapshot = await db.collection("analysis").get();
  const data = snapshot.docs.map(doc => doc.data());

  return data;
}

function groupData(data) {
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - 7));

  const revenueByDate = {};
  const productCount = {};
  const productRevenue = {};
  let totalRevenue = 0;
  let weekRevenue = {};

  data.forEach(({ product_name, price, date, userId }) => {
    const ts = date.toDate();
    const dayStr = ts.toISOString().split("T")[0];

    totalRevenue += price;

  
    productCount[product_name] = (productCount[product_name] || 0) + 1;

  
    productRevenue[product_name] = (productRevenue[product_name] || 0) + price;

  
    revenueByDate[dayStr] = (revenueByDate[dayStr] || 0) + price;


    if (ts >= weekStart) {
      weekRevenue[userId] = (weekRevenue[userId] || 0) + price;
    }
  });

  return { totalRevenue, productCount, productRevenue, revenueByDate, weekRevenue };
}

function drawCharts({ totalRevenue, productCount, productRevenue, revenueByDate }) {

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
      labels: Object.keys(revenueByDate),
      datasets: [{
        label: "Revenue",
        data: Object.values(revenueByDate),
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

fetchData().then(data => {
  const grouped = groupData(data);
  drawCharts(grouped);
});
