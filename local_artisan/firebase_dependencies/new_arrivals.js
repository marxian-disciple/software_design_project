import { collection, getDocs, query, where, Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { db } from '../lib/firebaseConfig.js';

const content = document.querySelector('.middle-content');
const newArrivals = document.querySelector(".new-arrivals");

async function fetchAndDisplayNewArrivals() {
    try {
        // Calculate timestamp for one week ago
        const oneWeekAgoDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const oneWeekAgoTimestamp = Timestamp.fromDate(oneWeekAgoDate);

        // Query products created less than a week ago
        const q = query(
            collection(db, "products"),
            where("createdAt", ">", oneWeekAgoTimestamp)
        );

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
            content.innerHTML = '<p>No new arrivals this week.</p>';
        }
    } catch (err) {
        console.error("Error fetching products:", err);
        content.innerHTML = '<p>Failed to load products.</p>';
    }
}

newArrivals.addEventListener("click", fetchAndDisplayNewArrivals);
