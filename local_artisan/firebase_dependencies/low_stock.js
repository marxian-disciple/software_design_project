import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { db } from '../lib/firebaseConfig.js';

const content = document.querySelector('.middle-content');
const lowStock = document.querySelector(".low-stock");

async function fetchAndDisplayLowStock() {
    try {
        // Query products created less than a week ago
        const q = query(collection(db, "products"), where("quantity", "<", 10));

        const querySnapshot = await getDocs(q);
        content.innerHTML = ''; // Clear previous content if needed

        querySnapshot.forEach(doc => {
            const product = doc.data();
            product.id = doc.id;

            const card = document.createElement('section');
            card.classList.add('product-card');

            card.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">R${parseFloat(product.price).toFixed(2)}</p>
                <a href="html/view_product.html?id=${product.id}" class="view-button">View Product</a>
            `;

            content.appendChild(card);
        });

        if (querySnapshot.empty) {
            content.innerHTML = '<p>No low stock products found.</p>';
        }
    } catch (err) {
        console.error("Error fetching products:", err);
        content.innerHTML = '<p>Failed to load products.</p>';
    }
}

lowStock.addEventListener("click", fetchAndDisplayLowStock);
