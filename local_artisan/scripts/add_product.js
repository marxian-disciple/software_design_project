import { initializeForm } from '../fb_scripts/add_product.js';

// Initialize the form when the document is ready
document.addEventListener('DOMContentLoaded', initializeForm);

document.getElementById("closeBtn").addEventListener("click", () => {
    window.location.href = "seller_dashboard.html"; 
  });