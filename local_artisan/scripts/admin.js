import { admin } from '../fb_scripts/admin.js';

document.addEventListener('DOMContentLoaded', () => {
  // You keep control of DOM elements here
  const sellerApplications = document.querySelector('.seller_applications');
  const activeSellers = document.querySelector('.active_sellers');
  const productRequests = document.querySelector('.product_requests');
  const closeBtn = document.getElementById('closeBtn');

  // Pass them to the dashboard initializer
  admin({
    sellerApplications,
    activeSellers,
    productRequests,
    closeBtn
  });
});