import { auth, db, storage } from '../lib/firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { seller_applications, active_sellers, product_requests, closeBtn } from './../scripts/admin.js';

let trueSellerCreatedAt;
let trueProductCreatedAt;
async function fetchAndDisplayApplications() {
    try {
        const sel_apps = await getDocs(collection(db, 'seller_applications'));
        sel_apps.forEach(docSnap => {
            const application = docSnap.data();
            application.id = docSnap.id;

            const card = document.createElement('section');
            card.classList.add('application');
            card.setAttribute('data-doc-id', application.id);
            card.setAttribute('data-created-at', application.createdAt?.toMillis?.() ?? '');

            const createdAtDate = application.createdAt.toDate();
            const formattedDate = createdAtDate.toLocaleString();
            card.setAttribute('data-created-at', createdAtDate.toISOString());


            card.innerHTML = `
                <p class="business-name">Business Name: ${application.businessName}</p>
                <p class="created-at">Created At: ${formattedDate}</p>
                <p class="email">Email: ${application.email}</p>
                <p class="reg-number">Registration Number: ${application.registrationNumber}</p>
                <p class="name">Full Name of Seller: ${application.fullName}</p>
                <p class="phone">Phone number of Seller: ${application.phone}</p>
                <p class="user-id">Seller's UserID: ${application.userId}</p>
                <p class="vat-number">Seller's VAT Number: ${application.vatNumber}</p>
                <p class="website">Business Website: ${application.website}</p>
                <button class="approve-seller">Approve Seller</button>
                <br><br>
            `;
            seller_applications.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching applications:", err);
        seller_applications.innerHTML = '<p>Failed to load applications.</p>';
    }
}

async function fetchAndDisplayActiveSellers() {
    try {
        const act_sels = await getDocs(collection(db, 'sellers'));
        act_sels.forEach(docSnap => {
            const active = docSnap.data();
            const card = document.createElement('section');
            card.classList.add('active');
            card.setAttribute('data-created-at', active.createdAt?.toMillis?.() ?? '');

            const createdAtDate = active.createdAt.toDate();
            const formattedDate = createdAtDate.toLocaleString();

            card.innerHTML = `
                <p class="business-name">Business Name: ${active.businessName}</p>
                <p class="created-at">Created At: ${formattedDate}</p>
                <p class="email">Email: ${active.email}</p>
                <p class="reg-number">Registration Number: ${active.registrationNumber}</p>
                <p class="name">Full Name of Seller: ${active.fullName}</p>
                <p class="phone">Phone number of Seller: ${active.phone}</p>
                <p class="user-id">Seller's UserID: ${active.userId}</p>
                <p class="vat-number">Seller's VAT Number: ${active.vatNumber}</p>
                <p class="website">Business Website: ${active.website}</p>
                <br><br>
            `;
            active_sellers.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching active sellers:", err);
        active_sellers.innerHTML = '<p>Failed to load active sellers.</p>';
    }
}

async function fetchAndDisplayProductRequests() {
    try {
        const prod_reqs = await getDocs(collection(db, 'product_requests'));
        prod_reqs.forEach(docSnap => {
            const prod = docSnap.data();
            prod.id = docSnap.id;

            const card = document.createElement('section');
            card.classList.add('prods');
            card.setAttribute('data-doc-id', prod.id);
            card.setAttribute('data-created-at', prod.createdAt?.toMillis?.() ?? '');

            const createdAtDate = prod.createdAt.toDate();
            const formattedDate = createdAtDate.toLocaleString();
            card.setAttribute('data-created-at', createdAtDate.toISOString());


            card.innerHTML = `
                <img src="${prod.imageUrl}" alt="${prod.name}" class="product-image" style="width: 300px; height: 200px;">
                <p class="prod-name">Product Name: ${prod.name}</p>
                <p class="price">Product Price: ${prod.price}</p>
                <p class="category">Category of Product: ${prod.category}</p>
                <p class="quantity">Quantity of Product: ${prod.quantity}</p>
                <p class="weight">Weight of Product: ${prod.weight}</p>
                <p class="description">Product Description: ${prod.description}</p>
                <p class="user-id">Seller's UserID: ${prod.userId}</p>
                <p class="created-at">Request Submitted at: ${formattedDate}</p>
                <button class="approve-product">Approve Product</button>
                <br><br>
            `;
            product_requests.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching product requests:", err);
        product_requests.innerHTML = '<p>Failed to load product requests.</p>';
    }
}

// Handle approval of sellers
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('approve-seller')) {
        const card = e.target.closest('.application');
        if (!card) return;

        const docId = card.getAttribute('data-doc-id');

        const businessName = card.querySelector('.business-name')?.textContent.split(':').slice(1).join(':').trim();
        const registrationNumber = card.querySelector('.reg-number')?.textContent.split(':').slice(1).join(':').trim();
        const vatNumber = card.querySelector('.vat-number')?.textContent.split(':').slice(1).join(':').trim();
        const name = card.querySelector('.name')?.textContent.split(':').slice(1).join(':').trim();
        const email = card.querySelector('.email')?.textContent.split(':').slice(1).join(':').trim();
        const phone = card.querySelector('.phone')?.textContent.split(':').slice(1).join(':').trim();
        const website = card.querySelector('.website')?.textContent.split(':').slice(1).join(':').trim();
        const userId = card.querySelector('.user-id')?.textContent.split(':').slice(1).join(':').trim();

        const q = query(collection(db, 'applications'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        let createdAt;
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            createdAt = data.createdAt;
        }
        console.log(createdAt);

        try {
            await addDoc(collection(db, 'sellers'), {
                userId, fullName: name, businessName,
                registrationNumber, vatNumber,
                email, phone, website, createdAt: new Date()
            });

            await deleteDoc(doc(db, 'seller_applications', docId));
            alert('Seller approved and application deleted.');
            card.remove();
        } catch (err) {
            console.error("Error approving seller:", err);
        }
    }
});

// Handle approval of products
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('approve-product')) {
        const card = e.target.closest('.prods');
        if (!card) return;

        const docId = card.getAttribute('data-doc-id');

        const name = card.querySelector('.prod-name')?.textContent.split(':').slice(1).join(':').trim();
        const price = card.querySelector('.price')?.textContent.split(':').slice(1).join(':').trim();
        const weight = card.querySelector('.weight')?.textContent.split(':').slice(1).join(':').trim();
        const quantity = card.querySelector('.quantity')?.textContent.split(':').slice(1).join(':').trim();
        const category = card.querySelector('.category')?.textContent.split(':').slice(1).join(':').trim();
        const description = card.querySelector('.description')?.textContent.split(':').slice(1).join(':').trim();
        const imageUrl = card.querySelector('.product-image')?.src;
        const userId = card.querySelector('.user-id')?.textContent.split(':').slice(1).join(':').trim();

        try {
            await addDoc(collection(db, 'products'), {
                userId, name, price, weight, quantity,
                category, description, imageUrl, createdAt: new Date()
            });

            await deleteDoc(doc(db, 'product_requests', docId));
            alert('Product approved and request deleted.');
            card.remove();
        } catch (err) {
            console.error("Error approving product:", err);
        }
    }
});

// Close button event
closeBtn.addEventListener("click", () => {
    window.location.href = "./../index.html";
});

// Initial data load
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchAndDisplayApplications();
        fetchAndDisplayActiveSellers();
        fetchAndDisplayProductRequests();
    } else {
        alert('You must be logged in to view this content.');
    }
});