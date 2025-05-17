import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { db } from '../lib/firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('[data-filter-category]');
    const productContainer = document.querySelector('.middle-content');
    const searchBar = document.querySelector('.search-bar'); // Add this if missing

    let currentCategory = 'all';

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

    // Fetch function
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
        currentCategory = e.target.dataset.filterCategory;
        
        categoryLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');

        // Refresh search cache when category changes 👇
        await initializeSearch();
        await fetchAndDisplayProducts(currentCategory);
  });
    });

    // Initial load - fetch all products
    fetchAndDisplayProducts('all');

    // Search functionality
    let allProductsCache = []; // Cache for all products

    // Debounce function to limit search triggers
    const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
    };

    // Initial fetch of all products for search
    const initializeSearch = async () => {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef);
        const querySnapshot = await getDocs(q);
        allProductsCache = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
        }));
    } catch (error) {
        console.error('Error initializing search:', error);
    }
    };

    // Search handler
    const handleSearch = debounce(async (searchTerm) => {
    try {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
        // If search is empty, show current category
        await fetchAndDisplayProducts(currentCategory);
        return;
        }

        // Filter cached products
        const filteredProducts = allProductsCache.filter(product =>
        product.name.toLowerCase().includes(term)
        );
        
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Search error:', error);
    }
    }, 300);

    // Event listener for search input
    searchBar.addEventListener('input', (e) => {
    handleSearch(e.target.value);
    });

    initializeSearch(); 
});


