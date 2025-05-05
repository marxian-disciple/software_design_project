import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { db } from '../lib/firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('[data-filter-category]');
    const productContainer = document.querySelector('.middle-content');

    // Unified function to handle product display
    const displayProducts = (products) => {
        productContainer.innerHTML = ''; // Clear previous products
        
        products.forEach(product => {
            const card = document.createElement('section');
            card.classList.add('product-card');

            card.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
                <a href="html/view_product.html?id=${product.id}" class="view-button">View Product</a>
            `;

            productContainer.appendChild(card);
        });
    };

    // Modified fetch function
    const fetchAndDisplayProducts = async (category) => {
        try {
            const productsRef = collection(db, 'products');
            const q = category === 'all' 
                ? query(productsRef) 
                : query(productsRef, where('category', '==', category));

            const querySnapshot = await getDocs(q);
            const products = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            productContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
        }
    };

    // Event handlers for categories
    categoryLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const filterValue = e.target.dataset.filterCategory;

            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            await fetchAndDisplayProducts(filterValue);
        });
    });

    // Initial load - fetch all products
    fetchAndDisplayProducts('all');
});