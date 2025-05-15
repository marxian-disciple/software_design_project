import { db } from '../lib/firebaseConfig.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const seller_applications = document.querySelector("seller_applications");
const active_sellers = document.querySelector("active_sellers");
const product_requests = document.querySelector("product_requests");

async function fetchAndDisplayApplications() {
    try {
        const sel_apps = await getDocs(collection(db, 'applications'));

        sel_apps.forEach(doc => {
            const application = doc.data();
            application.id = doc.id; // Add the document ID if you need it

            const card = document.createElement('section');
            card.classList.add('application');

            card.innerHTML = `
                <p class="business-name">${application.businessName}</p>
                <p class="created-at">${application.createdAt}</p>
                <p class="email">${application.email}</p>
                <p class="reg-number">${application.registrationNumber}</p>
                <p class="name">${application.fullName}</p>
                <p class="phone">${application.phone}</p>
                <p class="user-id">${application.userId}</p>
                <p class="vat-number">${application.vatNumber}</p>
                <p class="website">${application.website}</p>
            `;

            seller_applications.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching applications:", err);
        content.innerHTML = '<p>Failed to load applications.</p>';
    }
}

async function fetchAndDisplayActiveSellers() {
    try {
        const act_sels = await getDocs(collection(db, 'sellers'));
        const prod_reqs = await getDocs(collection(db, 'product_requests'));

        sel_apps.forEach(doc => {
            const active = doc.data();
            active.id = doc.id; // Add the document ID if you need it

            const card = document.createElement('section');
            card.classList.add('active');

            card.innerHTML = `
                <p class="business-name">${active.businessName}</p>
                <p class="created-at">${active.createdAt}</p>
                <p class="email">${active.email}</p>
                <p class="reg-number">${active.registrationNumber}</p>
                <p class="name">${active.fullName}</p>
                <p class="phone">${active.phone}</p>
                <p class="user-id">${active.userId}</p>
                <p class="vat-number">${active.vatNumber}</p>
                <p class="website">${active.website}</p>
            `;

            active_sellers.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching active sellers:", err);
        content.innerHTML = '<p>Failed to load active sellers.</p>';
    }
}

async function fetchAndDisplayProductRequests() {
    try {
        const prod_reqs = await getDocs(collection(db, 'product_requests'));

        prod_reqs.forEach(doc => {
            const prod = doc.data();
            prod.id = doc.id; // Add the document ID if you need it

            const card = document.createElement('section');
            card.classList.add('prods');

            card.innerHTML = `
                <img src="${prod.imageUrl}" alt="${prod.name}" class="product-image">
                <p class="prod-name">${prod.name}</p>
                <p class="price">${prod.price}</p>
                <p class="category">${prod.category}</p>
                <p class="quantity">${prod.quantity}</p>
                <p class="weight">${prod.weight}</p>
                <p class="description">${prod.description}</p>
                <p class="user-id">${prod.userId}</p>
                <p class="created-at">${prod.createdAt}</p>
                
            `;

            product_requests.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching product requests:", err);
        content.innerHTML = '<p>Failed to load product requests.</p>';
    }
}
fetchAndDisplayApplications();
fetchAndDisplayActiveSellers();
fetchAndDisplayProductRequests();

document.getElementById("closeBtn").addEventListener("click", () => {
    window.location.href = "./../index.html"; 
  });