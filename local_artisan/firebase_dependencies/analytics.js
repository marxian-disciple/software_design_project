import { drawCharts } from "./../scripts/analytics.js"
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