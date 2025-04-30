const content = document.querySelector('.content');
import { db } from '../lib/firebaseConfig.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

async function fetchAndDisplayProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));

        querySnapshot.forEach(doc => {
            const product = doc.data();
            product.id = doc.id; // Add the document ID if you need it

            const card = document.createElement('section');
            card.classList.add('product-card');

            card.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
                <a href="view_product.html?id=${product.id}" class="view-button">View Product</a>
            `;

            content.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        content.innerHTML = '<p>Failed to load products.</p>';
    }
}

fetchAndDisplayProducts();
